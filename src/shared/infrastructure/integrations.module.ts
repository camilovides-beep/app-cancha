import { Global, Module, Provider } from '@nestjs/common';
import { loadEnv } from '../config/env';
import { DOCUMENT_LOOKUP } from '../domain/ports/document-lookup.port';
import { MESSAGING } from '../domain/ports/messaging.port';
import { PAYMENT_GATEWAY } from '../domain/ports/payment-gateway.port';
import { StubDocumentLookupAdapter } from './adapters/stub-document-lookup.adapter';
import { StubMessagingAdapter } from './adapters/stub-messaging.adapter';
import { StubPaymentGatewayAdapter } from './adapters/stub-payment-gateway.adapter';

const env = loadEnv();

/**
 * Selecciona el adaptador de cada puerto según el proveedor configurado en .env.
 * Hoy solo existe el adaptador "stub"; los adaptadores reales (ePayco, Meta,
 * n8n) se registran aquí cuando se implementen, sin tocar el dominio.
 */
const paymentProvider: Provider = {
  provide: PAYMENT_GATEWAY,
  useClass: StubPaymentGatewayAdapter,
};
const messagingProvider: Provider = {
  provide: MESSAGING,
  useClass: StubMessagingAdapter,
};
const documentLookupProvider: Provider = {
  provide: DOCUMENT_LOOKUP,
  useClass: StubDocumentLookupAdapter,
};

@Global()
@Module({
  providers: [paymentProvider, messagingProvider, documentLookupProvider],
  exports: [PAYMENT_GATEWAY, MESSAGING, DOCUMENT_LOOKUP],
})
export class IntegrationsModule {
  constructor() {
    const { payment, messaging, documentLookup } = env.providers;
    if (payment !== 'stub' || messaging !== 'stub' || documentLookup !== 'stub') {
      // Aviso para cuando se configuren proveedores reales aún no implementados.
      // eslint-disable-next-line no-console
      console.warn(
        `[Integraciones] Proveedores solicitados (payment=${payment}, messaging=${messaging}, ` +
          `documentLookup=${documentLookup}). Solo "stub" está implementado; usando stub.`,
      );
    }
  }
}
