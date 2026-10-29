export const SETTING_REPOSITORY = Symbol('SETTING_REPOSITORY');

/** Puerto del repositorio de configuración clave/valor. */
export interface SettingRepository {
  getAll(): Promise<Record<string, string>>;
  get(key: string): Promise<string | null>;
  setMany(values: Record<string, string>): Promise<void>;
}
