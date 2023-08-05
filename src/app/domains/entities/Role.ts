import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/app/domains/entities/User';
import { RolePermission } from '@/app/domains/DTOs/RolePermission';

@Entity('Role')
@Index(['name'])
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'jsonb', nullable: false })
    permission: RolePermission;

    @OneToMany(() => User, (user) => user.role, { eager: false, cascade: false })
    users: User[];
}
