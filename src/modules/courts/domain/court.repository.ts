import { Court } from './court';

export const COURT_REPOSITORY = Symbol('COURT_REPOSITORY');

/** Puerto del repositorio de canchas. */
export interface CourtRepository {
  findAll(): Promise<Court[]>;
  findActive(): Promise<Court[]>;
  findById(id: string): Promise<Court | null>;
  create(court: Court): Promise<Court>;
  update(court: Court): Promise<Court>;
  delete(id: string): Promise<void>;
}
