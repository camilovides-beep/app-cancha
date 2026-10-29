import { UserCategory } from '../../../shared/domain/value-objects/user-category';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role?: string;
  category?: UserCategory;
  documentNumber?: string | null;
  documentType?: string | null;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Entidad de dominio User (cliente que reserva). */
export class User {
  readonly id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  category: UserCategory;
  documentNumber: string | null;
  documentType: string | null;
  status: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone ?? null;
    this.role = props.role ?? 'customer';
    this.category = props.category ?? UserCategory.D;
    this.documentNumber = props.documentNumber ?? null;
    this.documentType = props.documentType ?? 'CC';
    this.status = props.status ?? 'active';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  isActive(): boolean {
    return this.status === 'active';
  }
}
