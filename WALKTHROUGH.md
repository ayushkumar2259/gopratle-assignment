# 5–7 minute walkthrough script

Use this as a recording outline. Speak to what is actually on screen. Do not claim a live Atlas or public URL unless you have opened it in this session.

Suggested length: about 6 minutes.

## 0:00–0:40 — What you built

Open the local app at `http://localhost:3000`.

Say: this is a four-step event requirement flow. Organizers describe an event, choose Event Planner, Performer, or Crew, fill category-specific fields, review everything, and submit. Success is shown only after MongoDB saves the document.

Point to the progress indicator at the top of `RequirementWizard`.

Files to show:

- `frontend/app/page.js`
- `frontend/components/RequirementWizard.js`

## 0:40–2:10 — Frontend form

Walk through Step 1. Fill:

- Event name, type, same start and end date (single-day support)
- Location, optional venue
- Category: Event Planner

Click Continue. Show Step 2 (attendees, budget, services) and Step 3 (experience, number of planners, notes).

Go Back, then Continue again, to show data is preserved.

Change category to Performer, then back to Planner, and show that the previous planner-only values were cleared (`changeCategory` in `RequirementWizard.js`).

Try Continue with an empty event name to show validation.

Files and functions:

- `frontend/components/StepEventBasics.js`
- `frontend/components/StepRequirements.js`
- `frontend/components/StepPreferences.js`
- `frontend/lib/validation.js` (`validateStep1`, `validateStep2`, `validateStep3`)
- `frontend/lib/api.js` (`createRequirement`)

## 2:10–3:10 — Review, submit, API request

On Step 4, open `frontend/components/StepReview.js`. Use Edit to jump back, then return.

Open DevTools → Network. Click Submit once. Point out the button shows “Submitting…” and is disabled (`submitting` state).

Select the `POST /api/requirements` request. Show JSON body and `201` response with `_id`, `status: "submitted"`, and timestamps.

Only then open the success page, which calls `GET /api/requirements/:id`.

Files:

- `frontend/components/RequirementWizard.js` (`handleSubmit`)
- `frontend/app/success/[id]/page.js`
- `frontend/components/SuccessDetails.js`

## 3:10–4:20 — Backend and MongoDB

Show the Express layout:

1. `backend/src/server.js` starts the process and connects to MongoDB.
2. `backend/src/app.js` wires Helmet, CORS from `FRONTEND_URL`, JSON parsing, rate limiting, routes, and the error handler.
3. `backend/src/routes/requirementRoutes.js` maps `POST /` and `GET /:id`.
4. `backend/src/middleware/validateRequirement.js` validates before the controller.
5. `backend/src/controllers/requirementController.js` `createRequirement` calls `Requirement.create`.
6. `backend/src/models/Requirement.js` is the Mongoose schema for the `requirements` collection.

Say: common event fields live on the root document. Category is an enum: planner, performer, crew. Only the matching details object is stored. `createdAt` and `updatedAt` come from `timestamps: true`.

If you are on Atlas, open the `requirements` collection and find the same `_id`. If you are on `MONGODB_URI=memory`, say clearly that this local demo used an in-memory MongoDB server, and production should use Atlas.

## 4:20–5:10 — Testing and edge cases

Report only tests you actually ran. Typical demo:

- `cd backend && npm test` — health, all three categories, date range, incompatible details, numeric validation, GET by id, 400/404
- `cd frontend && npm test` — client validation and payload shape
- Manual: inverted dates, duplicate submit click, category switch, health endpoint

Mention backend validation is independent of the UI: POST a bad body with curl or Thunder Client and you still get `400` with `errors[]`.

## 5:10–6:00 — Limitations and next steps

Be honest:

- No auth, payments, or admin dashboard, by assignment scope
- Public deploy needs Atlas, Render, and Vercel accounts (do not invent URLs)
- In-memory Mongo is for local demo only
- Rate limiting is basic
- No file uploads or vendor matching yet

Possible improvements: user accounts, drafts, vendor search, email confirmation, richer date-time slots.

Close on the architecture sentence: Next.js collects and validates the flow, Express validates again and writes to MongoDB, the success screen reads the saved document back.
