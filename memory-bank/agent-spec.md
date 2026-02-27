# QA Agent — CLI & Intelligence Engine Specification

> **Version**: 1.0
> **Purpose**: Specification for the QA Agent command-line tool and LLM intelligence engine. The agent analyzes codebases, generates executable test files (unit + E2E + API), syncs test definitions with the web application, and provides AI-powered QA intelligence. This is **2 of 3** spec documents. For the web application, see `application-spec.md`. For the multi-agent pipeline, see `ecosystem-spec.md`.

---

## 1. Overview

### 1.1 What the QA Agent Is

A command-line tool that a developer installs in any project. It:

1. **Analyzes** the codebase to understand its structure, language, framework, and test conventions.
2. **Generates** executable test files (unit tests, E2E tests, API tests) in the project's native language and test framework.
3. **Syncs** generated test definitions with the QA Regression Manager web application (see `application-spec.md`), so tests exist both as runnable code in the repo and as structured test cases in the web UI.
4. **Runs** the test suite using the project's native test runner and reports results back to the web application.
5. **Watches** for new tickets in connected issue trackers and auto-generates tests when code changes land (see `ecosystem-spec.md`).
6. **Reports** using LLM intelligence to generate regression reports, risk scores, and coverage gap analyses.

### 1.2 Developer Experience

```
$ cd my-project
$ npx qa-agent init              # Detect stack, connect to web app
$ npx qa-agent generate          # Analyze codebase, generate test suite
$ npx qa-agent run               # Execute tests, push results to web app
$ npx qa-agent sync              # Reconcile repo files <-> web UI
$ npx qa-agent report            # Generate regression report
$ npx qa-agent watch             # Watch for tickets, auto-generate tests
```

### 1.3 Relationship to Other Specs

- **`application-spec.md`**: The web API that the agent pushes data to (ProjectConfig, TestFile, AgentRun, Feature, Scenario, Step, ScenarioResult entities).
- **`ecosystem-spec.md`**: The multi-agent pipeline that orchestrates this agent alongside the Ticket Refiner and Code Implementer agents.

---

## 2. CLI Commands

### 2.1 `qa init`

**Purpose**: Initialize the QA Agent for a project.

**What it does**:
1. Scans the project directory to detect language, framework, test runner, source directory, and test directory (see Section 3: Code Analysis Engine).
2. Creates a `.qa/config.yaml` file in the project root with the detected configuration.
3. Prompts the user for the web application URL and auth credentials (or reads from environment variables).
4. Registers the project with the web API by calling `POST /api/Project`.
5. Logs an AgentRun record via `POST /api/AgentRun`.

**Configuration file** (`.qa/config.yaml`):
```yaml
version: 1
server:
  url: http://localhost:3333/api
  token: <jwt-token>
project:
  id: <uuid-from-server>
  name: my-project
  language: typescript
  framework: nextjs
  testRunner: jest
  sourceDirectory: src
  testDirectory: __tests__
  apiSpecPath: null               # path to OpenAPI spec if available
generation:
  unit: true
  e2e: true
  api: true
  overwrite: false                # if true, regenerate existing test files
llm:
  provider: openai
  model: gpt-4o
```

**Flags**:
- `--url <server-url>` — web app URL (overrides env var `QA_SERVER_URL`)
- `--token <jwt-token>` — auth token (overrides env var `QA_TOKEN`)
- `--force` — overwrite existing `.qa/config.yaml`
- `--no-register` — skip server registration (offline mode)

### 2.2 `qa generate`

**Purpose**: Analyze the codebase and generate the full test suite.

**What it does**:
1. Reads `.qa/config.yaml` for project configuration.
2. Runs the Code Analysis Engine (Section 3) to build a ProjectProfile.
3. Runs the Test Code Generator (Section 4) to produce test files.
4. Writes test files to the project's test directory.
5. Pushes generated test definitions to the web API:
   - Creates/updates Features and Scenarios via `POST/PATCH /api/Feature` and `POST/PATCH /api/Scenario`.
   - Registers test files via `POST /api/TestFile/bulk`.
6. Updates `ProjectConfig.lastAnalyzedAt` via `PATCH /api/Project/:id`.
7. Logs an AgentRun record.

