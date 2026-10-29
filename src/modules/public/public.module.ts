import { Module } from '@nestjs/common';
import { CourtsModule } from '../courts/courts.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { SettingsModule } from '../settings/settings.module';
import { PublicController } from './public.controller';

@Module({
  imports: [SettingsModule, CourtsModule, ReservationsModule],
  controllers: [PublicController],
})
export class PublicModule {}
