import { Inject, Injectable } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import {
  ConflictException,
  EntityNotFoundException,
} from '../../../shared/domain/exceptions/domain.exception';
import { MESSAGING, MessagingPort } from '../../../shared/domain/ports/messaging.port';
import {
  PAYMENT_GATEWAY,
  PaymentGatewayPort,
} from '../../../shared/domain/ports/payment-gateway.port';
import {
  assertCategory,
  BASE_PRICE_BY_CATEGORY,
  normalizeCategory,
  UserCategory,
} from '../../../shared/domain/value-objects/user-category';
import { CourtsService } from '../../courts/application/courts.service';
import { UsersService } from '../../users/application/users.service';
import { PriceBreakdown, PricingService } from '../domain/pricing.service';
import {
  PaymentStatus,
  Reservation,
  ReservationStatus,
} from '../domain/reservation';
import {
  RESERVATION_REPOSITORY,
  ReservationListFilters,
  ReservationRepository,
} from '../domain/reservation.repository';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { QuoteDto } from './dto/quote.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @Inject(RESERVATION_REPOSITORY) private readonly repo: ReservationRepository,
    private readonly courts: CourtsService,
    private readonly users: UsersService,
    @Inject(MESSAGING) private readonly messaging: MessagingPort,
    @Inject(PAYMENT_GATEWAY) private readonly payments: PaymentGatewayPort,
  ) {}

  list(filters?: ReservationListFilters): Promise<Reservation[]> {
    return this.repo.findAll(filters);
  }

  async getById(id: string): Promise<Reservation> {
    const reservation = await this.repo.findById(id);
    if (!reservation) throw new EntityNotFoundException('Reserva', id);
    return reservation;
  }

  /** Previsualiza el precio sin crear la reserva. */
  async quote(dto: QuoteDto): Promise<PriceBreakdown & { courtId: string }> {
    const court = await this.courts.findById(dto.courtId);
    const { category } = await this.resolveCategory({
      category: dto.category,
      documentNumber: dto.documentNumber,
      isAffiliate: !!dto.category,
    });
    const { start, end } = this.buildRange(dto.date, dto.startTime, dto.endTime);
    return { courtId: court.id, ...PricingService.calculate(court, category, start, end) };
  }

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const court = await this.courts.findById(dto.courtId);
    const { category, price } = await this.resolveCategory(dto);
    const { start, end } = this.buildRange(dto.date, dto.startTime, dto.endTime);

    await this.assertAvailable(court.id, start, end);

    const breakdown = PricingService.calculate(court, category, start, end);

    const reservation = new Reservation({
      id: randomUUID(),
      courtId: court.id,
      userId: dto.userId ?? null,
      startTime: start,
      endTime: end,
      status: ReservationStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
      totalAmount: breakdown.total,
      notes: dto.notes ?? `Turno: ${breakdown.slotLabel} - Categoría: ${category}`,
      userName: dto.customerName,
      courtName: court.name,
      userPhone: dto.customerPhone ?? null,
      userEmail: dto.customerEmail ?? null,
      userCategory: category,
      categoryPrice: price,
      userDocument: dto.documentNumber ?? null,
    });

    return this.repo.create(reservation);
  }

  async updateStatus(id: string, status: string): Promise<Reservation> {
    const reservation = await this.getById(id);
    switch (status) {
      case ReservationStatus.CONFIRMED:
        reservation.confirm();
        break;
      case ReservationStatus.CANCELLED:
        reservation.cancel();
        break;
      case ReservationStatus.COMPLETED:
        reservation.status = ReservationStatus.COMPLETED;
        break;
      default:
        reservation.status = ReservationStatus.PENDING;
    }
    return this.repo.update(reservation);
  }

  /** Genera y envía un código de verificación por el canal disponible. */
  async sendVerification(id: string): Promise<{ sent: boolean; expiresAt: Date }> {
    const reservation = await this.getById(id);
    if (!reservation.userPhone) {
      throw new ConflictException('La reserva no tiene teléfono para enviar el código');
    }
    const code = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    reservation.setVerification(code, expiresAt);
    await this.repo.update(reservation);

    await this.messaging.send({
      to: reservation.userPhone,
      channel: 'whatsapp',
      template: 'verification_code',
      variables: { code, name: reservation.userName ?? '' },
    });
    return { sent: true, expiresAt };
  }

  async verify(id: string, code: string): Promise<Reservation> {
    const reservation = await this.getById(id);
    reservation.verify(code);
    return this.repo.update(reservation);
  }

  /** Inicia el pago a través de la pasarela (puerto). */
  async initPayment(id: string, method = 'epayco'): Promise<{
    reference: string;
    checkoutUrl: string;
    status: string;
  }> {
    const reservation = await this.getById(id);
    if (reservation.paymentStatus === PaymentStatus.PAID) {
      throw new ConflictException('La reserva ya está pagada');
    }
    const intent = await this.payments.createIntent({
      reservationId: reservation.id,
      amount: reservation.totalAmount,
      description: `Reserva ${reservation.courtName ?? ''}`,
      customerEmail: reservation.userEmail ?? undefined,
      customerName: reservation.userName ?? undefined,
    });
    reservation.paymentStatus = PaymentStatus.PENDING;
    reservation.paymentMethod = method;
    reservation.paymentReference = intent.reference;
    await this.repo.update(reservation);
    return { reference: intent.reference, checkoutUrl: intent.checkoutUrl, status: intent.status };
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.repo.delete(id);
  }

  // ---- helpers ----

  private async assertAvailable(courtId: string, start: Date, end: Date): Promise<void> {
    const overlapping = await this.repo.findOverlapping(courtId, start, end);
    if (overlapping.length > 0) {
      throw new ConflictException('El horario seleccionado ya está reservado');
    }
  }

  private async resolveCategory(input: {
    category?: string;
    documentNumber?: string;
    isAffiliate?: boolean;
  }): Promise<{ category: UserCategory; price: number }> {
    if (input.category && input.isAffiliate) {
      const category = assertCategory(input.category);
      return { category, price: BASE_PRICE_BY_CATEGORY[category] };
    }
    if (input.documentNumber) {
      const resolution = await this.users.resolveCategoryByDocument(input.documentNumber);
      return { category: resolution.category, price: resolution.price };
    }
    const category = normalizeCategory(input.category);
    return { category, price: BASE_PRICE_BY_CATEGORY[category] };
  }

  /** Construye el rango de fechas en zona horaria de Colombia (UTC-5 fijo). */
  private buildRange(date: string, startTime: string, endTime: string): { start: Date; end: Date } {
    const start = new Date(`${date}T${startTime}:00-05:00`);
    const end = new Date(`${date}T${endTime}:00-05:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new ConflictException('Fecha u hora inválida');
    }
    return { start, end };
  }
}
