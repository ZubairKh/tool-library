# Tool Library

A full-stack Tool Library project for teaching/demo purposes.

This repository contains:
- `frontend/` (React + Vite)
- `backend/` (Node + Express + MongoDB + JWT auth)
- `backend-mysql/` (Node + Express + Prisma + MySQL)

## AI Extension Overview

This project now includes an **AI Tool Finder and Recommendation Assistant** for the Mongo backend path.

Users can describe a task in natural language (for example, furniture assembly or drilling concrete), and the app returns recommended tools from the existing catalogue, plus explanation and caveats.

### Why this use case fits AI

- Task descriptions are unstructured natural language.
- Tool metadata is structured and limited, so recommendations can be grounded to known catalogue entries.
- Reasoning text helps students inspect both usefulness and limitations.

### Architecture (Mongo active path)

1. Frontend sends `task` text to `POST /api/tools/recommend`.
2. Backend reads the current Mongo tool catalogue (`name`, `category`, `condition`, `isAvailable`, `_id`).
3. Provider adapter selects either:
- deterministic mock recommender (`AI_MOCK_MODE=true`) or
- real provider integration (`AI_MOCK_MODE=false`, currently OpenAI-compatible).
4. Backend validates provider output and filters recommendations so only existing catalogue tool IDs are returned.
5. Frontend renders recommendations, unavailability status, notes, and limitations.

### Key implementation principles

- No tool invention: only current catalogue tools may be recommended.
- No secret exposure: provider credentials stay in backend environment variables only.
- Failure-safe behavior: timeout and malformed output handling return clear API errors.
- Teaching reliability: deterministic mock mode supports demos without paid API access.

## Classroom Quickstart (5 Minutes)

Use this if you just want to run the app quickly in class.

1. Clone and install:

```bash
git clone https://github.com/ZubairKh/tool-library.git
cd tool-library
cd backend && npm install
cd ../frontend && npm install
```

2. Create `backend/.env` from the template:

```bash
cp backend/.env.example backend/.env
```

3. Edit `backend/.env` and set valid values for `MONGO_URI` and `JWT_SECRET`.

4. Start backend (Terminal 1):

```bash
cd backend
npm run dev
```

5. Start frontend (Terminal 2):

```bash
cd frontend
npm run dev
```

6. Open the app:
- Frontend: `http://localhost:5173`
- API health: `http://localhost:4000/api/health`
- Swagger docs: `http://localhost:4000/api-docs`

Note: For MySQL mode, use `backend-mysql/.env.example` and run the Prisma steps in the full setup section below.

## Prerequisites

- Node.js 18+
- npm
- Git
- MongoDB (for `backend/`)
- MySQL (for `backend-mysql/`)

## Project Setup

Clone and install dependencies:

```bash
git clone https://github.com/ZubairKh/tool-library.git
cd tool-library

cd backend && npm install
cd ../backend-mysql && npm install
cd ../frontend && npm install
```

## Environment Variables (.env Guide)

Important:
- Never commit real secrets.
- `.env` files are already ignored in this project.

### 1) Mongo Backend (`backend/.env`)

Create `backend/.env`:

```env
PORT=4000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
AI_MOCK_MODE=true
AI_TIMEOUT_MS=10000
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
AI_API_KEY=replace_with_provider_key_when_mock_mode_false
```

AI variables:
- `AI_MOCK_MODE=true`: deterministic local demo mode (no paid API needed)
- `AI_MOCK_MODE=false`: use real provider adapter
- `AI_TIMEOUT_MS`: provider request timeout in milliseconds
- `AI_PROVIDER`: currently `openai`
- `AI_MODEL`: model identifier used by provider adapter
- `AI_API_KEY`: provider secret (backend only, do not expose in frontend)

#### How to get `MONGO_URI` from MongoDB Atlas

1. Go to https://www.mongodb.com/atlas and create/sign in to your account.
2. Create a project and then create a cluster (the free tier is fine for class demo use).
3. In Atlas, open **Database Access** and create a database user (username + password).
4. Open **Network Access** and add your current IP address.
- For classroom/demo only, you can temporarily allow `0.0.0.0/0` (less secure, not recommended for production).
5. Open your cluster, click **Connect** -> **Drivers**.
6. Copy the connection string that looks like:

