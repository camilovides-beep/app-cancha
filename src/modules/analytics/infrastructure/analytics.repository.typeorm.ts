import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  AnalyticsRepository,
  DailyPoint,
  MonthlyPoint,
  PeriodSummary,
  TopCourt,
} from '../domain/analytics.repository';

/** Adaptador de analítica con SQL de solo lectura sobre PostgreSQL. */
@Injectable()
export class TypeOrmAnalyticsRepository implements AnalyticsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async periodSummary(start: string, end: string, courtId?: string): Promise<PeriodSummary> {
    const courtFilter = courtId ? 'AND court_id = $3' : '';
    const params = courtId ? [start, end, courtId] : [start, end];
    const [row] = await this.dataSource.query(
      `SELECT
         COUNT(*)::int AS "totalReservations",
         COALESCE(SUM(CASE WHEN status='confirmed' THEN 1 ELSE 0 END),0)::int AS confirmed,
         COALESCE(SUM(CASE WHEN status='cancelled' THEN 1 ELSE 0 END),0)::int AS cancelled,
         COALESCE(SUM(CASE WHEN status='pending'   THEN 1 ELSE 0 END),0)::int AS pending,
         COALESCE(SUM(total_amount),0)::float AS "totalRevenue",
         COALESCE(SUM(CASE WHEN status='confirmed' THEN total_amount ELSE 0 END),0)::float AS "confirmedRevenue",
         COUNT(DISTINCT user_id)::int AS "totalUsers"
       FROM reservations
       WHERE (start_time AT TIME ZONE 'America/Bogota')::date BETWEEN $1 AND $2 ${courtFilter}`,
      params,
    );
    const days = Math.max(1, (new Date(end).getTime() - new Date(start).getTime()) / 86_400_000 + 1);
    const occupancyRate = Math.round(((row.confirmed / days) * 100) / 8 * 10) / 10;
    return { ...row, occupancyRate };
  }

  async reservationsByDay(start: string, end: string, courtId?: string): Promise<DailyPoint[]> {
    const courtFilter = courtId ? 'AND court_id = $3' : '';
    const params = courtId ? [start, end, courtId] : [start, end];
    return this.dataSource.query(
      `SELECT (start_time AT TIME ZONE 'America/Bogota')::date::text AS date,
              COUNT(*)::int AS count,
              COALESCE(SUM(total_amount),0)::float AS revenue
       FROM reservations
       WHERE (start_time AT TIME ZONE 'America/Bogota')::date BETWEEN $1 AND $2 ${courtFilter}
       GROUP BY 1 ORDER BY 1 ASC`,
      params,
    );
  }

  async revenueByMonth(year: number): Promise<MonthlyPoint[]> {
    return this.dataSource.query(
      `SELECT TO_CHAR(start_time, 'YYYY-MM') AS month,
              COALESCE(SUM(total_amount),0)::float AS revenue,
              COUNT(*)::int AS count
       FROM reservations
       WHERE status='confirmed' AND EXTRACT(YEAR FROM start_time) = $1
       GROUP BY 1 ORDER BY 1 ASC`,
      [year],
    );
  }

  async topCourts(start: string, end: string, limit: number): Promise<TopCourt[]> {
    return this.dataSource.query(
      `SELECT c.id, c.name, c.sport_type AS "sportType",
              COUNT(r.id)::int AS "reservationCount",
              COALESCE(SUM(r.total_amount),0)::float AS revenue
       FROM reservations r
       JOIN courts c ON c.id = r.court_id
       WHERE (r.start_time AT TIME ZONE 'America/Bogota')::date BETWEEN $1 AND $2
       GROUP BY c.id, c.name, c.sport_type
       ORDER BY "reservationCount" DESC
       LIMIT $3`,
      [start, end, limit],
    );
  }
}
