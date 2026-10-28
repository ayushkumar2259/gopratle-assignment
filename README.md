# GoPratle Event Requirement Poster

A working full-stack submission for the GoPratle Full-Stack Developer Intern assignment: a four-step event requirement flow with a Next.js frontend and an Express + MongoDB API in one repository.

## Architecture

```
Browser (Next.js App Router)
  → POST /api/requirements
Express routes → validation middleware → controller
  → Mongoose Requirement model
  → MongoDB `requirements` collection
Browser success page
  → GET /api/requirements/:id
```

| Layer | Location | Role |
| --- | --- | --- |
| UI | `frontend/` | Four-step wizard, client validation, loading and duplicate-submit protection |
| API | `backend/` | Express routes, controllers, middleware, centralized errors |
| Data | MongoDB Atlas (production) or in-memory Mongo (local demo) | Persisted requirement documents |

The frontend never receives `MONGODB_URI`. Only the Node server talks to the database.

## Project structure

```
backend/
  src/app.js
  src/server.js
  src/config/          env + database connection
  src/models/          Requirement schema
  src/routes/          /api/health and /api/requirements
  src/controllers/
  src/middleware/      validation + error handler
  src/utils/           request validators
  tests/               Jest + Supertest
frontend/
  app/                 App Router pages
  components/          wizard steps
  lib/                 constants, validation, API client
```

## Prerequisites

- Node.js 18 or newer (this project was developed on Node 22)
- npm
- A MongoDB Atlas cluster for production and for a durable local database

You can run the API locally without Atlas by setting `MONGODB_URI=memory`. That starts `mongodb-memory-server` for a temporary database. It is not a production configuration.

## Setup

```bash
git clone <your-fork-url>
cd gopratle-assignment

cd backend
copy .env.example .env
npm install

cd ../frontend
copy .env.example .env.local
npm install
```

On macOS/Linux use `cp` instead of `copy`.

## Environment variables

### `backend/.env`

| Name | Required | Purpose |
| --- | --- | --- |
| `PORT` | No (default `5000`) | API port |
| `NODE_ENV` | No | `development`, `test`, or `production` |
| `MONGODB_URI` | Yes | Atlas connection string, or `memory` for local demo |
| `FRONTEND_URL` | Yes | Allowed CORS origin. Comma-separate multiple origins |

### `frontend/.env.local`

| Name | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Public API origin, for example `http://localhost:5000` |

Do not put Atlas credentials in any `NEXT_PUBLIC_` variable. `.env` and `.env.local` are gitignored. Commit only `.env.example` files.

## Commands

Terminal 1 — API:

```bash
cd backend
npm run dev
```

Terminal 2 — UI:

```bash
cd frontend
npm run dev
```

Open `http://localhost:3000`.

| Command | Where | What it does |
| --- | --- | --- |
| `npm run dev` | backend | Nodemon API |
| `npm start` | backend | Production `node src/server.js` |
| `npm test` | backend | Jest API tests with an in-memory database |
| `npm run dev` | frontend | Next.js dev server |
| `npm run build` / `npm start` | frontend | Production Next.js build |
| `npm test` | frontend | Node test runner for form validation |
| `npm run lint` | frontend | ESLint |

## API

Base URL locally: `http://localhost:5000`

### `GET /api/health`

```json
{
  "success": true,
  "service": "gopratle-requirements-api",
  "status": "ok",
  "database": "connected",
  "timestamp": "2026-10-25T22:00:00.000Z"
}
```

### `POST /api/requirements`

Creates a document. Returns `201` on success, `400` with `errors` on validation failure.

Planner example:

```bash
curl -X POST http://localhost:5000/api/requirements ^
  -H "Content-Type: application/json" ^
  -d "{\"eventName\":\"Spring Garden Wedding\",\"eventType\":\"Wedding\",\"startDate\":\"2026-12-12\",\"endDate\":\"2026-12-12\",\"location\":\"Bengaluru\",\"venue\":\"Lalbagh Glass House\",\"category\":\"planner\",\"plannerDetails\":{\"expectedAttendees\":180,\"budget\":250000,\"requiredServices\":[\"Decor\",\"Catering\"],\"experience\":\"3-5 years\",\"numberOfPlanners\":2,\"additionalNotes\":\"Prefer sustainable decor.\"}}"
```

Performer and crew payloads use `category: "performer"` + `performerDetails`, or `category: "crew"` + `crewDetails`. Sending details for a different category is rejected.

### `GET /api/requirements/:id`

Returns the saved document, or `400` for a bad id, or `404` if it does not exist.

The stored shape includes:

- Event fields: name, type, start/end dates, location, optional venue
- `category`: `planner` | `performer` | `crew`
- Matching `plannerDetails`, `performerDetails`, or `crewDetails`
- `status` (`submitted`)
- `createdAt` / `updatedAt`

## Form flow

1. Event basics, including single-day dates (`startDate === endDate`) and required category
2. Category requirements (planner services / performer type / crew roles)
3. Preferences, notes, and remaining numeric fields
4. Full review, edit links, then submit

Changing category clears planner, performer, and crew details so leftover fields cannot be submitted.

## Testing

From `backend/`:

```bash
npm test
```

Tests cover health, planner/performer/crew creates, missing fields, inverted dates, incompatible category details, invalid numbers, GET by id, malformed id, and unknown routes.

From `frontend/`:

```bash
npm test
```

Manual checks: all three categories, back/continue, required-field errors, date ranges, category switching, duplicate submit clicks, and the success page only after a `201`.

## Deployment

Public URLs are not included here until they have been opened and verified.

### MongoDB Atlas

1. Create a free cluster.
2. Create a database user.
3. Network Access → allow the Render (or host) IP, or `0.0.0.0/0` if you accept that risk for a demo.
4. Connect → Drivers → copy the URI. Database name can be `gopratle`.
5. Put the URI only in the backend host’s `MONGODB_URI` secret.

### Backend (Render)

1. Push this repo to GitHub.
2. New → Web Service → this repository.
3. Root directory: `backend`.
4. Build: `npm install`. Start: `npm start`.
5. Set `NODE_ENV=production`, `MONGODB_URI`, and `FRONTEND_URL` (your Vercel origin, no trailing slash).
6. After the first deploy, open `https://<render-host>/api/health` and confirm `"database": "connected"`.

`render.yaml` at the repo root describes the same service.

### Frontend (Vercel)

1. Import the GitHub repo in Vercel.
2. Root directory: `frontend`.
3. Framework: Next.js.
4. Set `NEXT_PUBLIC_API_URL` to the Render origin, for example `https://<render-host>`.
5. Deploy, then add that Vercel origin to backend `FRONTEND_URL` and redeploy the API if CORS blocks the browser.

### Verify a public submission

1. Submit a requirement on the Vercel app.
2. Confirm the Network tab shows `201` from Render.
3. Open Atlas → `requirements` and find the same `_id`.
4. Open `/success/<id>` and confirm GET returns the document.

## Out of scope

No authentication, payments, or admin tools. Those were excluded on purpose.

## License

MIT
