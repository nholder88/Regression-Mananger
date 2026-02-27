# Developer Toolchain — Multi-Agent Ecosystem Specification

> **Version**: 3.0
> **Purpose**: Specification for the 3-agent developer toolchain that automates the ticket-to-tested-code pipeline. This document defines the agent protocol, pipeline orchestration, bidirectional issue tracker sync, and phased implementation roadmap. This is **3 of 3** spec documents. For the web application, see `application-spec.md`. For the QA Agent CLI and AI engine, see `agent-spec.md`.

---

## 1. Overview

### 1.1 The Vision

A composable developer toolchain where three pluggable agents automate the journey from a raw ticket to tested, production-ready code:

```
Raw Ticket
    │
    ▼
┌──────────────────┐
│  Ticket Refiner   │  Reads raw tickets, rewrites them with clear
│  (Agent 1)        │  acceptance criteria, edge cases, and structure.
└────────┬─────────┘
         │ refined ticket
         ▼
┌──────────────────┐
│ Code Implementer  │  Reads refined tickets, generates or modifies
│  (Agent 2)        │  code to implement the feature/fix.
└────────┬─────────┘
         │ code changes
         ▼
┌──────────────────┐
│   QA Agent        │  Reads refined tickets + code changes, generates
│  (Agent 3)        │  tests, runs them, reports results.
└────────┬─────────┘
         │ test results
         ▼
   Issue Tracker
   (results posted back)
```

Each agent is an independent project/tool that plugs into a shared protocol. Agents can be used standalone or composed into the full pipeline.

### 1.2 Design Principles

- **Composable**: Each agent works independently. The pipeline is optional.
- **Tracker-as-state**: The issue tracker (ADO, Jira, GitHub) is the shared state. Agents communicate by reading from and writing to tickets.
- **Event-driven**: Agents watch for ticket status transitions that signal their turn.
- **Language-agnostic**: The protocol works regardless of what language each agent is built in.
- **Human-in-the-loop**: Each agent's output can be reviewed before triggering the next agent.

---

## 2. Agent Protocol

### 2.1 Agent Interface

Every agent in the toolchain implements this interface:

```
AgentInterface:
  metadata:
    name: string              # "ticket-refiner", "code-implementer", "qa-agent"
    version: string
    capabilities: string[]    # what this agent can do

  lifecycle:
    init(config)              # configure for a project
    run(context) → result     # execute the agent's primary task
    status() → AgentStatus    # report current state
    destroy()                 # clean up

  pipeline:
    canHandle(event) → bool   # does this agent respond to this event?
    getInputSchema() → schema # what context this agent needs
    getOutputSchema() → schema# what context this agent produces
```

### 2.2 Pipeline Context

Context is the data passed between agents. It accumulates as the ticket moves through the pipeline:

```
PipelineContext:
  ticket:
    externalId: string        # e.g., "PROJ-101"
    provider: string          # "azure_devops", "jira", "github"
    url: string
    title: string
    description: string       # original description
    refinedDescription: string # after Ticket Refiner (null if not yet refined)
    acceptanceCriteria: string[]
    type: string              # "story", "bug", "task"
    labels: string[]
    
  code:
    repoUrl: string
    branch: string
    prUrl: string             # after Code Implementer (null if not yet implemented)
    changedFiles: string[]
    commitHash: string
    
  tests:
    generatedFiles: string[]  # after QA Agent (null if not yet generated)
    testResults: {scenarioId, status, notes}[]
    reportUrl: string
    
  metadata:
    projectId: string         # ProjectConfig ID from web app
    triggeredBy: string       # which agent or user started this
    startedAt: Date
    currentPhase: "refining" | "implementing" | "testing" | "complete" | "failed"
```

### 2.3 Context Passing Mechanism

Context is passed via the issue tracker itself, not a separate message bus:

1. **Ticket fields/labels**: Each agent reads/writes structured data via:
   - Custom fields (ADO, Jira)
   - Labels or metadata comments (GitHub)
   - A structured JSON block in a designated comment

2. **Status transitions**: Each agent watches for specific status values:
   | Status | Meaning | Next Agent |
   |--------|---------|------------|
   | `New` / `To Do` | Raw ticket, unrefined | Ticket Refiner |
   | `Refining` | Ticket Refiner is actively processing (transient) | — |
   | `Refined` | Ticket has clear AC and structure | Code Implementer |
   | `Implementing` | Code Implementer is actively processing (transient) | — |
   | `Implementation Complete` | Code is written, PR ready | QA Agent |
   | `Testing` | QA Agent is actively processing (transient) | — |
   | `QA Passed` | All tests passed | Done (or manual review) |
   | `QA Failed` | Tests failed | Code Implementer (feedback loop) |