**Flags**:
- `--type <unit|e2e|api|all>` — which test types to generate (default: all)
- `--dry-run` — show what would be generated without writing files
- `--overwrite` — regenerate existing test files
- `--feature <name>` — only generate tests for a specific feature/module
- `--from-tickets` — also fetch and incorporate tickets from connected trackers

**Output**:
```
Analyzing project...
  Language: TypeScript
  Framework: Next.js 14 (App Router)
  Test Runner: Jest + Playwright
  Source: src/ (47 files)
  Routes: 12 pages, 8 API routes

Generating tests...
  Unit tests: 23 files created
  E2E tests: 8 files created
  API tests: 6 files created

Syncing with server...
  Features: 5 created, 2 updated
  Scenarios: 37 created
  Test files: 37 registered

Done. Run `qa run` to execute the test suite.
```

### 2.3 `qa run`

**Purpose**: Execute the generated test suite and report results.

**What it does**:
1. Detects the test runner from `.qa/config.yaml`.
2. Invokes the native test runner (e.g., `npx jest`, `npx playwright test`, `pytest`).
3. Parses the test runner's output (JSON reporter or stdout parsing).
4. Maps test results back to Scenario IDs (using metadata comments in test files).
5. Pushes results to the web API via `POST /api/ScenarioResult/bulk`.
6. Logs an AgentRun record.

**Flags**:
- `--type <unit|e2e|api|all>` — which test types to run (default: all)
- `--watch` — re-run on file changes
- `--no-push` — run locally without pushing results to the server

**Output**:
```
Running unit tests (Jest)...
  23 test suites, 142 tests
  138 passed, 3 failed, 1 skipped

Running E2E tests (Playwright)...
  8 test suites, 34 tests
  32 passed, 2 failed

Pushing results to server...
  176 scenario results pushed

Summary: 170 passed, 5 failed, 1 skipped
```

### 2.4 `qa sync`

**Purpose**: Bidirectional sync between test files in the repo and test cases in the web UI.

**What it does**:
1. Reads all test files tracked in `.qa/` and computes content hashes.
2. Fetches current test file records from `GET /api/Project/:id/files`.
3. Compares hashes to detect changes:
   - **File changed in repo**: Developer modified a test file manually. Update the corresponding Scenario/Steps in the web UI.
   - **Scenario changed in web UI**: Someone edited a test case in the web UI. Regenerate the test file.
   - **Both changed**: Conflict. Prompt the user to choose which version to keep.
   - **No changes**: Already in sync.
4. Updates TestFile sync status via `PATCH /api/TestFile/:id`.
5. Logs an AgentRun record.

**Flags**:
- `--direction <push|pull|both>` — force sync direction (default: both)
- `--force` — overwrite without prompting on conflicts

**Sync status model**:
| Status | Meaning |
|--------|---------|
| `synced` | File and web UI match |
| `modified_in_repo` | File changed since last sync |
| `modified_in_ui` | Web UI scenario changed since last sync |
| `conflict` | Both changed; requires resolution |

### 2.5 `qa report`

**Purpose**: Generate a regression report using LLM intelligence.

**What it does**:
1. Fetches the latest ScenarioResults from the web API for the current project.
2. Feeds results + historical data to the LLM (see Section 5).
3. Generates a Markdown report with: executive summary, pass/fail breakdown, risk assessment, failure details, recommendations.
4. Writes the report to `.qa/reports/YYYY-MM-DD.md`.
5. Optionally pushes the report to the web UI or a Slack/Teams webhook.
6. Logs an AgentRun record.

**Flags**:
- `--header <id>` — scope to a specific regression header
- `--testpass <id>` — scope to a specific test pass
- `--output <path>` — custom output path
- `--format <md|pdf|html>` — output format (default: md)

### 2.6 `qa watch`

**Purpose**: Continuous mode — watch for pipeline events and auto-generate tests.

**What it does**:
1. Polls the web API (or listens via webhook) for new events:
   - New tickets imported from issue trackers.
   - Ticket status transitions indicating code is ready (from the multi-agent pipeline).
   - New commits or PRs on the connected repo.
