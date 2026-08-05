# Setup Guide

## Requirements

- Node.js 18+
- Supabase cloud project ([supabase.com](https://supabase.com))

## Architecture (summary)

Worklo PSA is a **Next.js** web app (default dev port **3000**) that calls a separate **Express.js** REST API (default **4000**). The API uses **Supabase** for PostgreSQL, **Row Level Security**, and **Supabase Auth** (JWT + cookies). The Express server can host Next-style route handlers via an adapter so shared handler code works in both environments.

## Steps

### 1. Configure

```bash
cp .env.local.template .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Copy the same `SUPABASE_*` values to `backend/.env` (see `backend/.env.example`).

### 2. Run (Development)

```bash
# Terminal 1 — Express backend (port 4000)
cd backend && npm run dev

# Terminal 2 — Next.js frontend (port 3000)
npm run dev
```

### 3. First-time setup

On first visit, you'll be redirected to `/onboarding` to:
1. Enter the setup token printed in the backend terminal
2. Create your superadmin account

### 4. Invite team

From Admin → Invite Users, send email invitations. Recipients get a link to create their account.

## Production

```bash
# Backend
cd backend && npm run build && npm start   # port 4000

# Frontend
npm run build && npm start                  # port 3000
```

## Email (optional)

Configure SMTP in `.env.local` for invitation emails:

```env
SMTP_HOST=smtp.your-domain.com
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASS=your-password
SMTP_FROM=Worklo <noreply@Worklo.dev>
```

## Demo Mode

```bash
npm run dev:demo
```

Enables quick-login buttons for demo users.
