import { DataSource, Repository } from 'typeorm';
import { User } from '@/app/domains/entities/User';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }
}