2. When triggered:
   - Pulls the latest code changes.
   - Runs targeted `qa generate` for affected modules.
   - Optionally runs `qa run` on the new tests.
   - Reports results back to the web API and tracker.
3. Logs AgentRun records for each action.

**Flags**:
- `--interval <seconds>` — polling interval (default: 60)
- `--auto-run` — also execute tests after generating (default: generate only)

See `ecosystem-spec.md` for how `qa watch` integrates with the multi-agent pipeline.

---

## 3. Code Analysis Engine

### 3.1 Purpose

The Code Analysis Engine scans a project directory and produces a **ProjectProfile** — a structured understanding of the codebase that drives test generation.

### 3.2 Detection Pipeline

```
Project Directory
       │
       ▼
┌──────────────────┐
│ Language Detector │ ── package.json? → TypeScript/JavaScript
│                  │ ── requirements.txt/pyproject.toml? → Python
│                  │ ── go.mod? → Go
│                  │ ── pom.xml/build.gradle? → Java
│                  │ ── *.csproj? → C#
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│Framework Detector│ ── next.config.* → Next.js
│                  │ ── angular.json → Angular
│                  │ ── manage.py → Django
│                  │ ── spring-boot → Spring Boot
│                  │ ── Program.cs + Startup.cs → ASP.NET
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│Test Runner       │ ── jest.config.* → Jest
│ Detector         │ ── vitest.config.* → Vitest
│                  │ ── playwright.config.* → Playwright
│                  │ ── cypress.config.* → Cypress
│                  │ ── pytest.ini/conftest.py → pytest
│                  │ ── *Test.java → JUnit
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Structure Mapper │ ── Source directory (src/, app/, lib/)
│                  │ ── Test directory (__tests__/, tests/, spec/)
│                  │ ── Route discovery (pages/, app/api/, routes/)
│                  │ ── Component graph (imports/exports)
│                  │ ── API surface (controllers, route handlers)
│                  │ ── DB schema (ORM models, migrations, Prisma)
│                  │ ── OpenAPI spec (swagger.json, openapi.yaml)
└────────┬─────────┘
         │
         ▼
    ProjectProfile
```

### 3.3 ProjectProfile Schema

```
ProjectProfile:
  language: string
  framework: string
  testRunner: string
  sourceDirectory: string
  testDirectory: string
  
  modules: [
    {
      name: string                    # e.g., "auth", "users", "payments"
      type: "page" | "api" | "service" | "component" | "util" | "model"
      filePath: string
      exports: [string]              # exported functions/classes/components
      dependencies: [string]         # imported modules
    }
  ]
  
  routes: [
    {
      path: string                   # e.g., "/api/users", "/dashboard"
      method: string                 # GET, POST, etc. (for API routes)
      handler: string                # file path of the handler
      type: "page" | "api"
    }
  ]
  
  dbModels: [
    {
      name: string                   # e.g., "User", "Product"
      filePath: string
      fields: [{name, type}]
    }
  ]
  
  existingTests: [
    {
      filePath: string
      testCount: number
      coversModule: string           # which source module this tests
    }
  ]
```

### 3.4 What the Analysis Does NOT Do

- Does not execute any code.
- Does not require a running database or server.
- Does not read `.env` files or secrets.
- Static analysis only: file system scanning, AST parsing, and pattern matching.

---

## 4. Test Code Generation

### 4.1 Generation Strategy

For each module discovered by the Code Analysis Engine, the generator decides what tests to create:

| Module Type | Unit Test | E2E Test | API Test |
|-------------|-----------|----------|----------|
| Page / Route (frontend) | — | Yes (Playwright) | — |
| API Route / Controller | — | — | Yes (supertest/httpx) |
| Service / Business Logic | Yes | — | — |
| Component (UI) | Yes (render test) | — | — |
| Utility / Helper | Yes | — | — |
| Model / Entity | Yes (validation) | — | — |

### 4.2 Test File Structure

Each generated test file includes:
- A metadata header comment linking it to the web UI Scenario ID.
- Imports appropriate for the test framework.
- Descriptive test names derived from the module's exports.
- Placeholder assertions that the developer can refine.

