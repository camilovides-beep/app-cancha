import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { normalizeCategory } from '../../../../shared/domain/value-objects/user-category';
import { User } from '../../domain/user';
import { UserRepository } from '../../domain/user.repository';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity) private readonly repo: Repository<UserOrmEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    const rows = await this.repo.find({ order: { createdAt: 'DESC' } });
    return rows.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? this.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { email } });
    return row ? this.toDomain(row) : null;
  }

  async findByDocument(documentNumber: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { documentNumber } });
    return row ? this.toDomain(row) : null;
  }

  async create(user: User): Promise<User> {
    const saved = await this.repo.save(this.toOrm(user));
    return this.toDomain(saved);
  }

  async update(user: User): Promise<User> {
    await this.repo.update(user.id, this.toOrm(user));
    const saved = await this.repo.findOneOrFail({ where: { id: user.id } });
    return this.toDomain(saved);
  }

  /**
   * Elimina el usuario tras anonimizar sus reservas, para no violar la FK
   * reservations.user_id y conservar el historial. Todo en una transacción.
   */
  async delete(id: string): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.query(
        `UPDATE reservations
         SET user_id = NULL, user_name = '[Usuario eliminado]',
             user_phone = NULL, user_email = NULL, user_document = NULL
         WHERE user_id = $1`,
        [id],
      );
      await manager.delete(UserOrmEntity, id);
    });
  }

  count(): Promise<number> {
    return this.repo.count();
  }

  private toDomain(r: UserOrmEntity): User {
    return new User({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone,
      role: r.role,
      category: normalizeCategory(r.category),
      documentNumber: r.documentNumber,
      documentType: r.documentType,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }

  private toOrm(u: User): Partial<UserOrmEntity> {
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      category: u.category,
      documentNumber: u.documentNumber,
      documentType: u.documentType,
      status: u.status,
    };
  }
}
