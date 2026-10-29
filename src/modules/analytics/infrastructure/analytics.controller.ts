import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../shared/infrastructure/auth/jwt-auth.guard';
import { AnalyticsService } from '../application/analytics.service';

@ApiTags('Analítica')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen del período' })
  @ApiQuery({ name: 'start', required: false })
  @ApiQuery({ name: 'end', required: false })
  @ApiQuery({ name: 'courtId', required: false })
  summary(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('courtId') courtId?: string,
  ) {
    return this.analytics.summary(start, end, courtId);
  }

  @Get('reservations-by-day')
  @ApiOperation({ summary: 'Reservas e ingresos por día' })
  reservationsByDay(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('courtId') courtId?: string,
  ) {
    return this.analytics.reservationsByDay(start, end, courtId);
  }

  @Get('revenue-by-month')
  @ApiOperation({ summary: 'Ingresos por mes' })
  @ApiQuery({ name: 'year', required: false })
  revenueByMonth(@Query('year') year?: string) {
    return this.analytics.revenueByMonth(year ? parseInt(year, 10) : undefined);
  }

  @Get('top-courts')
  @ApiOperation({ summary: 'Canchas con más reservas' })
  topCourts(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('limit') limit?: string,
  ) {
    return this.analytics.topCourts(start, end, limit ? parseInt(limit, 10) : 5);
  }
}
