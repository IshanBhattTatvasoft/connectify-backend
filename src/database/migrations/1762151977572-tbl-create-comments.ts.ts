import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateComments1762151977572 implements MigrationInterface {
    name = 'CreateComments1762151977572';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE connectify_schema.comments (
                id SERIAL PRIMARY KEY,
                post_id INT NOT NULL,
                user_id INT NOT NULL,
                parent_comment_id INT,
                content TEXT NOT NULL,
                upvotes INT DEFAULT 0,
                downvotes INT DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_comments_post FOREIGN KEY (post_id)
                    REFERENCES connectify_schema.posts (id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_comments_user FOREIGN KEY (user_id)
                    REFERENCES connectify_schema.users (id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_comments_parent FOREIGN KEY (parent_comment_id)
                    REFERENCES connectify_schema.comments (id)
                    ON DELETE CASCADE
            );`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE connectify_schema.comments`);
    }

}
