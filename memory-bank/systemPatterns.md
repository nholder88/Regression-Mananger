# System Patterns

## Architecture
Nx monorepo with:
- **regression-ui**: Next.js 14 SPA (new frontend, App Router)
- **regression-poc**: Angular SPA (legacy frontend, to be removed)
- **api**: NestJS backend (REST API, TypeORM, PostgreSQL)
- **api-interfaces**: Shared TypeScript interfaces
- **regression-poc-e2e**: Cypress E2E tests

## Key Technical Decisions
- **Next.js App Router**: Route groups for authenticated vs public pages
- **Skeleton UI + Tailwind CSS v4**: cerberus dark theme, utility-first styling
- **Client-side auth**: JWT token in localStorage, API client auto-attaches Bearer header
- **@nestjsx/crud**: CRUD endpoints generated from DTOs; controllers use `@Crud` decorator
- **Typed API services**: Separate service files per domain (regression, admin) wrapping ApiClient

## Design Patterns
- **Route groups**: `(authenticated)` group wraps pages in AppShell layout
- **AppShell component**: Client component with header nav, sub-nav, user dropdown
- **API client singleton**: Single `apiClient` instance with get/post/put/patch/delete, auto 401 handling
- **Service layer**: Domain services (regressionService, userService, featureService, scenarioService) abstract API calls
- **Inline CRUD forms**: Admin pages toggle between table view and inline edit form

## Component Relationships

```
RootLayout (data-theme="cerberus")
├── /login → LoginPage (public)
├── (authenticated)/layout → AppShell
│   ├── /dashboard → DashboardPage
│   ├── /regression
│   │   ├── /listing → TestPassListingPage
│   │   ├── /continue/[id] → RegressionTestingPage
│   │   └── /history → RegressionHistoryPage
│   └── /admin
│       ├── /users → UsersPage
│       ├── /features → FeaturesPage
│       └── /scenarios → ScenariosPage
```

## API Structure
- **AuthModule**: POST /auth/login, GET /profile; uses UsersModule for validation
- **RegressionModule**: CRUD for RegressionHeader, TestPass, Feature, Scenario, Step, ScenarioResult
- **UsersModule**: CRUD for User (UserController at /User)