**Example: TypeScript/Jest unit test**
```typescript
/**
 * @qa-scenario-id abc-123-uuid
 * @qa-feature Authentication
 * @qa-generated true
 */
import { validateUser, hashPassword } from '../src/services/auth.service';

describe('auth.service', () => {
  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      // TODO: implement with test fixtures
      expect(true).toBe(true);
    });

    it('should return null when username does not exist', async () => {
      expect(true).toBe(true);
    });

    it('should return null when password is incorrect', async () => {
      expect(true).toBe(true);
    });
  });

  describe('hashPassword', () => {
    it('should return a bcrypt hash different from the input', async () => {
      expect(true).toBe(true);
    });
  });
});
```

**Example: Playwright E2E test**
```typescript
/**
 * @qa-scenario-id def-456-uuid
 * @qa-feature User Login
 * @qa-generated true
 */
import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should redirect to dashboard on successful login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('testUser');
    await page.getByLabel('Password').fill('password');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Username').fill('wrong');
    await page.getByLabel('Password').fill('wrong');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Invalid credentials')).toBeVisible();
  });
});
```

### 4.3 LLM-Enhanced Generation

When the LLM is configured, the generator goes beyond scaffolding:

1. **Reads the source code** of the module under test.
2. **Sends the code + project context** to the LLM with a prompt like: "Generate comprehensive unit tests for this module. Cover happy paths, error paths, edge cases, and boundary conditions."
3. **Receives test code** from the LLM and validates it parses correctly.
4. **Writes the test file** with full, meaningful assertions (not just `expect(true).toBe(true)`).

Without an LLM configured, the generator produces structural scaffolds (correct file paths, imports, describe/it blocks) with placeholder assertions.

### 4.4 Supported Language/Framework Matrix

| Language    | Unit Test Framework | E2E Framework | API Test Framework |
|-------------|--------------------|--------------|--------------------|
| TypeScript  | Jest, Vitest       | Playwright, Cypress | supertest     |
| JavaScript  | Jest, Vitest       | Playwright, Cypress | supertest     |
| Python      | pytest             | Playwright   | httpx, requests    |
| Go          | go test, testify   | —            | net/http/httptest  |
| Java        | JUnit 5            | Selenium     | RestAssured        |
| C#          | xUnit, NUnit       | Playwright   | WebApplicationFactory |

Additional languages can be added by implementing a `LanguageAdapter` (see Section 4.5).

### 4.5 Language Adapter Interface

Each supported language implements this interface:

```
LanguageAdapter:
  language: string
  
  detectFramework(projectPath) → {framework, testRunner}
  discoverModules(projectPath) → Module[]
  discoverRoutes(projectPath) → Route[]
  discoverModels(projectPath) → DbModel[]
  
  generateUnitTest(module, scenarioId, llmContext?) → string
  generateE2ETest(route, scenarioId, llmContext?) → string
  generateApiTest(route, scenarioId, llmContext?) → string
  
  parseTestResults(output) → TestResult[]
  getTestRunCommand(type) → string
```

This makes the system extensible: adding a new language means implementing one adapter.

---

## 5. LLM Intelligence Engine

### 5.1 Overview

The LLM Intelligence Engine provides AI-powered features that go beyond basic CRUD. It uses the project's codebase, test library, historical results, and issue tracker data as context.

### 5.2 Regression Scoping

**Trigger**: Creating a new Test Pass, or running `qa generate --from-tickets`.

**How it works**:
1. Connects to the project's git repository.
2. Computes the diff between the previous release tag and the current branch (or between two specified commits).
3. Sends the changed file list + the full Feature/Scenario library to the LLM.
4. LLM returns a recommended set of Features and Scenarios to include in the test pass, with a confidence score and reasoning for each.

**Input to LLM**:
```
Changed files:
- src/services/auth.service.ts (modified)
- src/pages/login/page.tsx (modified)
- src/services/payment.service.ts (new)

Existing test library:
- Feature: Authentication (5 scenarios)
- Feature: Dashboard (3 scenarios)
- Feature: Payments (0 scenarios - NEW)
- Feature: User Management (4 scenarios)

Task: Which features and scenarios should be included in the regression test pass for this release?
```

