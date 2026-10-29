import { Injectable, Logger } from '@nestjs/common';
import { DocumentLookupPort, DocumentLookupResult } from '../../domain/ports/document-lookup.port';
import { UserCategory } from '../../domain/value-objects/user-category';

/**
 * Adaptador stub de consulta de documento.
 * Deriva una categoría determinística del documento para poder probar el flujo
 * sin el webhook real. Sustituible por un adaptador n8n/HTTP real.
 */
@Injectable()
export class StubDocumentLookupAdapter implements DocumentLookupPort {
  private readonly logger = new Logger(StubDocumentLookupAdapter.name);

  async lookup(documentNumber: string): Promise<DocumentLookupResult> {
    this.logger.debug(`[STUB] Consulta de documento ${documentNumber}`);
    const digits = documentNumber.replace(/\D/g, '');
    const last = digits.length ? Number(digits[digits.length - 1]) : 0;
    const category =
      last <= 2 ? UserCategory.A : last <= 5 ? UserCategory.B : last <= 7 ? UserCategory.C : UserCategory.D;
    return { found: category !== UserCategory.D, category };
  }
}
