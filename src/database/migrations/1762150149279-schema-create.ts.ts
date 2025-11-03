import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateConnectifySchema1762150149279 implements MigrationInterface {
    name = 'CreateConnectifySchema1762150149279';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE SCHEMA IF NOT EXISTS connectify_schema');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP SCEHMA IF EXISTS connectify_schema');
    }

}
