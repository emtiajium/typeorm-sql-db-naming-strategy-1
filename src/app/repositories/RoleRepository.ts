import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Role } from '@/app/domains/entities/Role';

@Injectable()
export class RoleRepository extends Repository<Role> {
    constructor(private dataSource: DataSource) {
        super(Role, dataSource.createEntityManager());
    }
}
