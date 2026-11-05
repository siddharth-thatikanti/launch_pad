# LaunchPad — Next.js + NestJS + PostgreSQL

This version has the exact split you requested:

- **Frontend:** Next.js App Router (React)
- **Backend:** NestJS REST API (TypeScript)
- **Database:** PostgreSQL 16
- **Local orchestration:** Docker Compose

The Next.js frontend calls the NestJS API. NestJS validates the contact form and stores the lead in PostgreSQL using parameterized SQL.

## Requirements
Install Docker Desktop on Windows, or Docker Engine and the Docker Compose plugin on Linux.

## Run on Windows PowerShell
From the project root:
```powershell
Copy-Item .env.example .env
# Open .env and replace the example database password
docker compose up --build -d
docker compose ps
```

## Run on Linux/macOS
```bash
cp .env.example .env
# Edit .env and replace the example database password
docker compose up --build -d
docker compose ps
```

## Open the application
- Next.js frontend: http://localhost:3000
- NestJS health: http://localhost:4000/api/health
- NestJS readiness + PostgreSQL check: http://localhost:4000/api/ready

Submit the contact form. A successful response means the NestJS API inserted the lead into PostgreSQL.

## Verify the database row
```powershell
docker compose exec postgres psql -U launchpad_user -d launchpad -c "SELECT id,name,email,message,created_at FROM leads ORDER BY created_at DESC;"
```
If you changed the DB name or username in `.env`, use those values in the command.

## API endpoints
- `GET /api/health` — API process health.
- `GET /api/ready` — verifies PostgreSQL connectivity.
- `POST /api/leads` — validates and stores `{ "name": "...", "email": "...", "message": "..." }`.

Example request:
```bash
curl -X POST http://localhost:4000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Doe","email":"alex@example.com","message":"I would like to know more."}'
```

## Useful Docker commands
```bash
docker compose logs -f
docker compose logs --tail=100 frontend backend postgres
docker compose up --build -d
docker compose down
```

**Destructive — deletes the PostgreSQL volume and all saved leads:**
```bash
docker compose down -v
```

## Environment variables
Root `.env`:
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

Backend container variables are wired in Compose:
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL`
- `CORS_ORIGIN`

Frontend uses `NEXT_PUBLIC_API_URL` at image build time. Compose sets the local value to `http://localhost:4000/api`. For a remote deployment, rebuild the frontend with the public HTTPS URL of the NestJS API.

## Deployment notes
- Deploy the Next.js frontend and NestJS backend as separate services/containers.
- Deploy PostgreSQL as a private managed database or private VM service; do not expose port 5432 to the public internet.
- Put secrets in the hosting platform's secret/application settings, never in Git.
- For managed PostgreSQL, enable TLS and configure trusted CA certificates before setting `DB_SSL=true`.
- Set NestJS `CORS_ORIGIN` to the exact frontend origin(s), not `*`.
- Configure HTTPS, backups, monitoring, rate limiting and spam protection before production.
- A database backup alone is not disaster recovery. Test restoring it in the secondary cloud and measure recovery time and data loss.

## Scope and limitations
This is a demo/learning starter, not production-hardened. It does not include authentication, CAPTCHA, rate limiting, admin lead browsing, automated database replication, or automatic multi-cloud failover. Do not describe it as production-ready DR without implementing and testing those capabilities.
