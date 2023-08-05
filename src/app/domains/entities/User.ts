import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@/app/domains/entities/Role';

@Entity('User')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    email: string;

    @ManyToOne(() => Role, (role) => role.users, { eager: false, nullable: false })
    @JoinColumn({ name: 'roleId' })
    role: Role;
}
