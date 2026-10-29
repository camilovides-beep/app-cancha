export const PAYMENT_GATEWAY = Symbol('PAYMENT_GATEWAY');

export interface PaymentIntent {
  reservationId: string;
  amount: number;
  description: string;
  customerEmail?: string;
  customerName?: string;
}

export interface PaymentIntentResult {
  /** Identificador de la transacción en la pasarela. */
  reference: string;
  /** URL de checkout a la que redirigir al cliente (si aplica). */
  checkoutUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Puerto de pasarela de pagos. El sistema original integraba ePayco (PSE);
 * aquí es un puerto con adaptador stub por defecto.
 */
export interface PaymentGatewayPort {
  createIntent(intent: PaymentIntent): Promise<PaymentIntentResult>;
  verify(reference: string): Promise<{ status: 'pending' | 'approved' | 'rejected' }>;
}
