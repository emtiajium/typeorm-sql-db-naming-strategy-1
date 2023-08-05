import { DatabaseNamingStrategy, identifierLengthLimit } from '@/common/persistence/DatabaseNamingStrategy';

describe('DatabaseNamingStrategy', () => {
    describe(`Primary Keys`, () => {
        test('PK I', () => {
            // Arrange
            const tableName = 'CommonTable';
            const columnName = 'commonColumn';

            // Act
            const primaryKeyName = new DatabaseNamingStrategy().primaryKeyName(tableName, [columnName]);

            // Assert
            expect(primaryKeyName).toBe(`PK_${tableName}_${columnName}`);
        });

        test('PK II', () => {
            // Arrange
            const tableName = 'CommonTable';
            const columnName = 'commonColumn1';
            const secondColumnName = 'commonColumn2';

            // Act
            const primaryKeyName = new DatabaseNamingStrategy().primaryKeyName(tableName, [
                columnName,
                secondColumnName,
            ]);

            // Assert
            expect(primaryKeyName).toBe(`PK_${tableName}_${columnName}_${secondColumnName}`);
        });
    });

    describe(`Foreign Keys`, () => {
        test('FK I', () => {
            // Arrange
            const referencingTableName = 'CommonTable';
            const referencingColumnName = 'commonColumn';
            const referencedTableName = 'SecondTable';
            const referencedColumnName = 'secondColumn';

            // Act
            const foreignKeyName = new DatabaseNamingStrategy().foreignKeyName(
                referencingTableName,
                [referencingColumnName],
                referencedTableName,
                [referencedColumnName],
            );

            // Assert
            expect(foreignKeyName).toBe(
                `FK_${referencingTableName}_${referencingColumnName}_${referencedTableName}_${referencedColumnName}`,
            );
        });

        test('FK II', () => {
            // Arrange
            const referencingTableName = 'CommonTable';
            const referencingColumnNames = ['commonColumn1', 'commonColumn2'];
            const referencedTableName = 'SecondTable';
            const referencedColumnNames = ['secondTableColumn1', 'secondTableColumn2'];

            // Act
            const foreignKeyName = new DatabaseNamingStrategy().foreignKeyName(
                referencingTableName,
                referencingColumnNames,
                referencedTableName,
                referencedColumnNames,
            );

            // Assert
            expect(foreignKeyName).toBe(
                `FK_${referencingTableName}_${referencingColumnNames[0]}_${referencedTableName}_${referencedColumnNames[0]}_${referencingTableName}_${referencingColumnNames[1]}_${referencedTableName}_${referencedColumnNames[1]}`.slice(
                    0,
                    identifierLengthLimit,
                ),
            );
        });
    });

    describe(`Index Keys`, () => {
        test('IDX I', () => {
            // Arrange
            const tableName = 'CommonTable';
            const columnName = 'commonColumn';

            // Act
            const indexName = new DatabaseNamingStrategy().indexName(tableName, [columnName]);

            // Assert
            expect(indexName).toBe(`IDX_${tableName}_${columnName}`);
        });

        test('IDX II', () => {
            // Arrange
            const tableName = 'CommonTable';
            const columnNames = ['commonColumn1', 'commonColumn2'];

            // Act
            const indexName = new DatabaseNamingStrategy().indexName(tableName, columnNames);

            // Assert
            expect(indexName).toBe(`IDX_${tableName}_${columnNames[0]}_${columnNames[1]}`);
        });

        test('IDX III: WHERE Clause I', () => {
            // Arrange
            const tableName = 'CommonTable';
            const columnName = 'commonColumn';
            const whereClause = `"deletedAt" IS NULL`;

            // Act
            const indexName = new DatabaseNamingStrategy().indexName(tableName, [columnName], whereClause);

            // Assert
            expect(indexName).toBe(`IDX_${tableName}_${columnName}_WHERE_deletedAt_IS_NULL`);
        });

        test('IDX IV: WHERE Clause II', () => {
            // Arrange
            const tableName = 'CommonTable';
            const columnName = 'commonColumn';
            const whereClause = `price > 50`;

            // Act
            const indexName = new DatabaseNamingStrategy().indexName(tableName, [columnName], whereClause);

            // Assert
            expect(indexName).toBe(`IDX_${tableName}_${columnName}_WHERE_92bcc723bd09769c62708801a2`);
        });
    });

    describe(`Unique Keys`, () => {
        test('UQ I', () => {
            // Arrange
            const tableName = 'CommonTable';
            const columnName = 'commonColumn';

            // Act
            const uniqueConstraintName = new DatabaseNamingStrategy().uniqueConstraintName(tableName, [columnName]);

            // Assert
            expect(uniqueConstraintName).toBe(`UQ_${tableName}_${columnName}`);
        });

        test('UQ II', () => {
            // Arrange
            const tableName = 'CommonTable';
            const columnNames = ['commonColumn1', 'commonColumn2'];

            // Act
            const uniqueConstraintName = new DatabaseNamingStrategy().uniqueConstraintName(tableName, columnNames);

            // Assert
            expect(uniqueConstraintName).toBe(`UQ_${tableName}_${columnNames[0]}_${columnNames[1]}`);
        });
    });
});
