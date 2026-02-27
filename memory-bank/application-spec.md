# QA Regression Manager — Application Specification

> **Version**: 4.0
> **Purpose**: Framework-agnostic specification for the QA Regression Manager web application. This is **1 of 3** spec documents. It covers the web UI and API server. For the CLI/agent and AI engine, see `agent-spec.md`. For the multi-agent pipeline and ecosystem, see `ecosystem-spec.md`.

---

## 1. Product Overview

### 1.1 Name
QA Regression Manager (also referred to as ICP Regression Manager)

### 1.2 Purpose
The QA Regression Manager is the **web application and API server** at the center of a QA automation platform. It serves two audiences:

- **Web UI users** (QA testers, leads, admins) — plan regressions, execute test passes, manage the test library, and review dashboards through a browser.
- **The QA Agent CLI** (developers) — a command-line tool that analyzes codebases, generates executable test files, and syncs test definitions with this web application. See `agent-spec.md`.

The web application is also one node in a **3-agent developer toolchain** (Ticket Refiner, Code Implementer, QA Agent). See `ecosystem-spec.md`.

### 1.3 Users
- **QA Testers** — execute test passes and record results via the web UI.
- **QA Leads / Managers** — create regression headers, define test passes, review dashboards.
- **Developers** — interact via the QA Agent CLI (`qa init`, `qa generate`, etc.) to auto-generate and sync tests. See `agent-spec.md`.
- **Administrators** — manage users, features, scenarios, integrations, connected projects, and system configuration.
- **Admin User** — a special seeded account created on first startup from environment variables.

### 1.4 Key Workflows

#### Workflow A: Bootstrap
1. On first startup the system seeds an admin user into the database from environment variables.
2. Admin creates additional users.

#### Workflow B: Define Test Library (shared, team-visible)
1. Admin creates Features (with team assignment).
2. Admin creates Scenarios under Features, including Steps inline.
3. Alternatively, admin imports issues from an external tracker (ADO, Jira, GitHub) and converts them into Features/Scenarios/Steps (see Section 14).
4. Alternatively, a developer runs `qa generate` against a codebase, which analyzes the project and pushes generated Features/Scenarios/Steps to the web API. See `agent-spec.md`.

#### Workflow C: Plan a Regression
1. Lead creates a Regression Header (release name, date range).
2. Lead creates one or more Test Passes under it, selecting which Features to include.
3. Alternatively, the LLM intelligence engine recommends a Test Pass composition based on code changes between releases. See `agent-spec.md` Section 5.

#### Workflow D: Execute a Test Pass
1. Tester opens a test pass.
2. A single API call loads the full execution tree (test pass, features, scenarios, steps, existing results).
3. Tester walks through each scenario, records status/notes/bugs/step progress.
4. Save persists all results (including step completion state).
5. Complete marks the test pass as done.

#### Workflow E: Report
1. Dashboard is scoped to a specific Regression Header or Test Pass.
2. Summary cards, charts, and data table display results within that scope.
3. Drill-down from header to test passes to individual results.
4. LLM can auto-generate a stakeholder-ready regression report. See `agent-spec.md` Section 5.

#### Workflow F: Agent-Driven Testing (developer workflow)
1. Developer runs `qa init` in their project directory. The agent detects the language/framework/test runner and registers the project with the web application.
2. Developer runs `qa generate` — the agent analyzes the codebase, generates unit and E2E test files in the repo, and pushes corresponding test definitions to the web API.
3. Developer runs `qa run` — the agent executes tests using the project's native test runner, collects results, and pushes them to the web API.
4. Developer runs `qa sync` to reconcile any manual changes between repo test files and web UI test cases.
5. See `agent-spec.md` for full CLI specification.

---

## 2. Data Model

All primary keys are UUIDs, auto-generated. Entities that are part of the shared test library (Feature, Scenario, Step, RegressionHeader, TestPass, ScenarioResult) are **visible to all authenticated users**. The `userId` foreign key on each entity tracks *who created or last modified* the record (audit trail) but is **not used as a visibility filter**.

### 2.1 Entity Definitions

#### User
| Field    | Type   | Constraints                        |
|----------|--------|------------------------------------|
| id       | UUID   | PK, auto-generated                 |
| username | string | unique, required                   |
| email    | string | required                           |
| password | string | required, stored as bcrypt hash    |

- Password is hashed before persistence (bcrypt).
- Password is **never** returned in any API query response.
- The admin user is seeded into this table on first startup if no user with the admin username exists.

#### RegressionHeader
| Field       | Type    | Constraints / Defaults      |
|-------------|---------|-----------------------------|
| id          | UUID    | PK, auto-generated          |
| name        | string  | required                    |
| releaseName | string  | required                    |
| startDate   | Date    | default: current timestamp  |
| endDate     | Date    | default: current timestamp  |
| isComplete  | boolean | default: false              |
| isStarted   | boolean | default: false              |
| userId      | UUID    | FK → User (creator)         |

- **Relations**: belongs-to User (creator); has-many TestPass (cascade delete).

#### Feature
| Field  | Type   | Constraints / Defaults |
|--------|--------|------------------------|
| id     | UUID   | PK, auto-generated     |
| name   | string | required               |
| team   | string | required               |
| userId | UUID   | FK → User (creator)    |

- **Relations**: belongs-to User (creator); has-many Scenario (cascade delete, eager load); many-to-many TestPass (via join table).

#### Scenario
| Field     | Type   | Constraints / Defaults          |
|-----------|--------|---------------------------------|
| id        | UUID   | PK, auto-generated              |
| name      | string | required                        |
| note      | string | default: empty string           |
| order     | number | auto-increment / sequential     |
| timestamp | Date   | default: current timestamp      |
| userId    | UUID   | FK → User (creator)             |
| featureId | UUID   | FK → Feature                    |

- **Relations**: belongs-to User (creator); belongs-to Feature (cascade delete); has-many Step (cascade delete, eager load).
- **Nested creation**: When creating or updating a Scenario, an optional `steps` array can be provided to create/replace all child Steps in one request.

#### Step
| Field      | Type   | Constraints / Defaults |
|------------|--------|------------------------|
| id         | UUID   | PK, auto-generated     |
| name       | string | required               |
| order      | number | required               |
| userId     | UUID   | FK → User (creator)    |
| scenarioId | UUID   | FK → Scenario          |

- **Relations**: belongs-to User (creator); belongs-to Scenario (cascade delete).

#### TestPass
| Field                | Type    | Constraints / Defaults      |
|----------------------|---------|-----------------------------|
| id                   | UUID    | PK, auto-generated          |
| title                | string  | required                    |
| testingLoginUserName | string  | default: empty string       |
| testingRole          | string  | default: empty string       |
| isComplete           | boolean | default: false              |
| isStarted            | boolean | default: false              |
| timeStamp            | Date    | default: current timestamp  |
| userId               | UUID    | FK → User (creator)         |
| headerId             | UUID    | FK → RegressionHeader       |

- **Relations**: belongs-to User (creator); belongs-to RegressionHeader; many-to-many Feature (owner side, via join table); has-many ScenarioResult (cascade delete).

#### ScenarioResult
| Field          | Type     | Constraints / Defaults               |
|----------------|----------|---------------------------------------|
| id             | UUID     | PK, auto-generated                    |
| status         | string   | enum: "pass", "fail", "blocked", "not_run" |
| notes          | string   | default: empty string                 |
| bugCreated     | boolean  | default: false                        |
| completedBy    | string   | default: empty string                 |
| timestamp      | Date     | default: current timestamp            |
| completedSteps | number[] | JSON column, default: empty array     |
| userId         | UUID     | FK → User (creator)                   |
| scenarioId     | UUID     | FK → Scenario                         |
| testPassId     | UUID     | FK → TestPass                         |

- `completedSteps` stores the indices of steps the tester has checked off. Persisted as a JSON array so progress survives between sessions.
- **Unique constraint**: `(scenarioId, testPassId)` — one result per scenario per test pass.
- **Relations**: belongs-to User (creator); belongs-to Scenario (cascade delete); belongs-to TestPass (cascade delete).

