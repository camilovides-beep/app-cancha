import { Injectable, Logger } from '@nestjs/common';
import { MessagingPort, OutboundMessage } from '../../domain/ports/messaging.port';

/**
 * Adaptador stub de mensajería: registra el mensaje en logs en lugar de
 * enviarlo. Sustituible por un adaptador real de WhatsApp (Meta) o SMS.
 */
@Injectable()
export class StubMessagingAdapter implements MessagingPort {
  private readonly logger = new Logger(StubMessagingAdapter.name);

  async send(message: OutboundMessage): Promise<{ delivered: boolean; providerMessageId?: string }> {
    this.logger.log(
      `[STUB] ${message.channel} → ${message.to} | ${message.template} | ${JSON.stringify(message.variables)}`,
    );
    return { delivered: true, providerMessageId: `stub-${Date.now()}` };
  }
}
