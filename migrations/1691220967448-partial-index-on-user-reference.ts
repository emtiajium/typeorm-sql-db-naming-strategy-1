import { MigrationInterface, QueryRunner } from 'typeorm';

export class PartialIndexOnUserReference1691220967448 implements MigrationInterface {
    name = 'PartialIndexOnUserReference1691220967448';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_User_reference"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_User_reference_WHERE_deletedAt_IS_NULL" ON "User" ("reference")
                WHERE "deletedAt" IS NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_User_reference_WHERE_deletedAt_IS_NULL"
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_User_reference" ON "User" ("reference")
                WHERE ("deletedAt" IS NULL)
        `);
    }
}
