import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingRepository } from '../../domain/setting.repository';
import { SettingOrmEntity } from './setting.orm-entity';

@Injectable()
export class TypeOrmSettingRepository implements SettingRepository {
  constructor(
    @InjectRepository(SettingOrmEntity)
    private readonly repo: Repository<SettingOrmEntity>,
  ) {}

  async getAll(): Promise<Record<string, string>> {
    const rows = await this.repo.find();
    return rows.reduce<Record<string, string>>((acc, row) => {
      acc[row.key] = row.value ?? '';
      return acc;
    }, {});
  }

  async get(key: string): Promise<string | null> {
    const row = await this.repo.findOne({ where: { key } });
    return row ? row.value : null;
  }

  async setMany(values: Record<string, string>): Promise<void> {
    for (const [key, value] of Object.entries(values)) {
      // upsert por clave única
      await this.repo.upsert({ key, value }, ['key']);
    }
  }
}