#### IntegrationConfig
| Field        | Type   | Constraints / Defaults                  |
|--------------|--------|-----------------------------------------|
| id           | UUID   | PK, auto-generated                      |
| provider     | string | enum: "azure_devops", "jira", "github"  |
| name         | string | required (display name)                 |
| baseUrl      | string | required (instance URL)                 |
| projectKey   | string | required (project/org identifier)       |
| authMethod   | string | enum: "pat", "oauth", "api_key"         |
| authToken    | string | encrypted at rest                       |
| isActive     | boolean| default: true                           |
| userId       | UUID   | FK → User (creator)                     |
| createdAt    | Date   | default: current timestamp              |
| updatedAt    | Date   | default: current timestamp              |

- Stores connection details for external issue trackers.
- `authToken` is encrypted before storage, decrypted only at the point of use.
- **Relations**: belongs-to User (creator); has-many ImportSession.

#### ImportSession
| Field            | Type   | Constraints / Defaults              |
|------------------|--------|-------------------------------------|
| id               | UUID   | PK, auto-generated                  |
| integrationId    | UUID   | FK → IntegrationConfig              |
| query            | string | the query/filter used to fetch issues |
| status           | string | enum: "pending", "in_progress", "completed", "failed" |
| importedCount    | number | default: 0                          |
| skippedCount     | number | default: 0                          |
| errorMessage     | string | nullable                            |
| userId           | UUID   | FK → User (who triggered)           |
| createdAt        | Date   | default: current timestamp          |

- Tracks each import operation for audit and debugging.
- **Relations**: belongs-to User; belongs-to IntegrationConfig.

#### ProjectConfig
| Field          | Type   | Constraints / Defaults                  |
|----------------|--------|-----------------------------------------|
| id             | UUID   | PK, auto-generated                      |
| name           | string | required (display name)                 |
| repoUrl        | string | required (git remote URL)               |
| language       | string | detected: "typescript", "python", "go", "java", "csharp", etc. |
| framework      | string | detected: "nextjs", "express", "django", "spring", etc. |
| testRunner     | string | detected: "jest", "vitest", "pytest", "junit", "playwright", etc. |
| testDirectory  | string | detected path to test files             |
| sourceDirectory| string | detected path to source files           |
| lastAnalyzedAt | Date   | nullable, updated on each `qa generate` |
| configHash     | string | hash of the `.qa/config.yaml` file for change detection |
| userId         | UUID   | FK → User (who connected it)            |
| createdAt      | Date   | default: current timestamp              |
| updatedAt      | Date   | default: current timestamp              |

- Stores the detected profile of a connected codebase project.
- Created automatically when a developer runs `qa init` and the agent registers with the web API.
- **Relations**: belongs-to User; has-many TestFile; has-many AgentRun.

#### TestFile
| Field        | Type   | Constraints / Defaults                  |
|--------------|--------|-----------------------------------------|
| id           | UUID   | PK, auto-generated                      |
| projectId    | UUID   | FK → ProjectConfig                      |
| scenarioId   | UUID   | FK → Scenario (nullable)                |
| filePath     | string | required (relative path in repo)        |
| testType     | string | enum: "unit", "e2e", "api"              |
| generatedAt  | Date   | default: current timestamp              |
| lastSyncedAt | Date   | nullable                                |
| syncStatus   | string | enum: "synced", "modified_in_repo", "modified_in_ui", "conflict" |
| contentHash  | string | hash of last known file content         |

- Tracks each generated test file and its sync state with the web UI.
- Links a file in the repo to a Scenario in the test library.
- **Relations**: belongs-to ProjectConfig; belongs-to Scenario (optional).

#### AgentRun
| Field        | Type   | Constraints / Defaults              |
|--------------|--------|-------------------------------------|
| id           | UUID   | PK, auto-generated                  |
| projectId    | UUID   | FK → ProjectConfig                  |
| command      | string | enum: "init", "generate", "run", "sync", "report", "watch" |
| status       | string | enum: "running", "completed", "failed" |
| startedAt    | Date   | default: current timestamp          |
| completedAt  | Date   | nullable                            |
| summary      | string | human-readable result summary       |
| errorMessage | string | nullable                            |
| userId       | UUID   | FK → User (who triggered)           |

- Logs each CLI agent execution for audit and debugging.
- **Relations**: belongs-to ProjectConfig; belongs-to User.

#### UserRole (placeholder — not fully implemented)
| Field       | Type     | Notes                          |
|-------------|----------|--------------------------------|
| id          | UUID     | PK                             |
| name        | string   | role name                      |
| permissions | string[] | not persisted, runtime only    |

- Currently returns mock/hardcoded data. Backend enforcement is a future feature.

### 2.2 Entity Relationship Diagram

```
User (1)─────────────┬──── creates ───── RegressionHeader (*)
                     │                        │
                     │                   contains (1:*)
                     │                        │
                     ├──── creates ───── TestPass (*)
                     │                    │          │
                     │              linked (M:N)   contains (1:*)
                     │                    │          │
                     ├──── creates ── Feature (*)    ScenarioResult (*)
                     │                    │               │
                     │              contains (1:*)   linked (M:1)
                     │                    │               │
                     ├──── creates ── Scenario (*) ◄──────┘
                     │                    │
                     │              contains (1:*)
                     │                    │
                     ├──── creates ──── Step (*)
                     │
                     ├──── configures ── IntegrationConfig (*)
                     │                        │
                     │                   tracks (1:*)
                     │                        │
                     ├──── triggers ──── ImportSession (*)
                     │
                     ├──── connects ──── ProjectConfig (*)
                     │                    │
                     │              tracks (1:*)
                     │                    │
                     │               ┌── TestFile (*) ──── links to ── Scenario
                     │               │
                     │               └── AgentRun (*)
```

### 2.3 Data Hierarchy Summary

```
User
├── RegressionHeader
│   └── TestPass(es)
│       ├── Feature(s)        [many-to-many]
│       └── ScenarioResult(s)
│           └── Scenario      [many-to-one]
│
├── Feature
│   └── Scenario(s)
│       └── Step(s)
│
├── IntegrationConfig
│   └── ImportSession(s)
│
├── ProjectConfig (connected codebase)
│   ├── TestFile(s) → Scenario
│   └── AgentRun(s)
```

---

## 3. Authentication & Authorization

### 3.1 Login Flow
1. User submits `{username, password}` to the login endpoint.
2. Server looks up user by username in the database and compares password using bcrypt.
3. On success, server returns a signed JWT with payload: `{username, sub: userId}`.
4. Client stores the token in browser local storage (key: `reg_qa_app_token`).
5. All subsequent API requests include `Authorization: Bearer <token>` header.

### 3.2 JWT Configuration
| Parameter   | Value                                              |
|-------------|----------------------------------------------------|
| Algorithm   | HS256 (default)                                    |
| Expiry      | 2 days                                             |
| Secret      | Configurable via `JWT_SECRET` env var              |
| Payload     | `{username: string, sub: UUID (userId)}`           |
| Extraction  | `Authorization` header, Bearer scheme              |

### 3.3 Route Protection
- All API endpoints require a valid JWT **except** the login endpoint and the health check.
- Frontend uses a route guard / middleware to check for a valid token before rendering protected pages. If the token is missing or expired, redirect to login.
- On receiving a 401 response from the API, the client clears the stored token and redirects to login.

### 3.4 Admin Seed Account
- Configured via environment variables: `ADMIN_USER`, `ADMIN_PASSWORD`.
- On application startup, if no user with the configured admin username exists in the database, a User record is created with those credentials (password bcrypt-hashed).
- This ensures the admin has a real UUID and can create/own entities like any other user.

### 3.5 Profile Endpoint
- Returns the authenticated user's information (id, username) derived from the JWT payload.

### 3.6 Future: User Roles
- A roles system is planned but not implemented.
- Currently, a mock role service returns hardcoded role data.
- No backend enforcement of permissions exists.

