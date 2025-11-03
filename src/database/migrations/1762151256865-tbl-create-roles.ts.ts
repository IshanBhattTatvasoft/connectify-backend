import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoles1762151256865 implements MigrationInterface {
    name = 'CreateRoles1762151256865';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
          `CREATE TABLE IF NOT EXISTS connectify_schema.roles (
            id SERIAL NOT NULL,
            name VARCHAR(20) NOT NULL,
            code VARCHAR(50) UNIQUE NOT NULL,
            is_active bool DEFAULT true NOT NULL,
            created_date timestamp(3) without time zone NOT NULL,
            created_by VARCHAR(50),
            modified_date timestamp(3) without time zone,
            modified_by VARCHAR(50),
            CONSTRAINT roles_pkey PRIMARY KEY (id));`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE connectify_schema.roles');
    }

}
