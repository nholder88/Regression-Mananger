# Regression-Mananger

> Nx monorepo with Angular UI and NestJS API for managing QA regression test passes.

## Problem

QA teams commonly track regression work in spreadsheets: scenarios, steps, test passes, and their pass/fail results are scattered across tabs and owners. Nigel wanted a web app that centralized that data with real users, auth, and reporting so a regression run could be planned, executed, and reviewed in one place. This repo was the server-side half of that idea.

## Goal

A deployed Angular + NestJS app where QA users create regression headers, scenarios, steps, and test passes, record results, and generate reports. It was also intended to be the central server that a separate CLI (`qa-agent`) would sync with.

## Approach

Nx monorepo with an Angular frontend (`regression-poc`) using Clarity UI and NgRx, a NestJS API using TypeORM against SQL Server, JWT auth via `@auth0/angular-jwt` and `@nestjs/jwt`, and deployment via Azure Pipelines / GitHub Actions to an Azure Web App. Migrations are wired through TypeORM CLI.

## Implemented features

- Nx workspace with `regression-poc`, `regression-poc-e2e`, and `api` apps
- API modules under `apps/api/src/app/regression/` for feature / header / scenario / step / scenarioResult / testPass, plus `auth`, `users`, and `migrations`
- Angular feature folders for `admin`, `regression`, and `reporting`
- TypeORM migrations setup (generate + run scripts)
- JWT auth dependencies configured on both sides
- Azure Pipelines config plus a GitHub Actions deploy workflow badge
- `Procfile` for Heroku-style deploy

## What's left to reach the goal

- [ ] Upgrade off Angular 9 / NestJS 6 (stack is years out of date)
- [ ] Confirm whether the Azure Web App deployment is still live
- [ ] Finish the UI beyond the POC state
- [ ] Add the data-seeding "Test Import" page called out in the roadmap
- [ ] Finish user roles and admin management pages (Phase II)
- [ ] Verify `qa-agent` sync contract and document the API surface

## Related repos

- `qa-agent` — CLI client that was meant to sync against this API
- `code-implementer` — companion tool in the same QA Regression Manager ecosystem

## Getting started

```bash
npm install
npm run dev   # runs typeorm migrations, then `ng serve api` and `ng serve -o` concurrently
```

Prerequisites (from the original README): a local SQL Server with TCP/IP enabled, a `root` user, and a `dev` database created manually. Individual apps can also be started with `ng serve api` or `ng serve regression-poc`.

## Status

**Current:** abandoned  ·  50% complete

No commits in the last year; the most recent commit is a Dependabot bump from 2023. The bones of both apps are in place but the stack is stale and deployment status is unknown. Keep as historical / reference for the newer `qa-agent` and `code-implementer` work.

Repo-name cleanup: the repo is spelled `Regression-Mananger` (typo). A `gh repo rename` to `Regression-Manager` is planned.

---

*Part of Nigel's personal project cleanup (April 2026). See problem statement above for what this is supposed to solve.*
