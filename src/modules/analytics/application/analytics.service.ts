import { Inject, Injectable } from '@nestjs/common';
import {
  ANALYTICS_REPOSITORY,
  AnalyticsRepository,
} from '../domain/analytics.repository';

/** Casos de uso de analítica del panel. */
@Injectable()
export class AnalyticsService {
  constructor(@Inject(ANALYTICS_REPOSITORY) private readonly repo: AnalyticsRepository) {}

  private defaultRange(): { start: string; end: string } {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
  }

  summary(start?: string, end?: string, courtId?: string) {
    const range = { ...this.defaultRange(), ...(start && { start }), ...(end && { end }) };
    return this.repo.periodSummary(range.start, range.end, courtId);
  }

  reservationsByDay(start?: string, end?: string, courtId?: string) {
    const range = { ...this.defaultRange(), ...(start && { start }), ...(end && { end }) };
    return this.repo.reservationsByDay(range.start, range.end, courtId);
  }

  revenueByMonth(year?: number) {
    return this.repo.revenueByMonth(year ?? new Date().getFullYear());
  }

  topCourts(start?: string, end?: string, limit = 5) {
    const range = { ...this.defaultRange(), ...(start && { start }), ...(end && { end }) };
    return this.repo.topCourts(range.start, range.end, limit);
  }
}