---

## 4. API Specification

### 4.1 General Conventions
| Aspect          | Detail                                            |
|-----------------|---------------------------------------------------|
| Base path       | `/api`                                            |
| Auth            | JWT Bearer token required on all endpoints except login and heartbeat |
| Rate limiting   | 100 requests per 4 minutes per IP address         |
| CORS            | Enabled for all origins                           |
| Security headers| HTTP security headers enabled (e.g., Helmet)      |
| Visibility      | All authenticated users can see all records (no per-user filtering) |
| Audit           | `userId` tracks who created each record           |
| ID format       | UUID                                              |
| Date format     | ISO 8601                                          |
| Pagination      | All list endpoints support `?page=1&limit=25` (default limit: 25, max: 100) |
| Sorting         | `?sort=field,ASC` or `?sort=field,DESC`           |

### 4.2 Authentication Endpoints

| Method | Path              | Request Body              | Response                 | Auth Required |
|--------|-------------------|---------------------------|--------------------------|---------------|
| POST   | /api/auth/login   | `{username, password}`    | `{access_token: string}` | No            |
| GET    | /api/profile      | —                         | `{id, username}`          | Yes           |

### 4.3 Health Check

| Method | Path                | Response         | Auth Required |
|--------|---------------------|------------------|---------------|
| GET    | /api/App/heartbeat  | Health status    | No            |

### 4.4 Resource CRUD Endpoints

Each resource follows a standard CRUD pattern. All require JWT authentication.

**Pagination response envelope**:
```
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 25,
  "pageCount": 6
}
```

#### Regression Headers — `/api/Header`

| Method | Path              | Description                  | Joins                  | Notes           |
|--------|-------------------|------------------------------|------------------------|-----------------|
| GET    | /api/Header       | List all (paginated)         | testPasses, user       |                 |
| GET    | /api/Header/:id   | Get by ID                    | testPasses, user       |                 |
| POST   | /api/Header       | Create                       | —                      | userId auto-set from auth |
| PATCH  | /api/Header/:id   | Update                       | —                      |                 |
| DELETE | /api/Header/:id   | Delete                       | —                      | Cascades to test passes |

**Create/Update Body**: `{name, releaseName, startDate?, endDate?, isComplete?, isStarted?}`

#### Features — `/api/Feature`

| Method | Path              | Description                  | Joins                  | Notes           |
|--------|-------------------|------------------------------|------------------------|-----------------|
| GET    | /api/Feature      | List all (paginated)         | scenarios, scenarios.steps |             |
| GET    | /api/Feature/:id  | Get by ID                    | scenarios, scenarios.steps |             |
| POST   | /api/Feature      | Create                       | —                      |                 |
| PATCH  | /api/Feature/:id  | Update                       | —                      |                 |
| DELETE | /api/Feature/:id  | Delete                       | —                      | Cascades to scenarios, steps |

**Create/Update Body**: `{name, team}`

#### Scenarios — `/api/Scenario`

| Method | Path               | Description                 | Joins                  | Notes           |
|--------|--------------------|-----------------------------|------------------------|-----------------|
| GET    | /api/Scenario      | List all (sorted by order ASC, paginated) | steps, feature, user |  |
| GET    | /api/Scenario/:id  | Get by ID                   | steps, feature, user   |                 |
| POST   | /api/Scenario      | Create (with nested steps)  | —                      |                 |
| PATCH  | /api/Scenario/:id  | Update (with nested steps)  | —                      |                 |
| DELETE | /api/Scenario/:id  | Delete                      | —                      | Cascades to steps |

**Create/Update Body**: `{name, note?, order?, featureId, steps?: [{name, order}]}`

When `steps` is provided, the server replaces all existing steps for that scenario with the provided set. This allows atomic creation and modification of a scenario and its steps in a single request.

#### Steps — `/api/Step`

| Method | Path           | Description    | Joins  | Notes           |
|--------|----------------|----------------|--------|-----------------|
| GET    | /api/Step      | List all (paginated) | user |                 |
| GET    | /api/Step/:id  | Get by ID      | user   |                 |
| POST   | /api/Step      | Create         | —      |                 |
| PATCH  | /api/Step/:id  | Update         | —      |                 |
| DELETE | /api/Step/:id  | Delete         | —      |                 |

**Create/Update Body**: `{name, order, scenarioId}`

Individual Step CRUD is still available for fine-grained control, but the nested approach via Scenario is preferred.

#### Test Passes — `/api/TestPass`

| Method | Path                    | Description              | Joins                                        | Notes           |
|--------|-------------------------|--------------------------|----------------------------------------------|-----------------|
| GET    | /api/TestPass           | List all (paginated)     | header, featureScenarioContainers, results   |                 |
| GET    | /api/TestPass/:id       | Get by ID                | results                                      |                 |
| GET    | /api/TestPass/:id/full  | Get full execution tree  | features, scenarios, steps, results          | See below       |
| POST   | /api/TestPass           | Create                   | —                                            |                 |
| PATCH  | /api/TestPass/:id       | Update                   | —                                            |                 |
| DELETE | /api/TestPass/:id       | Delete                   | —                                            | Cascades to scenario results |

**Create/Update Body**: `{title, testingLoginUserName?, testingRole?, isComplete?, isStarted?, headerId, featureIds?: UUID[]}`

The many-to-many relationship with Features is managed on the TestPass side. When creating or updating a test pass, the set of associated feature IDs can be provided.

**`GET /api/TestPass/:id/full`** returns the complete execution tree in a single response:
```
{
  "id": "...",
  "title": "...",
  ...testPass fields...,
  "features": [
    {
      "id": "...",
      "name": "...",
      "scenarios": [
        {
          "id": "...",
          "name": "...",
          "steps": [ { "id": "...", "name": "...", "order": 1 } ],
          "result": {
            "id": "...",
            "status": "pass",
            "notes": "...",
            "completedSteps": [0, 1, 2],
            ...
          } | null
        }
      ]
    }
  ]
}
```

This endpoint is used by the Regression Testing page to load everything needed for execution in one call.

#### Scenario Results — `/api/ScenarioResult`

| Method | Path                        | Description        | Joins                      | Notes           |
|--------|-----------------------------|--------------------|----------------------------|-----------------|
| GET    | /api/ScenarioResult         | List all (paginated) | scenario, testPass, user |                 |
| GET    | /api/ScenarioResult/:id     | Get by ID          | scenario, testPass, user   |                 |
| POST   | /api/ScenarioResult         | Create             | —                          |                 |
| PATCH  | /api/ScenarioResult/:id     | Update             | —                          |                 |
| DELETE | /api/ScenarioResult/:id     | Delete             | —                          |                 |
| POST   | /api/ScenarioResult/bulk    | Bulk create/update | —                          | Array of results |

**Create/Update Body**: `{status, notes?, bugCreated?, completedBy?, completedSteps?, scenarioId, testPassId}`

**Bulk Body**: `[{status, notes?, bugCreated?, completedBy?, completedSteps?, scenarioId, testPassId}, ...]`

The bulk endpoint creates new results or updates existing ones (matched by the unique constraint on `scenarioId + testPassId`).

**Filtering**: Supports query parameters for scoping dashboard data:
- `?testPassId=UUID` — filter by test pass
- `?headerId=UUID` — filter by regression header (results whose testPass belongs to that header)
- `?featureId=UUID` — filter by feature (results whose scenario belongs to that feature)

#### Users — `/api/User`

| Method | Path            | Description           | Notes                          |
|--------|-----------------|-----------------------|--------------------------------|
| GET    | /api/User       | List all (paginated)  | Password excluded from response |
| GET    | /api/User/:id   | Get by ID             | Password excluded from response |
| POST   | /api/User       | Create                | Password auto-hashed with bcrypt |
| PATCH  | /api/User/:id   | Update                |                                |
| DELETE | /api/User/:id   | Delete                |                                |

**Create Body**: `{username, email, password}`
**Update Body**: `{username?, email?, password?}`

#### Integration Config — `/api/Integration`

