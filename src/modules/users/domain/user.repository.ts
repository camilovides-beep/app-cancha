import { User } from './user';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

/** Puerto del repositorio de usuarios/clientes. */
export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByDocument(documentNumber: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  /** Elimina el usuario anonimizando sus reservas (mantiene historial). */
  delete(id: string): Promise<void>;
  count(): Promise<number>;
}
