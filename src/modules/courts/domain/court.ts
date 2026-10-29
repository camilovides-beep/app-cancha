import { TimeSlot } from '../../../shared/domain/value-objects/time-slot';
import { BASE_PRICE_BY_CATEGORY, UserCategory } from '../../../shared/domain/value-objects/user-category';

export interface GeoLocation {
  lat: number | null;
  lng: number | null;
  address: string | null;
}

/** Matriz de tarifas por categoría y franja. */
export type RateMatrix = Record<UserCategory, Record<TimeSlot, number | null>>;

export interface CourtProps {
  id: string;
  name: string;
  sportType: string;
  status: string;
  location?: string | null;
  courtType?: string | null;
  venueName?: string | null;
  description?: string | null;
  address?: string | null;
  additionalInfo?: string | null;
  images?: string[];
  attributes?: string[];
  venueServices?: string[];
  map?: GeoLocation;
  hourlyRate?: number;
  dayRate?: number | null;
  afternoonRate?: number | null;
  nightRate?: number | null;
  rates?: RateMatrix;
  createdAt?: Date;
}

/**
 * Entidad de dominio Court: cualquier recurso reservable (cancha, auditorio,
 * chiva...). Encapsula la regla de negocio del cálculo de tarifa.
 */
export class Court {
  readonly id: string;
  name: string;
  sportType: string;
  status: string;
  location: string | null;
  courtType: string | null;
  venueName: string | null;
  description: string | null;
  address: string | null;
  additionalInfo: string | null;
  images: string[];
  attributes: string[];
  venueServices: string[];
  map: GeoLocation;
  hourlyRate: number;
  dayRate: number | null;
  afternoonRate: number | null;
  nightRate: number | null;
  rates: RateMatrix;
  readonly createdAt: Date;

  constructor(props: CourtProps) {
    this.id = props.id;
    this.name = props.name;
    this.sportType = props.sportType;
    this.status = props.status;
    this.location = props.location ?? null;
    this.courtType = props.courtType ?? null;
    this.venueName = props.venueName ?? null;
    this.description = props.description ?? null;
    this.address = props.address ?? null;
    this.additionalInfo = props.additionalInfo ?? null;
    this.images = props.images ?? [];
    this.attributes = props.attributes ?? [];
    this.venueServices = props.venueServices ?? [];
    this.map = props.map ?? { lat: null, lng: null, address: null };
    this.hourlyRate = props.hourlyRate ?? 0;
    this.dayRate = props.dayRate ?? null;
    this.afternoonRate = props.afternoonRate ?? null;
    this.nightRate = props.nightRate ?? null;
    this.rates = props.rates ?? Court.emptyRates();
    this.createdAt = props.createdAt ?? new Date();
  }

  isActive(): boolean {
    return this.status === 'active';
  }

  /** Tarifa por hora según categoría y franja, con cadena de respaldo. */
  rateFor(category: UserCategory, slot: TimeSlot): number {
    const specific = this.rates[category]?.[slot];
    if (specific && specific > 0) return specific;

    const legacy = this.legacyRate(slot);
    if (legacy && legacy > 0) return legacy;

    if (this.hourlyRate > 0) return this.hourlyRate;

    return BASE_PRICE_BY_CATEGORY[category];
  }

  private legacyRate(slot: TimeSlot): number | null {
    switch (slot) {
      case TimeSlot.DAY:
        return this.dayRate;
      case TimeSlot.AFTERNOON:
        return this.afternoonRate;
      case TimeSlot.NIGHT:
        return this.nightRate;
    }
  }

  static emptyRates(): RateMatrix {
    const slots = { [TimeSlot.DAY]: null, [TimeSlot.AFTERNOON]: null, [TimeSlot.NIGHT]: null };
    return {
      [UserCategory.A]: { ...slots },
      [UserCategory.B]: { ...slots },
      [UserCategory.C]: { ...slots },
      [UserCategory.D]: { ...slots },
    };
  }
}
