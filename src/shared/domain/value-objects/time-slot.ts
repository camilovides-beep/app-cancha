import { DomainValidationException } from '../exceptions/domain.exception';

/**
 * Franja horaria del día. Determina la tarifa aplicable.
 * Regla de negocio heredada del sistema original:
 *   Día    → 06:00–11:59
 *   Tarde  → 12:00–17:59
 *   Noche  → 18:00–05:59
 */
export enum TimeSlot {
  DAY = 'day',
  AFTERNOON = 'afternoon',
  NIGHT = 'night',
}

export const TIME_SLOT_LABEL: Record<TimeSlot, string> = {
  [TimeSlot.DAY]: 'Día',
  [TimeSlot.AFTERNOON]: 'Tarde',
  [TimeSlot.NIGHT]: 'Noche',
};

/** Deriva la franja a partir de la hora de inicio (0–23). */
export function timeSlotFromHour(hour: number): TimeSlot {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
    throw new DomainValidationException(`Hora inválida: ${hour}`);
  }
  if (hour >= 6 && hour < 12) return TimeSlot.DAY;
  if (hour >= 12 && hour < 18) return TimeSlot.AFTERNOON;
  return TimeSlot.NIGHT;
}
