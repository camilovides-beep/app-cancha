import { TimeSlot } from '../../../shared/domain/value-objects/time-slot';
import { UserCategory } from '../../../shared/domain/value-objects/user-category';
import { Court, RateMatrix } from '../domain/court';
import { RateMatrixDto } from './dto/rate-matrix.dto';

/** Convierte el DTO de tarifas (anidado) a la matriz de dominio. */
export function rateMatrixFromDto(dto?: RateMatrixDto): RateMatrix {
  const matrix = Court.emptyRates();
  if (!dto) return matrix;
  for (const cat of Object.values(UserCategory)) {
    const slots = dto[cat];
    if (!slots) continue;
    matrix[cat][TimeSlot.DAY] = slots.day ?? null;
    matrix[cat][TimeSlot.AFTERNOON] = slots.afternoon ?? null;
    matrix[cat][TimeSlot.NIGHT] = slots.night ?? null;
  }
  return matrix;
}

/** Serializa una Court de dominio a la forma pública de la API. */
export function courtToView(court: Court) {
  return {
    id: court.id,
    name: court.name,
    sportType: court.sportType,
    status: court.status,
    courtType: court.courtType,
    venueName: court.venueName,
    description: court.description,
    location: court.location,
    address: court.address,
    additionalInfo: court.additionalInfo,
    images: court.images,
    attributes: court.attributes,
    venueServices: court.venueServices,
    map: court.map,
    hourlyRate: court.hourlyRate,
    rates: court.rates,
    createdAt: court.createdAt,
  };
}
