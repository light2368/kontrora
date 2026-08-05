# Backend

## Overview

The backend is a standalone Express.js server (`backend/`) that serves all API routes.
It was migrated from Next.js API Route Handlers to Express for independent deployment and mobile app support.

## Running

```bash
# Development (hot reload)
cd backend && npm run dev        # port 4000

# Production
cd backend && npm run build && npm start
```

## Structure

```
backend/
├── src/
│   ├── index.ts          # Express app, middleware, port 4000
│   ├── router.ts         # Mounts all 100+ routes
│   ├── adapter.ts        # NextRequest/NextResponse → Express shim
│   ├── lib/
│   │   ├── supabase-server.ts   # Auth: getUserFromRequest(token)
│   │   ├── server-guards.ts     # requireAuthentication(), requirePermission()
│   │   └── [copied from lib/]   # Services, permissions, validation
│   └── routes-next/      # Route handlers (migrated from app/api/)
│       ├── accounts/
│       ├── projects/
│       ├── tasks/
│       ├── workflows/
│       ├── dashboard/
│       ├── analytics/
│       └── ...
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

## Authentication

All routes use `getUserFromRequest(req)` which:
1. Extracts `Authorization: Bearer <token>` from the request header
2. Calls `admin.auth.getUser(token)` — validates JWT against Supabase
3. Returns the authenticated user or null

The frontend sends the token via `apiFetch()` in `lib/api-config.ts`.

## Environment Variables

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Adding a New Route

1. Create `backend/src/routes-next/your-route/route.ts`
2. Export `GET`, `POST`, `PATCH`, `DELETE` functions
3. Mount in `backend/src/router.ts`
4. Use `getUserFromRequest(request)` for auth
5. Use `createAdminSupabaseClient()` for DB operations