3. **Structured comments**: Agents post a structured comment on the ticket:
   ```
   <!-- agent:qa-agent -->
   ## QA Agent Results
   - Tests generated: 5
   - Tests passed: 4
   - Tests failed: 1
   - Report: [link to report]
   
   ### Failures
   - Scenario: "User resets password" — Step 3 failed: reset link not received
   
   ### Context
   ```json
   {"generatedFiles": [...], "testResults": [...]}
   ```
   <!-- /agent:qa-agent -->
   ```

   Other agents can parse the JSON from these structured comments.

---

## 3. Agent Specifications

### 3.1 Agent 1: Ticket Refiner

**Purpose**: Takes raw, vague tickets and rewrites them into well-structured, implementation-ready specifications.

**Input**: A ticket with a title and rough description.

**Output**: The same ticket, updated with:
- Clear, concise title
- Structured description with context and requirements
- Explicit acceptance criteria (numbered list)
- Edge cases and error scenarios identified
- Suggested test scenarios (hints for the QA Agent)
- Technical notes if applicable

**How it works**:
1. Reads the ticket title and description.
2. Optionally reads related tickets (linked issues, parent epic) for context.
3. Optionally reads the codebase structure (via ProjectProfile from the QA Agent's analysis) to understand technical context.
4. Sends the content to an LLM with a refinement prompt.
5. Updates the ticket in the tracker with the refined content.
6. Transitions the ticket status to `Refined`.

**Example transformation**:

Before (raw):
> **Title**: Password reset broken
> **Description**: Users can't reset their passwords. It was working before.

After (refined):
> **Title**: Fix: Password reset email not sent when user requests reset
> **Description**: Users who click "Forgot Password" on the login page and submit their email address do not receive a reset email. This was working in v2.4 and broke after the email service migration in v2.5.
> 
> **Acceptance Criteria**:
> 1. User clicks "Forgot Password" on login page
> 2. User enters a registered email address and submits
> 3. System sends a password reset email within 30 seconds
> 4. Email contains a valid reset link that expires after 24 hours
> 5. Clicking the reset link allows the user to set a new password
> 6. User can log in with the new password
> 
> **Edge Cases**:
> - Unregistered email: show generic "If this email exists..." message (no information leak)
> - Expired reset link: show error with option to request a new one
> - Multiple reset requests: only the most recent link should be valid
> 
> **Suggested Test Scenarios**:
> - Happy path: registered user resets password successfully
> - Invalid email: unregistered email shows generic message
> - Expired link: user clicks link after 24 hours
> - Multiple requests: only latest link works

### 3.2 Agent 2: Code Implementer

**Purpose**: Takes a refined ticket (or pasted text) and generates or modifies code to implement the feature or fix, using the project's established patterns and conventions.

**Design philosophy**: Do not build a general-purpose coding engine from scratch. Wrap a proven LLM coding tool (Aider or Claude Code) as the implementation backend, and add pipeline integration, project memory bank, and container deployment on top.

#### 3.2.1 Input Modes

The Code Implementer accepts work from two sources:

**Mode A: Pipeline ticket** (automated)
- Triggered when a ticket transitions to `Refined` in the tracker.
- Reads the refined title, description, acceptance criteria, and edge cases.
- Fully automated (no human input beyond the ticket).

**Mode B: Pasted text** (ad-hoc)
- Developer passes raw text directly via CLI or web UI:
  ```bash
  npx code-implementer implement --text "Add a /api/health endpoint that returns {status: ok, uptime: seconds}"
  ```
- Useful for quick changes that don't warrant a ticket.
- The agent still applies project patterns and creates git diffs.

#### 3.2.2 Implementation Engine (Swappable Backend)

The agent delegates actual code generation to a configurable backend:

```
Code Implementer Agent
├── Input Parser (ticket OR pasted text → structured instruction)
├── Memory Bank (project patterns, rules, conventions)
├── Implementation Engine (swappable)
│   ├── Aider (default — open source, any LLM, git-native)
│   └── Claude Code (optional — Claude models, MCP integrations)
├── Git Manager (branch, commit, diff, PR)
└── Pipeline Output (ticket comment, status transition)
```

**Aider backend** (default):
- Invoked via Python API: `Coder.create(model, fnames).run(instruction)`
- Or via CLI: `aider --message "instruction" --yes --auto-commits`
- Or via `aider-api` REST wrapper for container deployment
- Supports any LLM provider (OpenAI, Anthropic, local via Ollama)
- Git-native: produces clean commits with diffs automatically
- Open source (Apache 2.0), no subscription required

**Claude Code backend** (optional):
- Invoked via CLI: `claude -p "instruction"` (headless mode)
- Or via Agent SDK (Python/TypeScript) for structured output
- MCP protocol provides 3,000+ integrations (GitHub, databases, etc.)
- Hooks system for pre/post automation
- Requires Anthropic API key. Claude models only.

**Configuration**:
```yaml
implementer:
  engine: aider              # "aider" or "claude-code"
  model: gpt-4o              # LLM model (ignored if engine is claude-code)
  auto_commit: true          # auto-commit changes with descriptive messages
  create_pr: true            # open a PR after implementation
  branch_prefix: impl/       # branch naming: impl/PROJ-101
```

#### 3.2.3 Project Memory Bank

On first run (`code-implementer init`), the agent analyzes the project and generates a `.memory-bank/` directory documenting the project's patterns and rules. This is the agent's persistent knowledge about the project.

**Auto-generated files**:

```
.memory-bank/
├── projectbrief.md          # What the project is, tech stack, purpose
├── patterns.md              # Detected code patterns and conventions
├── rules.md                 # Rules the agent must follow when generating code
├── architecture.md          # Module structure, dependency graph, layers
└── deviations.md            # Where and why the agent chose to deviate from patterns
```

**`patterns.md`** — auto-detected from codebase analysis:
```markdown
# Detected Patterns

## Naming
- Files: kebab-case (e.g., user-service.ts)
- Classes: PascalCase
- Functions: camelCase
- Database columns: camelCase

## Architecture
- Service layer pattern: controllers → services → repositories
- All business logic in services, controllers are thin
- Error handling: custom AppError class thrown from services, caught by global handler

## Testing
- Test files: *.spec.ts co-located with source
- Test pattern: describe(ClassName) → describe(methodName) → it(behavior)
- Mocking: jest.mock() for external dependencies

## API
- REST conventions: plural resource names, kebab-case URLs
- Response format: { data, meta } envelope
- Validation: class-validator decorators on DTOs
```

**`rules.md`** — derived from patterns + configurable by the developer:
```markdown
# Implementation Rules

## Must Follow
- All new services must have a corresponding *.spec.ts file
- All API endpoints must validate input with DTOs
- Database queries must go through repository layer, never directly in controllers
- Use existing error handling patterns (throw AppError, not raw Error)

## Style
- Max file length: 300 lines (split into modules if larger)
- Prefer composition over inheritance
- Use dependency injection (constructor injection)

## Do Not
- Do not add new npm dependencies without noting in deviations.md
- Do not modify existing test files (create new ones)
- Do not change database schema without a migration file
```

**`deviations.md`** — when the agent intentionally deviates from patterns:
```markdown
# Deviations Log

## 2026-02-26: PROJ-101 — Added WebSocket support
- **Pattern**: Project uses REST exclusively
- **Deviation**: Added socket.io dependency and WebSocket gateway
- **Reason**: Ticket requires real-time notifications, REST polling is insufficient
- **Impact**: New dependency, new architectural pattern (gateway layer)
```

**How the memory bank is used**:
1. On every implementation run, the agent reads `.memory-bank/` for context.
2. The patterns and rules are injected into the LLM prompt alongside the ticket instructions.
3. After implementation, the agent checks its output against the rules.
4. If a deviation was necessary, it logs the deviation with reasoning in `deviations.md`.
5. Developers can edit `rules.md` to refine behavior over time.

#### 3.2.4 Implementation Flow

```
1. Receive input (ticket or pasted text)
2. Read .memory-bank/ for project context
3. Determine affected files:
   - Parse the instruction to identify which modules/files need changes
   - Use codebase analysis to find the right locations
4. Create a git branch (impl/<ticket-id> or impl/adhoc-<timestamp>)
5. Invoke the implementation engine:
   - Pass: instruction + project rules + affected file contents
   - Engine produces code changes
6. Review output against rules:
   - Does it follow naming conventions?
   - Does it use existing patterns (error handling, service layer, etc.)?
   - If deviation needed, log in deviations.md
7. Git commit with descriptive message (references ticket ID if available)
8. Open PR (if configured)
9. Post structured comment on ticket (if pipeline mode):
   - PR URL, changed files, deviation notes
   - Transition ticket to "Implementation Complete"
```

#### 3.2.5 CLI Commands

```bash
# Initialize memory bank for a project
npx code-implementer init

# Implement from a tracker ticket
npx code-implementer implement PROJ-101

# Implement from pasted text
npx code-implementer implement --text "Add pagination to the /api/users endpoint"

# Implement from a file containing instructions
npx code-implementer implement --file instructions.md

# Dry run (show plan without making changes)
npx code-implementer implement PROJ-101 --dry-run

# Re-analyze project and update memory bank
npx code-implementer analyze

# Watch for tickets (pipeline mode)
npx code-implementer watch
```

**Flags**:
- `--engine <aider|claude-code>` — override configured engine
- `--model <model-name>` — override LLM model
- `--no-pr` — commit but don't open a PR
- `--no-commit` — make changes but don't commit (for review)
- `--branch <name>` — custom branch name
- `--dry-run` — show what would change without writing

#### 3.2.6 Container Deployment

The Code Implementer ships as a Docker container that teams can self-host:

```dockerfile
# Dockerfile
FROM node:20-alpine
RUN pip install aider-chat    # Aider backend
RUN npm install -g code-implementer
WORKDIR /workspace
ENTRYPOINT ["code-implementer"]
```

**Usage**:
```bash
# Mount project directory and run
docker run -v /path/to/project:/workspace \
  -e LLM_API_KEY=sk-... \
  -e TRACKER_INTEGRATION_ID=uuid \
  code-implementer implement PROJ-101

# Run as a persistent service (watch mode)
docker run -d \
  -v /path/to/project:/workspace \
  -e LLM_API_KEY=sk-... \
  -e TRACKER_INTEGRATION_ID=uuid \
  code-implementer watch
```

**Docker Compose** for team deployment:
```yaml
services:
  code-implementer:
    image: code-implementer:latest
    volumes:
      - ./:/workspace
    environment:
      - LLM_API_KEY=${LLM_API_KEY}
      - LLM_PROVIDER=openai
      - LLM_MODEL=gpt-4o
      - QA_SERVER_URL=http://qa-web:3333/api
      - TRACKER_INTEGRATION_ID=${TRACKER_INTEGRATION_ID}
    command: watch
```

The container:
- Mounts the project filesystem for direct file access
- Persists the `.memory-bank/` directory in the mounted volume
- Runs git operations inside the container (needs git config)
- Can run alongside the QA web app and database in a Docker Compose stack

#### 3.2.7 Output

For each implementation, the agent produces:

| Artifact | Location | Purpose |
|----------|----------|---------|
| Code changes | Git branch + commits | The actual implementation |
| PR (optional) | Git provider | Human review of changes |
| Deviation log | `.memory-bank/deviations.md` | Transparency on pattern breaks |
| Ticket comment | Issue tracker | Pipeline handoff context |
| Agent run log | QA web app (via API) | Audit trail |

#### 3.2.8 What the Code Implementer is NOT

- **Not a general-purpose coding assistant.** It does not replace Cursor, Copilot, or interactive pair programming. It is a pipeline agent that processes tickets.
- **Not a code review tool.** It does not review PRs or suggest improvements to existing code.
- **Not an IDE plugin.** It runs headless (CLI or container). Developers interact with its output via git and the issue tracker.

### 3.3 Agent 3: QA Agent

**Purpose**: Generates tests for the implemented code, runs them, and reports results.

This agent is fully specified in `agent-spec.md`. In the pipeline context:

1. **Trigger**: Ticket transitions to `Implementation Complete`.
2. **Input**: Refined ticket (acceptance criteria) + code changes (changed files, branch).
3. **Actions**:
   - Pulls the latest code from the implementation branch.
   - Runs `qa generate` targeted at the changed modules.
   - Runs `qa run` to execute the generated tests.
   - Runs `qa report` to produce a summary.
4. **Output**:
   - Test files committed to the branch (or a separate test branch).
   - Test results pushed to the web application.
   - Structured comment posted on the ticket with results.
   - Ticket status transitioned to `QA Passed` or `QA Failed`.

---

## 4. Pipeline Orchestration

### 4.1 Orchestration Model

The pipeline is **decentralized** — there is no central orchestrator process. Each agent watches the issue tracker independently and activates when it sees a relevant status transition.

```
┌───────────────────────────────────────────────────────┐
│                   Issue Tracker                        │
│                                                       │
│  Ticket: PROJ-101                                     │
│  Status: New → Refined → Impl Complete → QA Passed    │
│                                                       │
│  ┌─────────┐  watches   ┌──────────┐  watches         │
│  │ Refiner │◄───────────│Implementer│◄─────────┐      │
│  │         │  "New"     │          │  "Refined"│      │
│  └────┬────┘            └────┬─────┘           │      │
│       │ writes               │ writes          │      │
│       │ "Refined"            │ "Impl Complete" │      │
│       ▼                      ▼                 │      │
│  ┌──────────┐   watches                       │      │
│  │ QA Agent │◄─────────────────────────────────┘      │
│  │          │   "Impl Complete"                       │
│  └────┬─────┘                                         │
│       │ writes                                        │
│       │ "QA Passed" / "QA Failed"                     │
│       ▼                                               │
│  (pipeline complete or feedback loop)                 │
└───────────────────────────────────────────────────────┘
```

### 4.2 Feedback Loops

When the QA Agent reports `QA Failed`:
1. The ticket transitions to `QA Failed`.
2. The failure details (which tests failed, why) are posted as a structured comment.
3. The Code Implementer can be configured to watch for `QA Failed` and automatically attempt a fix.
4. Alternatively, a human developer reviews the failures and fixes manually.
5. When code is updated, the ticket returns to `Implementation Complete`, triggering the QA Agent again.

**Loop limit**: To prevent infinite loops, the pipeline tracks iteration count. After N failures (configurable, default: 3), the ticket is escalated to human review with a "needs manual intervention" label.

### 4.3 Human-in-the-Loop Gates

The pipeline supports optional approval gates between agents:

| Gate | When | Behavior |
|------|------|----------|
| Post-refinement | After Ticket Refiner runs | Ticket moves to "Refined - Pending Review" instead of "Refined". A human approves the refinement before implementation starts. |
| Post-implementation | After Code Implementer runs | PR requires human review before QA Agent runs. |
| Post-QA | After QA Agent runs | Even on pass, require human sign-off before closing. |

Gates are configured per-project. By default, no gates are active (fully automated pipeline).

### 4.4 Parallel vs Sequential

The default is **sequential** (Refiner → Implementer → QA), but the pipeline supports:

- **Parallel QA + Implementation**: The QA Agent can start generating test scaffolds from the refined ticket while the Implementer writes code. When implementation completes, QA runs the tests against the actual code.
- **QA-only mode**: Skip Refiner and Implementer. Just run QA Agent on the existing codebase (the `qa generate` standalone workflow).

---

## 5. Bidirectional Issue Tracker Sync

### 5.1 Overview

Beyond importing tickets (covered in `application-spec.md` Section 14), the ecosystem supports **pushing data back** to the issue tracker.

### 5.2 What Gets Pushed Back

| Event | Action on Tracker |
|-------|-------------------|
| Test pass completed (all pass) | Comment with results summary; transition to "QA Passed" |
| Test pass completed (failures) | Comment with failure details; transition to "QA Failed" |
| Bug created from failing scenario | Create new bug ticket in tracker, linked to parent ticket |
| Regression report generated | Comment with report link or inline summary |
| Test coverage gap found | Comment listing untested areas |

### 5.3 Auto-Created Bug Tickets

When a scenario fails and the tester (or QA Agent) marks `bugCreated: true`:

1. The system creates a new ticket in the connected tracker.
2. **Bug ticket content**:
   - Title: `[QA] {Scenario name} — {failure summary}`
   - Description:
     - Link to parent ticket/feature
     - Steps to reproduce (from the Scenario's Steps)
     - Actual result (from the tester's notes)
     - Expected result (from the Scenario description)
     - Environment info (from the test pass metadata)
   - Labels: `bug`, `qa-generated`
   - Link: bidirectional link to the parent ticket

3. The bug ticket ID is stored on the ScenarioResult in the web app.
4. When the bug is resolved and the test passes in the next regression, the system can auto-close the bug ticket.

### 5.4 Tracker Status Mapping

Each provider has slightly different status names. The system uses configurable status mappings:

**Default mappings**:

| Pipeline Status | Azure DevOps | Jira | GitHub |
|----------------|-------------|------|--------|
| New | New | To Do | Open |
| Refining | Active + Tag: refining | In Progress | Label: `refining` |
| Refined | Refined (custom) | Refined (custom) | Label: `refined` |
| Implementing | Active + Tag: implementing | In Progress | Label: `implementing` |
| Implementation Complete | Resolved | In Review | Label: `implementation-complete` |
| Testing | Active + Tag: testing | In Progress | Label: `testing` |
| QA Passed | Closed | Done | Closed |
| QA Failed | Active | In Progress | Label: `qa-failed` |

Mappings are configurable per IntegrationConfig in the web app.

---

## 6. CLI Composition

### 6.1 Unified CLI

The 3 agents can be invoked via a unified CLI or individually:

```bash
# Individual agent CLIs
npx ticket-refiner refine PROJ-101
npx code-implementer implement PROJ-101
npx qa-agent generate

# Unified pipeline CLI
npx dev-pipeline run PROJ-101           # Full pipeline: refine → implement → test
npx dev-pipeline run PROJ-101 --from qa # Start from QA step only
npx dev-pipeline status PROJ-101       # Check pipeline status for a ticket
npx dev-pipeline watch                  # Watch tracker for new tickets, run pipeline
```

### 6.2 Configuration

The unified pipeline is configured via a `.pipeline/config.yaml` in the project root:

```yaml
version: 1
agents:
  refiner:
    enabled: true
    command: npx ticket-refiner
    trigger_on: "New"
    output_status: "Refined"
    
  implementer:
    enabled: true
    command: npx code-implementer
    trigger_on: "Refined"
    output_status: "Implementation Complete"
    engine: aider              # "aider" or "claude-code"
    model: gpt-4o
    auto_commit: true
    create_pr: true
    branch_prefix: impl/
    memory_bank: true          # maintain .memory-bank/ for project patterns
    
  qa:
    enabled: true
    command: npx qa-agent
    trigger_on: "Implementation Complete"
    output_status_pass: "QA Passed"
    output_status_fail: "QA Failed"

pipeline:
  max_iterations: 3
  gates:
    post_refinement: false
    post_implementation: true    # require PR review
    post_qa: false
    
tracker:
  integration_id: <uuid>        # from web app IntegrationConfig
```

---

## 7. Data Flow Diagram

Complete data flow across all three specs:

```
Developer runs            Web UI User                Issue Tracker
"qa init/generate"        manages test               (ADO/Jira/GitHub)
      │                   library + runs                    │
      │                        │                            │
      ▼                        ▼                            ▼
┌──────────┐          ┌────────────────┐          ┌──────────────┐
│ QA Agent │◄────────►│  Web App API   │◄────────►│  Tracker API │
│   CLI    │  push/   │  (application- │  import/ │              │
│ (agent-  │  pull    │   spec.md)     │  push    │              │
│  spec.md)│          │                │          │              │
└──────────┘          └────────────────┘          └──────────────┘
      │                        │                            │
      ▼                        ▼                            │
┌──────────┐          ┌────────────────┐                    │
│Test Files│          │   PostgreSQL   │                    │
│ in Repo  │          │   Database     │                    │
└──────────┘          └────────────────┘                    │
                                                            │
      ┌─────────────────────────────────────────────────────┘
      │
      ▼
┌──────────────────────────────────────────────┐
│           Pipeline (ecosystem-spec.md)        │
│                                              │
│  Ticket Refiner → Code Implementer → QA Agent │
│                                              │
│  Each agent reads/writes to the tracker.     │
│  QA Agent pushes results to the web app.     │
└──────────────────────────────────────────────┘
```

---

## 8. Implementation Roadmap

### Phase 1: Core Web Application
**Spec**: `application-spec.md` (Sections 1-11, 14)
**Deliverables**:
- Web UI with all pages (dashboard, regression management, admin, import)
- REST API with all CRUD endpoints
- JWT authentication
- PostgreSQL database with migrations
- Basic issue tracker import (ADO, Jira, GitHub → Features/Scenarios/Steps)

### Phase 2: QA Agent CLI (Single Language)
**Spec**: `agent-spec.md` (Sections 2-4)
**Deliverables**:
- `qa init` — project detection and server registration
- `qa generate` — code analysis engine + test generation for TypeScript (Jest + Playwright)
- Test file metadata linking (`@qa-scenario-id`)
- ProjectConfig, TestFile, AgentRun entities and API endpoints

### Phase 3: Test Execution and Sync
**Spec**: `agent-spec.md` (Sections 2, 6)
**Deliverables**:
- `qa run` — execute tests via native runner, parse results, push to server
- `qa sync` — bidirectional sync between repo test files and web UI test cases
- Sync status tracking and conflict resolution

### Phase 4: LLM Intelligence
**Spec**: `agent-spec.md` (Section 5)
**Deliverables**:
- LLM-enhanced test generation (full assertions, not just scaffolds)
- Regression scoping (diff analysis → recommended test pass)
- Risk scoring (historical analysis per scenario)
- Flaky test detection
- Auto-generated regression reports (`qa report`)
- Test coverage gap analysis
- Conversational test authoring

### Phase 5: Multi-Agent Pipeline
**Spec**: `ecosystem-spec.md` (Sections 2-5, 11-14)
**Deliverables**:
- Agent protocol implementation
- `qa watch` — watch tracker for pipeline events
- Bidirectional tracker sync (push results, status transitions, auto-create bugs)
- Pipeline orchestration via tracker status transitions (including transient statuses)
- Concurrency controls (branch-level locking, ticket-level locks, project queue)
- Feedback loops (QA Failed → back to Implementer)
- Human-in-the-loop gates
- Notification webhooks (Slack, Teams, custom)
- Watchdog timer for stale agent runs
- Rollback and recovery mechanisms

### Phase 6: Code Implementer Agent
**Spec**: `ecosystem-spec.md` (Section 3.2)
**Deliverables**:
- Code Implementer CLI (`code-implementer init/implement/watch`)
- Aider backend integration (default engine)
- Project memory bank auto-generation (`.memory-bank/` with patterns, rules, architecture)
- Memory bank rule enforcement and deviation logging
- Git workflow (branch, commit, PR creation)
- Pipeline ticket input mode (automated from tracker)
- Pasted text input mode (ad-hoc developer use)
- Dockerfile and Docker Compose for container deployment

### Phase 7: Claude Code Backend + Ticket Refiner
**Spec**: `ecosystem-spec.md` (Sections 3.1, 3.2.2)
**Deliverables**:
- Claude Code backend integration (optional swappable engine)
- Ticket Refiner agent (separate project, implements agent protocol)
- Unified pipeline CLI (`dev-pipeline run/watch`)
- Additional language adapters (Python, Go, Java, C#)
- Custom test templates
- Parallel pipeline mode

---

## 9. Success Metrics

How to measure whether the ecosystem is delivering value:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Test generation time | < 5 minutes for initial suite | Time from `qa generate` to completion |
| Test coverage | > 80% module coverage on first run | Gap analysis output |
| Ticket-to-tested time | < 1 hour (pipeline) | Time from ticket creation to QA Passed |
| Regression report time | < 1 minute | Time from `qa report` to output |
| False positive rate | < 5% | Flaky tests / total tests |
| Developer adoption | `qa init` in > 80% of new projects | ProjectConfig count vs total repos |

---

## 10. Repository Structure

### 10.1 Recommended Layout

The ecosystem uses a **hybrid** repo structure: the web application lives in one repository, and each agent is an independent repository.

```
Organization / Team
├── qa-regression-manager/       # Web app (frontend + API + database)
│   ├── apps/
│   │   ├── api/                 # Backend API server
│   │   └── web/                 # Frontend application
│   ├── prisma/ or migrations/
│   └── docker-compose.yml
│
├── qa-agent/                    # QA Agent CLI (TypeScript/Node)
│   ├── src/
│   │   ├── analysis/            # Code Analysis Engine
│   │   ├── generation/          # Test Code Generator
│   │   ├── sync/                # Bidirectional sync
│   │   ├── intelligence/        # LLM Intelligence Engine
│   │   └── adapters/            # Language Adapters
│   ├── package.json
│   └── Dockerfile
│
├── code-implementer/            # Code Implementer Agent (Python + Node)
│   ├── src/
│   │   ├── engines/             # Aider / Claude Code backends
│   │   ├── memory_bank/         # Memory bank generator
│   │   ├── git_manager/         # Branch / commit / PR logic
│   │   └── pipeline/            # Tracker integration
│   ├── pyproject.toml
│   └── Dockerfile
│
├── ticket-refiner/              # Ticket Refiner Agent
│   ├── src/
│   └── Dockerfile
│
└── llm-gateway/                 # LLM Proxy / Cost Management (Python)
    ├── src/
    └── pyproject.toml
```

### 10.2 Why Separate Repos

| Reason | Detail |
|--------|--------|
| Independent deployment | Each agent ships as its own container on its own release schedule |
| Language flexibility | Code Implementer is Python (wraps Aider), QA Agent is TypeScript, web app is TypeScript |
| Clean boundaries | Agents communicate via API and tracker, not shared imports |
| Simpler CI/CD | Each repo has its own pipeline; no monorepo tooling overhead |
| Team scalability | Different people/teams can own different agents |

### 10.3 Shared Protocol

The only shared artifact is the **Agent Protocol** (Section 2). This is a specification, not a shared code library. Each agent implements the protocol independently in its own language.

If a shared types package becomes necessary (e.g., TypeScript types for PipelineContext), it can be published as a small npm package consumed by the TypeScript agents.

---

## 11. Concurrency & Locking

### 11.1 Problem

Multiple pipeline runs or agent invocations can target the same repository simultaneously. Without coordination:
- Two Code Implementer runs could create conflicting branches.
- The QA Agent could generate tests while the Code Implementer is still writing code.
- Two `qa generate` runs for different tickets could produce overlapping test files.

### 11.2 Branch-Level Locking

Each agent creates a ticket-specific branch (e.g., `impl/PROJ-101`, `qa/PROJ-101`). This provides natural isolation:
- Different tickets work on different branches — no conflicts.
- The same ticket cannot be processed by the same agent concurrently (enforced by a lock file or tracker status).

### 11.3 Ticket-Level Lock

Agents use the tracker status as an implicit lock:
- The Code Implementer only picks up tickets in `Refined` status. Once it starts, it transitions the ticket to `Implementing` (a transient status). Other agents see `Implementing` and skip it.
- The QA Agent only picks up tickets in `Implementation Complete`. Once it starts, it transitions to `Testing`.

**Updated status flow with transient states**:
```
New → Refining → Refined → Implementing → Implementation Complete → Testing → QA Passed / QA Failed
```

### 11.4 File-Level Lock (CLI)

For standalone CLI usage (outside the pipeline), the agent uses a `.qa/lock` file:
- On start: create `.qa/lock` with PID and timestamp.
- On finish: delete `.qa/lock`.
- On start if lock exists: check if the PID is still alive. If not, remove stale lock and proceed. If alive, abort with a message.

### 11.5 Project Queue (Web App)

The web application maintains a queue for agent runs per project:
- When an AgentRun is created, it checks for active runs on the same project.
- If another run is active, the new run enters `queued` status.
- The active run completing triggers the next queued run.

---

## 12. Notifications

### 12.1 Overview

The ecosystem supports configurable notifications for pipeline events. Notifications are sent via webhooks to external services (Slack, Teams, email, custom).

### 12.2 Notification Events

| Event | Default Priority | Payload Includes |
|-------|-----------------|------------------|
| Pipeline completed (all pass) | Normal | Ticket ID, test summary, report link |
| Pipeline completed (failures) | High | Ticket ID, failure details, failing scenarios |
| Pipeline escalated (max iterations) | Critical | Ticket ID, iteration count, failure history |
| Agent error (unrecoverable) | High | Agent name, error details, ticket ID |
| Budget limit reached | High | Project, run ID, cost so far, limit |
| Import completed | Normal | Session ID, imported count, errors |

### 12.3 Configuration

Notification endpoints are configured per project via the web app:

```yaml
# .pipeline/config.yaml
notifications:
  enabled: true
  channels:
    - type: slack
      webhook_url: https://hooks.slack.com/services/...
      events: [pipeline_failed, escalated, agent_error]
    - type: teams
      webhook_url: https://outlook.office.com/webhook/...
      events: [pipeline_completed, pipeline_failed]
    - type: webhook
      url: https://my-service.com/hooks/qa
      events: [all]
      headers:
        Authorization: Bearer <token>
```

### 12.4 Web App Notification Entity

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK |
| projectId | UUID | FK → ProjectConfig |
| channelType | string | enum: "slack", "teams", "webhook", "email" |
| endpoint | string | URL or email address |
| events | string[] | which events trigger this notification |
| isActive | boolean | default: true |

---

## 13. Rollback & Recovery

### 13.1 Code Implementer Rollback

If the Code Implementer produces bad code:

**Automatic (during pipeline)**:
- If the QA Agent reports `QA Failed` and the failure is in newly generated code (not pre-existing tests), the pipeline can be configured to auto-revert the implementation branch before retrying.

**Manual (CLI)**:
```bash
# Revert the last implementation for a ticket
npx code-implementer rollback PROJ-101

# This does:
# 1. Finds the branch impl/PROJ-101
# 2. Reverts to the commit before the agent's changes
# 3. Logs the rollback in deviations.md
# 4. Updates the ticket status back to "Refined"
```

**Safety**: The agent never force-pushes to `main` or `master`. All changes live on feature branches until a human merges them.

### 13.2 Import Undo

Import sessions in the web app can be undone. See `application-spec.md` Section 14.6.

### 13.3 Test Generation Undo

```bash
# Remove all generated test files for the project
npx qa-agent clean

# Remove generated tests for a specific feature only
npx qa-agent clean --feature Authentication

# This does:
# 1. Finds all files with @qa-generated metadata
# 2. Deletes them from the filesystem
# 3. Removes corresponding TestFile records from the server
# 4. Does NOT delete the Scenario/Step records in the web UI (those remain as manual test cases)
```

---

## 14. Error Recovery

### 14.1 Pipeline-Level Recovery

When an agent fails during a pipeline run:

| Failure Scenario | Recovery |
|-----------------|----------|
| Agent crashes mid-run | Ticket stays in transient status (`Implementing`, `Testing`). A watchdog timer (configurable, default: 30 min) detects stale transient statuses and resets the ticket to the previous stable status. |
| Tracker API down | Agent retries with exponential backoff (5s, 10s, 20s, 40s). After 5 retries, the run fails and results are cached locally. |
| LLM API down | Falls back to scaffold-only mode (no LLM features). Run completes with reduced output. |
| Git conflict | Agent aborts cleanly, logs the conflict, posts a comment on the ticket requesting manual resolution. |

### 14.2 Watchdog Timer

Each agent sets a heartbeat on the tracker (via a comment or custom field update) every N minutes while running. The pipeline monitors for stale heartbeats:

1. If an agent's last heartbeat is older than the timeout, the ticket is flagged.
2. A `needs-attention` label is applied.
3. The pipeline resets the ticket to its pre-agent status.
4. A notification is sent (see Section 12).

### 14.3 Idempotency

All agent operations are designed to be idempotent:
- Running `qa generate` twice produces the same test files (existing files are skipped unless `--overwrite` is set).
- Running `code-implementer implement PROJ-101` twice: the second run detects the branch already exists and checks for unaddressed changes before proceeding.
- Bulk result push (ScenarioResult) upserts based on the unique constraint — safe to retry.

---

## 15. Glossary

| Term | Definition |
|------|------------|
| Agent | An independent tool that performs a specific task in the pipeline |
| Pipeline | The sequential flow of Refiner → Implementer → QA Agent |
| Pipeline Context | The accumulated data about a ticket as it flows through agents |
| Tracker-as-State | Design pattern where the issue tracker is the shared database for the pipeline |
| Gate | An optional human approval step between agents |
| Feedback Loop | When a QA failure sends the ticket back to the Implementer for a fix |
| Language Adapter | A plugin that adds support for a new programming language to the QA Agent |
| Iteration | One pass through the Implementer → QA cycle. Capped to prevent infinite loops |
| Implementation Engine | The swappable LLM coding backend (Aider or Claude Code) that generates code |
| Project Memory Bank | Auto-generated `.memory-bank/` directory documenting a project's patterns, rules, and architecture for the Code Implementer |
| Deviation | When the agent intentionally breaks an established project pattern and logs the reason |
| Pasted Text Mode | Ad-hoc input mode where a developer passes raw instructions instead of a ticket |
| LLM Gateway | External Python package that proxies LLM calls for cost tracking, rate limiting, and guardrails |
| Sub-Project | A distinct language/framework unit within a multi-language repository |
| Transient Status | A temporary ticket status (e.g., "Implementing") indicating an agent is actively processing |
| Watchdog Timer | A timeout mechanism that detects and recovers from stale agent runs |
| Rollback | Reverting agent-generated changes on a feature branch |
| Notification Channel | A configured webhook endpoint (Slack, Teams, custom) for pipeline event alerts |
