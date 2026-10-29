import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PASSWORD_HASHER, PasswordHasher } from '../../../shared/domain/ports/password-hasher';
import { UnauthorizedDomainException } from '../../../shared/domain/exceptions/domain.exception';
import { ADMIN_REPOSITORY, AdminRepository } from '../domain/admin.repository';
import { Admin } from '../domain/admin';
import { LoginDto } from './dto/login.dto';

export interface AuthenticatedAdmin {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResult {
  accessToken: string;
  admin: AuthenticatedAdmin;
}

/**
 * Caso de uso de autenticación de administradores.
 * Depende solo de puertos (repositorio, hasher) y del firmador de JWT.
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(ADMIN_REPOSITORY) private readonly admins: AdminRepository,
    @Inject(PASSWORD_HASHER) private readonly hasher: PasswordHasher,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const admin = await this.admins.findByUsernameOrEmail(dto.username);
    if (!admin || !admin.isActive()) {
      throw new UnauthorizedDomainException('Usuario o contraseña incorrectos');
    }

    const valid = await this.hasher.compare(dto.password, admin.passwordHash);
    if (!valid) {
      throw new UnauthorizedDomainException('Usuario o contraseña incorrectos');
    }

    await this.admins.updateLastLogin(admin.id);
    return this.buildResult(admin);
  }

  async findAuthenticated(id: number): Promise<AuthenticatedAdmin> {
    const admin = await this.admins.findById(id);
    if (!admin || !admin.isActive()) {
      throw new UnauthorizedDomainException('Sesión inválida');
    }
    return this.toView(admin);
  }

  private buildResult(admin: Admin): LoginResult {
    const payload = { sub: admin.id, username: admin.username, role: admin.role };
    return {
      accessToken: this.jwt.sign(payload),
      admin: this.toView(admin),
    };
  }

  private toView(admin: Admin): AuthenticatedAdmin {
    return {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };
  }
}
