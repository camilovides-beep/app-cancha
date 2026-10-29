import { DomainValidationException } from '../exceptions/domain.exception';

/**
 * Categoría del usuario según su afiliación a la Caja (A, B, C o D).
 * Afecta la tarifa: A es la más económica, D la tarifa particular por defecto.
 */
export enum UserCategory {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

/** Tarifa base por categoría cuando la cancha no define tarifas específicas. */
export const BASE_PRICE_BY_CATEGORY: Record<UserCategory, number> = {
  [UserCategory.A]: 50000,
  [UserCategory.B]: 55000,
  [UserCategory.C]: 58000,
  [UserCategory.D]: 60000,
};

export function normalizeCategory(value: string | null | undefined): UserCategory {
  const upper = (value ?? 'D').toUpperCase();
  if (upper in UserCategory) {
    return UserCategory[upper as keyof typeof UserCategory];
  }
  return UserCategory.D;
}

export function assertCategory(value: string): UserCategory {
  const upper = value?.toUpperCase();
  if (!(upper in UserCategory)) {
    throw new DomainValidationException(`Categoría inválida: ${value}`);
  }
  return UserCategory[upper as keyof typeof UserCategory];
}
