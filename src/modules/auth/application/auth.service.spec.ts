import { JwtService } from '@nestjs/jwt';
import { UnauthorizedDomainException } from '../../../shared/domain/exceptions/domain.exception';
import { PasswordHasher } from '../../../shared/domain/ports/password-hasher';
import { Admin } from '../domain/admin';
import { AdminRepository } from '../domain/admin.repository';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const admin = new Admin(1, 'admin', 'admin@comfasucre.com', 'Admin', 'admin', true, 'hash');

  const repo: jest.Mocked<AdminRepository> = {
    findByUsernameOrEmail: jest.fn(),
    findById: jest.fn(),
    updateLastLogin: jest.fn(),
  };
  const hasher: jest.Mocked<PasswordHasher> = {
    hash: jest.fn(),
    compare: jest.fn(),
  };
  const jwt = { sign: jest.fn().mockReturnValue('signed.jwt.token') } as unknown as JwtService;

  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(repo, hasher, jwt);
  });

  it('inicia sesión con credenciales válidas y devuelve token', async () => {
    repo.findByUsernameOrEmail.mockResolvedValue(admin);
    hasher.compare.mockResolvedValue(true);

    const result = await service.login({ username: 'admin', password: 'secret' });

    expect(result.accessToken).toBe('signed.jwt.token');
    expect(result.admin.username).toBe('admin');
    expect(repo.updateLastLogin).toHaveBeenCalledWith(1);
  });

  it('rechaza cuando el usuario no existe', async () => {
    repo.findByUsernameOrEmail.mockResolvedValue(null);
    await expect(service.login({ username: 'x', password: 'y' })).rejects.toBeInstanceOf(
      UnauthorizedDomainException,
    );
  });

  it('rechaza cuando la contraseña es incorrecta', async () => {
    repo.findByUsernameOrEmail.mockResolvedValue(admin);
    hasher.compare.mockResolvedValue(false);
    await expect(service.login({ username: 'admin', password: 'bad' })).rejects.toBeInstanceOf(
      UnauthorizedDomainException,
    );
  });
});
