# AuroraDocs Back-end

Quick start

```
cd backend
npm install
cp ../.env.example .env
# edit .env then
npm run dev
```

API endpoints (basic)
- `POST /api/auth/register` — register with { name, email, password }
- `POST /api/auth/login` — login with { email, password }
- `GET /api/auth/me` — get current user (requires `Authorization: Bearer TOKEN`)
- `POST /api/documents/upload` — upload a file (multipart form-data `file`)
- `GET /api/documents` — list user's documents
- `GET /api/documents/:id` — fetch document details and saved analysis
- `POST /api/documents/:id/analyze` — trigger AI analysis for document
- `POST /api/chat` — ask AuroraDocs a question, optionally scoped to a document

Notes
- The current implementation is a starter scaffold. Add production-ready password hashing, input validation, rate limiting, logging, and Google OAuth before shipping.
