# Project Brief

## Project Name
QA Regression Manager (ICP Regression Manager)

## Overview
This repository is the **canonical specification and Memory Bank** for the QA Regression Manager ecosystem. It describes:

- The QA Regression Manager web application (UI + API server)
- The QA Agent CLI that analyzes codebases and generates tests
- The multi-agent developer toolchain (Ticket Refiner, Code Implementer, QA Agent)

The documents here are **framework- and repo-agnostic**. They are written so that the system can be re-implemented in any language or framework. Concrete implementations (NestJS, Next.js, etc.) live in separate repositories and must conform to these specs.

## Core Requirements
- Manage regression test passes with features and scenarios
- Create and continue regression test executions
- Record scenario results (pass/fail, tester, notes)
- Report on regression results via dashboard
- Administer users, features, and scenarios
- Authenticate users via JWT (or equivalent secure mechanism)

## Goals
- Provide a centralized system for QA teams to run and track regression tests
- Support structured test data: Regression > Test Pass > Features > Scenarios > Steps > Scenario Results
- Enable reporting and visibility into test pass outcomes
- Admin capabilities for test structure (features/scenarios) and user management
- Provide machine-readable, implementation-agnostic specs that LLM agents and humans can follow

## Scope
- **In scope**: Regression management, test pass execution, reporting, auth, admin for users/features/scenarios, agent CLI behavior, and multi-agent pipeline behavior.
- **Out of scope**: Specific framework choices, build tooling, CI/CD, and repository layout for implementations (those are free to vary as long as they satisfy these specs).

## Detailed Specification
- `application-spec.md` — web application spec
- `agent-spec.md` — QA Agent CLI and AI engine spec
- `ecosystem-spec.md` — 3-agent pipeline and ecosystem spec
