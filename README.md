# TaskForge - Where Teams Build Progress.

## Author

Avinash Sinha

## Overview

TaskForge is a production-ready project and task management application for teams. Users can register, create projects, invite members, assign tasks, track progress, filter work, and view dashboard metrics with role-based permissions.

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- Password hashing: bcrypt

## Folder Structure

```text
TaskForge
├── backend
│   ├── prisma
│   │   └── schema.prisma
│   └── src
│       ├── config
│       ├── middlewares
│       ├── modules
│       │   ├── auth
│       │   ├── dashboard
│       │   ├── projects
│       │   └── tasks
│       ├── types
│       ├── utils
│       ├── app.ts
│       └── server.ts
├── frontend
│   ├── public
│   └── src
│       ├── components
│       ├── lib
│       ├── pages
│       ├── state
│       └── types.ts
└── INTERVIEW_GUIDE.md
```

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`. Backend runs on `http://localhost:5000`.

## Environment Variables

### Backend

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskforge?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="7d"
PORT=5000
FRONTEND_URL="http://localhost:5173"
```

### Frontend

```env
VITE_API_URL="http://localhost:5000"
```

## API Docs

### Auth

- `POST /auth/register` - register user
- `POST /auth/login` - login user
- `GET /auth/me` - current user

### Projects

- `POST /projects` - create project
- `GET /projects?limit=20&offset=0` - user projects
- `GET /projects/:id` - project details
- `POST /projects/:id/add-member` - add member by email
- `DELETE /projects/:id/remove-member` - remove member by email

### Tasks

- `POST /tasks` - create task
- `GET /tasks?projectId=&status=&priority=&assignedToId=&search=&limit=&offset=` - project tasks
- `GET /tasks/user` - assigned tasks
- `PUT /tasks/:id` - update task details
- `PUT /tasks/:id/status` - update status
- `DELETE /tasks/:id` - delete task

### Dashboard

- `GET /dashboard` - stats, overdue tasks, user task summary

## Architecture Explanation

The backend follows Controller -> Service -> Repository -> Database.

- Controller: handles HTTP request and response.
- Service: owns business logic, validation flow, RBAC checks, and task status rules.
- Repository: performs Prisma queries.
- Middleware: handles authentication, validation, rate limiting, security headers, and centralized errors.

## Railway Deployment

### Backend Railway par deploy kaise karna hai

1. Railway dashboard open karo and `New Project` select karo.
2. GitHub repo connect karo.
3. Backend service ke root directory me `backend` set karo.
4. Railway PostgreSQL plugin add karo.
5. Backend service variables me add karo:
   - `DATABASE_URL` Railway PostgreSQL se automatically milega.
   - `JWT_SECRET` ek long random string.
   - `JWT_EXPIRES_IN=7d`
   - `FRONTEND_URL=https://your-frontend-domain`
6. Build command:
   ```bash
   npm install && npm run prisma:generate && npm run build
   ```
7. Start command:
   ```bash
   npm run prisma:deploy && npm start
   ```

### Frontend Railway/Vercel par deploy kaise karna hai

1. Frontend ke liye new service create karo.
2. Root directory `frontend` set karo.
3. Environment variable add karo:
   ```env
   VITE_API_URL=https://your-backend-domain
   ```
4. Build command:
   ```bash
   npm install && npm run build
   ```
5. Output directory:
   ```text
   dist
   ```

Deploy hone ke baad backend `FRONTEND_URL` ko final frontend URL se update karna zaroori hai, warna browser CORS block karega.
