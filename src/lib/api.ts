export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export async function fetchTasks() {
  // pass influencerId so backend can exclude tasks already accepted by this influencer
  const influencerId = 1; // TODO: replace with authenticated influencer id
  const res = await fetch(`${API_BASE}/api/tasks?influencerId=${influencerId}`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function acceptTask(taskId, influencer = { id: 0, name: "anonymous" }) {
  const res = await fetch(`${API_BASE}/api/tasks/${taskId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ influencer }),
  });
  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error(`Accept failed: status=${res.status}`);
  }
  if (!res.ok) throw new Error(`Accept failed: ${json.error || JSON.stringify(json)}`);
  return json;
}

export async function payout(influencerId, amount) {
  const res = await fetch(`${API_BASE}/api/payout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ influencerId, amount }),
  });
  return res.json();
}

export async function fetchCampaigns() {
  const res = await fetch(`${API_BASE}/api/campaigns`);
  if (!res.ok) throw new Error("Failed to fetch campaigns");
  return res.json();
}

export async function createCampaign(payload) {
  const res = await fetch(`${API_BASE}/api/campaigns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  let json;
  try {
    json = await res.json();
  } catch (e) {
    throw new Error(`Create campaign failed: status=${res.status}`);
  }
  if (!res.ok) throw new Error(`Create campaign failed: ${json.error || JSON.stringify(json)}`);
  // backend returns { campaign, task } — prefer to return campaign for callers
  return json.campaign || json;
}

export async function fetchWallet(influencerId) {
  const res = await fetch(`${API_BASE}/api/wallets/${influencerId}`);
  if (!res.ok) throw new Error("Failed to fetch wallet");
  return res.json();
}
