import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY } from './domain/user.repository';
import { UsersService } from './application/users.service';
import { UsersController } from './infrastructure/users.controller';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/user.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [UsersService, { provide: USER_REPOSITORY, useClass: TypeOrmUserRepository }],
  exports: [UsersService],
})
export class UsersModule {}
