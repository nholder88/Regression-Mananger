# Active Context

## Current Work Focus
Establishing Memory Bank and application spec documentation to capture implemented features and unfinished work.

## Recent Changes
- Initial Memory Bank creation
- Application spec documenting implemented vs unfinished areas

## Next Steps
1. Test Import Page for Data Seeding (Phase I)
2. E2E Testing for Release Validation (Phase I)
3. User Roles with backend (Phase II)
4. Admin Teams route and management (Phase II)
5. Address route gaps: admin/teams, regression/manage
6. Resolve code TODOs (scenario-result mash, unsubscribe, role backend, login return object)

## Active Decisions and Considerations
- RoleService uses mock data; backend roles not yet implemented
- Teams route exists in nav but no corresponding component/route
- regression/manage link in header has no route (may map to listing or history)
- API User controller path is `User` (PascalCase); frontend UserService uses `user` (lowercase) - verify compatibility
