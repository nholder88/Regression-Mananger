# Tech Context

## Technologies (Reference Stack)
The specifications in this repo are **framework-agnostic**. However, one concrete reference implementation uses the following stack:

- **Frontend (new)**: Next.js 14 (App Router), React 18, Skeleton UI, Tailwind CSS v4
- **Frontend (legacy)**: Angular 9/11, Clarity UI (@clr/angular), ng2-charts, RxJS
- **Backend**: NestJS 10, TypeORM 0.2, @dataui/crud, Passport/JWT, RxJS 7
- **Database**: PostgreSQL 16 (pg driver); migrations via TypeORM CLI
- **Containerization**: Docker Compose with profiles (db-only for dev, full stack for CI/prod)
- **Testing**: Jest (unit), Cypress (e2e)
- **Monorepo**: Nx 19.8.4 (in the original implementation repo, not in this specs repo)

## Development Setup (Reference Only)
The following commands describe how a **reference implementation** (in a separate repo) is wired today. They do **not** apply to this specs repository directly, but they influence the specs:

- `npm install` then `npm run dev` to run DB, API, and Next.js UI
- `npm run db:up` / `npm run db:down` to manage PostgreSQL container independently
- `npm run docker:up` to run full containerized stack (DB + API + UI)
- API: `npx nx serve api` (port 3333, prefix /api)
- UI (new): `npx nx dev regression-ui-regression-ui` (port 4200)
- UI (legacy): `npm run dev:legacy` for Angular app
- Migrations: `npm run typeorm:migrate <name>`, `npm run typeorm:run`

## New Frontend Structure (Reference Implementation)
In the reference Next.js implementation, the UI follows this structure:

```
apps/regression-ui/regression-ui/
  src/
    app/
      layout.tsx          - Root layout (cerberus theme)
      page.tsx            - Redirect to /dashboard
      login/page.tsx      - Login form
      (authenticated)/
        layout.tsx        - AppShell wrapper
        dashboard/page.tsx
        regression/
          page.tsx        - Redirect to listing
          listing/page.tsx
          continue/[id]/page.tsx
          history/page.tsx
        admin/
          page.tsx        - Redirect to users
          users/page.tsx
          features/page.tsx
          scenarios/page.tsx
    lib/
      environment.ts      - API URL config
      api-client.ts       - Fetch wrapper with JWT
      navigation.ts       - Nav links data
      services/
        regression.service.ts
        admin.service.ts
    components/
      AppShell.tsx        - Navigation shell
    middleware.ts         - Route middleware
```

## Environment (Conceptual)
- Centralized configuration file (e.g., `.env`) for database, API, JWT, and UI base URLs.
- Database connection variables (host, port, user, password, db name).
- API listen port and JWT signing key.
- Admin seed credentials (for initial admin user).

## Docker & Deployment (Conceptual)
- Container-compatible web app and API with a shared database.
- Optional Docker Compose setup for local development and CI.
- Separation between dev-only services (e.g., db-only) and full stack profiles.

## Technical Constraints (Reference Implementation)
- Nx project name `regression-ui-regression-ui` (nested directory artifact).
- Angular dependencies in `package.json` for a legacy app.
- TypeORM 0.2.x with NestJS migrations.
- Swagger at `/api` for API docs.
