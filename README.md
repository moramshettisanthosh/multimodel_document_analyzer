# AuroraDocs — Multimodal Document Analyzer

Tagline: Illuminate insights from any document — fast, smart, and human-friendly.

Project name: AuroraDocs

Professional, AI-powered multimodal document analysis platform.

Color palette (AI themed):
- Primary: #6D28D9 (Indigo)
- Accent: #06B6D4 (Cyan)
- Neutral: #0F172A (Slate-900)
- Glass: rgba(255,255,255,0.06)

Quick start

1. Backend

```
cd backend
npm install
cp ../.env.example .env
# edit .env then
npm run dev
```

2. Frontend

```
cd frontend
npm install
npm run dev
```

Deployment notes:
- Frontend: deploy `frontend/dist` to Vercel (build with `npm run build`).
- Backend: deploy `backend` to Render or Railway; set env vars from `.env`.
- MongoDB: use MongoDB Atlas and set `MONGODB_URI`.

See `backend/README.md` and `frontend/README.md` for more details.

