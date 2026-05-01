# TaskForge Interview Guide

## System Design

TaskForge is split into a React client and an Express API. The client only stores the JWT token and calls protected APIs. The backend owns authentication, authorization, project membership, task state transitions, and database writes.

## Low-Level Design

Request flow:

```text
Route -> authMiddleware -> validate -> Controller -> Service -> Repository -> Prisma -> PostgreSQL
```

Controllers stay thin. Services enforce business rules. Repositories keep database access isolated.

## Database Design

- `User`: account data and hashed password.
- `Project`: workspace container.
- `ProjectMember`: many-to-many link between users and projects with `ADMIN` or `MEMBER` role.
- `Task`: project task with status, priority, creator, optional assignee, and due date.

`ProjectMember` has a unique constraint on `(userId, projectId)` so the same user cannot be added twice.

## Why SQL

TaskForge has relational data: users belong to projects, tasks belong to projects, tasks are assigned to users, and permissions depend on membership. PostgreSQL gives strong consistency, joins, transactions, indexes, and relational constraints, which fit this domain well.

## RBAC

Roles are scoped per project.

- `ADMIN`: add/remove members and assign tasks.
- `MEMBER`: view projects and work on assigned tasks.

The service layer checks membership before returning project or task data. Admin-only actions require an `ADMIN` membership for that project.

## Auth Flow

1. User registers with name, email, and password.
2. Password is hashed with bcrypt.
3. Login compares password with the hash.
4. Server returns a JWT.
5. Frontend sends `Authorization: Bearer <token>` on protected requests.
6. Auth middleware verifies the token and attaches the user payload to the request.

## Task Rules

- Only project members can create tasks.
- Only admins can assign tasks.
- Only assignee or admin can update status.
- Only creator or admin can edit/delete task details.
- Status can move forward only: `TODO -> IN_PROGRESS -> DONE`.

## Search, Filtering, Pagination

Task listing supports:

- `status`
- `priority`
- `assignedToId`
- `search` by title
- `limit` and `offset`

Project listing also supports `limit` and `offset`.

## Scaling

- Add indexes for common task filters and project membership lookups.
- Move JWT secrets to a managed secret store.
- Use connection pooling for PostgreSQL.
- Add refresh tokens if longer sessions are required.
- Cache dashboard aggregates for large teams.
- Add background jobs for due-date reminders.
- Split API services by domain only after traffic requires it.
