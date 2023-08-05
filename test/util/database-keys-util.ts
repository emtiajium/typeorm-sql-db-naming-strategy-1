import { DataSource } from 'typeorm';
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata';
import { ForeignKeyMetadata } from 'typeorm/metadata/ForeignKeyMetadata';
import { IndexMetadata } from 'typeorm/metadata/IndexMetadata';
import { UniqueMetadata } from 'typeorm/metadata/UniqueMetadata';

export class DatabaseKeysUtil {
    constructor(private readonly dataSource: DataSource) {}

    getTableNames(): string[] {
        return this.dataSource.entityMetadatas.map((metadata) => metadata.tableName);
    }

    getPrimaryColumnsMetadata(tableName: string): ColumnMetadata[] {
        const { primaryColumns } = this.dataSource.entityMetadatas.find((metadata) => metadata.tableName === tableName);
        return primaryColumns;
    }

    getForeignKeysMetadata(tableName: string): ForeignKeyMetadata[] {
        const { foreignKeys } = this.dataSource.entityMetadatas.find((metadata) => metadata.tableName === tableName);
        return foreignKeys;
    }

    getIndexMetadata(tableName: string): IndexMetadata[] {
        const { indices } = this.dataSource.entityMetadatas.find((metadata) => metadata.tableName === tableName);
        return indices;
    }

    getUniqueMetadata(tableName: string): UniqueMetadata[] {
        const { uniques } = this.dataSource.entityMetadatas.find((metadata) => metadata.tableName === tableName);
        return uniques;
    }

    private getConstraints(
        tableName: string,
        constraintType: 'PRIMARY KEY' | 'FOREIGN KEY' | 'UNIQUE',
    ): Promise<{ constraintName: string }[]> {
        return this.dataSource.query(
            `
                SELECT DISTINCT (tc.constraint_name) AS "constraintName"
                FROM information_schema.key_column_usage kcu
                         INNER JOIN information_schema.table_constraints tc
                                    ON kcu.table_name = tc.table_name
                                        AND kcu.table_name = $1
                                        AND tc.table_name = $1
                                        AND kcu.constraint_name = tc.constraint_name
                                        AND tc.constraint_type = $2;
            `,
            [tableName, constraintType],
        );
    }

    async getPrimaryKeyWithinTable(tableName: string): Promise<string> {
        const queryResult = await this.getConstraints(tableName, 'PRIMARY KEY');
        return queryResult.map(({ constraintName }) => constraintName)[0];
    }

    async getAllPrimaryKeys(tableNames: string[]): Promise<Record<string, string>> {
        const responseMap: Record<string, string> = {};

        await Promise.all(
            tableNames.map(async (tableName) => {
                responseMap[tableName] = await this.getPrimaryKeyWithinTable(tableName);
            }),
        );

        return responseMap;
    }

    async getForeignKeysWithinTable(tableName: string): Promise<string[]> {
        const queryResult = await this.getConstraints(tableName, 'FOREIGN KEY');
        return queryResult.map(({ constraintName }) => constraintName);
    }

    async getAllForeignKeys(tableNames: string[]): Promise<Record<string, string[]>> {
        const responseMap: Record<string, string[]> = {};

        await Promise.all(
            tableNames.map(async (tableName) => {
                responseMap[tableName] = await this.getForeignKeysWithinTable(tableName);
            }),
        );

        return responseMap;
    }

    async getUniqueKeysWithinTable(tableName: string): Promise<string[]> {
        const queryResult = await this.getConstraints(tableName, 'UNIQUE');
        return queryResult.map(({ constraintName }) => constraintName);
    }

    async getAllUniqueKeys(tableNames: string[]): Promise<Record<string, string[]>> {
        const responseMap: Record<string, string[]> = {};

        await Promise.all(
            tableNames.map(async (tableName) => {
                responseMap[tableName] = await this.getUniqueKeysWithinTable(tableName);
            }),
        );

        return responseMap;
    }

    async getIndexKeysWithinTable(tableName: string): Promise<string[]> {
        const queryResult: { indexName: string }[] = await this.dataSource.query(
            `
                SELECT indexname AS "indexName"
                FROM pg_catalog.pg_indexes
                WHERE (indexdef ILIKE '%CREATE INDEX%'
                    OR indexdef ILIKE '%CREATE UNIQUE INDEX%')
                  AND tablename = $1;
            `,
            [tableName],
        );

        return queryResult.map(({ indexName }) => indexName);
    }

    async getAllIndexKeys(tableNames: string[]): Promise<Record<string, string[]>> {
        const responseMap: Record<string, string[]> = {};

        await Promise.all(
            tableNames.map(async (tableName) => {
                responseMap[tableName] = await this.getIndexKeysWithinTable(tableName);
            }),
        );

        return responseMap;
    }
}
