import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  ConflictException,
  EntityNotFoundException,
} from '../../../shared/domain/exceptions/domain.exception';
import {
  DOCUMENT_LOOKUP,
  DocumentLookupPort,
} from '../../../shared/domain/ports/document-lookup.port';
import {
  BASE_PRICE_BY_CATEGORY,
  normalizeCategory,
  UserCategory,
} from '../../../shared/domain/value-objects/user-category';
import { User } from '../domain/user';
import { USER_REPOSITORY, UserRepository } from '../domain/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface CategoryResolution {
  found: boolean;
  category: UserCategory;
  price: number;
  user: User | null;
}

/** Casos de uso de gestión de clientes. */
@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly repo: UserRepository,
    @Inject(DOCUMENT_LOOKUP) private readonly documentLookup: DocumentLookupPort,
  ) {}

  findAll(): Promise<User[]> {
    return this.repo.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) throw new EntityNotFoundException('Usuario', id);
    return user;
  }

  findByDocument(documentNumber: string): Promise<User | null> {
    return this.repo.findByDocument(documentNumber);
  }

  async create(dto: CreateUserDto): Promise<User> {
    if (await this.repo.findByEmail(dto.email)) {
      throw new ConflictException(`Ya existe un usuario con el correo ${dto.email}`);
    }
    const user = new User({
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      category: normalizeCategory(dto.category),
      documentNumber: dto.documentNumber ?? null,
      documentType: dto.documentType ?? 'CC',
      status: dto.status ?? 'active',
    });
    return this.repo.create(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (dto.email && dto.email !== user.email) {
      const existing = await this.repo.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException(`Ya existe un usuario con el correo ${dto.email}`);
      }
      user.email = dto.email;
    }
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.category !== undefined) user.category = normalizeCategory(dto.category);
    if (dto.documentNumber !== undefined) user.documentNumber = dto.documentNumber;
    if (dto.documentType !== undefined) user.documentType = dto.documentType;
    if (dto.status !== undefined) user.status = dto.status;
    user.updatedAt = new Date();
    return this.repo.update(user);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repo.delete(id);
  }

  /**
   * Resuelve la categoría (y por tanto la tarifa base) de una persona por
   * documento. Si existe localmente con categoría != D se usa; si no, se
   * consulta el puerto de afiliación.
   */
  async resolveCategoryByDocument(documentNumber: string): Promise<CategoryResolution> {
    const user = await this.repo.findByDocument(documentNumber);
    if (user && user.category !== UserCategory.D) {
      return {
        found: true,
        category: user.category,
        price: BASE_PRICE_BY_CATEGORY[user.category],
        user,
      };
    }

    const lookup = await this.documentLookup.lookup(documentNumber);
    return {
      found: lookup.found,
      category: lookup.category,
      price: BASE_PRICE_BY_CATEGORY[lookup.category],
      user: user ?? null,
    };
  }
}
