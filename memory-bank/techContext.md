# Tech Context

## Technologies
- **Frontend**: Angular 9/11, Clarity UI (@clr/angular), ng2-charts, RxJS
- **Backend**: NestJS, TypeORM, @nestjsx/crud, Passport/JWT
- **Database**: SQL Server (mssql driver); migrations via TypeORM CLI
- **Testing**: Jest (unit), Cypress (e2e)

## Development Setup
- `npm install` then `npm run dev` to run API and UI concurrently
- API: `ng serve api` (port 3333, prefix /api)
- UI: `ng serve -o` (port 4200)
- Migrations: `npm run typeorm:migrate <name>`, `npm run typeorm:run`

## Environment
- `apps/regression-poc/src/environments/environment.ts`: apiUrl = `http://localhost:3333/api`
- `apps/regression-poc/proxy.conf.json`: proxies API requests during dev
- SQL Server: create `root` user and `dev` database; enable TCP/IP for local instance

## Technical Constraints
- Angular 9/11 mixed versions in package.json
- TypeORM 0.2.x with NestJS migrations (ormconfig at apps/api/src/app/ormconfig.ts)
- Swagger at /api for API docs
