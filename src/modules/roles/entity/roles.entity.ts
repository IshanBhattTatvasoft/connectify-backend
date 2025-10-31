import { Entity, Column } from "typeorm";
import { BaseEntity } from "../../../database/entities/base.entity";

@Entity({name: 'roles'})
export class Roles extends BaseEntity {
    @Column({length: 50})
    name: string;

    @Column({ length: 300, nullable: true })
    description: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ default: false })
    is_system_defined: boolean;
}