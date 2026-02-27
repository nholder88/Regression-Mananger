# Developer Toolchain — Multi-Agent Ecosystem Specification

> **Version**: 1.0
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
   | `Refined` | Ticket has clear AC and structure | Code Implementer |
   | `Implementation Complete` | Code is written, PR ready | QA Agent |
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

**Purpose**: Takes a refined ticket and generates or modifies code to implement the feature or fix.

**Input**: A refined ticket with clear acceptance criteria + the project codebase.

**Output**:
- A branch with code changes
- A pull request (or commit) linked to the ticket
- Changed files list posted back to the ticket

**How it works**:
1. Reads the refined ticket (title, description, acceptance criteria, edge cases).
2. Analyzes the codebase to understand where changes are needed (similar to the QA Agent's Code Analysis Engine).
3. Generates or modifies code to satisfy the acceptance criteria.
4. Creates a branch, commits changes, opens a PR.
5. Posts a structured comment on the ticket with the PR URL and changed files.
6. Transitions the ticket status to `Implementation Complete`.

**Scope of this spec**: The Code Implementer is a separate project. This document defines only its interface with the pipeline, not its internal implementation.

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
| Refined | Refined (custom) | Refined (custom) | Label: `refined` |
| Implementation Complete | Resolved | In Review | Label: `implementation-complete` |
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
**Spec**: `ecosystem-spec.md` (Sections 2-5)
**Deliverables**:
- Agent protocol implementation
- `qa watch` — watch tracker for pipeline events
- Bidirectional tracker sync (push results, status transitions, auto-create bugs)
- Pipeline orchestration via tracker status transitions
- Feedback loops (QA Failed → back to Implementer)
- Human-in-the-loop gates

### Phase 6: Full Ecosystem
**Spec**: `ecosystem-spec.md` (Sections 3, 6) + `agent-spec.md` (Section 10)
**Deliverables**:
- Ticket Refiner agent (separate project, implements agent protocol)
- Code Implementer agent (separate project, implements agent protocol)
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

## 10. Glossary

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
