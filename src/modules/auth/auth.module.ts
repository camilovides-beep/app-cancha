import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { loadEnv } from '../../shared/config/env';
import { ADMIN_REPOSITORY } from './domain/admin.repository';
import { AuthService } from './application/auth.service';
import { AuthController } from './infrastructure/auth.controller';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { AdminOrmEntity } from './infrastructure/persistence/admin.orm-entity';
import { TypeOrmAdminRepository } from './infrastructure/persistence/admin.repository.typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const env = loadEnv();
        // expiresIn admite formatos como '8h' o '7d'; el tipo de 'ms' exige cast.
        return { secret: env.jwt.secret, signOptions: { expiresIn: env.jwt.expiresIn as `${number}h` } };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: ADMIN_REPOSITORY, useClass: TypeOrmAdminRepository },
  ],
})
export class AuthModule {}
