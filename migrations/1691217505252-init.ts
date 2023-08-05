import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1691217505252 implements MigrationInterface {
    name = 'Init1691217505252';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "Role"
            (
                "id"         uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "name"       character varying NOT NULL,
                "permission" jsonb             NOT NULL,
                CONSTRAINT "PK_Role_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_Role_name" ON "Role" ("name")
        `);
        await queryRunner.query(`
            CREATE TABLE "User"
            (
                "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "name"      character varying NOT NULL,
                "reference" character varying NOT NULL,
                "deletedAt" TIMESTAMP WITH TIME ZONE,
                "cohortId"  uuid              NOT NULL,
                "roleId"    uuid              NOT NULL,
                CONSTRAINT "PK_User_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_User_reference" ON "User" ("reference")
                WHERE "deletedAt" IS NOT NULL
        `);
        await queryRunner.query(`
            CREATE TABLE "Cohort"
            (
                "id"   uuid              NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                CONSTRAINT "UQ_Cohort_name" UNIQUE ("name"),
                CONSTRAINT "PK_Cohort_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "User"
                ADD CONSTRAINT "FK_User_cohortId_Cohort_id" FOREIGN KEY ("cohortId") REFERENCES "Cohort" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "User"
                ADD CONSTRAINT "FK_User_roleId_Role_id" FOREIGN KEY ("roleId") REFERENCES "Role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "User"
                DROP CONSTRAINT "FK_User_roleId_Role_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "User"
                DROP CONSTRAINT "FK_User_cohortId_Cohort_id"
        `);
        await queryRunner.query(`
            DROP TABLE "Cohort"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_User_reference"
        `);
        await queryRunner.query(`
            DROP TABLE "User"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_Role_name"
        `);
        await queryRunner.query(`
            DROP TABLE "Role"
        `);
    }
}
