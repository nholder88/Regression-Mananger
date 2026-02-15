# System Patterns

## Architecture
Nx monorepo with:
- **regression-poc**: Angular SPA (main UI)
- **api**: NestJS backend (REST API, TypeORM, SQL Server)
- **api-interfaces**: Shared TypeScript interfaces
- **regression-poc-e2e**: Cypress E2E tests

## Key Technical Decisions
- **@nestjsx/crud**: CRUD endpoints generated from DTOs; controllers use `@Crud` decorator
- **BaseModelService**: Angular service base class for HTTP CRUD with BehaviorSubjects for list/add/delete/selection
- **JWT Auth**: Login returns `access_token`; JwtInterceptor attaches token to requests; AuthGuard protects routes
- **Lazy-loaded feature modules**: Regression, Reporting (dashboard), Admin

## Design Patterns
- **Feature modules**: Regression, Reporting, Admin; each has containers, components, services
- **Shared module**: Login, guards, interceptors, BaseModelService, ErrorHandlingService
- **API path convention**: `environment.apiUrl + /{EndpointName}` (e.g., RegressionHeader, TestPass, Feature, Scenario, Step, ScenarioResult, User)

## Component Relationships

```
AppModule
├── AppRoutingModule (lazy: regression, admin, dashboard)
├── WelcomeComponent (login outlet)
├── ApplicationHeaderComponent (nav: Dashboard, Regressions, Administration)
└── Feature Modules
    ├── RegressionModule (history, listing, continue/:id)
    ├── ReportingModule (dashboard landing, bar graph, datatable)
    └── AdminModule (landing, users, features, scenarios)
```

## API Structure
- **AuthModule**: POST /auth/login, GET /profile; uses UsersModule for validation
- **RegressionModule**: CRUD for RegressionHeader, TestPass, Feature, Scenario, Step, ScenarioResult
- **UsersModule**: CRUD for User (UserController at /User)
