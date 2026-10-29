import { Inject, Injectable } from '@nestjs/common';
import {
  BRAND_KEY_MAP,
  BrandConfig,
  DEFAULT_BRAND,
} from '../domain/brand-config';
import { SETTING_REPOSITORY, SettingRepository } from '../domain/setting.repository';
import { UpdateBrandDto } from './dto/update-brand.dto';

/** Casos de uso de configuración (marca). */
@Injectable()
export class SettingsService {
  constructor(@Inject(SETTING_REPOSITORY) private readonly repo: SettingRepository) {}

  /** Devuelve la configuración de marca combinando BD + valores por defecto. */
  async getBrand(): Promise<BrandConfig> {
    const stored = await this.repo.getAll();
    const brand = { ...DEFAULT_BRAND };
    (Object.keys(BRAND_KEY_MAP) as (keyof BrandConfig)[]).forEach((field) => {
      const value = stored[BRAND_KEY_MAP[field]];
      if (value !== undefined && value !== null && value !== '') {
        brand[field] = value;
      }
    });
    return brand;
  }

  async updateBrand(dto: UpdateBrandDto): Promise<BrandConfig> {
    const values: Record<string, string> = {};
    (Object.keys(dto) as (keyof UpdateBrandDto)[]).forEach((field) => {
      const value = dto[field];
      if (value !== undefined && field in BRAND_KEY_MAP) {
        values[BRAND_KEY_MAP[field as keyof BrandConfig]] = value;
      }
    });
    if (Object.keys(values).length > 0) {
      await this.repo.setMany(values);
    }
    return this.getBrand();
  }
}
