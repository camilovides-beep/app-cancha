import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SETTING_REPOSITORY } from './domain/setting.repository';
import { SettingsService } from './application/settings.service';
import { SettingsController } from './infrastructure/settings.controller';
import { SettingOrmEntity } from './infrastructure/persistence/setting.orm-entity';
import { TypeOrmSettingRepository } from './infrastructure/persistence/setting.repository.typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SettingOrmEntity])],
  controllers: [SettingsController],
  providers: [SettingsService, { provide: SETTING_REPOSITORY, useClass: TypeOrmSettingRepository }],
  exports: [SettingsService],
})
export class SettingsModule {}
