/** Configuración de marca derivada de la tabla settings. */
export interface BrandConfig {
  name: string;
  tagline: string;
  primaryColor: string;
  primaryColorText: string;
  secondaryColor: string;
  secondaryColorText: string;
  whatsapp: string;
  email: string;
  address: string;
  logo: string;
  favicon: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

/** Valores por defecto (Manual de Marca Comfasucre 2025). */
export const DEFAULT_BRAND: BrandConfig = {
  name: 'Comfasucre',
  tagline: 'Tu mejor opción en deportes',
  primaryColor: '#19559B',
  primaryColorText: '#FFFFFF',
  secondaryColor: '#1FB5E5',
  secondaryColorText: '#0F3461',
  whatsapp: '',
  email: 'servicioalcliente@comfasucre.com',
  address: 'Sincelejo, Sucre',
  logo: '',
  favicon: '',
  facebook: '',
  instagram: '',
  twitter: '',
};

/** Mapa campo de BrandConfig ↔ clave en la tabla settings. */
export const BRAND_KEY_MAP: Record<keyof BrandConfig, string> = {
  name: 'brand_name',
  tagline: 'brand_tagline',
  primaryColor: 'brand_primary_color',
  primaryColorText: 'brand_primary_color_text',
  secondaryColor: 'brand_secondary_color',
  secondaryColorText: 'brand_secondary_color_text',
  whatsapp: 'brand_whatsapp',
  email: 'brand_email',
  address: 'brand_address',
  logo: 'brand_logo',
  favicon: 'brand_favicon',
  facebook: 'brand_facebook',
  instagram: 'brand_instagram',
  twitter: 'brand_twitter',
};
