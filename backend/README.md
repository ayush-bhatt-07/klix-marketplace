# Klix Backend (local demo)

This is a minimal demo backend for the Klix marketplace frontend. It uses Express and a simple JSON file as the data store.

Run (from repository root):

```powershell
cd backend
npm install
npm run dev
```

API endpoints:
- `GET /api/health` - health check
- `GET /api/tasks` - list tasks
- `POST /api/tasks/:id/accept` - accept a task (body: `{ influencer: { id, name } }`)
- `POST /api/payout` - simulate payout (body: `{ influencerId, amount }`)

This is a local demo — replace payout logic and DB with production-grade integrations for real deployments.
