# Application Spec

## Section A: Implemented Features

### Frontend (regression-poc Angular App)

**Regression Module**
- Regression listing
- Test pass listing
- Test pass create wizard
- Regression testing (continue/:id)
- Regression header modal

**Reporting Module (Dashboard)**
- Landing page
- Bar graph for scenario results
- Datatable for scenario results

**Admin Module**
- Users container, list, form
- Features container, list, form
- Scenarios container, list, form

**Auth**
- Login component
- JWT interceptor
- AuthGuard
- Logout

**Shared**
- BaseModelService
- Login service
- Error handling
- Application header with navigation

### Backend (NestJS API)

- Regression CRUD: regression headers, test passes, features, scenarios, steps, scenario results
- Auth: POST /auth/login, JWT strategy, profile endpoint
- User CRUD: UserController with @nestjsx/crud (excludes replaceOne, password in query)
- TypeORM entities and migrations (init migration present)

### Infrastructure

- CI for UI and API (Azure pipeline, GitHub Actions per README badges)
- Nx monorepo: regression-poc, api, api-interfaces, regression-poc-e2e

---

## Section B: Unfinished / Gaps

### From README Roadmap

1. **Test Import Page for Data Seeding** - Not implemented; no import/seed UI or API
2. **E2E Testing for Release Validation** - E2e project exists; spec only checks welcome message; no regression/release flows
3. **User Roles** - RoleService returns mock `of([...])`; no backend roles
4. **Admin Pages for Managing Tests, Users, Regressions** - Users/Features/Scenarios exist; Teams and role enforcement missing

### Route Gaps

- `admin/teams` - Header links to it; AdminModule has no teams route (only users, features, scenarios)
- `regression/manage` - Header links to it; RegressionModule has history, listing, continue/:id but no "manage" route

### Code TODOs

| File | Line | Description |
|------|------|-------------|
| [scenario-result.service.ts](apps/regression-poc/src/app/feature/regression/services/scenario-result.service.ts) | 32 | Mash existing test pass data with scenario results |
| [regression-testing.component.ts](apps/regression-poc/src/app/feature/regression/components/regression-testing.component.ts) | 68 | Unsubscribe handling |
| [role.service.ts](apps/regression-poc/src/app/feature/admin/services/role.service.ts) | 10 | Backend for roles |
| [login.service.ts](apps/regression-poc/src/Shared/services/login.service.ts) | 25 | Return object accuracy |

### Potential Issues

- UserService uses endpoint `'user'` (lowercase) vs API `@Controller('User')` - possible path mismatch
- Login fallback when `apiUrl.length <= 1` returns undefined for non-"test" credentials
- Admin feature/feature-listing uses FeatureService (regression API); admin scenario/scenario-listing uses ScenarioService - verify these hit correct API paths
