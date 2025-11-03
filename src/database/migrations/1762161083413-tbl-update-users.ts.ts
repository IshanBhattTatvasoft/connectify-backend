import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUsers1762161083413 implements MigrationInterface {
    name = 'UpdateUsers1762161083413';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE connectify_schema.users
            ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'local';
        `);

        await queryRunner.query(`
            ALTER TABLE connectify_schema.users
            ADD COLUMN provider_id VARCHAR(255);
        `);

        await queryRunner.query(`
            ALTER TABLE connectify_schema.users
            ALTER COLUMN password DROP NOT NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE connectify_schema.users
            ALTER COLUMN password SET NOT NULL;
        `);

        await queryRunner.query(`
            ALTER TABLE connectify_schema.users
            DROP COLUMN provider_id;
        `);

        await queryRunner.query(`
            ALTER TABLE connectify_schema.users
            DROP COLUMN auth_provider;
        `);
    }
}