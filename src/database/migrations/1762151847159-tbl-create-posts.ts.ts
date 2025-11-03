import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePosts1762151847159 implements MigrationInterface {
    name = 'CreatePosts1762151847159';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE connectify_schema.posts (
                id SERIAL PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(200) NOT NULL,
                content TEXT,
                type VARCHAR(20) NOT NULL,
                upvotes INT DEFAULT 0,
                downvotes INT DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_posts_user FOREIGN KEY (user_id)
                    REFERENCES connectify_schema.users (id)
                    ON DELETE CASCADE
                );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE connectify_scehma.posts`);
    }

}
