import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Users } from 'src/modules/users/entity/users.entity';
import { Comments } from 'src/modules/comments/entity/comments.entity';

@Entity({ name: 'posts', schema: 'connectify_schema' })
export class Posts extends BaseEntity {
  @Column()
  user_id: number;

  @ManyToOne(() => Users, (user) => user.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ length: 20 })
  type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time_stamp: Date;

  @Column({ default: 0 })
  upvotes: number;

  @Column({ default: 0 })
  downvotes: number;

  @OneToMany(() => Comments, (comment) => comment.post)
  comments: Comments[];
}
