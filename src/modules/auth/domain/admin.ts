/**
 * Entidad de dominio Admin (usuario del panel administrativo).
 * Pura: sin dependencias de framework ni de persistencia.
 */
export class Admin {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public readonly name: string,
    public readonly role: string,
    public readonly active: boolean,
    /** Hash bcrypt de la contraseña. No se expone nunca hacia el exterior. */
    public readonly passwordHash: string,
  ) {}

  isActive(): boolean {
    return this.active;
  }
}