| Method | Path                  | Description           | Notes                          |
|--------|-----------------------|-----------------------|--------------------------------|
| GET    | /api/Integration      | List all configs      | authToken excluded from response |
| GET    | /api/Integration/:id  | Get by ID             | authToken excluded from response |
| POST   | /api/Integration      | Create                | authToken encrypted before storage |
| PATCH  | /api/Integration/:id  | Update                |                                |
| DELETE | /api/Integration/:id  | Delete                | Cascades to import sessions    |
| POST   | /api/Integration/:id/test | Test connection    | Returns success/failure        |

**Create/Update Body**: `{provider, name, baseUrl, projectKey, authMethod, authToken?, isActive?}`

#### Import — `/api/Import`

| Method | Path                          | Description                    | Notes           |
|--------|-------------------------------|--------------------------------|-----------------|
| POST   | /api/Import/preview           | Preview issues before import   | Returns parsed issues without saving |
| POST   | /api/Import/execute           | Execute import                 | Creates Features/Scenarios/Steps     |
| GET    | /api/Import/sessions          | List import sessions (paginated) |               |
| GET    | /api/Import/sessions/:id      | Get session details            |                 |

See Section 14 for full import workflow details.

#### Projects — `/api/Project` (used by QA Agent CLI)

| Method | Path                        | Description                | Notes                          |
|--------|-----------------------------|----------------------------|--------------------------------|
| GET    | /api/Project                | List all connected projects (paginated) |                   |
| GET    | /api/Project/:id            | Get project by ID          | Includes latest agent run      |
| POST   | /api/Project                | Register a project         | Called by `qa init`            |
| PATCH  | /api/Project/:id            | Update project config      | Called by `qa init` on re-run  |
| DELETE | /api/Project/:id            | Disconnect a project       | Cascades to TestFiles, AgentRuns |
| GET    | /api/Project/:id/files      | List test files for project (paginated) |              |
| GET    | /api/Project/:id/runs       | List agent runs for project (paginated) |              |

**Create/Update Body**: `{name, repoUrl, language, framework, testRunner, testDirectory, sourceDirectory, configHash}`

#### Test Files — `/api/TestFile` (used by QA Agent CLI)

| Method | Path                  | Description                | Notes                          |
|--------|-----------------------|----------------------------|--------------------------------|
| GET    | /api/TestFile/:id     | Get test file by ID        |                                |
| POST   | /api/TestFile         | Register a generated file  | Called by `qa generate`        |
| PATCH  | /api/TestFile/:id     | Update sync status/hash    | Called by `qa sync`            |
| DELETE | /api/TestFile/:id     | Remove file tracking       |                                |
| POST   | /api/TestFile/bulk    | Bulk register files        | Called by `qa generate`        |

**Create Body**: `{projectId, scenarioId?, filePath, testType, contentHash}`

#### Agent Runs — `/api/AgentRun` (used by QA Agent CLI)

| Method | Path                        | Description                | Notes                          |
|--------|-----------------------------|----------------------------|--------------------------------|
| GET    | /api/AgentRun               | List all runs (paginated)  | Filterable by `?projectId=`    |
| GET    | /api/AgentRun/:id           | Get run by ID              |                                |
| POST   | /api/AgentRun               | Start a run                | Called at start of any `qa` command |
| PATCH  | /api/AgentRun/:id           | Update run status/summary  | Called on completion/failure    |

**Create Body**: `{projectId, command}`
**Update Body**: `{status, summary?, errorMessage?, completedAt?}`

---

## 5. Frontend Specification

### 5.1 Navigation Structure

```
┌─────────────────────────────────────────────────────────┐
│ [App Logo/Title]                                        │
│                                                         │
│ Dashboard | Regressions | Administration | Import | Projects [User ▾] │
│                                                         │
│ Context sub-nav:                                        │
│   Regressions → Test Passes | History                   │
│   Administration → Users | Features | Scenarios         │
│   Import → Integrations | Import Issues                 │
└─────────────────────────────────────────────────────────┘
```

- **Top-level**: Dashboard, Regressions, Administration, Import, Projects
- **Regressions sub-nav**: Test Passes (listing), History
- **Administration sub-nav**: Users, Features, Scenarios
- **Import sub-nav**: Integrations (manage connections), Import Issues (fetch and convert)
- **Projects sub-nav**: Connected Projects, Agent Runs
- **User dropdown**: displays logged-in username; contains Logout action

### 5.2 Route Map

| Route                      | Page                    | Auth Required | Description                          |
|----------------------------|-------------------------|---------------|--------------------------------------|
| /login                     | LoginPage               | No            | Login form                           |
| /dashboard                 | DashboardPage           | Yes           | Reporting charts and results table   |
| /regression/listing        | TestPassListingPage     | Yes           | List and create test passes          |
| /regression/continue/:id   | RegressionTestingPage   | Yes           | Execute a test pass                  |
| /regression/history        | RegressionHistoryPage   | Yes           | List and manage regression headers   |
| /admin                     | AdminLandingPage        | Yes           | Card links to admin sub-pages        |
| /admin/users               | UsersPage               | Yes           | CRUD for users                       |
| /admin/features            | FeaturesPage            | Yes           | CRUD for features                    |
| /admin/scenarios           | ScenariosPage           | Yes           | CRUD for scenarios with steps        |
| /import/integrations       | IntegrationsPage        | Yes           | Manage external tracker connections  |
| /import/issues             | ImportIssuesPage        | Yes           | Fetch, preview, and import issues    |
| /projects                  | ProjectsPage            | Yes           | List connected codebase projects     |
| /projects/:id              | ProjectDetailPage       | Yes           | Project profile, test files, runs    |
| /projects/:id/runs         | AgentRunsPage           | Yes           | Agent run history for a project      |

- Root path (`/`) redirects to `/dashboard`.
- `/regression` redirects to `/regression/listing`.
- `/admin` shows a landing page with navigation cards.
- `/import` redirects to `/import/integrations`.
- `/projects` lists all connected projects.

### 5.3 Page Specifications

#### 5.3.1 Login Page (`/login`)

**Purpose**: Authenticate the user.

**UI Elements**:
- Username text input (required)
- Password text input (required, masked)
- Submit button ("Login")
- Error message area

**Behavior**:
1. On submit, POST `{username, password}` to `/api/auth/login`.
2. On success: store JWT token in local storage (key: `reg_qa_app_token`), store username, redirect to `/dashboard`.
3. On failure: display error message ("Invalid credentials" or similar).
4. If user is already authenticated (valid token exists), redirect to `/dashboard`.

#### 5.3.2 Dashboard Page (`/dashboard`)

**Purpose**: Provide an at-a-glance view of regression testing results.

**UI Elements**:
- **Scope selector**: Dropdown to select a Regression Header, and optionally a Test Pass within it. Defaults to the most recent header.
- **Summary cards**: Key metrics within scope (total results, pass count, fail count, blocked count, not-run count).
- **Bar chart**: Scenario results grouped by status. X-axis = status categories, Y-axis = count.
- **Pie chart** (optional): Distribution of results by status.
- **Results data table**: Tabular view of scenario results with columns:
  - Scenario name
  - Feature name
  - Status (with color coding: green=pass, red=fail, yellow=blocked, gray=not_run)
  - Completed by (tester name)
  - Notes
  - Timestamp

**Data Source**: GET `/api/ScenarioResult?headerId=<id>` or `?testPassId=<id>` with scenario and testPass joins.

**Behavior**:
- On page load, fetch the most recent Regression Header and display its results.
- Changing the scope selector re-fetches and re-renders charts and table.
- Charts and table are empty with a helpful message when no results exist for the selected scope.

#### 5.3.3 Regression History Page (`/regression/history`)

**Purpose**: Manage regression headers (the top-level grouping for test passes).

**UI Elements**:
- **Table** with columns: Name, Release Name, Start Date, End Date, Is Started, Is Complete.
- **Create button** → opens form/modal.
- **Edit action** per row → opens form/modal pre-populated.
- **Delete action** per row → confirmation then delete.

