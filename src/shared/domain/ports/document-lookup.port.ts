import { UserCategory } from '../value-objects/user-category';

export const DOCUMENT_LOOKUP = Symbol('DOCUMENT_LOOKUP');

export interface DocumentLookupResult {
  found: boolean;
  category: UserCategory;
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Puerto para consultar la categoría/afiliación de una persona por documento.
 * El sistema original lo resolvía con un webhook de n8n; aquí es un puerto
 * con adaptador stub por defecto.
 */
export interface DocumentLookupPort {
  lookup(documentNumber: string): Promise<DocumentLookupResult>;
}
