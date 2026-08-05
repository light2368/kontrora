# Permission System

## Overview

~40 permissions across 15 categories. No hardcoded role names — all checks are permission-based and dynamic.

## Evaluation Flow

```
1. Superadmin?              → ALLOW (bypass all)
2. Override permission?     → ALLOW (e.g. VIEW_ALL_PROJECTS)
3. Base permission + context → ALLOW (e.g. VIEW_PROJECTS + assigned)
4. Otherwise               → DENY
```

## Key Permissions

### Projects
| Permission | Description |
|-----------|-------------|
| `VIEW_PROJECTS` | View assigned projects |
| `VIEW_ALL_PROJECTS` | View all projects (override) |
| `MANAGE_PROJECTS` | Create/edit/delete in assigned accounts |
| `MANAGE_ALL_PROJECTS` | Manage any project (override) |

### Accounts
| Permission | Description |
|-----------|-------------|
| `VIEW_ACCOUNTS` | View accessible accounts |
| `VIEW_ALL_ACCOUNTS` | View all accounts (override) |
| `MANAGE_ACCOUNTS` | Create/edit/delete accounts |

### Users & Roles
| Permission | Description |
|-----------|-------------|
| `MANAGE_USER_ROLES` | Create/edit/delete roles, assign users |
| `MANAGE_USERS` | View, edit, delete users |

### Time & Capacity
| Permission | Description |
|-----------|-------------|
| `MANAGE_TIME` | Log and edit own time entries |
| `VIEW_ALL_TIME_ENTRIES` | View all time entries (override) |
| `EDIT_OWN_AVAILABILITY` | Set weekly availability |
| `VIEW_TEAM_CAPACITY` | View team capacity |
| `VIEW_ALL_CAPACITY` | Org-wide capacity (override) |

### Analytics
| Permission | Description |
|-----------|-------------|
| `VIEW_ALL_ANALYTICS` | Org-wide analytics |
| `VIEW_ALL_DEPARTMENT_ANALYTICS` | Department analytics |
| `VIEW_ALL_ACCOUNT_ANALYTICS` | Account analytics |

### Workflows
| Permission | Description |
|-----------|-------------|
| `MANAGE_WORKFLOWS` | Create/edit workflow templates |
| `EXECUTE_WORKFLOWS` | Hand off work in workflows |
| `SKIP_WORKFLOW_NODES` | Out-of-order transitions (admin only) |

## Implementation Files

| File | Purpose |
|------|---------|
| `lib/permissions.ts` | Permission enum (~40 definitions) |
| `lib/permission-checker.ts` | Core evaluation engine |
| `lib/rbac.ts` | Helper functions |
| `lib/permission-utils.ts` | Sync permission utilities |
| `lib/rbac-types.ts` | TypeScript types |