**Create/Edit Form Fields**:
- Name (string, required)
- Release Name (string, required)
- Start Date (date picker)
- End Date (date picker)

**Data Source**: GET `/api/Header`.

**Behavior**:
- Table loads all regression headers on mount (paginated).
- Create → POST `/api/Header` → refresh table.
- Edit → PATCH `/api/Header/:id` → refresh table.
- Delete → DELETE `/api/Header/:id` → refresh table.

#### 5.3.4 Test Pass Listing Page (`/regression/listing`)

**Purpose**: View all test passes and create new ones.

**UI Elements**:
- **Table** with columns: Title, Testing Username, Testing Role, Is Started, Is Complete, Timestamp, Associated Header name.
- **Create button** → launches Test Pass Create Wizard.
- **Continue button** per row → navigates to `/regression/continue/:id`.

**Data Source**: GET `/api/TestPass`.

#### 5.3.5 Test Pass Create Wizard

**Purpose**: Multi-step guided creation of a test pass.

**Steps**:
1. **Test Pass Details**: Enter title, testingLoginUserName, testingRole.
2. **Select Regression Header**: Choose which regression header this test pass belongs to (dropdown or list of existing headers).
3. **Select Features**: Multi-select list of available features to include in this test pass (many-to-many).
4. **Review & Create**: Summary of selections. Confirm to create.

**Behavior**:
- On confirm, POST `/api/TestPass` with `{title, testingLoginUserName, testingRole, headerId, featureIds}`.
- On success, navigate to `/regression/listing` or optionally to `/regression/continue/:id` to begin execution.

#### 5.3.6 Regression Testing Page (`/regression/continue/:id`)

**Purpose**: Execute a test pass by recording results for each scenario.

**Data Loading**:
- Single call to `GET /api/TestPass/:id/full` returns the complete execution tree: test pass metadata, associated features, their scenarios with steps, and any existing ScenarioResults.

**UI Structure**:
```
[Test Pass Title]                          [Complete Button]

▼ Feature: "Feature Name"
  ┌──────────────────────────────────────────────────┐
  │ Scenario: "Scenario Name"                        │
  │                                                  │
  │ Steps:                                           │
  │   ☑ Step 1 name                                  │
  │   ☑ Step 2 name                                  │
  │   ☐ Step 3 name                                  │
  │                                                  │
  │ Status: [pass ▾]  Bug Created: [☐]               │
  │ Notes: [________________________]                 │
  │ Completed By: [auto-filled username]             │
  └──────────────────────────────────────────────────┘

  ┌──────────────────────────────────────────────────┐
  │ Scenario: "Another Scenario"                     │
  │ ...                                              │
  └──────────────────────────────────────────────────┘

▶ Feature: "Another Feature" (collapsed)

                                           [Save Button]
```

**Per-Scenario Controls**:
- **Status dropdown**: "pass", "fail", "blocked", "not_run"
- **Notes**: free-text input
- **Bug Created**: boolean toggle/checkbox
- **Step checkboxes**: track completed steps (persisted in `completedSteps` array on ScenarioResult)
- **Completed By**: auto-populated from logged-in username

**Behavior**:
- **Save**: collects all scenario results and submits via POST `/api/ScenarioResult/bulk`. Each result includes: `{status, notes, bugCreated, completedBy, completedSteps, scenarioId, testPassId}`.
- **Complete**: PATCH `/api/TestPass/:id` with `{isComplete: true}`, then navigate back to listing.
- Features displayed as expandable/collapsible sections (accordions).
- Existing results (from prior saves) are pre-populated in the form, including checked-off steps.

#### 5.3.7 Admin Landing Page (`/admin`)

**Purpose**: Navigation hub for admin functions.

**UI Elements**:
- Card grid linking to:
  - Users management
  - Features management
  - Scenarios management

#### 5.3.8 Admin: Users Page (`/admin/users`)

**Purpose**: CRUD management of user accounts.

**UI Elements**:
- **Table** with columns: Username, Email. (Password never displayed.)
- **Create form** (inline or modal): Username, Email, Password fields.
- **Edit action** per row.
- **Delete action** per row with confirmation.

**Data Source**: GET `/api/User` (paginated).

**Behavior**:
- Create → POST `/api/User` (password hashed server-side) → refresh table.
- Edit → PATCH `/api/User/:id` → refresh table.
- Delete → DELETE `/api/User/:id` → refresh table.

#### 5.3.9 Admin: Features Page (`/admin/features`)

**Purpose**: CRUD management of test features.

**UI Elements**:
- **Table** with columns: Name, Team, Scenario Count.
- **Create/Edit form** (inline or modal): Name, Team fields.
- **Delete action** per row with confirmation.

**Data Source**: GET `/api/Feature`.

**Behavior**:
- Create → POST `/api/Feature` → refresh table.
- Edit → PATCH `/api/Feature/:id` → refresh table.
- Delete → DELETE `/api/Feature/:id` (cascades to scenarios and steps) → refresh table.

#### 5.3.10 Admin: Scenarios Page (`/admin/scenarios`)

**Purpose**: CRUD management of test scenarios and their steps.

**UI Elements**:
- **Table** with columns: Name, Feature (parent), Order, Note.
- **Create/Edit form**: Name, Note, Order, Feature (dropdown), and dynamic Steps list.
- **Steps sub-form**: ordered list of steps, each with Name and Order. Add/remove/reorder capability.
- **Delete action** per row with confirmation.

**Data Source**: GET `/api/Scenario`.

**Behavior**:
- Create → POST `/api/Scenario` with `{name, note, order, featureId, steps: [{name, order}]}` → refresh table.
- Edit → PATCH `/api/Scenario/:id` with same body shape → refresh table.
- Delete → DELETE `/api/Scenario/:id` (cascades to steps) → refresh table.
- Steps are sent inline with the scenario. The server replaces all steps atomically.

#### 5.3.11 Integrations Page (`/import/integrations`)

**Purpose**: Manage connections to external issue trackers.

**UI Elements**:
- **Table** with columns: Name, Provider (icon + label), Base URL, Project Key, Status (active/inactive).
- **Create button** → opens form/modal.
- **Edit action** per row.
- **Test Connection button** per row → calls POST `/api/Integration/:id/test`, shows success/failure.
- **Delete action** per row with confirmation.

**Create/Edit Form Fields**:
- Provider (dropdown: Azure DevOps, Jira, GitHub)
- Display Name (string, required)
- Base URL (string, required — e.g., `https://dev.azure.com/myorg`, `https://mycompany.atlassian.net`, `https://api.github.com`)
- Project Key (string, required — e.g., project name, Jira key, `owner/repo`)
- Auth Method (dropdown: Personal Access Token, OAuth, API Key)
- Auth Token (password input, required)
- Active (toggle, default: true)

**Data Source**: GET `/api/Integration`.

#### 5.3.12 Import Issues Page (`/import/issues`)

**Purpose**: Fetch issues from a connected tracker and convert them into Features/Scenarios/Steps.

**UI Elements**:
- **Integration selector**: Dropdown of active integrations.
- **Query input**: Text field for entering a search query / filter:
  - ADO: WIQL or simple text search
  - Jira: JQL expression
  - GitHub: Search query string (label, milestone, etc.)
- **Fetch button**: Calls POST `/api/Import/preview` with `{integrationId, query}`.
- **Preview table**: Shows fetched issues with columns: External ID, Title, Type, Status, Description (truncated).
- **Mapping controls** per issue:
  - **Import as**: dropdown ("Feature", "Scenario", "Skip")
  - **Target Feature**: dropdown (existing features + "New Feature"), shown when importing as Scenario
  - **Auto-generate steps**: toggle (attempts to parse numbered lists or acceptance criteria from the issue description into Step records)
- **Select All / Deselect All** checkboxes.
- **Import button**: Calls POST `/api/Import/execute` with the mapping selections.
- **Result summary**: Shows imported count, skipped count, any errors.

