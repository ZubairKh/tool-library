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
