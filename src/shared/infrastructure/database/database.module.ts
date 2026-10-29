import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildDataSourceOptions } from './data-source';

/**
 * Conexión global a la base de datos. La configuración procede del entorno,
 * por lo que apuntar a un Postgres local (docker) o remoto es solo cambiar .env.
 */
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...buildDataSourceOptions(),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