**Output**:
```
Recommended test pass:
- Authentication: ALL scenarios (directly impacted by auth.service.ts changes)
- Dashboard: Scenario "Login redirects to dashboard" (login page changed)
- Payments: NEW FEATURE - generate scenarios (new service detected)

Not recommended:
- User Management: No code changes detected
```

### 5.3 Risk Scoring

**Trigger**: Dashboard view, or `qa report`.

**How it works**:
1. Queries historical ScenarioResults across the last N regressions.
2. Computes per-scenario metrics:
   - **Failure rate**: % of runs that failed
   - **Flakiness**: alternating pass/fail without code changes
   - **Time since last failure**: recency-weighted risk
   - **Code churn**: how often the underlying module has changed
3. Assigns a risk score (0-100) to each scenario.
4. Surfaces in the web UI as a sortable column and color indicator.

**Risk categories**:
| Score   | Label    | Meaning |
|---------|----------|---------|
| 0-20    | Low      | Consistently passing, stable code |
| 21-50   | Medium   | Occasional failures or moderate churn |
| 51-80   | High     | Frequent failures or high churn |
| 81-100  | Critical | Failing consistently, needs attention |

### 5.4 Flaky Test Detection

**Trigger**: After `qa run`, or on dashboard.

**How it works**:
1. For each scenario, examine the last N results.
2. If the status alternates (pass → fail → pass → fail) without corresponding code changes, flag as flaky.
3. Surface in the web UI with a "flaky" badge.
4. Include in reports with a recommendation to stabilize or remove.

### 5.5 Auto-Generated Regression Reports

**Trigger**: `qa report`, or after a Test Pass is marked complete.

**How it works**:
1. Collect all ScenarioResults for the scope (test pass or regression header).
2. Enrich with historical context (previous regression results, risk scores).
3. Send to LLM with a report generation prompt.
4. LLM produces a structured Markdown report.

**Report sections**:
- Executive Summary (2-3 sentences)
- Pass/Fail/Blocked breakdown with percentages
- Failure Details (per failing scenario: what failed, steps, notes, linked bug)
- Risk Assessment (features with high risk scores, trends)
- Comparison with Previous Regression (improved/degraded)
- Recommendations (go/no-go, areas needing attention)

### 5.6 Test Coverage Gap Analysis

**Trigger**: `qa generate --analyze-gaps`, or from the web UI dashboard.

**How it works**:
1. Run the Code Analysis Engine to discover all modules, routes, and models.
2. Compare against the existing test library (Features/Scenarios).
3. Identify untested areas: API routes with no corresponding test, services with no unit tests, pages with no E2E tests.
4. Send the gap list to the LLM with the source code of untested modules.
5. LLM suggests new Scenarios and Steps to fill the gaps.

**Output**:
```
Coverage Analysis:
  Covered: 34/47 modules (72%)
  
  Gaps found:
  - src/services/notification.service.ts — no unit tests
  - src/pages/settings/page.tsx — no E2E tests
  - /api/webhooks route — no API tests
  
  Suggested scenarios:
  1. "Notification service sends email on test pass completion" (3 steps)
  2. "Settings page allows user to update preferences" (4 steps)
  3. "Webhook endpoint validates signature and processes payload" (5 steps)
```

### 5.7 Conversational Test Authoring

**Trigger**: Web UI chat interface or CLI input.

**How it works**:
1. User describes a test in natural language: "Test that a user can add items to cart, apply a discount code, and complete checkout with the discounted total."
2. LLM parses the description into structured data:
   - Feature: "Shopping Cart" (matched to existing or new)
   - Scenario: "User completes checkout with discount code"
   - Steps: ordered list extracted from the description
3. User reviews and confirms.
4. System creates the Feature/Scenario/Steps via the web API.
5. If a project is connected, generates the corresponding test file.

---

## 6. Bidirectional Sync Protocol

### 6.1 Overview

Test definitions exist in two places:
1. **Repo**: Executable test files (`.test.ts`, `.spec.py`, etc.)
2. **Web UI**: Structured test cases (Feature → Scenario → Steps)

