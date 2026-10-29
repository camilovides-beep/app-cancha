import { createHash } from 'crypto';
import { AppEnv } from '../../config/env';

export interface EpaycoConfirmationInput {
  refPayco: string;
  transactionId: string;
  amount: string | number;
  currency: string;
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}
function md5(value: string): string {
  return createHash('md5').update(value, 'utf8').digest('hex');
}
function formatAmount(amount: string | number): string {
  const parsed =
    typeof amount === 'number'
      ? amount
      : parseFloat(String(amount).trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed.toFixed(2) : '0.00';
}

/**
 * Firmas válidas posibles para la confirmación (x_signature) de ePayco, portado
 * de epayco_reacudo_rd. ePayco ha documentado md5 y sha256 con distintas llaves,
 * así que se aceptan varias variantes y dos formatos de monto.
 */
export function epaycoConfirmationCandidates(
  keys: AppEnv['epayco'],
  input: EpaycoConfirmationInput,
): string[] {
  const { merchantId, publicKey, privateKey, pKey } = keys;
  const { refPayco, transactionId } = input;
  const currency = (input.currency ?? '').toUpperCase();
  if (!merchantId || !refPayco || !transactionId) return [];

  const amounts = new Set<string>([
    formatAmount(input.amount),
    String(input.amount).trim(),
  ]);
  const candidates = new Set<string>();
  for (const amount of amounts) {
    const tail = `${refPayco}^${transactionId}^${amount}^${currency}`;
    if (publicKey) {
      candidates.add(md5(`${merchantId}^${publicKey}^${tail}`));
      candidates.add(sha256(`${merchantId}^${publicKey}^${tail}`));
    }
    if (privateKey) {
      candidates.add(sha256(`${privateKey}^${merchantId}^${tail}`));
    }
    if (pKey) {
      candidates.add(sha256(`${merchantId}^${pKey}^${tail}`));
      candidates.add(md5(`${merchantId}^${pKey}^${tail}`));
    }
  }
  return [...candidates];
}

export function isEpaycoConfirmationValid(
  keys: AppEnv['epayco'],
  signature: string | undefined | null,
  input: EpaycoConfirmationInput,
): boolean {
  const normalized = (signature ?? '').trim().toLowerCase();
  if (normalized === '') return false;
  return epaycoConfirmationCandidates(keys, input).includes(normalized);
}
