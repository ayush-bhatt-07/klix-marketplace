const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const cors = require("cors");

const PORT = process.env.PORT || 4000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "../db.json");
console.log("Using DB_PATH:", DB_PATH);

const app = express();
app.use(cors());
app.use(express.json());

async function readDB() {
  try {
    const content = await fs.readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(content);
    // ensure structure
    parsed.tasks = parsed.tasks || [];
    parsed.accepted = parsed.accepted || [];
    parsed.wallets = parsed.wallets || [];
    parsed.campaigns = parsed.campaigns || [];
    return parsed;
  } catch (err) {
    console.error("readDB error reading DB at", DB_PATH, err && err.message);
    return { tasks: [], accepted: [], wallets: [], campaigns: [] };
  }
}

async function writeDB(data) {
  // Keep file formatted
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("writeDB error writing DB at", DB_PATH, err && err.message);
    throw err;
  }
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/tasks", async (req, res) => {
  try {
    const db = await readDB();
    // optionally exclude tasks already accepted by an influencer
    const influencerId = req.query.influencerId ? Number(req.query.influencerId) : null;
    let tasks = db.tasks || [];
    if (influencerId !== null) {
      const acceptedByInfluencer = new Set((db.accepted || [])
        .filter(a => Number(a.influencer?.id) === influencerId)
        .map(a => Number(a.taskId)));
      tasks = tasks.filter(t => !acceptedByInfluencer.has(Number(t.id)));
    }
    res.json(tasks);
  } catch (err) {
    console.error("/api/tasks error", err);
    res.status(500).json({ error: "Internal error" });
  }
});

app.post("/api/tasks/:id/accept", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const influencer = req.body.influencer || { id: 0, name: "anonymous" };
    const db = await readDB();
    const task = (db.tasks || []).find((t) => t.id === id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const already = (db.accepted || []).find((a) => Number(a.taskId) === id && Number(a.influencer?.id) === Number(influencer.id));
    if (already) return res.status(400).json({ error: "Already accepted" });

    // Add to accepted list
    db.accepted.push({ taskId: id, influencer, acceptedAt: new Date().toISOString(), status: "accepted" });

    // Remove from tasks
    db.tasks = (db.tasks || []).filter((t) => t.id !== id);

    // Credit influencer wallet (reward stored as string in seed — parse to number)
    const rewardRaw = task.reward || "0";
    const reward = Number(String(rewardRaw).replace(/[^0-9.-]+/g, "")) || 0;
    db.wallets = db.wallets || [];
    let wallet = db.wallets.find((w) => w.influencerId === influencer.id);
    if (!wallet) {
      wallet = { influencerId: influencer.id, influencerName: influencer.name, balance: 0, transactions: [] };
      db.wallets.push(wallet);
    }
    wallet.balance = Number(wallet.balance || 0) + reward;
    wallet.transactions.push({ type: "credit", amount: reward, source: `task:${id}`, at: new Date().toISOString() });

    await writeDB(db);

    res.json({ success: true, taskId: id, credited: reward, newBalance: wallet.balance });
  } catch (err) {
    console.error("/api/tasks/:id/accept error", err);
    res.status(500).json({ error: "Internal error" });
  }
});

// Campaign endpoints
app.get("/api/campaigns", async (req, res) => {
  const db = await readDB();
  res.json(db.campaigns || []);
});

app.post("/api/campaigns", async (req, res) => {
  // kept in the same file but ensure errors don't crash the process
  try {
    const data = req.body || {};
    if (!data.name || !data.description) return res.status(400).json({ error: "Missing required fields" });
    const db = await readDB();
    const id = (db.campaigns && db.campaigns.length ? Math.max(...db.campaigns.map(c=>c.id)) : 0) + 1;
    const campaign = { id, ...data, createdAt: new Date().toISOString(), status: "live" };
    db.campaigns.push(campaign);
    // Create a corresponding task so creators can accept it (simple mapping)
    db.tasks = db.tasks || [];
    // Compute next task id by considering existing task ids and already accepted taskIds
    const existingTaskIds = (db.tasks || []).map(t => Number(t.id));
    const acceptedTaskIds = (db.accepted || []).map(a => Number(a.taskId));
    const maxId = Math.max(0, ...(existingTaskIds.concat(acceptedTaskIds)));
    const nextTaskId = maxId + 1;
    const task = {
      id: nextTaskId,
      title: data.name,
      description: data.description,
      brand: data.brand || (data.brandName || "Brand"),
      reward: data.budget ? String(data.budget) : (data.reward ? String(data.reward) : "0"),
      location: data.location || "",
      deadline: data.duration || "",
      category: data.category || "",
    };
    db.tasks.push(task);
    await writeDB(db);
    res.json({ campaign, task });
  } catch (err) {
    console.error("/api/campaigns error", err);
    res.status(500).json({ error: "Internal error" });
  }
});

// Wallet endpoints
app.get("/api/wallets/:influencerId", async (req, res) => {
  const influencerId = Number(req.params.influencerId);
  const db = await readDB();
  const wallet = (db.wallets || []).find((w) => w.influencerId === influencerId) || { influencerId, balance: 0, transactions: [] };
  res.json(wallet);
});

app.post("/api/payout", async (req, res) => {
  // This endpoint simulates a UPI payout. In production integrate UPI provider.
  const { influencerId, amount } = req.body || {};
  if (!influencerId || !amount) return res.status(400).json({ error: "Missing influencerId or amount" });

  // For demo, just return success with a fake transaction id
  res.json({ success: true, txId: `TX_${Date.now()}`, influencerId, amount });
});

app.listen(PORT, () => {
  console.log(`Klix backend running on http://localhost:${PORT}`);
});

// Global error handlers to avoid silent crashes during development
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
