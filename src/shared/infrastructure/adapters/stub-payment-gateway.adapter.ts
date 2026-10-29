import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  PaymentGatewayPort,
  PaymentIntent,
  PaymentIntentResult,
} from '../../domain/ports/payment-gateway.port';

/**
 * Adaptador stub de pasarela de pagos: genera una referencia y una URL de
 * checkout simulada y aprueba el pago. Sustituible por un adaptador ePayco real.
 */
@Injectable()
export class StubPaymentGatewayAdapter implements PaymentGatewayPort {
  private readonly logger = new Logger(StubPaymentGatewayAdapter.name);

  async createIntent(intent: PaymentIntent): Promise<PaymentIntentResult> {
    const reference = `STUB-${randomUUID().slice(0, 8).toUpperCase()}`;
    this.logger.log(
      `[STUB] Intento de pago ${reference} por $${intent.amount} (reserva ${intent.reservationId})`,
    );
    return {
      reference,
      checkoutUrl: `https://checkout.stub.local/pay/${reference}`,
      status: 'pending',
    };
  }

  async verify(reference: string): Promise<{ status: 'pending' | 'approved' | 'rejected' }> {
    this.logger.debug(`[STUB] Verificando pago ${reference} → approved`);
    return { status: 'approved' };
  }
}
