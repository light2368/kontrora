# Architecture

## System Overview

```
Browser
  │
  ├── Next.js Frontend (port 3000)
  │     ├── React Server Components (pages, layouts)
  │     ├── Client Components (interactive UI)
  │     └── lib/api-config.ts → routes all /api/* to backend
  │
  └── Express Backend (port 4000)
        ├── router.ts — mounts all 100+ routes
        ├── adapter.ts — Next.js NextRequest/NextResponse shim
        ├── lib/supabase-server.ts — auth via admin.auth.getUser(token)
        └── routes-next/ — migrated Next.js route handlers
              └── Supabase (PostgreSQL + RLS)
```

## Authentication Flow

```
1. User logs in via Supabase Auth → receives JWT access_token
2. Frontend stores token in Supabase session (cookie)
3. apiFetch() reads token via supabase.auth.getSession()
4. Sends: Authorization: Bearer <token>
5. Backend: getUserFromRequest(req) → admin.auth.getUser(token)
6. Returns authenticated user → fetch profile → check permissions
```

## Key Patterns

### 1. Service Layer
Business logic lives in `lib/services/` and `lib/*-service.ts`. API routes are thin wrappers.

### 2. Hybrid Permission System
Three-layer evaluation:
1. Superadmin bypass → full access
2. Override permissions (`VIEW_ALL_*`) → global access
3. Base permission + context (project assignment, account membership)

### 3. Row Level Security
Every Supabase table has RLS policies. Data access enforced at PostgreSQL level — application bugs cannot leak data.

### 4. Dynamic Department Membership
Departments derive from active project assignments, not static org charts.

## Database Tables

| Category | Tables |
|----------|--------|
| Users | `user_profiles`, `user_roles` |
| Org | `roles`, `departments` |
| Accounts | `accounts`, `account_members` |
| Projects | `projects`, `project_assignments`, `project_stakeholders` |
| Tasks | `tasks`, `task_dependencies` |
| Time | `time_entries`, `clock_sessions`, `user_availability` |
| Workflows | `workflow_templates`, `workflow_nodes`, `workflow_connections`, `workflow_instances`, `workflow_history`, `workflow_active_steps` |
| Forms | `form_templates`, `form_responses` |
| Client | `deliverables`, `client_feedback` |

## Backend Route Structure

All routes live in `backend/src/routes-next/` mirroring the original `app/api/` structure.
The `adapter.ts` shim converts Next.js `NextRequest`/`NextResponse` to Express `req`/`res`.
Auth uses `getUserFromRequest()` which calls `admin.auth.getUser(token)` directly.
