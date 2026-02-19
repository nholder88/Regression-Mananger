import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1595020133067 implements MigrationInterface {
    name = 'init1595020133067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "user_dto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "password" varchar(255) NOT NULL, "username" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, CONSTRAINT "UQ_506c9e3196659f12dccb2d1378e" UNIQUE ("username"), CONSTRAINT "PK_8edd1326f655ae96b51aea0d24f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "feature_dto" ("name" varchar(255) NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "team" varchar(255) NOT NULL, "userId" uuid, CONSTRAINT "PK_d922fec52434a55d4ac1c2ca8b9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regression_header_dto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" varchar(255) NOT NULL, "releaseName" varchar(255) NOT NULL, "startDate" timestamp NOT NULL DEFAULT now(), "endDate" timestamp NOT NULL DEFAULT now(), "isComplete" boolean NOT NULL, "isStarted" boolean NOT NULL, "userId" uuid, CONSTRAINT "PK_25606f90bc4010ea4a0313ed8f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "scenario_dto_order_seq" OWNED BY NONE`);
        await queryRunner.query(`CREATE TABLE "scenario_dto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" varchar(255) NOT NULL, "note" varchar(255) NOT NULL DEFAULT '', "order" integer NOT NULL DEFAULT nextval('scenario_dto_order_seq'), "timestamp" timestamp NOT NULL DEFAULT now(), "userId" uuid, "featureId" uuid, CONSTRAINT "PK_36119ad96029e71d98c33a43086" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "test_pass_dto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isComplete" boolean NOT NULL, "isStarted" boolean NOT NULL, "timeStamp" timestamp NOT NULL DEFAULT now(), "title" varchar(255) NOT NULL, "testingLoginUserName" varchar(255) NOT NULL DEFAULT '', "testingRole" varchar(255) NOT NULL DEFAULT '', "userId" uuid, "headerId" uuid, CONSTRAINT "PK_ce8e2cf71f4749824ec01761bf9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scenario_result_dto" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "timestamp" timestamp NOT NULL, "completedBy" varchar(255) NOT NULL, "status" varchar(255) NOT NULL, "notes" varchar(255) NOT NULL, "bugCreated" boolean NOT NULL, "userId" uuid, "scenarioId" uuid, "testPassId" uuid, CONSTRAINT "PK_f63dccab37dc3567594680e32bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "step_dto" ("name" varchar(255) NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "order" integer NOT NULL, "userId" uuid, "scenarioId" uuid, CONSTRAINT "PK_d2992955a4ab1c85638bae93177" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "test_pass_dto_feature_scenario_containers_feature_dto" ("testPassDtoId" uuid NOT NULL, "featureDtoId" uuid NOT NULL, CONSTRAINT "PK_b35b615842f1997688e08d5f3e8" PRIMARY KEY ("testPassDtoId", "featureDtoId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_48e706e3c9e2ecf605902d3177" ON "test_pass_dto_feature_scenario_containers_feature_dto" ("testPassDtoId")`);
        await queryRunner.query(`CREATE INDEX "IDX_6a7af41417f81d56f1e4a3b383" ON "test_pass_dto_feature_scenario_containers_feature_dto" ("featureDtoId")`);
        await queryRunner.query(`ALTER TABLE "feature_dto" ADD CONSTRAINT "FK_6e5690d0dbd32ab831bc37a5f4f" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "regression_header_dto" ADD CONSTRAINT "FK_e67a642e5c465a8572178d93896" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scenario_dto" ADD CONSTRAINT "FK_2d87f23088d6e3a4dd72e742765" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scenario_dto" ADD CONSTRAINT "FK_419ea3da38371e5f02ecbacd81a" FOREIGN KEY ("featureId") REFERENCES "feature_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_pass_dto" ADD CONSTRAINT "FK_6f3839a5800e80ee2bf8e716984" FOREIGN KEY ("headerId") REFERENCES "regression_header_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_pass_dto" ADD CONSTRAINT "FK_a9412ee64bec577945032953a43" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" ADD CONSTRAINT "FK_e9f4321efe10e872a4f7d8ce2ec" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" ADD CONSTRAINT "FK_710db68b82c2114bd8d82363475" FOREIGN KEY ("scenarioId") REFERENCES "scenario_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" ADD CONSTRAINT "FK_0c0802bfaa1f202f403caf762dc" FOREIGN KEY ("testPassId") REFERENCES "test_pass_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "step_dto" ADD CONSTRAINT "FK_31470147d4c20447ec46d0fb5e8" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "step_dto" ADD CONSTRAINT "FK_04ac8c6cb1f108c92f8df86ddbc" FOREIGN KEY ("scenarioId") REFERENCES "scenario_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_pass_dto_feature_scenario_containers_feature_dto" ADD CONSTRAINT "FK_48e706e3c9e2ecf605902d3177d" FOREIGN KEY ("testPassDtoId") REFERENCES "test_pass_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "test_pass_dto_feature_scenario_containers_feature_dto" ADD CONSTRAINT "FK_6a7af41417f81d56f1e4a3b383e" FOREIGN KEY ("featureDtoId") REFERENCES "feature_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_pass_dto_feature_scenario_containers_feature_dto" DROP CONSTRAINT "FK_6a7af41417f81d56f1e4a3b383e"`);
        await queryRunner.query(`ALTER TABLE "test_pass_dto_feature_scenario_containers_feature_dto" DROP CONSTRAINT "FK_48e706e3c9e2ecf605902d3177d"`);
        await queryRunner.query(`ALTER TABLE "step_dto" DROP CONSTRAINT "FK_04ac8c6cb1f108c92f8df86ddbc"`);
        await queryRunner.query(`ALTER TABLE "step_dto" DROP CONSTRAINT "FK_31470147d4c20447ec46d0fb5e8"`);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" DROP CONSTRAINT "FK_0c0802bfaa1f202f403caf762dc"`);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" DROP CONSTRAINT "FK_710db68b82c2114bd8d82363475"`);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" DROP CONSTRAINT "FK_e9f4321efe10e872a4f7d8ce2ec"`);
        await queryRunner.query(`ALTER TABLE "test_pass_dto" DROP CONSTRAINT "FK_a9412ee64bec577945032953a43"`);
        await queryRunner.query(`ALTER TABLE "test_pass_dto" DROP CONSTRAINT "FK_6f3839a5800e80ee2bf8e716984"`);
        await queryRunner.query(`ALTER TABLE "scenario_dto" DROP CONSTRAINT "FK_419ea3da38371e5f02ecbacd81a"`);
        await queryRunner.query(`ALTER TABLE "scenario_dto" DROP CONSTRAINT "FK_2d87f23088d6e3a4dd72e742765"`);
        await queryRunner.query(`ALTER TABLE "regression_header_dto" DROP CONSTRAINT "FK_e67a642e5c465a8572178d93896"`);
        await queryRunner.query(`ALTER TABLE "feature_dto" DROP CONSTRAINT "FK_6e5690d0dbd32ab831bc37a5f4f"`);
        await queryRunner.query(`DROP INDEX "IDX_6a7af41417f81d56f1e4a3b383"`);
        await queryRunner.query(`DROP INDEX "IDX_48e706e3c9e2ecf605902d3177"`);
        await queryRunner.query(`DROP TABLE "test_pass_dto_feature_scenario_containers_feature_dto"`);
        await queryRunner.query(`DROP TABLE "step_dto"`);
        await queryRunner.query(`DROP TABLE "scenario_result_dto"`);
        await queryRunner.query(`DROP TABLE "test_pass_dto"`);
        await queryRunner.query(`DROP TABLE "scenario_dto"`);
        await queryRunner.query(`DROP SEQUENCE IF EXISTS "scenario_dto_order_seq"`);
        await queryRunner.query(`DROP TABLE "regression_header_dto"`);
        await queryRunner.query(`DROP TABLE "feature_dto"`);
        await queryRunner.query(`DROP TABLE "user_dto"`);
    }

}
