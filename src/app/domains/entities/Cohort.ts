import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/app/domains/entities/User';

@Entity('Cohort')
export class Cohort {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false, unique: true })
    name: string;

    @OneToMany(() => User, (user) => user.role, { eager: false, cascade: false })
    users: User[];
}