**Behavior**:
1. User selects an integration and enters a query.
2. Preview fetches issues from the external system and displays them.
3. User reviews each issue and selects how to map it (Feature, Scenario, or Skip).
4. For issues mapped as Scenario, user picks or creates a parent Feature.
5. Import executes: server creates Feature/Scenario/Step records.
6. An ImportSession record is created for audit.
7. User can navigate to Admin Features/Scenarios to review imported data.

#### 5.3.13 Projects Page (`/projects`)

**Purpose**: View all codebase projects connected via the QA Agent CLI.

**UI Elements**:
- **Table** with columns: Name, Repo URL, Language, Framework, Test Runner, Last Analyzed, Agent Run Count.
- **Detail link** per row → navigates to `/projects/:id`.

**Data Source**: GET `/api/Project`.

**Behavior**:
- Read-only from the web UI. Projects are registered by the CLI (`qa init`).
- Clicking a row navigates to the project detail page.

#### 5.3.14 Project Detail Page (`/projects/:id`)

**Purpose**: View a connected project's profile, generated test files, and agent run history.

**UI Elements**:
- **Project Profile card**: Name, repo URL, language, framework, test runner, source directory, test directory, last analyzed timestamp.
- **Test Files table**: File Path, Test Type (unit/e2e/api), Linked Scenario, Sync Status, Last Synced.
- **Recent Agent Runs table**: Command, Status, Started, Completed, Summary.
- **View All Runs link** → navigates to `/projects/:id/runs`.

**Data Source**: GET `/api/Project/:id`, GET `/api/Project/:id/files`, GET `/api/Project/:id/runs`.

#### 5.3.15 Agent Runs Page (`/projects/:id/runs`)

**Purpose**: Full history of QA Agent CLI executions for a project.

**UI Elements**:
- **Table** with columns: Command, Status, Started At, Completed At, Summary, Error.
- **Filter**: by command type (init, generate, run, sync, report, watch).

**Data Source**: GET `/api/AgentRun?projectId=<id>`.

---

## 6. Frontend State Management

### 6.1 Service Pattern (Framework-Agnostic)

Each domain entity is managed by a dedicated service that encapsulates API communication and provides reactive state. The abstract pattern for each service:

```
EntityService:
  state:
    entities           — reactive list of all entities of this type
    selectedEntity     — the currently selected entity (for edit forms)
    pagination         — {page, limit, total, pageCount}

  methods:
    fetchAll(page?, limit?)  — GET list endpoint, update entities + pagination state
    fetchById(id)            — GET single endpoint
    save(entity)             — if entity.id exists: PATCH, else: POST; then refresh entities
    delete(id)               — DELETE; then refresh entities
    selectEntity(e)          — set selectedEntity
```

### 6.2 Concrete Services

| Service                  | Entity           | Special Behavior                                  |
|--------------------------|------------------|---------------------------------------------------|
| RegressionHeaderService  | RegressionHeader | —                                                 |
| TestPassService          | TestPass         | `fetchFull(id)` — GET /TestPass/:id/full          |
| FeatureService           | Feature          | —                                                 |
| ScenarioService          | Scenario         | Accepts nested `steps` on save                    |
| ScenarioResultService    | ScenarioResult   | `bulkSave(results[])` — POST to bulk endpoint; supports filter params |
| UserService              | User             | Password excluded from read operations            |
| LoginService             | Auth state       | `login(username, password)`, `logout()`, `isLoggedIn` |
| JwtService               | Token storage    | `getToken()`, `setToken(token)`, `clearToken()`   |
| IntegrationService       | IntegrationConfig| `testConnection(id)` — POST /Integration/:id/test |
| ImportService            | Import operations| `preview(integrationId, query)`, `execute(mappings)`, `fetchSessions()` |
| ProjectService           | ProjectConfig    | Read-only from web UI; projects registered by CLI  |
| TestFileService          | TestFile         | Read-only from web UI; files registered by CLI     |
| AgentRunService          | AgentRun         | Read-only from web UI; runs logged by CLI          |
| RoleService              | UserRole         | Returns mock/hardcoded data (future: real backend) |

### 6.3 API Client

A singleton HTTP client wrapper that:
- Attaches `Authorization: Bearer <token>` header to every request.
- Provides typed methods: `get<T>(url, params?)`, `post<T>(url, body)`, `patch<T>(url, body)`, `delete(url)`.
- On 401 response: clears stored token and redirects to login page.
- Base URL is configurable via environment variable.

---

## 7. Frontend Component Hierarchy

```
RootLayout
├── /login → LoginPage (public)
└── AuthenticatedLayout (protected by auth guard)
    ├── NavigationHeader
    │   ├── AppTitle / Logo
    │   ├── MainNavLinks (Dashboard, Regressions, Administration, Import)
    │   ├── SubNavLinks (context-dependent on active section)
    │   └── UserDropdown (username display, Logout action)
    │
    ├── /dashboard → DashboardPage
    │   ├── ScopeSelector (Header dropdown, TestPass dropdown)
    │   ├── SummaryCards
    │   ├── ResultsBarChart
    │   ├── ResultsPieChart (optional)
    │   └── ResultsDataTable
    │
    ├── /regression
    │   ├── /history → RegressionHistoryPage
    │   │   ├── RegressionHeadersTable
    │   │   └── RegressionHeaderForm (modal or inline)
    │   │
    │   ├── /listing → TestPassListingPage
    │   │   ├── TestPassTable
    │   │   └── TestPassCreateWizard
    │   │       ├── Step1_DetailsForm
    │   │       ├── Step2_SelectHeader
    │   │       ├── Step3_SelectFeatures
    │   │       └── Step4_ReviewAndCreate
    │   │
    │   └── /continue/:id → RegressionTestingPage
    │       ├── TestPassHeader (title, complete button)
    │       ├── FeatureAccordionList
    │       │   └── FeatureAccordion (per feature)
    │       │       └── ScenarioCard (per scenario)
    │       │           ├── StepCheckboxList
    │       │           ├── StatusDropdown
    │       │           ├── NotesInput
    │       │           ├── BugCreatedToggle
    │       │           └── CompletedByDisplay
    │       └── SaveButton
    │
    ├── /admin
    │   ├── / → AdminLandingPage (navigation cards)
    │   ├── /users → UsersPage
    │   │   ├── UsersTable
    │   │   └── UserForm (inline or modal)
    │   ├── /features → FeaturesPage
    │   │   ├── FeaturesTable
    │   │   └── FeatureForm (inline or modal)
    │   └── /scenarios → ScenariosPage
    │       ├── ScenariosTable
    │       └── ScenarioForm (inline or modal)
    │           └── StepsList (dynamic add/remove/reorder)
    │
    ├── /import
    │   ├── /integrations → IntegrationsPage
    │   │   ├── IntegrationsTable
    │   │   └── IntegrationForm (modal or inline)
    │   └── /issues → ImportIssuesPage
    │       ├── IntegrationSelector
    │       ├── QueryInput
    │       ├── PreviewTable
    │       │   └── IssueMappingRow (per issue)
    │       │       ├── ImportAsDropdown
    │       │       ├── TargetFeatureDropdown
    │       │       └── AutoGenerateStepsToggle
    │       └── ImportResultSummary
    │
    └── /projects
        ├── / → ProjectsPage
        │   └── ProjectsTable
        └── /:id → ProjectDetailPage
            ├── ProjectProfileCard
            ├── TestFilesTable
            ├── RecentAgentRunsTable
            └── /runs → AgentRunsPage
                └── AgentRunsTable
```

---

## 8. Environment Configuration

