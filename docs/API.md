# API Reference

All API routes are served by the Express backend at `http://localhost:4000`.

## Authentication

All protected routes require:
```
Authorization: Bearer <supabase_access_token>
```

The frontend handles this automatically via `apiFetch()` in `lib/api-config.ts`.

## Base URL

```
http://localhost:4000/api
```

---

## Accounts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/accounts` | List accessible accounts |
| POST | `/api/accounts` | Create account |
| GET | `/api/accounts/:id` | Get account |
| PATCH | `/api/accounts/:id` | Update account |
| DELETE | `/api/accounts/:id` | Delete account |
| GET | `/api/accounts/:id/members` | List members |
| POST | `/api/accounts/:id/members` | Add member |

## Projects

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/complete` | Mark complete |
| GET | `/api/projects/:id/updates` | Project updates |
| GET | `/api/projects/:id/issues` | Project issues |

## Tasks

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Time Tracking

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/time-entries` | List time entries |
| POST | `/api/time-entries` | Log time |
| GET | `/api/clock` | Clock status |
| POST | `/api/clock` | Clock in |
| POST | `/api/clock/out` | Clock out |
| POST | `/api/clock/discard` | Discard session |
| GET | `/api/availability` | Get availability |
| POST | `/api/availability` | Set availability |

## Users & Roles

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List users |
| GET | `/api/profile` | Own profile |
| PATCH | `/api/profile` | Update profile |
| GET | `/api/roles` | List roles |
| POST | `/api/roles` | Create role |
| PATCH | `/api/roles/:id` | Update role |
| DELETE | `/api/roles/:id` | Delete role |
| POST | `/api/roles/:id/assign-user` | Assign user |
| GET | `/api/departments` | List departments |
| POST | `/api/departments` | Create department |

## Workflows

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/workflows/templates` | List templates |
| POST | `/api/admin/workflows/templates` | Create template |
| GET | `/api/admin/workflows/templates/:id` | Get template |
| PATCH | `/api/admin/workflows/templates/:id` | Update template |
| DELETE | `/api/admin/workflows/templates/:id` | Delete template |
| POST | `/api/workflows/instances/start` | Start workflow |
| POST | `/api/workflows/instances/:id/handoff` | Hand off step |
| GET | `/api/workflows/my-projects` | My active projects |
| GET | `/api/workflows/my-approvals` | Pending approvals |

## Analytics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/analytics/overview` | Org overview |
| GET | `/api/analytics/projects` | Project analytics |
| GET | `/api/analytics/team` | Team analytics |
| GET | `/api/analytics/time` | Time analytics |
| GET | `/api/capacity/organization` | Org capacity |
| GET | `/api/capacity/department` | Dept capacity |

## Dashboard

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/dashboard/preferences` | Widget preferences |
| PUT | `/api/dashboard/preferences` | Save preferences |
| GET | `/api/dashboard/my-accounts` | My accounts |
| GET | `/api/dashboard/my-workflows` | My workflows |
| GET | `/api/dashboard/recent-activity` | Recent activity |
| GET | `/api/dashboard/upcoming-deadlines` | Deadlines |

## Invitations

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/invitations` | List invitations |
| POST | `/api/invitations` | Send invitation |
| DELETE | `/api/invitations/:id` | Revoke |
| GET | `/api/invitations/accept/:token` | Get invite details |
| POST | `/api/invitations/accept/:token` | Accept invitation |

## Onboarding

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/onboarding/check-first-run` | First run check |
| GET | `/api/onboarding/setup-token` | Get setup token |
| POST | `/api/onboarding/setup-token` | Verify token |
| POST | `/api/onboarding/complete-setup` | Create superadmin |
