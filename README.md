# GoPratle Event Requirement Poster

A full-stack event requirement posting application built for the GoPratle Full-Stack Developer Intern assignment. It provides a four-step wizard for event planners, performers, and crew to submit event requirements, with server-side validation and MongoDB persistence.

## Live Demo

- **Frontend:** https://gopratle-assignment-2mkv5rk1q-ayushkumar2259s-projects.vercel.app/
- **Backend Health:** https://gopratle-backend-zv3f.onrender.com/api/health
- **GitHub Repository:** https://github.com/ayushkumar2259/gopratle-assignment

## Architecture

```text
Browser (Next.js App Router)
        |
        | POST /api/requirements
        v
Express API
        |
        v
Validation Middleware
        |
        v
Controller → Mongoose Model
        |
        v
MongoDB Atlas
        |
        v
Saved requirement displayed
on the success page
```

| Layer | Location | Responsibility |
|---|---|---|
| Frontend | `frontend/` | Four-step wizard, client-side validation, loading states, and duplicate-submission protection |
| Backend | `backend/` | REST API, server-side validation, controllers, and centralized error handling |
| Database | MongoDB Atlas | Persistent storage of submitted requirements |

The frontend communicates with the backend through HTTP requests. MongoDB credentials remain on the server and are never exposed to the browser.

## Technology Stack

**Frontend**
- Next.js and React
- JavaScript
- Client-side form validation

**Backend**
- Node.js
- Express.js
- REST API
- Mongoose

**Database**
- MongoDB Atlas

**Testing and deployment**
- Jest and Supertest for backend tests
- Node.js test runner for frontend validation tests
- Vercel for frontend deployment
- Render for backend deployment

## Project Structure

```text
gopratle-assignment/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── utils/
│   └── tests/
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
├── render.yaml
└── README.md
```

## Features

- Four-step event requirement submission wizard
- Support for three categories: planner, performer, and crew
- Category-specific fields and validation
- Review submitted details before submission
- Navigate back and edit previous steps
- Loading states and protection against duplicate submissions
- Server-side validation before saving data
- MongoDB persistence
- Success page displaying the saved requirement
- API health endpoint for deployment monitoring

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas, or the project's supported in-memory database configuration for local development

### 1. Clone the repository

```bash
git clone https://github.com/ayushkumar2259/gopratle-assignment.git
cd gopratle-assignment
```

### 2. Set up the backend

Open a terminal:

```bash
cd backend
copy .env.example .env
npm install
```

Configure the environment variables in `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
FRONTEND_URL=http://localhost:3000
```

Use your own MongoDB connection string. Never commit real credentials to GitHub.

Start the backend:

```bash
npm run dev
```

The API should run at `http://localhost:5000`.

### 3. Set up the frontend

Open a second terminal from the project root:

```bash
cd frontend
copy .env.example .env.local
npm install
```

Configure `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open http://localhost:3000.

For macOS/Linux, use `cp` instead of `copy` when copying the example environment files.

## Environment Variables

### Backend

| Variable | Purpose |
|---|---|
| `PORT` | API port; defaults to `5000` |
| `NODE_ENV` | Runtime environment |
| `MONGODB_URI` | MongoDB connection string or supported local demo configuration |
| `FRONTEND_URL` | Allowed frontend origin for CORS; multiple origins may be comma-separated if supported by the application |

### Frontend

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API |

Environment files containing secrets should remain untracked by Git. Only example environment files should be committed.

## API Endpoints

### `GET /api/health`

Checks the API and database connection.

Production endpoint:

https://gopratle-backend-zv3f.onrender.com/api/health

A healthy response includes a successful status and a database connection status.

### `POST /api/requirements`

Creates a new event requirement.

- Returns `201 Created` on successful submission.
- Returns `400 Bad Request` for validation errors.
- Saves valid requirements to MongoDB.

The request includes common event fields and category-specific details for the selected planner, performer, or crew category.

### `GET /api/requirements/:id`

Retrieves a saved requirement using its ID.

- Returns the saved document when found.
- Returns `400` for an invalid ID.
- Returns `404` when the requirement does not exist.

## Form Flow

1. **Event basics:** Enter the event name, type, dates, location, and category.
2. **Category requirements:** Provide details specific to the selected planner, performer, or crew category.
3. **Preferences:** Enter remaining numeric fields, preferences, and additional notes.
4. **Review and submit:** Review the details, return to edit previous steps if needed, and submit the requirement.

The form supports single-day events. Changing the category clears incompatible category-specific details to prevent incorrect data from being submitted.

## Testing

### Backend

Run from the `backend/` directory:

```bash
npm test
```

The backend tests cover health checks, requirement creation for the supported categories, validation errors, date constraints, category-specific fields, retrieval by ID, malformed IDs, and unknown routes.

### Frontend

Run from the `frontend/` directory:

```bash
npm test
```

Manual testing should include category switching, navigation between steps, required-field errors, date ranges, duplicate submission attempts, and successful submission.

## Deployment

### Frontend — Vercel

- Project root: `frontend`
- Framework: Next.js
- Environment variable: `NEXT_PUBLIC_API_URL`

Set `NEXT_PUBLIC_API_URL` to:

```text
https://gopratle-backend-zv3f.onrender.com
```

### Backend — Render

- Service root: `backend`
- Build command: `npm install`
- Start command: `npm start`

Configure `NODE_ENV`, `MONGODB_URI`, and `FRONTEND_URL` in the Render environment settings. Use the deployed frontend origin for `FRONTEND_URL`.

### Database — MongoDB Atlas

The deployed backend connects to MongoDB Atlas through `MONGODB_URI`. Database credentials are configured on the backend host and are not included in the frontend bundle or repository.

## Scope

Authentication, payments, and administrative tools are outside the scope of this assignment.

## License

MIT
