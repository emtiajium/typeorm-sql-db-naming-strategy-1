import { Column, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '@/app/domains/entities/Role';
import { Cohort } from '@/app/domains/entities/Cohort';

@Entity('User')
@Index(['reference'], {
    where: `"deletedAt" IS NOT NULL`,
    unique: true,
})
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', nullable: false })
    reference: string;

    @DeleteDateColumn({ type: 'timestamp with time zone', nullable: true })
    deletedAt: Date;

    @ManyToOne(() => Cohort, (cohort) => cohort.users, { eager: false, nullable: false })
    @JoinColumn({ name: 'cohortId' })
    cohort: Cohort;

    @ManyToOne(() => Role, (role) => role.users, { eager: false, nullable: false })
    @JoinColumn({ name: 'roleId' })
    role: Role;
}
