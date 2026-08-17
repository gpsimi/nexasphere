# NexaSphere — Thesis Experiment Data Tables

> Measurements captured on **15 August 2026** from the running NexaSphere prototype.

---

## Table 5.1: Architecture Summary

| Metric | Value |
|--------|-------|
| Composition Mechanism | Next.js Multi-Zones (rewrites) |
| Total Workspace Packages | 16 |
| Micro-Frontend Apps | 9 (1 host shell + 8 remotes) |
| Shared Libraries | 5 (`ui`, `auth`, `utils`, `config`, `types`) |
| Backend Services | 1 (Express.js + Prisma ORM) |
| Framework | Next.js 14.1.0 (App Router) |
| Package Manager | pnpm 9.0.0 |
| Build Orchestrator | Turborepo 1.13.x |
| Language | TypeScript / JavaScript |
| CSS Approach | Custom utility-first design tokens |
| Auth Mechanism | JWT (8h expiry) via localStorage |
| Database | Supabase PostgreSQL (Cloud) + Prisma ORM (Live & Connected, 8 Tables) |

---

## Table 5.2: RBAC Permission Matrix

| Role | Dashboard | Users | Finance | Operations | Inventory | Reports | Analytics | System Health |
|------|:---------:|:-----:|:-------:|:----------:|:---------:|:-------:|:---------:|:-------------:|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Finance** | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Operations** | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Inventory** | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Management** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **PlatformAdmin** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Table 5.3: Micro-Frontend Source & Bundle Metrics

| MFE | Port | Source Files | Source LoC | First Load JS | Page Size | .next Build Size |
|-----|------|:-----------:|:---------:|:------------:|:---------:|:---------------:|
| Shell (Host) | 3000 | 7 | 687 | 84.2 KB (shared) | 2.77 KB (`/`) / 3.81 KB (`/login`) | 75.2 MB |
| Dashboard | 3001 | 7 | 715 | 84.3 KB (shared) | 4.68 KB | 77.49 MB |
| Users | 3002 | 7 | 836 | 84.2 KB (shared) | 4.36 KB | 76.05 MB |
| Finance | 3003 | 7 | 794 | 84.3 KB (shared) | 4.30 KB | 66.73 MB |
| Operations | 3004 | 6 | 687 | 84.2 KB (shared) | 3.33 KB | 65.57 MB |
| Inventory | 3005 | 6 | 649 | 84.3 KB (shared) | 3.40 KB | 31.48 MB |
| Reports | 3006 | 6 | 627 | 84.3 KB (shared) | 3.37 KB | 31.57 MB |
| Analytics | 3007 | 6 | 582 | 84.3 KB (shared) | — | In dev |
| System Health | 3008 | 6 | 598 | 84.3 KB (shared) | — | In dev |
| **API Backend** | 4000 | 1 | 227 | N/A | N/A | N/A |
| **TOTAL** | — | **59** | **6,402** | — | — | — |

> [!NOTE]
> "First Load JS (shared)" is the common JS bundle loaded by all pages, comprising React, React DOM, and shared framework chunks. Individual "Page Size" is the additional JS unique to that route.

---

## Table 5.4: Shared Package Metrics

| Package | Purpose | Source Size | Direct Dependencies |
|---------|---------|:----------:|:-------------------:|
| `@nexasphere/ui` | Design system (Button, Card, Table, Alert, Badge, Modal, Input) | 10.6 KB | 3 (react, react-dom, lucide-react) |
| `@nexasphere/auth` | AuthProvider, useAuth hook, RBAC hasPermission | 3.55 KB | 1 (@nexasphere/utils) |
| `@nexasphere/utils` | EventBus, apiClient, formatCurrency, formatDate | 2.65 KB | 0 |
| `@nexasphere/config` | Port mappings, API URLs, app metadata | 1.2 KB | 0 |
| `@nexasphere/types` | TypeScript interfaces (User, Transaction, etc.) | 0.8 KB | 0 |

---

## Table 5.5: Dev Server Cold-Start Times

| MFE | Cold-Start Time | Hot Recompile Time |
|-----|:--------------:|:-----------------:|
| Shell (Host) | 14.6s | 275ms–1.4s |
| Dashboard | 14.0s | 340ms–2.1s |
| Users | 13.2s | 472ms–1.1s |
| Finance | 14.0s | — |
| Operations | 11.3s | 514ms–729ms |
| Inventory | 13.1s | — |
| Reports | 9.7s | — |
| Analytics | 8.4s | — |
| System Health | 13.7s | — |
| API Backend | <1s | N/A (Node.js) |
| **Average (Next.js)** | **12.4s** | **~750ms** |

> [!NOTE]
> Cold-start = time from `turbo run dev` to `✓ Ready`. Hot recompile = incremental recompilation after file changes. These were measured on a Windows machine running 10 concurrent Next.js dev servers + 1 Express server.

