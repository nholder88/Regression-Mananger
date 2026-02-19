# Tech Context

## Technologies
- **Frontend (new)**: Next.js 14 (App Router), React 18, Skeleton UI, Tailwind CSS v4
- **Frontend (legacy)**: Angular 9/11, Clarity UI (@clr/angular), ng2-charts, RxJS
- **Backend**: NestJS 10, TypeORM 0.2, @dataui/crud, Passport/JWT, RxJS 7
- **Database**: PostgreSQL 16 (pg driver); migrations via TypeORM CLI
- **Containerization**: Docker Compose with profiles (db-only for dev, full stack for CI/prod)
- **Testing**: Jest (unit), Cypress (e2e)
- **Monorepo**: Nx 19.8.4

## Development Setup
- `npm install --legacy-peer-deps` then `npm run dev` to run DB, API, and Next.js UI
- `npm run db:up` / `npm run db:down` to manage PostgreSQL container independently
- `npm run docker:up` to run full containerized stack (DB + API + UI)
- API: `npx nx serve api` (port 3333, prefix /api)
- UI (new): `npx nx dev regression-ui-regression-ui` (port 4200)
- UI (legacy): `npm run dev:legacy` for Angular app
- Migrations: `npm run typeorm:migrate <name>`, `npm run typeorm:run`

## New Frontend Structure
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

## Environment
- Centralized `.env` file at project root (`.env.example` committed as template)
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`: DB connection
- `API_PORT`: NestJS listen port (falls back to `PORT`, then 3333)
- `JWT_SECRET`: JWT signing key (dev default: `devTesting`)
- `ADMIN_USER` / `ADMIN_PASSWORD`: Seed admin credentials
- `NEXT_PUBLIC_API_URL`: API base URL (default: `http://localhost:3333/api`)

## Docker Setup
- Root `docker-compose.yml` with PostgreSQL service and profile-gated `api`/`ui` services
- `docker compose up db` starts only PostgreSQL (for local dev)
- `docker compose --profile full up` starts DB + API + UI containers
- Dockerfiles: `apps/api/Dockerfile` (NestJS multi-stage), `apps/regression-ui/Dockerfile` (Next.js standalone)
- `.dockerignore` at root excludes node_modules, dist, .next, .git

## Technical Constraints
- Nx project name is `regression-ui-regression-ui` (nested directory artifact)
- Angular dependencies still in package.json for legacy app
- TypeORM 0.2.x with NestJS migrations
- Swagger at /api for API docs