| Variable             | Description                        | Default                          |
|----------------------|------------------------------------|----------------------------------|
| POSTGRES_HOST        | Database host                      | localhost                        |
| POSTGRES_PORT        | Database port                      | 5432                             |
| POSTGRES_DB          | Database name                      | dev                              |
| POSTGRES_USER        | Database username                  | root                             |
| POSTGRES_PASSWORD    | Database password                  | root                             |
| API_PORT             | Backend server port                | 3333                             |
| JWT_SECRET           | Secret key for JWT signing         | devTesting                       |
| ADMIN_USER           | Seeded admin username              | testUser                         |
| ADMIN_PASSWORD       | Seeded admin password              | SuperSecret!                     |
| FRONTEND_API_URL     | Frontend API base URL              | http://localhost:3333/api        |
| ENCRYPTION_KEY       | Key for encrypting integration tokens | (required in production)      |
| LLM_PROVIDER         | LLM provider for AI features       | openai                           |
| LLM_API_KEY          | API key for LLM provider           | (required for AI features)       |
| LLM_MODEL            | Model name for LLM calls           | gpt-4o                           |

The application should use a centralized environment configuration file (e.g., `.env`) at the project root. All services read from this single source of truth.

LLM-related variables are used by the QA Agent CLI and the server-side AI features. See `agent-spec.md` for details.

---

## 9. Security Requirements

| Requirement          | Implementation Detail                                                |
|----------------------|----------------------------------------------------------------------|
| Password storage     | bcrypt hash; hash computed before database insert                    |
| Password exposure    | Password field excluded from all API query/list responses            |
| Authentication       | JWT Bearer token on all endpoints except login and health check      |
| Token storage        | Browser local storage (key: `reg_qa_app_token`)                      |
| Token expiry         | 2 days                                                               |
| Security headers     | HTTP security headers (e.g., Helmet or equivalent)                   |
| CORS                 | Enabled for all origins (configurable for production)                |
| Rate limiting        | 100 requests per 4 minutes per IP address                            |
| Input validation     | Required fields enforced; UUIDs validated on path parameters         |
| Secret encryption    | Integration auth tokens encrypted at rest using ENCRYPTION_KEY       |
| Token proxying       | External tracker credentials never sent to or exposed on the frontend |

---

## 10. Database Requirements

| Requirement          | Detail                                                |
|----------------------|-------------------------------------------------------|
| Engine               | PostgreSQL (version 16 recommended)                   |
| Primary keys         | UUID, auto-generated                                  |
| Migrations           | Schema managed via migration files, applied on deploy |
| Cascade deletes      | RegressionHeader → TestPass; Feature → Scenario → Step; TestPass → ScenarioResult; Scenario → ScenarioResult; IntegrationConfig → ImportSession |
| Indexes              | userId foreign keys on all entities; unique constraint on User.username; unique constraint on ScenarioResult(scenarioId, testPassId) |
| JSON columns         | ScenarioResult.completedSteps stored as JSON array    |
| Connection pooling   | Recommended for production                            |
| Admin seeding        | On startup, insert admin user if not exists           |

---

## 11. Status Values Reference

### ScenarioResult.status
| Value    | Display   | Color Code  | Meaning                         |
|----------|-----------|-------------|---------------------------------|
| pass     | Pass      | Green       | Scenario passed testing         |
| fail     | Fail      | Red         | Scenario failed testing         |
| blocked  | Blocked   | Yellow/Amber| Scenario could not be tested    |
| not_run  | Not Run   | Gray        | Scenario has not been executed   |

---

## 12. Roadmap & Known Gaps

### Implementation Phases

| Phase | Focus | Key Deliverables |
|-------|-------|------------------|
| 1     | Core Web App | Web UI + API server (this spec, Sections 1-11, 14) |
| 2     | CLI Skeleton | `qa init`, `qa generate` for TypeScript/Jest. See `agent-spec.md` |
| 3     | E2E + Sync | Playwright test generation, `qa run`, `qa sync`. See `agent-spec.md` |
| 4     | LLM Intelligence | Regression scoping, risk scoring, report generation. See `agent-spec.md` |
| 5     | Multi-Agent Pipeline | `qa watch`, bidirectional tracker sync. See `ecosystem-spec.md` |
| 6     | Expansion | Additional languages, conversational authoring, Refiner + Implementer agents. See `ecosystem-spec.md` |

### Known Gaps

| # | Feature                         | Status        | Notes                                                  |
|---|---------------------------------|---------------|--------------------------------------------------------|
| 1 | User Roles with Backend         | Not started   | RoleService returns mock data; no backend enforcement  |
| 2 | Teams / Organization Model      | Not started   | Multi-tenancy for isolating data between organizations |
| 3 | Export/Reporting                 | Enhancement   | Export test results to CSV/PDF                         |
| 4 | Webhook Notifications           | Enhancement   | Notify external systems on test pass completion        |

---

## 13. Glossary

| Term              | Definition                                                                        |
|-------------------|-----------------------------------------------------------------------------------|
| Regression Header | A named regression cycle, typically corresponding to a software release           |
| Test Pass         | A single execution run within a regression, containing selected features           |
| Feature           | A functional area of the application under test, grouping related scenarios        |
| Scenario          | A specific test case within a feature, composed of ordered steps                   |
| Step              | An individual action or verification within a scenario                             |
| Scenario Result   | The recorded outcome of executing a single scenario within a test pass             |
| Test Library      | The collection of all features, scenarios, and steps defined in the system         |
| Integration       | A configured connection to an external issue tracker (ADO, Jira, GitHub)           |
| Import Session    | A recorded instance of fetching issues from an external tracker and converting them |
| Project Config    | A connected codebase project, detected and registered by the QA Agent CLI          |
| Test File         | A generated test file in a repo, linked to a Scenario in the test library          |
| Agent Run         | A single execution of a QA Agent CLI command, logged for audit                     |
| QA Agent          | The CLI tool that analyzes codebases and generates tests. See `agent-spec.md`      |

---

## 14. External Issue Tracker Integration

### 14.1 Overview

The application can connect to external issue trackers to import tickets/issues and convert them into Features, Scenarios, and Steps. This eliminates manual re-entry and keeps the test library aligned with the development backlog.

### 14.2 Supported Providers

| Provider       | API                          | Auth Methods      | Query Language        |
|----------------|------------------------------|-------------------|-----------------------|
| Azure DevOps   | REST API v7.x                | PAT, OAuth        | WIQL or simple search |
| Jira           | REST API v3 (Cloud) / v2 (Server) | API Token, OAuth | JQL                   |
| GitHub         | REST API v3 / GraphQL v4    | PAT, OAuth, App   | Search query syntax   |

### 14.3 Integration Setup Flow

1. Admin navigates to `/import/integrations`.
2. Creates a new integration: selects provider, enters base URL, project key, and auth credentials.
3. Tests the connection (POST `/api/Integration/:id/test`) to verify credentials and reachability.
4. Integration is now available for imports.

### 14.4 Import Flow

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Select   │     │  Enter Query │     │   Preview    │     │   Execute    │
│Integration│ ──► │  & Fetch     │ ──► │  & Map       │ ──► │   Import     │
└──────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Step 1: Select Integration**
- User picks an active integration from the dropdown.

**Step 2: Enter Query & Fetch**
- User enters a query in the provider's native query language.
- Examples:
  - ADO: `[System.WorkItemType] = 'User Story' AND [System.IterationPath] = 'Sprint 42'`
  - Jira: `project = PROJ AND type = Story AND sprint = "Sprint 42"`
  - GitHub: `repo:owner/repo is:issue label:regression milestone:"v2.5"`
- Client calls POST `/api/Import/preview` with `{integrationId, query}`.

**Step 3: Preview & Map**
- Server fetches issues from the external tracker and returns a normalized list:
  ```
  {
    "issues": [
      {
        "externalId": "ADO-1234",
        "title": "User can reset password",
        "type": "User Story",
        "status": "Active",
        "description": "As a user, I want to reset my password...\n\nAcceptance Criteria:\n1. Click forgot password\n2. Enter email\n3. Receive reset link\n4. Set new password",
        "url": "https://dev.azure.com/..."
      }
    ]
  }
  ```
- User reviews each issue and selects a mapping:
  - **Import as Feature**: Creates a new Feature from the issue title. Useful for epics or large work items.
  - **Import as Scenario**: Creates a Scenario under a target Feature. If the description contains numbered lists or acceptance criteria, they can be auto-parsed into Steps.
  - **Skip**: Do not import this issue.