---

## Table 5.6: Fault Isolation Test Results (Experiment B — Objective O3)

| Test Case | Expected Behaviour | Implemented |
|-----------|-------------------|:-----------:|
| Finance MFE throws runtime error | `MfeErrorBoundary` catches error, displays recovery UI | ✅ |
| Other MFEs remain functional | Dashboard, Users, Operations etc. unaffected | ✅ |
| Recovery action available | "Try Again" button resets error state | ✅ |
| Error boundary is per-module | Each remote has its own named `MfeErrorBoundary` | ✅ |
| Error logging | `console.error` with MFE name and stack trace | ✅ |

### Fault Isolation Mechanism
```
Layout.tsx (Sidebar + Header)
  └─ MfeErrorBoundary name="Finance"
       └─ Finance App.tsx
            └─ throw new Error('Simulated Finance MFE Runtime Outage')
                 └─ Caught by MfeErrorBoundary → Shows Alert + "Try Again"
```

---

## Table 5.7: Authentication Flow Verification

| Step | Component | Verified |
|------|-----------|:--------:|
| 1. User submits credentials | `apps/shell/app/login/page.tsx` | ✅ |
| 2. `login()` calls API | `packages/auth/index.js` → `apiClient.post('/auth/login')` | ✅ |
| 3. API validates + returns JWT | `services/api/src/server.js` → `jwt.sign()` (8h expiry) | ✅ |
| 4. Token stored in localStorage | `nexasphere_token` + `nexasphere_user` | ✅ |
| 5. Subsequent API calls attach Bearer token | `apiClient.request()` → `Authorization: Bearer <token>` | ✅ |
| 6. Sidebar filters by role permissions | `Layout.tsx` → `hasPermission(item.permission)` | ✅ |
| 7. Shared auth across Multi-Zones | All zones read same localStorage (same origin) | ✅ |

---

## Table 5.8: API Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|:------------:|-------------|
| POST | `/api/auth/login` | ❌ | Authenticate user, return JWT |
| GET | `/api/users` | ❌ | List all users |
| POST | `/api/users` | ❌ | Create new user |
| PUT | `/api/users/:id/status` | ❌ | Toggle user active/inactive |
| GET | `/api/transactions` | ❌ | List financial transactions |
| POST | `/api/transactions` | ❌ | Record new transaction |
| GET | `/api/invoices` | ❌ | List invoices |
| GET | `/api/customers` | ❌ | List customers |
| GET | `/api/orders` | ❌ | List orders |
| GET | `/api/products` | ❌ | List inventory products |
| POST | `/api/products/:id/reorder` | ❌ | Reorder product stock |
| GET | `/api/health` | ❌ | System health status |

---

## Table 5.9: Multi-Zone Routing Configuration

| Route Pattern | Proxy Target | Remote App |
|--------------|:------------:|:----------:|
| `/dashboard/:path*` | `http://localhost:3001` | Dashboard |
| `/users/:path*` | `http://localhost:3002` | Users |
| `/finance/:path*` | `http://localhost:3003` | Finance |
| `/operations/:path*` | `http://localhost:3004` | Operations |
| `/inventory/:path*` | `http://localhost:3005` | Inventory |
| `/reports/:path*` | `http://localhost:3006` | Reports |
| `/analytics/:path*` | `http://localhost:3007` | Analytics |
| `/system-health/:path*` | `http://localhost:3008` | System Health |

---

## Table 5.10: Technology Stack

| Layer | Technology | Version |
|-------|-----------|:-------:|
| Frontend Framework | Next.js (App Router) | 14.1.0 |
| UI Library | React | 18.3.1 |
| Language | TypeScript | 5.9.3 |
| Package Manager | pnpm | 9.0.0 |
| Monorepo Orchestrator | Turborepo | 1.13.4 |
| Backend | Express.js | 4.21.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 16.x |
| Authentication | jsonwebtoken (JWT) | 9.x |
| Icons | Lucide React | 0.469.x |
| Code Formatter | Prettier | 3.9.6 |

---

## Table 5.11: Independent Deployability Matrix

| Property | Evidence |
|----------|---------|
| Independent build | Each app has its own `next build` command, verified via sequential compilation |
| Independent dev server | Each app runs on its own port (3000–3008) |
| Independent failure | `MfeErrorBoundary` isolates crashes per-module |
| Shared dependencies | `@nexasphere/ui`, `auth`, `utils` consumed as workspace packages |
| Shared auth state | All zones share `localStorage` (same-origin policy) |
| No cross-MFE build coupling | Removing one MFE's source does not break other MFEs' builds |
| Incremental hot reload | File changes in one MFE only trigger recompile in that MFE (~750ms) |
