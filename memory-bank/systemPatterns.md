# System Patterns

## Architecture
Conceptual architecture (independent of any single repo layout):

- **Web App**: Regression management UI + REST API (or equivalent) backed by a relational database.
- **QA Agent CLI**: Standalone CLI that analyzes codebases, generates tests, runs them, and syncs results back to the web app.
- **Multi-Agent Pipeline**: Ticket Refiner → Code Implementer → QA Agent orchestrated via an issue tracker.

One reference implementation uses an Nx monorepo with:
- **regression-ui**: Next.js 14 SPA (new frontend, App Router)
- **regression-poc**: Angular SPA (legacy frontend, to be removed)
- **api**: NestJS backend (REST API, TypeORM, PostgreSQL)
- **api-interfaces**: Shared TypeScript interfaces
- **regression-poc-e2e**: Cypress E2E tests

## Key Technical Decisions (Reference Implementation)
- **Next.js App Router**: Route groups for authenticated vs public pages.
- **Skeleton UI + Tailwind CSS v4**: cerberus dark theme, utility-first styling.
- **Client-side auth**: JWT token in localStorage, API client auto-attaches Bearer header.
- **CRUD abstraction**: CRUD endpoints generated from DTOs using a NestJS CRUD layer.
- **Typed API services**: Separate service files per domain (regression, admin) wrapping ApiClient.

## Design Patterns
- **Route groups**: Authenticated vs public routes, with a shared application shell for authenticated flows.
- **AppShell component**: Layout with header nav, sub-nav, user dropdown.
- **API client singleton**: Single HTTP client with get/post/put/patch/delete, auto 401 handling.
- **Service layer**: Domain services (regression, user, feature, scenario) abstract API calls from UI components.
- **Inline CRUD forms**: Admin pages toggle between table view and inline edit form.

## Component Relationships (Web App)

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

## API Structure (Conceptual)
- **Auth**: POST `/auth/login`, GET `/profile`; validates against User records.
- **Regression**: CRUD for RegressionHeader, TestPass, Feature, Scenario, Step, ScenarioResult.
- **Users**: CRUD for User.
