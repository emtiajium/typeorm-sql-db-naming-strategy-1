import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleType } from '@/app/domains/enums/RoleType';
import { User } from '@/app/domains/entities/User';

@Entity('Role')
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false, default: RoleType.CUSTOMER })
    type: string;

    @OneToMany(() => User, (user) => user.role, { eager: false, cascade: false })
    users: User[];
}
