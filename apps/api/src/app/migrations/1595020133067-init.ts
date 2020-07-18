import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1595020133067 implements MigrationInterface {
    name = 'init1595020133067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_dto" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_8edd1326f655ae96b51aea0d24f" DEFAULT NEWSEQUENTIALID(), "password" varchar(255) NOT NULL, "username" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, CONSTRAINT "UQ_506c9e3196659f12dccb2d1378e" UNIQUE ("username"), CONSTRAINT "PK_8edd1326f655ae96b51aea0d24f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "feature_dto" ("name" nvarchar(255) NOT NULL, "id" uniqueidentifier NOT NULL CONSTRAINT "DF_d922fec52434a55d4ac1c2ca8b9" DEFAULT NEWSEQUENTIALID(), "team" nvarchar(255) NOT NULL, "userId" uniqueidentifier, CONSTRAINT "PK_d922fec52434a55d4ac1c2ca8b9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "regression_header_dto" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_25606f90bc4010ea4a0313ed8f5" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "releaseName" nvarchar(255) NOT NULL, "startDate" datetime NOT NULL CONSTRAINT "DF_a9e2ba27e1433f2ecc627119c41" DEFAULT '2020-07-17T21:08:56.412Z', "endDate" datetime NOT NULL CONSTRAINT "DF_4523e0c8df8fb7bdd7985b77a5f" DEFAULT '2020-07-17T21:08:56.412Z', "isComplete" bit NOT NULL, "isStarted" bit NOT NULL, "userId" uniqueidentifier, CONSTRAINT "PK_25606f90bc4010ea4a0313ed8f5" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "scenario_dto" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_36119ad96029e71d98c33a43086" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "note" nvarchar(255) NOT NULL CONSTRAINT "DF_27da72394e604250a7df3fbcb0c" DEFAULT '', "order" int NOT NULL CONSTRAINT "DF_42bf9da64b3132a974310bd9411" DEFAULT 0, "timestamp" datetime NOT NULL CONSTRAINT "DF_9b529c7a1c87ce75114ecf20332" DEFAULT '2020-07-17T21:08:56.683Z', "userId" uniqueidentifier, "featureId" uniqueidentifier, CONSTRAINT "PK_36119ad96029e71d98c33a43086" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "test_pass_dto" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_ce8e2cf71f4749824ec01761bf9" DEFAULT NEWSEQUENTIALID(), "isComplete" bit NOT NULL, "isStarted" bit NOT NULL, "timeStamp" datetime NOT NULL CONSTRAINT "DF_a7a41c2bf2ed7f849e301da2655" DEFAULT '2020-07-17T21:08:57.199Z', "title" nvarchar(255) NOT NULL, "testingLoginUserName" nvarchar(255) NOT NULL CONSTRAINT "DF_42197adc38d3a577a8f452c2617" DEFAULT '', "testingRole" nvarchar(255) NOT NULL CONSTRAINT "DF_3045e0f07e0036b80972b067cc5" DEFAULT '', "userId" uniqueidentifier, "headerId" uniqueidentifier, CONSTRAINT "PK_ce8e2cf71f4749824ec01761bf9" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "scenario_result_dto" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_f63dccab37dc3567594680e32bb" DEFAULT NEWSEQUENTIALID(), "timestamp" datetime NOT NULL, "completedBy" nvarchar(255) NOT NULL, "status" nvarchar(255) NOT NULL, "notes" nvarchar(255) NOT NULL, "bugCreated" bit NOT NULL, "userId" uniqueidentifier, "scenarioId" uniqueidentifier, "testPassId" uniqueidentifier, CONSTRAINT "PK_f63dccab37dc3567594680e32bb" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "step_dto" ("name" nvarchar(255) NOT NULL, "id" uniqueidentifier NOT NULL CONSTRAINT "DF_d2992955a4ab1c85638bae93177" DEFAULT NEWSEQUENTIALID(), "order" int NOT NULL, "userId" uniqueidentifier, "scenarioId" uniqueidentifier, CONSTRAINT "PK_d2992955a4ab1c85638bae93177" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "test_pass_dto_feature_scenario_containers_feature_dto" ("testPassDtoId" uniqueidentifier NOT NULL, "featureDtoId" uniqueidentifier NOT NULL, CONSTRAINT "PK_b35b615842f1997688e08d5f3e8" PRIMARY KEY ("testPassDtoId", "featureDtoId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_48e706e3c9e2ecf605902d3177" ON "test_pass_dto_feature_scenario_containers_feature_dto" ("testPassDtoId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_6a7af41417f81d56f1e4a3b383" ON "test_pass_dto_feature_scenario_containers_feature_dto" ("featureDtoId") `, undefined);
        await queryRunner.query(`ALTER TABLE "feature_dto" ADD CONSTRAINT "FK_6e5690d0dbd32ab831bc37a5f4f" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "regression_header_dto" ADD CONSTRAINT "FK_e67a642e5c465a8572178d93896" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_dto" ADD CONSTRAINT "FK_2d87f23088d6e3a4dd72e742765" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_dto" ADD CONSTRAINT "FK_419ea3da38371e5f02ecbacd81a" FOREIGN KEY ("featureId") REFERENCES "feature_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "test_pass_dto" ADD CONSTRAINT "FK_6f3839a5800e80ee2bf8e716984" FOREIGN KEY ("headerId") REFERENCES "regression_header_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "test_pass_dto" ADD CONSTRAINT "FK_a9412ee64bec577945032953a43" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" ADD CONSTRAINT "FK_e9f4321efe10e872a4f7d8ce2ec" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" ADD CONSTRAINT "FK_710db68b82c2114bd8d82363475" FOREIGN KEY ("scenarioId") REFERENCES "scenario_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" ADD CONSTRAINT "FK_0c0802bfaa1f202f403caf762dc" FOREIGN KEY ("testPassId") REFERENCES "test_pass_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "step_dto" ADD CONSTRAINT "FK_31470147d4c20447ec46d0fb5e8" FOREIGN KEY ("userId") REFERENCES "user_dto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "step_dto" ADD CONSTRAINT "FK_04ac8c6cb1f108c92f8df86ddbc" FOREIGN KEY ("scenarioId") REFERENCES "scenario_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "test_pass_dto_feature_scenario_containers_feature_dto" ADD CONSTRAINT "FK_48e706e3c9e2ecf605902d3177d" FOREIGN KEY ("testPassDtoId") REFERENCES "test_pass_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "test_pass_dto_feature_scenario_containers_feature_dto" ADD CONSTRAINT "FK_6a7af41417f81d56f1e4a3b383e" FOREIGN KEY ("featureDtoId") REFERENCES "feature_dto"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "test_pass_dto_feature_scenario_containers_feature_dto" DROP CONSTRAINT "FK_6a7af41417f81d56f1e4a3b383e"`, undefined);
        await queryRunner.query(`ALTER TABLE "test_pass_dto_feature_scenario_containers_feature_dto" DROP CONSTRAINT "FK_48e706e3c9e2ecf605902d3177d"`, undefined);
        await queryRunner.query(`ALTER TABLE "step_dto" DROP CONSTRAINT "FK_04ac8c6cb1f108c92f8df86ddbc"`, undefined);
        await queryRunner.query(`ALTER TABLE "step_dto" DROP CONSTRAINT "FK_31470147d4c20447ec46d0fb5e8"`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" DROP CONSTRAINT "FK_0c0802bfaa1f202f403caf762dc"`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" DROP CONSTRAINT "FK_710db68b82c2114bd8d82363475"`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_result_dto" DROP CONSTRAINT "FK_e9f4321efe10e872a4f7d8ce2ec"`, undefined);
        await queryRunner.query(`ALTER TABLE "test_pass_dto" DROP CONSTRAINT "FK_a9412ee64bec577945032953a43"`, undefined);
        await queryRunner.query(`ALTER TABLE "test_pass_dto" DROP CONSTRAINT "FK_6f3839a5800e80ee2bf8e716984"`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_dto" DROP CONSTRAINT "FK_419ea3da38371e5f02ecbacd81a"`, undefined);
        await queryRunner.query(`ALTER TABLE "scenario_dto" DROP CONSTRAINT "FK_2d87f23088d6e3a4dd72e742765"`, undefined);
        await queryRunner.query(`ALTER TABLE "regression_header_dto" DROP CONSTRAINT "FK_e67a642e5c465a8572178d93896"`, undefined);
        await queryRunner.query(`ALTER TABLE "feature_dto" DROP CONSTRAINT "FK_6e5690d0dbd32ab831bc37a5f4f"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_6a7af41417f81d56f1e4a3b383" ON "test_pass_dto_feature_scenario_containers_feature_dto"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_48e706e3c9e2ecf605902d3177" ON "test_pass_dto_feature_scenario_containers_feature_dto"`, undefined);
        await queryRunner.query(`DROP TABLE "test_pass_dto_feature_scenario_containers_feature_dto"`, undefined);
        await queryRunner.query(`DROP TABLE "step_dto"`, undefined);
        await queryRunner.query(`DROP TABLE "scenario_result_dto"`, undefined);
        await queryRunner.query(`DROP TABLE "test_pass_dto"`, undefined);
        await queryRunner.query(`DROP TABLE "scenario_dto"`, undefined);
        await queryRunner.query(`DROP TABLE "regression_header_dto"`, undefined);
        await queryRunner.query(`DROP TABLE "feature_dto"`, undefined);
        await queryRunner.query(`DROP TABLE "user_dto"`, undefined);
    }

}