```text
mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

7. Replace placeholders:
- `<username>` with your Atlas DB username
- `<password>` with your Atlas DB password
- `<database>` with a database name, for example `tool_library`

Example:

```text
mongodb+srv://teacher123:MyPass123@cluster0.abcd123.mongodb.net/tool_library?retryWrites=true&w=majority
```

8. Paste this final value into `backend/.env` as `MONGO_URI=...` and restart backend server if already running.

If connection fails:
- Re-check username/password
- Confirm your IP is allowlisted in Atlas Network Access
- Confirm special characters in password are URL-encoded

### 2) MySQL Backend (`backend-mysql/.env`)

Create `backend-mysql/.env`:

```env
PORT=4000
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/tool_library"
```

Then run Prisma migration/generation inside `backend-mysql/`:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 3) Frontend API URL

The frontend currently calls:
- `http://localhost:4000/api`

If you run backend on another host/port, update:
- `frontend/src/api/auth.ts`
- `frontend/src/api/tool.ts`
- `frontend/src/api/recommendation.ts`

## Running the App

Use one backend at a time (both default to port `4000`).

### Option A: Mongo backend

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

### Option B: MySQL backend

Terminal 1:

```bash
cd backend-mysql
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## API Endpoints

Mongo backend exposes:
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/auth/me`
- `GET /api/tools`
- `POST /api/tools`
- `POST /api/tools/recommend`

Recommendation request example:

```json
{
	"task": "I need to drill into a concrete wall for wall anchors"
}
```

Recommendation response example:

```json
{
	"task": "I need to drill into a concrete wall for wall anchors",
	"providerMode": "mock",
	"recommendations": [
		{
			"toolId": "68f...",
			"name": "Hammer Drill",
			"category": "Power Tools",
			"condition": "good",
			"isAvailable": false,
			"reason": "Matches common tooling patterns for tasks involving drill and concrete.",
			"limitations": [
				"Use correct drill bits and PPE when drilling into masonry or concrete.",
				"This tool is currently unavailable in the catalogue."
			],
			"score": 8
		}
	],
	"notes": []
}
```

Swagger docs (Mongo backend):
- `http://localhost:4000/api-docs`

MySQL backend exposes:
- `GET /api/health`
- `GET /api/tools`
- `POST /api/tools`
- `GET /api/bookings`
- `POST /api/bookings`

## Evaluation and Testing

This project includes fixed evaluation cases and backend tests for recommendation quality and failure handling.

### Run backend tests

```bash
cd backend
npm test
```

Covers:
- invalid input
- empty catalogue
- unavailable tools
- malformed provider output
- provider timeout
- filtering of non-catalogue tool IDs
- deterministic mock behavior
- predefined relevance checks

### Run evaluation metrics (mock mode benchmark)

```bash
cd backend
npm run eval:recommendations
```

This runs fixed cases in `backend/evaluation/recommendation-cases.json` and reports:
- Hit@1
- Hit@3
- MRR (Mean Reciprocal Rank)

Important: treat these values as a reproducible baseline for this dataset, not universal model accuracy.

## End-to-End Demo Checklist

1. Start Mongo backend (`backend`) and frontend (`frontend`).
2. Sign up or sign in.
3. Add at least 3 to 5 tools with mixed categories and availability.
4. Open AI Tool Finder and run a task prompt.
5. Verify returned tools are from current catalogue only.
6. Verify unavailable tools are labeled as unavailable.
7. Trigger invalid input (very short task) and observe frontend validation.
8. Simulate provider failure/timeout (for example, disable key in real mode) and observe error state.
9. Run `npm test` in backend and confirm all tests pass.
10. Run `npm run eval:recommendations` and capture metrics for teaching discussion.

## Five-Session Teaching Plan Mapping

1. Session 1: business problem, AI suitability, MVP and success criteria.
2. Session 2: architecture, provider adapter, prompt constraints and structured outputs.
3. Session 3: backend endpoint and frontend AI Tool Finder integration.
4. Session 4: testing and metric-based evaluation with limitations.
5. Session 5: reproducibility, docs and final demonstration checklist.

## Share With Students

Public repository link:
- https://github.com/ZubairKh/tool-library

Students can clone with:

```bash
git clone https://github.com/ZubairKh/tool-library.git
```
