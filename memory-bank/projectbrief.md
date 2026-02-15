# Project Brief

## Project Name
QA Regression Manager (ICP Regression Manager)

## Overview
A QA regression testing management application that allows teams to track regression test passes, features, scenarios, and test results. Built as an Nx monorepo with an Angular frontend and NestJS backend.

## Core Requirements
- Manage regression test passes with features and scenarios
- Create and continue regression test executions
- Record scenario results (pass/fail, tester, notes)
- Report on regression results via dashboard
- Administer users, features, and scenarios
- Authenticate users via JWT

## Goals
- Provide a centralized system for QA teams to run and track regression tests
- Support structured test data: Regression > Test Pass > Features > Scenarios > Steps > Scenario Results
- Enable reporting and visibility into test pass outcomes
- Admin capabilities for test structure (features/scenarios) and user management

## Scope
- **In scope**: Regression management, test pass execution, reporting, auth, admin for users/features/scenarios
- **Out of scope** (or future): Test Import for data seeding, E2E release validation, user roles with backend, teams management
