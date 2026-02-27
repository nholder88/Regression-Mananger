# Active Context

## Current Work Focus
- Use this repository as the **specification hub** for the QA Regression Manager ecosystem.
- Keep `application-spec.md`, `agent-spec.md`, and `ecosystem-spec.md` up to date with design decisions.
- Keep the Memory Bank aligned with the fact that implementations now live in separate repositories.

## Recent Changes
- Consolidated the specifications into three primary documents:
  - `application-spec.md` — web application (UI + API server).
  - `agent-spec.md` — QA Agent CLI and intelligence engine.
  - `ecosystem-spec.md` — multi-agent developer toolchain.
- Refactored this repo from an Nx implementation workspace into a **docs-only specs repo**.
- Updated `README.md` to describe this repo as canonical specs and to point to implementation repos.
- Updated `projectbrief.md`, `techContext.md`, and `systemPatterns.md` to be framework/repo-agnostic and reference the specs role.

## Next Steps
1. Stand up separate implementation repositories for:
   - Web app (`qa-regression-manager`).
   - QA Agent CLI (`qa-agent`).
   - Code Implementer (`code-implementer`).
   - Ticket Refiner (`ticket-refiner`).
   - LLM gateway (`llm-gateway`).
2. Create a `dev-toolchain` repo with:
   - Multi-root workspace file including this specs repo and all implementation repos.
   - Setup script to clone/update all repos side-by-side.
   - Docker Compose file to run the full ecosystem locally.
3. In each implementation repo, add a small Memory Bank / context file that links back to the relevant sections of these specs.

## Active Decisions and Considerations
- This repository is **code-agnostic**: it does not contain production application code.
- All cross-agent contracts and shared behavior live here and must be updated first when behavior changes.
- Implementation repos are free to choose languages and frameworks as long as they conform to these specifications.
