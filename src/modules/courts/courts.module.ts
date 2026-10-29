import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { COURT_REPOSITORY } from './domain/court.repository';
import { CourtsService } from './application/courts.service';
import { CourtsController } from './infrastructure/courts.controller';
import { CourtOrmEntity } from './infrastructure/persistence/court.orm-entity';
import { TypeOrmCourtRepository } from './infrastructure/persistence/court.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CourtOrmEntity])],
  controllers: [CourtsController],
  providers: [CourtsService, { provide: COURT_REPOSITORY, useClass: TypeOrmCourtRepository }],
  exports: [CourtsService],
})
export class CourtsModule {}
