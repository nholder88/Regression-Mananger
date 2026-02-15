# Progress

## What Works
- Regression listing, test pass listing, test pass create wizard, regression testing (continue/:id)
- Reporting dashboard with bar graph and datatable
- Admin users, features, scenarios (CRUD via API)
- Auth: login, JWT, AuthGuard, logout
- API: regression CRUD, auth, user CRUD
- CI: Azure pipeline, GitHub Actions
- Unit tests for services and components

## What's Left to Build
- Test Import Page for Data Seeding (Phase I)
- E2E tests for release validation (beyond welcome message)
- User roles backend (Phase II)
- Admin Teams route and management (Phase II)
- Route for regression/manage (or clarify mapping)
- Route for admin/teams (currently no component)

## Known Issues
- Route gaps: admin/teams, regression/manage link to non-existent routes
- RoleService is mock data
- UserService endpoint `user` vs API `User` - possible case mismatch
- Login fallback returns undefined when apiUrl is short and credentials are not "test"
- TODOs: scenario-result mash, regression-testing unsubscribe, role backend, login return object
