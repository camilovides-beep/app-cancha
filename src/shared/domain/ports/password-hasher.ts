/** Token de inyección del puerto de hashing de contraseñas. */
export const PASSWORD_HASHER = Symbol('PASSWORD_HASHER');

/**
 * Puerto de hashing de contraseñas. Abstrae el algoritmo concreto (bcrypt),
 * lo que permite sustituirlo o simularlo en pruebas (SOLID: DIP).
 */
export interface PasswordHasher {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
