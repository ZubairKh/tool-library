# Tool Library

A full-stack Tool Library project for teaching/demo purposes.

This repository contains:
- `frontend/` (React + Vite)
- `backend/` (Node + Express + MongoDB + JWT auth)
- `backend-mysql/` (Node + Express + Prisma + MySQL)

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
```

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

Swagger docs (Mongo backend):
- `http://localhost:4000/api-docs`

MySQL backend exposes:
- `GET /api/health`
- `GET /api/tools`
- `POST /api/tools`
- `GET /api/bookings`
- `POST /api/bookings`

## Share With Students

Public repository link:
- https://github.com/ZubairKh/tool-library

Students can clone with:

```bash
git clone https://github.com/ZubairKh/tool-library.git
```
