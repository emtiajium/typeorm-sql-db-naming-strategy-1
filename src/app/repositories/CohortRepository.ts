import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Cohort } from '@/app/domains/entities/Cohort';

@Injectable()
export class CohortRepository extends Repository<Cohort> {
    constructor(private dataSource: DataSource) {
        super(Cohort, dataSource.createEntityManager());
    }
}
