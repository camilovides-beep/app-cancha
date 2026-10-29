export const ANALYTICS_REPOSITORY = Symbol('ANALYTICS_REPOSITORY');

export interface PeriodSummary {
  totalReservations: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  totalRevenue: number;
  confirmedRevenue: number;
  totalUsers: number;
  occupancyRate: number;
}

export interface DailyPoint {
  date: string;
  count: number;
  revenue: number;
}

export interface MonthlyPoint {
  month: string;
  revenue: number;
  count: number;
}

export interface TopCourt {
  id: string;
  name: string;
  sportType: string;
  reservationCount: number;
  revenue: number;
}

/** Puerto de consultas analíticas de solo lectura. */
export interface AnalyticsRepository {
  periodSummary(start: string, end: string, courtId?: string): Promise<PeriodSummary>;
  reservationsByDay(start: string, end: string, courtId?: string): Promise<DailyPoint[]>;
  revenueByMonth(year: number): Promise<MonthlyPoint[]>;
  topCourts(start: string, end: string, limit: number): Promise<TopCourt[]>;
}
