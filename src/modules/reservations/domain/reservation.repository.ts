import { Reservation } from './reservation';

export const RESERVATION_REPOSITORY = Symbol('RESERVATION_REPOSITORY');

export interface ReservationListFilters {
  date?: string; // YYYY-MM-DD
  courtId?: string;
  status?: string;
  /** Estado de pago: unpaid | pending | paid. */
  paymentStatus?: string;
}

/** Puerto del repositorio de reservas. */
export interface ReservationRepository {
  findAll(filters?: ReservationListFilters): Promise<Reservation[]>;
  findById(id: string): Promise<Reservation | null>;
  /** Reservas no canceladas que se solapan con el rango dado en una cancha. */
  findOverlapping(courtId: string, start: Date, end: Date): Promise<Reservation[]>;
  create(reservation: Reservation): Promise<Reservation>;
  update(reservation: Reservation): Promise<Reservation>;
  delete(id: string): Promise<void>;
}
