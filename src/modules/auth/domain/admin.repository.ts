import { Admin } from './admin';

/** Token de inyección para el puerto del repositorio de administradores. */
export const ADMIN_REPOSITORY = Symbol('ADMIN_REPOSITORY');

/**
 * Puerto (driven) del repositorio de administradores.
 * La aplicación depende de esta abstracción, no de TypeORM.
 */
export interface AdminRepository {
  findByUsernameOrEmail(identifier: string): Promise<Admin | null>;
  findById(id: number): Promise<Admin | null>;
  updateLastLogin(id: number): Promise<void>;
}
