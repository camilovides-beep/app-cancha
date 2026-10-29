import { ValueTransformer } from 'typeorm';

/**
 * PostgreSQL devuelve los NUMERIC como string para no perder precisión.
 * Este transformer los convierte a number al leer (null se preserva).
 */
export const numericTransformer: ValueTransformer = {
  to: (value: number | null): number | null => value,
  from: (value: string | null): number | null => (value === null ? null : parseFloat(value)),
};
