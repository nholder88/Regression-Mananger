# Progress

## What Works
- Comprehensive framework-agnostic application specification documented (`application-spec.md`)
- Nx workspace upgraded to 19.8.4 with @nx/next plugin
- Next.js 14 app (`regression-ui`) builds successfully with all routes
- Skeleton UI + Tailwind CSS layout with cerberus dark theme
- AppShell navigation: header, sub-nav, user dropdown, logout
- Login page with JWT auth (POST /auth/login, token in localStorage)
- API client with automatic JWT headers and 401 handling
- Dashboard page with summary cards, CSS bar chart, results table
- Regression listing page with test pass table and inline create form
- Regression continue/[id] page with accordion, status dropdowns, save
- Regression history page with headers table
- Admin users page with CRUD inline form
- Admin features page with CRUD inline form and enable toggle
- Admin scenarios page with CRUD inline form and dynamic steps list
- Typed API services (regression.service.ts, admin.service.ts)
- NestJS 10 API running: all modules loaded, all CRUD routes mapped, Swagger at /api
- @dataui/crud v5 replaces @nestjsx/crud v4 (maintained fork, same API)
- Dev script updated: `npm run dev` auto-starts PostgreSQL + serves API + Next.js app
- PostgreSQL 16 running via Docker Compose with healthcheck
- TypeORM migrations run successfully against PostgreSQL
- Centralized .env configuration at project root
- Dockerfiles for API and UI (multi-stage builds) ready for full containerization

## What's Left to Build
- Chart.js integration for dashboard (replace CSS placeholder bars)
- Test pass create wizard (multi-step feature/scenario selection)
- E2E tests for the new Next.js app
- Full removal of Angular regression-poc app
- Admin Teams route and management
- Route for regression/manage
- User roles backend (Phase II)
- Test Import Page for Data Seeding
- Test full containerized stack (docker compose --profile full up)

## Known Issues
- Project name is `regression-ui-regression-ui` due to Nx generator nesting
- Angular app still present (dev:legacy script available)
- RoleService/roles not yet ported (was mock data in Angular)
- UserService endpoint case mismatch (User vs user) still applies to new services
- Next.js middleware is passthrough (auth enforced client-side only)
- Angular CLI updated to v18.2 (legacy Angular app may need attention before removal)
