import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoles1762151474106 implements MigrationInterface {
    name = 'CreateRoles1762151474106';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS connectify_schema.users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                mobile_no VARCHAR(15),
                address TEXT,
                role_id INT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_users_role FOREIGN KEY (role_id)
                    REFERENCES connectify_schema.roles (id)
                    ON DELETE SET NULL
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE connectify_schema.users');
    }

}
