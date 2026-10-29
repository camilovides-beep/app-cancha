import { DomainValidationException } from '../../../shared/domain/exceptions/domain.exception';
import { TimeSlot, timeSlotFromHour, TIME_SLOT_LABEL } from '../../../shared/domain/value-objects/time-slot';
import { UserCategory } from '../../../shared/domain/value-objects/user-category';
import { Court } from '../../courts/domain/court';

export interface PriceBreakdown {
  slot: TimeSlot;
  slotLabel: string;
  category: UserCategory;
  ratePerHour: number;
  hours: number;
  total: number;
}

/**
 * Servicio de dominio puro para el cálculo de la tarifa de una reserva.
 * Regla: franja según la hora de inicio → tarifa de la cancha por
 * categoría+franja → total = tarifa × horas.
 */
export class PricingService {
  static calculate(
    court: Court,
    category: UserCategory,
    startTime: Date,
    endTime: Date,
  ): PriceBreakdown {
    const hours = (endTime.getTime() - startTime.getTime()) / 3_600_000;
    if (hours <= 0) {
      throw new DomainValidationException('La duración de la reserva debe ser mayor a 0');
    }

    const slot = timeSlotFromHour(PricingService.bogotaHour(startTime));
    const ratePerHour = court.rateFor(category, slot);
    const total = Math.round(ratePerHour * hours);

    return {
      slot,
      slotLabel: TIME_SLOT_LABEL[slot],
      category,
      ratePerHour,
      hours,
      total,
    };
  }

  /** Hora (0–23) del instante en la zona horaria de Colombia (UTC-5 fijo). */
  private static bogotaHour(date: Date): number {
    const bogota = new Date(date.getTime() - 5 * 3_600_000);
    return bogota.getUTCHours();
  }
}