**Step 4: Execute Import**
- Client calls POST `/api/Import/execute` with:
  ```
  {
    "integrationId": "uuid",
    "mappings": [
      {
        "externalId": "ADO-1234",
        "importAs": "scenario",
        "targetFeatureId": "uuid-or-null",
        "newFeatureName": "Password Management",
        "autoGenerateSteps": true
      }
    ]
  }
  ```
- Server processes each mapping:
  - If `importAs` = "feature": creates a Feature with the issue title as name.
  - If `importAs` = "scenario": creates a Scenario under the specified Feature (existing or newly created). If `autoGenerateSteps` is true, parses the description for numbered items / acceptance criteria and creates Steps.
  - Creates an ImportSession record tracking the operation.
- Server returns:
  ```
  {
    "sessionId": "uuid",
    "importedCount": 8,
    "skippedCount": 2,
    "errors": []
  }
  ```

### 14.5 Step Auto-Generation Rules

When `autoGenerateSteps` is enabled, the server attempts to extract steps from the issue description:

1. **Numbered lists**: Lines matching `1.`, `2.`, `3.` etc. become Steps.
2. **Acceptance Criteria heading**: Content after "Acceptance Criteria", "AC:", or "Given/When/Then" blocks becomes Steps.
3. **Bullet lists**: Lines starting with `-`, `*`, or `•` become Steps.
4. **Fallback**: If no structured content is detected, a single Step is created with the full description text as the name.

Steps are assigned sequential `order` values starting from 1.

### 14.6 Provider-Specific Mapping

#### Azure DevOps
| ADO Field              | Maps To                |
|------------------------|------------------------|
| Title                  | Feature.name or Scenario.name |
| Description / Repro Steps | Step auto-generation source |
| Area Path              | Feature.team           |
| Work Item Type         | Suggested mapping (Epic→Feature, Story/Bug→Scenario) |
| ID                     | ImportSession tracking |

#### Jira
| Jira Field             | Maps To                |
|------------------------|------------------------|
| Summary                | Feature.name or Scenario.name |
| Description            | Step auto-generation source |
| Component              | Feature.team           |
| Issue Type             | Suggested mapping (Epic→Feature, Story/Bug/Task→Scenario) |
| Key                    | ImportSession tracking |

#### GitHub
| GitHub Field           | Maps To                |
|------------------------|------------------------|
| Title                  | Feature.name or Scenario.name |
| Body                   | Step auto-generation source |
| Labels                 | Feature.team (if a team label exists) |
| Issue Number           | ImportSession tracking |

### 14.7 Security Considerations

- Auth tokens are encrypted at rest using `ENCRYPTION_KEY`.
- All external API calls are made server-side only. The frontend never has access to integration credentials.
- API responses from external trackers are sanitized before returning to the client.
- Rate limiting on import endpoints prevents abuse of external API quotas.
- Import sessions provide an audit trail of all import operations.

---

## Appendix A: API Request/Response Examples

### Login
```
POST /api/auth/login
Content-Type: application/json

{"username": "testUser", "password": "SuperSecret!"}

→ 200 OK
{"access_token": "eyJhbGciOiJIUzI1NiIs..."}
```

### Create Regression Header
```
POST /api/Header
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sprint 42 Regression",
  "releaseName": "v2.5.0",
  "startDate": "2026-02-26T00:00:00.000Z",
  "endDate": "2026-03-02T00:00:00.000Z"
}

→ 201 Created
{
  "id": "a1b2c3d4-...",
  "name": "Sprint 42 Regression",
  "releaseName": "v2.5.0",
  "startDate": "2026-02-26T00:00:00.000Z",
  "endDate": "2026-03-02T00:00:00.000Z",
  "isComplete": false,
  "isStarted": false,
  "userId": "e5f6g7h8-..."
}
```

### Create Scenario with Nested Steps
```
POST /api/Scenario
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "User can reset password via email",
  "note": "Imported from ADO-1234",
  "featureId": "f1-uuid",
  "steps": [
    { "name": "Click forgot password link on login page", "order": 1 },
    { "name": "Enter registered email address", "order": 2 },
    { "name": "Check email for reset link", "order": 3 },
    { "name": "Click reset link and set new password", "order": 4 },
    { "name": "Verify login with new password", "order": 5 }
  ]
}

→ 201 Created
{
  "id": "sc-uuid",
  "name": "User can reset password via email",
  "note": "Imported from ADO-1234",
  "order": 7,
  "featureId": "f1-uuid",
  "steps": [
    { "id": "st1-uuid", "name": "Click forgot password link on login page", "order": 1 },
    ...
  ]
}
```

### Bulk Save Scenario Results
```
POST /api/ScenarioResult/bulk
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "status": "pass",
    "notes": "All steps verified",
    "bugCreated": false,
    "completedBy": "jdoe",
    "completedSteps": [0, 1, 2],
    "scenarioId": "s1-uuid",
    "testPassId": "tp1-uuid"
  },
  {
    "status": "fail",
    "notes": "Step 3 produced wrong output",
    "bugCreated": true,
    "completedBy": "jdoe",
    "completedSteps": [0, 1],
    "scenarioId": "s2-uuid",
    "testPassId": "tp1-uuid"
  }
]

→ 201 Created
[...created/updated ScenarioResult objects...]
```

### Import Preview
```
POST /api/Import/preview
Authorization: Bearer <token>
Content-Type: application/json

{
  "integrationId": "int-uuid",
  "query": "project = PROJ AND type = Story AND sprint = 'Sprint 42'"
}

→ 200 OK
{
  "issues": [
    {
      "externalId": "PROJ-101",
      "title": "User can reset password",
      "type": "Story",
      "status": "To Do",
      "description": "As a user...\n\nAcceptance Criteria:\n1. Click forgot password\n2. Enter email\n3. Receive reset link",
      "url": "https://mycompany.atlassian.net/browse/PROJ-101"
    }
  ]
}
```

### Import Execute
```
POST /api/Import/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "integrationId": "int-uuid",
  "mappings": [
    {
      "externalId": "PROJ-101",
      "importAs": "scenario",
      "targetFeatureId": "feat-uuid",
      "autoGenerateSteps": true
    }
  ]
}

→ 201 Created
{
  "sessionId": "sess-uuid",
  "importedCount": 1,
  "skippedCount": 0,
  "errors": []
}
```

---

## Appendix B: Behavioral Rules

1. **Auto-set userId**: On all create operations, the server must automatically set `userId` from the authenticated JWT payload. Clients do not send userId.
2. **Shared visibility**: All authenticated users can see all records. The `userId` field is an audit trail (who created it), not a visibility filter.
3. **Cascade behavior**: Deleting a parent entity cascades to all children (e.g., deleting a Feature removes its Scenarios and their Steps).
4. **Eager loading**: Features eagerly load their Scenarios; Scenarios eagerly load their Steps. This ensures the full test library hierarchy is available in a single request.
5. **Password handling**: Passwords are hashed with bcrypt on creation. The password field is excluded from all query responses. Clients never receive password hashes.
6. **Token lifecycle**: JWT tokens expire after 2 days. The client must handle token expiry gracefully by redirecting to login.
7. **Admin seeding**: On application startup, if no user exists with the configured admin username, one is created automatically with the configured password (bcrypt-hashed).
8. **Nested step management**: When a Scenario is created or updated with a `steps` array, the server replaces all existing Steps for that Scenario atomically.
9. **Unique results**: Only one ScenarioResult can exist per (scenarioId, testPassId) combination. The bulk endpoint upserts based on this constraint.
10. **Secret protection**: Integration auth tokens and LLM API keys are encrypted at rest and never exposed to the frontend.
11. **Agent API access**: The Project, TestFile, and AgentRun endpoints are primarily consumed by the QA Agent CLI, not the web UI. The web UI displays this data read-only.
12. **Cross-spec references**: This spec covers the web application only. The QA Agent CLI is specified in `agent-spec.md`. The multi-agent pipeline is specified in `ecosystem-spec.md`.
