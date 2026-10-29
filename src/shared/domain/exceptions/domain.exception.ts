/**
 * Excepciones de dominio: son independientes de HTTP y de cualquier framework.
 * La capa de infraestructura (filtro de excepciones) las traduce a respuestas HTTP.
 */
export abstract class DomainException extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

/** La entidad solicitada no existe. → 404 */
export class EntityNotFoundException extends DomainException {
  constructor(entity: string, id?: string) {
    super(id ? `${entity} con id "${id}" no encontrado` : `${entity} no encontrado`);
  }
}

/** Conflicto de estado/unicidad (p. ej. horario ocupado, email duplicado). → 409 */
export class ConflictException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

/** Invariante de dominio violada / datos inválidos. → 422 */
export class DomainValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}

/** Credenciales o autorización inválidas. → 401 */
export class UnauthorizedDomainException extends DomainException {
  constructor(message = 'No autorizado') {
    super(message);
  }
}
