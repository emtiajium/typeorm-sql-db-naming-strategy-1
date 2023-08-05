import { INestApplication } from '@nestjs/common';
import { kickOff } from '@/bootstrap';
import { AppModule } from '@/app/AppModule';
import { DatabaseKeysUtil } from '@test/util/database-keys-util';
import { DataSource } from 'typeorm';
import { DatabaseNamingStrategy } from '@/common/persistence/DatabaseNamingStrategy';

describe('Database Keys', () => {
    let app: INestApplication;
    let databaseKeysUtil: DatabaseKeysUtil;

    let tableNames: string[] = [];
    let allPrimaryKeys: Record<string, string> = {};
    let allForeignKeys: Record<string, string[]> = {};
    let allIndexKeys: Record<string, string[]> = {};
    let allUniqueKeys: Record<string, string[]> = {};

    beforeAll(async () => {
        app = await kickOff(AppModule);

        databaseKeysUtil = new DatabaseKeysUtil(app.get(DataSource));

        tableNames = databaseKeysUtil.getTableNames();

        [allPrimaryKeys, allForeignKeys, allIndexKeys, allUniqueKeys] = await Promise.all([
            databaseKeysUtil.getAllPrimaryKeys(tableNames),
            databaseKeysUtil.getAllForeignKeys(tableNames),
            databaseKeysUtil.getAllIndexKeys(tableNames),
            databaseKeysUtil.getAllUniqueKeys(tableNames),
        ]);
    });

    afterAll(async () => {
        await app.close();
    });

    test(`Primary Keys`, () => {
        // Arrange
        for (const tableName of tableNames) {
            const primaryKey = allPrimaryKeys[tableName];
            const primaryColumnsMetadata = databaseKeysUtil.getPrimaryColumnsMetadata(tableName);

            // Act
            const primaryKeyName = new DatabaseNamingStrategy().primaryKeyName(
                tableName,
                primaryColumnsMetadata.map((primaryColumnMetadata) => primaryColumnMetadata.databaseName),
            );

            // Assert
            expect(primaryKeyName).toBe(primaryKey);
        }
    });

    test(`Foreign Keys`, () => {
        // Arrange
        for (const tableName of tableNames) {
            const foreignKeysNames = allForeignKeys[tableName];
            const foreignKeysMetadata = databaseKeysUtil.getForeignKeysMetadata(tableName);

            foreignKeysMetadata.forEach((foreignKeyMetadata) => {
                // Act
                const foreignKeyName = new DatabaseNamingStrategy().foreignKeyName(
                    tableName,
                    foreignKeyMetadata.columnNames,
                    foreignKeyMetadata.referencedTablePath,
                    foreignKeyMetadata.referencedColumnNames,
                );

                // Assert
                expect(foreignKeysNames).toContain(foreignKeyName);
            });
        }
    });

    test(`Index Keys`, () => {
        // Arrange
        for (const tableName of tableNames) {
            const indexKeysNames = allIndexKeys[tableName];
            const indicesMetadata = databaseKeysUtil.getIndexMetadata(tableName);

            indicesMetadata.forEach((indexMetadata) => {
                // Act
                const indexName = new DatabaseNamingStrategy().indexName(
                    tableName,
                    indexMetadata.columns.map((column) => column.databaseName),
                    indexMetadata.where,
                );

                // Assert
                expect(indexKeysNames).toContain(indexName);
            });
        }
    });

    test(`Unique Keys`, () => {
        // Arrange
        for (const tableName of tableNames) {
            const uniqueKeysNames = allUniqueKeys[tableName];
            const uniqueMetadata = databaseKeysUtil.getUniqueMetadata(tableName);

            uniqueMetadata.forEach(({ columns }) => {
                // Act
                const uniqueKeyName = new DatabaseNamingStrategy().uniqueConstraintName(
                    tableName,
                    columns.map((column) => column.databaseName),
                );

                // Assert
                expect(uniqueKeysNames).toContain(uniqueKeyName);
            });
        }
    });
});
