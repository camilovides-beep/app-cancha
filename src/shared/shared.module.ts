import { Global, Module } from '@nestjs/common';
import { PASSWORD_HASHER } from './domain/ports/password-hasher';
import { BcryptPasswordHasher } from './infrastructure/security/bcrypt-password-hasher';

/**
 * Proveedores transversales disponibles para todos los módulos (DIP).
 * Al ser @Global, no hace falta reimportarlo en cada módulo.
 */
@Global()
@Module({
  providers: [{ provide: PASSWORD_HASHER, useClass: BcryptPasswordHasher }],
  exports: [PASSWORD_HASHER],
})
export class SharedModule {}