The sync protocol keeps them aligned.

### 6.2 Identity Linking

Each generated test file contains a metadata comment with the Scenario ID:

```typescript
/** @qa-scenario-id abc-123-uuid */
```

This ID is the link between the file and the web UI record.

### 6.3 Sync Algorithm

```
For each tracked TestFile:
  1. Compute current file content hash
  2. Fetch TestFile record from server (has last known hash + sync status)
  3. Compare:
  
     File hash == Server hash → SYNCED (no action)
     
     File hash != Server hash AND Server scenario unchanged:
       → MODIFIED_IN_REPO
       → Parse test file to extract test names/structure
       → Update Scenario/Steps in web UI to match
       → Update TestFile hash on server
     
     File hash == Server hash AND Server scenario changed:
       → MODIFIED_IN_UI
       → Regenerate test file from updated Scenario/Steps
       → Update file in repo
       → Update TestFile hash on server
     
     File hash != Server hash AND Server scenario changed:
       → CONFLICT
       → Prompt user: "Keep repo version or web UI version?"
       → Apply chosen version to both sides
       → Update TestFile hash on server
```

### 6.4 What Gets Synced

| From Repo → Web UI | From Web UI → Repo |
|----|-----|
| Test names (describe/it blocks) → Scenario.name, Step.name | Scenario.name → test describe block |
| Test count/structure → Step count and order | Steps → it blocks or test steps |
| File existence → TestFile.syncStatus | Scenario deletion → file deletion prompt |

### 6.5 Handling Manual Tests

Not all Scenarios in the web UI need a corresponding test file. Scenarios without a linked TestFile are "manual test cases" — they exist only in the web UI for manual execution during test passes. The sync protocol ignores them.

---

## 7. Environment Variables

These variables configure the QA Agent CLI. They can also be set in `.qa/config.yaml`.

| Variable         | Description                        | Default                          |
|------------------|------------------------------------|----------------------------------|
| QA_SERVER_URL    | Web application API URL            | http://localhost:3333/api        |
| QA_TOKEN         | JWT token for API authentication   | (from `qa init` login)           |
| LLM_PROVIDER     | LLM provider                       | openai                           |
| LLM_API_KEY      | API key for LLM                    | (required for AI features)       |
| LLM_MODEL        | Model name                         | gpt-4o                           |
| QA_LOG_LEVEL     | Logging verbosity                  | info                             |

---

## 8. Offline Mode

The QA Agent can operate without a server connection:

- `qa init --no-register` — creates config but skips server registration.
- `qa generate` — generates test files locally. Skips server sync.
- `qa run --no-push` — runs tests locally. Skips result pushing.
- `qa report` — generates report from local test runner output only (no historical data).

Offline mode is useful for quick local development. Full features (sync, watch, historical analysis) require a server connection.

---

## 9. Security

| Requirement | Detail |
|-------------|--------|
| Token storage | JWT stored in `.qa/config.yaml` (should be in `.gitignore`) |
| LLM data | Source code sent to LLM for analysis. Users should be aware of data privacy implications. |
| No secrets in tests | Generated tests never contain hardcoded credentials. Test fixtures use environment variables. |
| `.qa/` in `.gitignore` | The `.qa/` directory contains tokens and should be added to `.gitignore`. Config template (without tokens) can be committed. |

---

## 10. Extensibility

### 10.1 Language Adapters

New languages are supported by implementing the `LanguageAdapter` interface (Section 4.5). The adapter handles detection, module discovery, test generation templates, and result parsing.

### 10.2 LLM Providers

The LLM engine supports swappable providers:
- OpenAI (GPT-4o, GPT-4, etc.)
- Anthropic (Claude)
- Local models (Ollama, llama.cpp)
- Azure OpenAI

The provider is configured via `LLM_PROVIDER` and `LLM_API_KEY`.

### 10.3 Custom Test Templates

Users can override default test templates by placing files in `.qa/templates/`:
- `unit.template` — custom unit test template
- `e2e.template` — custom E2E test template
- `api.template` — custom API test template

Templates use a simple placeholder syntax (`{{moduleName}}`, `{{imports}}`, `{{testCases}}`).
