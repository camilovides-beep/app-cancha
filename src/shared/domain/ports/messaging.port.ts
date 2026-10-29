export const MESSAGING = Symbol('MESSAGING');

export type MessageChannel = 'whatsapp' | 'sms';

export interface OutboundMessage {
  to: string;
  channel: MessageChannel;
  template: 'verification_code' | 'reservation_confirmed' | 'reservation_reminder';
  variables: Record<string, string>;
}

/**
 * Puerto de mensajería saliente (códigos de verificación, confirmaciones).
 * El sistema original usaba la API de WhatsApp de Meta; aquí es un puerto
 * con adaptador stub por defecto.
 */
export interface MessagingPort {
  send(message: OutboundMessage): Promise<{ delivered: boolean; providerMessageId?: string }>;
}
