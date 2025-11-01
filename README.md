## Placement Portal — Main

Production-ready monorepo for a college/company placement portal. This root README documents how to run, develop, and deploy the core apps kept on the `main` branch.

### What’s in this branch
- `server/`: backend application (Python/FastAPI or similar as per codebase)
- `website/`: frontend application (Vite + React)
- Root docs and Compose for local dev

Note: Feature variants and historical folders are maintained in separate branches (one branch per former top-level folder).

---

## Quickstart (Docker)

Requirements:
- Docker Desktop
- VS Code (optional) + Dev Containers extension

Run all services:
```bash
docker-compose up --build
```

Then open:
- Frontend: http://localhost:5173 (or the port printed by Vite)
- Backend: http://localhost:8000 (or the port printed by the server)
- API docs (if FastAPI): http://localhost:8000/docs

### VS Code Dev Container (optional)
1) Install the “Dev Containers” extension.
2) Open this folder in VS Code.
3) When prompted, select “Reopen in Container” (or use the command palette).

If not prompted automatically:
```bash
docker-compose build
# then use: Dev Containers: Reopen in Container
```

---

## Local Development (without Docker)

Run backend (example):
```bash
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Run frontend:
```bash
cd website
npm install
npm run dev
```

Ports used may vary; check the app output.

---

## Configuration

Create environment files per app (see examples in their directories if present):
- `server/`: e.g., `.env` for DB/Redis/Cloud configs
- `website/`: e.g., environment variables via Vite (see `env.example.txt` or docs)

Sensitive values should not be committed.

---

## Repository Structure and Branching

This repository keeps only `server/` and `website/` on `main` for clarity. Other earlier top-level folders each have their own branch (created via subtree splits). This keeps history per folder clean while keeping `main` lean.

Common branches (examples):
- `placement-portal-Frontend`
- `placement-portal-admin-frontend`
- `placement-portal-secure`
...and more. Check `git branch -r` for the full list once pushed.

---

## Scripts and Useful Commands

Docker:
```bash
docker-compose up --build            # build and start
docker-compose down                  # stop
docker-compose logs -f               # follow logs
```

Frontend:
```bash
cd website
npm run dev                          # start dev server
npm run build                        # production build
npm run preview                      # preview production build
```

Backend (examples):
```bash
cd server
pytest                               # run tests
uvicorn main:app --reload            # run API locally
```

---

## Contributing
1) Create a feature branch from `main` (or from the specific folder branch you’re working in).
2) Commit with clear messages.
3) Open a PR to the appropriate branch.

---

## License

See `LICENSE` for details.
