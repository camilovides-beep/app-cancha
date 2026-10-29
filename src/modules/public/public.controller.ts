import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { courtToView } from '../courts/application/court.mapper';
import { CourtsService } from '../courts/application/courts.service';
import { CreateReservationDto } from '../reservations/application/dto/create-reservation.dto';
import { QuoteDto } from '../reservations/application/dto/quote.dto';
import { VerifyCodeDto } from '../reservations/application/dto/update-status.dto';
import { reservationToView } from '../reservations/application/reservation.mapper';
import { ReservationsService } from '../reservations/application/reservations.service';
import { SettingsService } from '../settings/application/settings.service';

/** Endpoints públicos (sin autenticación) para el portal y el flujo de reserva. */
@ApiTags('Público')
@Controller('public')
export class PublicController {
  constructor(
    private readonly settings: SettingsService,
    private readonly courts: CourtsService,
    private readonly reservations: ReservationsService,
  ) {}

  @Get('brand')
  @ApiOperation({ summary: 'Configuración de marca para el portal' })
  brand() {
    return this.settings.getBrand();
  }

  @Get('courts')
  @ApiOperation({ summary: 'Recursos activos disponibles para reservar' })
  async courtsList() {
    return (await this.courts.findActive()).map(courtToView);
  }

  @Post('reservations/quote')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cotiza una reserva' })
  quote(@Body() dto: QuoteDto) {
    return this.reservations.quote(dto);
  }

  @Post('reservations')
  @ApiOperation({ summary: 'Crea una reserva desde el portal' })
  async create(@Body() dto: CreateReservationDto) {
    return reservationToView(await this.reservations.create(dto));
  }

  @Post('reservations/:id/send-verification')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Envía el código de verificación' })
  sendVerification(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservations.sendVerification(id);
  }

  @Post('reservations/:id/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verifica el código y confirma la reserva' })
  async verify(@Param('id', ParseUUIDPipe) id: string, @Body() dto: VerifyCodeDto) {
    return reservationToView(await this.reservations.verify(id, dto.code));
  }

  @Get('reservations/:id')
  @ApiOperation({ summary: 'Detalle de una reserva (confirmación)' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return reservationToView(await this.reservations.getById(id));
  }
}
