import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1730000000000 implements MigrationInterface {
  name = 'InitialSchema1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_username" UNIQUE ("username"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "regression_headers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "releaseName" character varying NOT NULL,
        "startDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "endDate" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "isComplete" boolean NOT NULL DEFAULT false,
        "isStarted" boolean NOT NULL DEFAULT false,
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_regression_headers" PRIMARY KEY ("id"),
        CONSTRAINT "FK_regression_headers_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "features" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "team" character varying NOT NULL,
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_features" PRIMARY KEY ("id"),
        CONSTRAINT "FK_features_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "scenarios" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "note" character varying NOT NULL DEFAULT '',
        "order" integer NOT NULL DEFAULT 0,
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "featureId" uuid NOT NULL,
        CONSTRAINT "PK_scenarios" PRIMARY KEY ("id"),
        CONSTRAINT "FK_scenarios_user" FOREIGN KEY ("userId") REFERENCES "users"("id"),
        CONSTRAINT "FK_scenarios_feature" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "steps" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "order" integer NOT NULL,
        "userId" uuid NOT NULL,
        "scenarioId" uuid NOT NULL,
        CONSTRAINT "PK_steps" PRIMARY KEY ("id"),
        CONSTRAINT "FK_steps_user" FOREIGN KEY ("userId") REFERENCES "users"("id"),
        CONSTRAINT "FK_steps_scenario" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "test_passes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "testingLoginUserName" character varying NOT NULL DEFAULT '',
        "testingRole" character varying NOT NULL DEFAULT '',
        "isComplete" boolean NOT NULL DEFAULT false,
        "isStarted" boolean NOT NULL DEFAULT false,
        "timeStamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        "headerId" uuid NOT NULL,
        CONSTRAINT "PK_test_passes" PRIMARY KEY ("id"),
        CONSTRAINT "FK_test_passes_user" FOREIGN KEY ("userId") REFERENCES "users"("id"),
        CONSTRAINT "FK_test_passes_header" FOREIGN KEY ("headerId") REFERENCES "regression_headers"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "test_pass_features" (
        "testPassId" uuid NOT NULL,
        "featureId" uuid NOT NULL,
        CONSTRAINT "PK_test_pass_features" PRIMARY KEY ("testPassId", "featureId"),
        CONSTRAINT "FK_test_pass_features_testPass" FOREIGN KEY ("testPassId") REFERENCES "test_passes"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_test_pass_features_feature" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "scenario_results" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "status" character varying NOT NULL,
        "notes" character varying NOT NULL DEFAULT '',
        "bugCreated" boolean NOT NULL DEFAULT false,
        "bugTicketId" character varying,
        "completedBy" character varying NOT NULL DEFAULT '',
        "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "completedSteps" jsonb NOT NULL DEFAULT '[]',
        "userId" uuid NOT NULL,
        "scenarioId" uuid NOT NULL,
        "testPassId" uuid NOT NULL,
        CONSTRAINT "PK_scenario_results" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_scenario_results_scenario_testPass" UNIQUE ("scenarioId", "testPassId"),
        CONSTRAINT "FK_scenario_results_user" FOREIGN KEY ("userId") REFERENCES "users"("id"),
        CONSTRAINT "FK_scenario_results_scenario" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_scenario_results_testPass" FOREIGN KEY ("testPassId") REFERENCES "test_passes"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "integration_configs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "provider" character varying NOT NULL,
        "name" character varying NOT NULL,
        "baseUrl" character varying NOT NULL,
        "projectKey" character varying NOT NULL,
        "authMethod" character varying NOT NULL,
        "authToken" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_integration_configs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_integration_configs_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "import_sessions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "integrationId" uuid NOT NULL,
        "query" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "importedCount" integer NOT NULL DEFAULT 0,
        "skippedCount" integer NOT NULL DEFAULT 0,
        "errorMessage" character varying,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_import_sessions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_import_sessions_integration" FOREIGN KEY ("integrationId") REFERENCES "integration_configs"("id"),
        CONSTRAINT "FK_import_sessions_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "project_configs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "repoUrl" character varying NOT NULL,
        "language" character varying NOT NULL DEFAULT '',
        "framework" character varying NOT NULL DEFAULT '',
        "testRunner" character varying NOT NULL DEFAULT '',
        "testDirectory" character varying NOT NULL DEFAULT '',
        "sourceDirectory" character varying NOT NULL DEFAULT '',
        "lastAnalyzedAt" TIMESTAMP WITH TIME ZONE,
        "configHash" character varying,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_project_configs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_project_configs_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "test_files" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "projectId" uuid NOT NULL,
        "scenarioId" uuid,
        "filePath" character varying NOT NULL,
        "testType" character varying NOT NULL,
        "generatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "lastSyncedAt" TIMESTAMP WITH TIME ZONE,
        "syncStatus" character varying NOT NULL DEFAULT 'synced',
        "contentHash" character varying NOT NULL DEFAULT '',
        CONSTRAINT "PK_test_files" PRIMARY KEY ("id"),
        CONSTRAINT "FK_test_files_project" FOREIGN KEY ("projectId") REFERENCES "project_configs"("id"),
        CONSTRAINT "FK_test_files_scenario" FOREIGN KEY ("scenarioId") REFERENCES "scenarios"("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "agent_runs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "projectId" uuid NOT NULL,
        "command" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'running',
        "startedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "completedAt" TIMESTAMP WITH TIME ZONE,
        "summary" character varying NOT NULL DEFAULT '',
        "errorMessage" character varying,
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_agent_runs" PRIMARY KEY ("id"),
        CONSTRAINT "FK_agent_runs_project" FOREIGN KEY ("projectId") REFERENCES "project_configs"("id"),
        CONSTRAINT "FK_agent_runs_user" FOREIGN KEY ("userId") REFERENCES "users"("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "agent_runs"`);
    await queryRunner.query(`DROP TABLE "test_files"`);
    await queryRunner.query(`DROP TABLE "project_configs"`);
    await queryRunner.query(`DROP TABLE "import_sessions"`);
    await queryRunner.query(`DROP TABLE "integration_configs"`);
    await queryRunner.query(`DROP TABLE "scenario_results"`);
    await queryRunner.query(`DROP TABLE "test_pass_features"`);
    await queryRunner.query(`DROP TABLE "test_passes"`);
    await queryRunner.query(`DROP TABLE "steps"`);
    await queryRunner.query(`DROP TABLE "scenarios"`);
    await queryRunner.query(`DROP TABLE "features"`);
    await queryRunner.query(`DROP TABLE "regression_headers"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
