import { TimeSlot } from '../../../shared/domain/value-objects/time-slot';
import { UserCategory } from '../../../shared/domain/value-objects/user-category';
import { Court } from '../../courts/domain/court';
import { PricingService } from './pricing.service';

function buildCourt(): Court {
  const rates = Court.emptyRates();
  rates[UserCategory.A] = { day: 50000, afternoon: 55000, night: 65000 };
  rates[UserCategory.D] = { day: 60000, afternoon: 65000, night: 75000 };
  return new Court({ id: 'c1', name: 'Cancha', sportType: 'Fútbol', status: 'active', rates });
}

describe('PricingService', () => {
  const court = buildCourt();

  it('calcula precio franja noche categoría A (2 horas)', () => {
    const start = new Date('2026-11-15T18:00:00-05:00');
    const end = new Date('2026-11-15T20:00:00-05:00');
    const result = PricingService.calculate(court, UserCategory.A, start, end);

    expect(result.slot).toBe(TimeSlot.NIGHT);
    expect(result.ratePerHour).toBe(65000);
    expect(result.hours).toBe(2);
    expect(result.total).toBe(130000);
  });

  it('calcula precio franja día categoría D (1 hora)', () => {
    const start = new Date('2026-11-15T09:00:00-05:00');
    const end = new Date('2026-11-15T10:00:00-05:00');
    const result = PricingService.calculate(court, UserCategory.D, start, end);

    expect(result.slot).toBe(TimeSlot.DAY);
    expect(result.ratePerHour).toBe(60000);
    expect(result.total).toBe(60000);
  });

  it('usa el respaldo (tarifa base por categoría) si la cancha no define tarifa', () => {
    const emptyCourt = new Court({ id: 'c2', name: 'x', sportType: 'y', status: 'active' });
    const start = new Date('2026-11-15T13:00:00-05:00');
    const end = new Date('2026-11-15T14:00:00-05:00');
    const result = PricingService.calculate(emptyCourt, UserCategory.B, start, end);

    expect(result.slot).toBe(TimeSlot.AFTERNOON);
    expect(result.ratePerHour).toBe(55000); // BASE_PRICE_BY_CATEGORY.B
  });

  it('rechaza duraciones no positivas', () => {
    const t = new Date('2026-11-15T10:00:00-05:00');
    expect(() => PricingService.calculate(court, UserCategory.A, t, t)).toThrow();
  });
});
