import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Posts } from 'src/modules/posts/entity/posts.entity';
import { Users } from 'src/modules/users/entity/users.entity';

@Entity({ name: 'comments', schema: 'connectify_schema' })
export class Comments extends BaseEntity {
  @Column()
  post_id: number;

  @ManyToOne(() => Posts, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @Column()
  user_id: number;

  @ManyToOne(() => Users, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ nullable: true })
  parent_comment_id: number;

  @ManyToOne(() => Comments, { nullable: true })
  @JoinColumn({ name: 'parent_comment_id' })
  parentComment: Comments;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time_stamp: Date;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;
}
