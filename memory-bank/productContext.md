# Product Context

## Why This Project Exists
QA teams need a structured way to run regression test passes, record outcomes, and view reporting. Manual tracking in spreadsheets or ad-hoc tools does not scale.

## Problems Solved
- **Test pass tracking**: Create named regression test passes and associate them with features/scenarios
- **Execution flow**: Start a test pass, record pass/fail for each scenario, save results
- **Reporting**: Visualize scenario results via charts and datatables
- **Test structure management**: Define features and scenarios (with steps) that comprise the regression suite
- **User management**: Admin interface for users and roles (partial; roles are mock)

## How It Should Work
1. User logs in with employer credentials
2. From Dashboard, view reporting on regression results
3. From Regressions area: view history, create test passes, continue existing passes to record results
4. From Administration: manage users, features, scenarios (and future: teams)
5. All API calls are authenticated via JWT

## User Experience Goals
- Clear navigation: Dashboard, Regressions (Test Passes, Manage, History), Administration (Users, Teams, Features, Scenarios)
- Clarity UI for consistent, accessible interface
- Responsive forms for creating test passes (wizard) and recording scenario results

## Detailed Specification
See `application-spec.md` for the full framework-agnostic application specification including all pages, API endpoints, data models, and behavioral rules.
