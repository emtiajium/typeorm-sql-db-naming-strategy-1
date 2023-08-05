import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import DatabaseModule from '@/common/persistence/DatabaseModule';
import { AppController } from '@/app/controllers/AppController';
import { AppService } from '@/app/services/AppService';
import { UserRepository } from '@/app/repositories/UserRepository';
import { RoleRepository } from '@/app/repositories/RoleRepository';

const repositories = [UserRepository, RoleRepository];

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: '.env' }), DatabaseModule],
    controllers: [AppController],
    providers: [...repositories, AppService],
})
export class AppModule {}
