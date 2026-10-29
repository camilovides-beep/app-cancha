import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '../../domain/admin';
import { AdminRepository } from '../../domain/admin.repository';
import { AdminOrmEntity } from './admin.orm-entity';

/** Adaptador (driven) del repositorio de administradores sobre TypeORM. */
@Injectable()
export class TypeOrmAdminRepository implements AdminRepository {
  constructor(
    @InjectRepository(AdminOrmEntity)
    private readonly repo: Repository<AdminOrmEntity>,
  ) {}

  async findByUsernameOrEmail(identifier: string): Promise<Admin | null> {
    const row = await this.repo.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });
    return row ? this.toDomain(row) : null;
  }

  async findById(id: number): Promise<Admin | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.repo.update(id, { lastLogin: new Date() });
  }

  private toDomain(row: AdminOrmEntity): Admin {
    return new Admin(row.id, row.username, row.email, row.name, row.role, row.active, row.password);
  }
}
