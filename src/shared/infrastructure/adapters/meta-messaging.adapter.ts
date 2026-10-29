import { Injectable, Logger } from '@nestjs/common';
import { AppEnv, loadEnv } from '../../config/env';
import {
  MessagingPort,
  OutboundMessage,
} from '../../domain/ports/messaging.port';

/**
 * Adaptador real de WhatsApp sobre la Cloud API de Meta (Graph API), portado de
 * Meta_whatsapp_model.php de la app original de canchas. Usa las plantillas
 * aprobadas en el WhatsApp Business de Comfasucre:
 *
 *   - `codigo`            → código de verificación (1 variable)
 *   - `reserva`           → confirmación de reserva (7 variables)
 *   - `recordatorio_pago` → recordatorio de pago (4 variables)
 *
 * El orden de las variables de cada plantilla debe coincidir con el aprobado en
 * Meta; aquí se arma a partir del mapa `variables` del mensaje de dominio.
 */
@Injectable()
export class MetaMessagingAdapter implements MessagingPort {
  private readonly logger = new Logger(MetaMessagingAdapter.name);
  private readonly cfg: AppEnv['meta'];

  constructor() {
    this.cfg = loadEnv().meta;
  }

  async send(
    message: OutboundMessage,
  ): Promise<{ delivered: boolean; providerMessageId?: string }> {
    if (!this.cfg.token || !this.cfg.phoneNumberId) {
      this.logger.warn(
        'WhatsApp no enviado: faltan META_TOKEN o META_PHONE_NUMBER_ID.',
      );
      return { delivered: false };
    }

    const to = this.normalizePhone(message.to);
    if (to === '') {
      this.logger.warn('WhatsApp no enviado: teléfono vacío o inválido.');
      return { delivered: false };
    }

    const { templateName, params } = this.resolveTemplate(message);
    const url = `${this.cfg.graphUrl}/${encodeURIComponent(this.cfg.phoneNumberId)}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: this.cfg.templateLanguage },
        components: [
          {
            type: 'body',
            parameters: params.map((text) => ({ type: 'text', text })),
          },
        ],
      },
    };

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20_000);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.cfg.token}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timer);

      const body = (await res.json().catch(() => null)) as {
        messages?: { id?: string }[];
        error?: { message?: string };
      } | null;

      if (res.ok && body && body.error === undefined) {
        const providerMessageId = body.messages?.[0]?.id;
        this.logger.log(
          `WhatsApp "${templateName}" enviado a ${to} (id ${providerMessageId ?? 'n/d'}).`,
        );
        return { delivered: true, providerMessageId };
      }

      this.logger.warn(
        `WhatsApp "${templateName}" a ${to} falló (HTTP ${res.status}): ${
          body?.error?.message ?? 'error desconocido'
        }`,
      );
      return { delivered: false };
    } catch (error) {
      this.logger.warn(
        `WhatsApp a ${to} no enviado: ${(error as Error).message}`,
      );
      return { delivered: false };
    }
  }

  /** Mapea la plantilla de dominio a la plantilla de Meta y su lista ordenada de parámetros. */
  private resolveTemplate(message: OutboundMessage): {
    templateName: string;
    params: string[];
  } {
    const v = message.variables ?? {};
    switch (message.template) {
      case 'verification_code':
        return {
          templateName: this.cfg.templates.verificationCode,
          params: [v.code ?? ''],
        };
      case 'reservation_confirmed':
        return {
          templateName: this.cfg.templates.reservationConfirmed,
          // Orden aprobado en Meta: nombre, reserva_no, fecha, hora, lugar, cancha, valor.
          params: [
            v.nombre ?? '',
            v.reserva_no ?? '',
            v.fecha ?? '',
            v.hora ?? '',
            v.lugar ?? '',
            v.cancha ?? '',
            v.valor ?? '',
          ],
        };
      case 'reservation_reminder':
        return {
          templateName: this.cfg.templates.reservationReminder,
          // Orden aprobado en Meta: nombre, reserva_no, monto, enlace_pago.
          params: [
            v.nombre ?? '',
            v.reserva_no ?? '',
            v.monto ?? '',
            v.enlace_pago ?? '',
          ],
        };
      default:
        return { templateName: String(message.template), params: [] };
    }
  }

  /** Solo dígitos; antepone 57 (Colombia) si llegan 10 dígitos. */
  private normalizePhone(phone: string): string {
    const digits = (phone ?? '').replace(/[^0-9]/g, '');
    if (digits.length === 10) return `57${digits}`;
    return digits;
  }
}
