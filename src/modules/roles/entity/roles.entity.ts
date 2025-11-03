import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity({ name: 'roles', schema: 'connectify_schema' })
export class Roles extends BaseEntity {
  @Column({ length: 50, unique: true })
  name: string;

  @Column({ length: 50, unique: true })
  code: string;
}
