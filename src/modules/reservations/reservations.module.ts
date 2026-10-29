import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourtsModule } from '../courts/courts.module';
import { UsersModule } from '../users/users.module';
import { RESERVATION_REPOSITORY } from './domain/reservation.repository';
import { ReservationsService } from './application/reservations.service';
import { ReservationsController } from './infrastructure/reservations.controller';
import { EpaycoWebhookController } from './infrastructure/epayco-webhook.controller';
import { ReservationOrmEntity } from './infrastructure/persistence/reservation.orm-entity';
import { TypeOrmReservationRepository } from './infrastructure/persistence/reservation.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ReservationOrmEntity]), CourtsModule, UsersModule],
  controllers: [ReservationsController, EpaycoWebhookController],
  providers: [
    ReservationsService,
    { provide: RESERVATION_REPOSITORY, useClass: TypeOrmReservationRepository },
  ],
  exports: [ReservationsService],
})
export class ReservationsModule {}
