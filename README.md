# QA Regression Manager — Specifications

This repository is now the **canonical specification and Memory Bank** for the QA Regression Manager ecosystem and its three agents:

- Web Application (QA Regression Manager UI + API)
- QA Agent CLI (code analysis, test generation, sync, reports)
- Multi-Agent Developer Toolchain (Ticket Refiner, Code Implementer, QA Agent)

All implementation code (NestJS API, Angular/Next.js frontends, Nx workspace, shared libs) has been removed or will live in **separate repositories**. This repo does **not** run an application; it describes how the applications and agents should behave.

---

## Repository Role

- **Source of truth for behavior**: The specs in `memory-bank/` define the required behavior, data model, and APIs for all components in the ecosystem.
- **Framework-agnostic**: Specifications are written so the system can be re-implemented in any language or framework.
- **Stable contract for agents**: All cross-agent contracts and tracker/pipeline behavior are defined here and should be updated before implementations change.

There is **no production code** in this repository. To build or run the system, use the implementation repositories described below.

---

## Specification Files

- `memory-bank/application-spec.md` — Web application (UI + API server) specification.
- `memory-bank/agent-spec.md` — QA Agent CLI and LLM intelligence engine specification.
- `memory-bank/ecosystem-spec.md` — Multi-agent pipeline and developer toolchain specification.

These three documents are designed to be framework-agnostic and versioned independently. They reference each other and the rest of the Memory Bank (`projectbrief`, `productContext`, `techContext`, `systemPatterns`, `activeContext`, `progress`).

---

## Memory Bank Structure

The `memory-bank/` directory contains persistent project context:

- `projectbrief.md` — High-level goals and scope of the QA Regression Manager ecosystem.
- `productContext.md` — Product vision, users, workflows, and UX goals.
- `techContext.md` — Reference technology choices and environment assumptions (for one concrete stack).
- `systemPatterns.md` — Architectural and design patterns observed or recommended for implementations.
- `activeContext.md` — Current focus and active decisions for the **specs** themselves.
- `progress.md` — What is already specified, what remains to design, known gaps.
- `application-spec.md`, `agent-spec.md`, `ecosystem-spec.md` — Core specs described above.

Agents and implementation repositories should treat these files as **read-only contracts** and update them when behavior changes, rather than diverging silently.

---

## Related Repositories (Implementations)

The actual implementations are expected to live in separate repositories (names may change as they are created):

- `qa-regression-manager` — Web application implementation (UI + API + database).
- `qa-agent` — QA Agent CLI implementation.
- `code-implementer` — Code Implementer agent implementation.
- `ticket-refiner` — Ticket Refiner agent implementation.
- `llm-gateway` — LLM cost/proxy/guardrails service used by agents.
- `dev-toolchain` — Optional orchestration repo (multi-root workspace, setup script, Docker Compose).

Each implementation repo should maintain its own local Memory Bank (project-specific details) but rely on this repo for **shared specifications and contracts**.

---

## How to Use This Repo

- **Design & architecture**: Start in `memory-bank/projectbrief.md` and `memory-bank/productContext.md` to understand the vision and scope.
- **Implement the web app**: Follow `memory-bank/application-spec.md` for data model, API endpoints, and UI flows.
- **Implement the QA Agent**: Follow `memory-bank/agent-spec.md` for CLI commands, analysis engine, test generation, sync protocol, and LLM features.
- **Implement the pipeline**: Follow `memory-bank/ecosystem-spec.md` for the agent protocol, tracker integration, status mappings, and orchestration model.
- **Coordinate changes**: When changing behavior in any implementation, update the relevant spec here first, then update the code to match.

This repository is intended to be opened alongside implementation repos in a multi-root workspace (e.g., a `dev-toolchain.code-workspace` file) so that specs are always in view while coding.

