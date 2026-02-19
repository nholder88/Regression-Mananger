# Active Context

## Current Work Focus
NestJS v10 upgrade completed. All NestJS packages aligned to v10, CRUD library replaced, middleware upgraded, Nx executors fixed, and API confirmed running.

## Recent Changes
- Upgraded all NestJS packages from v6/v9 mix to v10 (common, core, platform-express, jwt, passport, typeorm, schematics, testing)
- Upgraded @nestjs/swagger from v4 to v7, added @nestjs/mapped-types
- Replaced unmaintained @nestjsx/crud v4 with @dataui/crud v5 (maintained fork)
- Upgraded helmet v3->v7, express-rate-limit v5->v7, swagger-ui-express v4->v5
- Upgraded RxJS from v6 to v7 (required by NestJS v10)
- Updated Angular CLI from v9.1.0 to v18.2, @angular-devkit/build-angular to v18.2
- Fixed Nx executors: build uses `@nx/webpack:webpack`, serve uses `@nx/js:node`
- Added `@nx/webpack` and `@nx/node` to devDependencies
- Created `apps/api/webpack.config.js` for Nx webpack executor
- Migrated `nx.json` from deprecated `implicitDependencies` to `namedInputs`
- Updated import style for helmet and express-rate-limit (default imports)
- Fixed deep swagger import paths (`@nestjs/swagger/dist/decorators` -> `@nestjs/swagger`)
- Switched dev scripts from `ng serve api` to `npx nx serve api`

## Next Steps
1. Connect to live API and validate all CRUD operations end-to-end
2. Add Chart.js + react-chartjs-2 for proper dashboard bar chart
3. Create test pass wizard (multi-step form for feature/scenario selection)
4. Add E2E tests targeting the new regression-ui app
5. Remove Angular `regression-poc` app after full validation
6. Test full containerized stack (`docker compose --profile full up`)

## Active Decisions and Considerations
- PostgreSQL chosen over MSSQL for lighter weight, free licensing, and strong TypeORM support
- Hybrid Docker approach: DB in container for dev, full stack containerization for CI/prod
- `.env` at root is the single source of truth for all environment configuration
- Docker Compose profiles separate dev (db only) from full stack (db + api + ui)
- Old Angular app preserved at `apps/regression-poc/` with `dev:legacy` script for fallback
- Auth uses localStorage for token/username (client-side only); middleware passes through
- Project name in Nx is `regression-ui-regression-ui` (nested directory from generator)
- @dataui/crud is a drop-in replacement for @nestjsx/crud (same API, different package name)
