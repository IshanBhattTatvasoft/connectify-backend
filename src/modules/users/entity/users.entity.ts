import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Roles } from 'src/modules/roles/entity/roles.entity';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Posts } from 'src/modules/posts/entity/posts.entity';
import { Comments } from 'src/modules/comments/entity/comments.entity';

@Entity({ name: 'users', schema: 'connectify_schema' })
export class Users extends BaseEntity {
  @Column({ length: 100, unique: true })
  username: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ nullable: true})
  password: string;

  @Column({ length: 15, nullable: true })
  mobile_no: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  role_id: number;

  @Column({ nullable: true })
  provider_id: string;

  @ManyToOne(() => Roles, { nullable: true })
  @JoinColumn({ name: 'role_id' })
  role: Roles;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];

  @OneToMany(() => Comments, (comment) => comment.user)
  comments: Comments[];
}
