# Qa Regression Manager

This project was generated using [Nx](https://nx.dev).

## Code Checks

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e8e825d4c8fb460696312a295f0a8e9d)](https://www.codacy.com?utm_source=github.com&utm_medium=referral&utm_content=nholder88/Regression-Mananger&utm_campaign=Badge_Grade)

[![Build Status](https://dev.azure.com/nholder/Regression%20Manager/_apis/build/status/nholder88.Regression-Mananger?branchName=develop)](https://dev.azure.com/nholder/Regression%20Manager/_apis/build/status/nholder88.Regression-Mananger?branchName=develop)

## Project Specific Quick Start

### Prerequisites

- For use of SQL Server you may have to create a user called `root` and then create the `dev` database manually. 
- You will also have to turn on the TCP/IP options in the protocols for your local instance of SQL server [See here](https://github.com/typeorm/typeorm/issues/2133) Or [here](http://127.0.0.1:63343/help/db-tutorial-connecting-to-ms-sql-server.html)
- To use migrations for you will need to follow the directions [here](https://typeorm.io/#/using-cli/installing-cli)

Run `cd qa; npm install; npm run dev;` to run the API and UI at the same time on first pull of Repo

## Roadmap

### Phase I

- Create Regression Page - Done
- Create Regression Test Pass Page - Done
- Create Regression Test Pass Create Page - Done
- Create Endpoints For UI - Done
- Hook up Endpoints to UI - Done
- Add authentication - Done
- Add Test Import Page for Data Seeding
- Add CI for UI - Done
- Add CI for API - Done
- Add E2E Testing for Release Validation

### Phase II

- Create Reporting Page - Done
- Create User Roles
- Add Admin Pages for Managing Tests, Users, Regressions

🔎 **Nx is a set of Extensible Dev Tools for Monorepos.**

## Quick Start & Documentation

[Nx Documentation](https://nx.dev/angular)

[10-minute video showing all Nx features](https://nx.dev/angular/getting-started/what-is-nx)

[Interactive Tutorial](https://nx.dev/angular/tutorial/01-create-application)

## Adding capabilities to your workspace

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are some plugins which you can add to your workspace:

- [Angular](https://angular.io)
  - `ng add @nrwl/angular`
- [React](https://reactjs.org)
  - `ng add @nrwl/react`
- Web (no framework frontends)
  - `ng add @nrwl/web`
- [Nest](https://nestjs.com)
  - `ng add @nrwl/nest`
- [Express](https://expressjs.com)
  - `ng add @nrwl/express`
- [Node](https://nodejs.org)
  - `ng add @nrwl/node`

## Generate an application

Run `ng g @nrwl/angular:app my-app` to generate an application.

> You can use any of the plugins above to generate applications as well.

When using Nx, you can create multiple applications and libraries in the same workspace.

## Generate a library

Run `ng g @nrwl/angular:lib my-lib` to generate a library.

> You can also use any of the plugins above to generate libraries as well.

Libraries are sharable across libraries and applications. They can be imported from `@qa/mylib`.

## Development server

Run `ng serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng g component my-component --project=my-app` to generate a new component.

## Build

Run `ng build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

## Running end-to-end tests

Run `ng e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

## Understand your workspace

Run `nx dep-graph` to see a diagram of the dependencies of your projects.

## Further help

Visit the [Nx Documentation](https://nx.dev/angular) to learn more.
