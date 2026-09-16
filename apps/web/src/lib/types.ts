export type BeanType = 'ARABICA' | 'ROBUSTA' | 'BLEND';
export type RoastLevel = 'CLARA' | 'MEDIA' | 'MEDIA_ESCURA' | 'ESCURA';
export type Process = 'NATURAL' | 'LAVADO' | 'CEREJA_DESCASCADO' | 'FERMENTADO' | 'HONEY';

export type Roaster = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  websiteUrl: string;
  logoUrl: string | null;
  city: string | null;
  state: string | null;
  _count?: { coffees: number };
};

export type Taxonomy = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { coffees: number };
};

export type Coffee = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  priceCents: number;
  weightGrams: number;
  beanType: BeanType;
  roastLevel: RoastLevel;
  process: Process;
  origin: string;
  region: string | null;
  altitude: number | null;
  scaScore: number | null;
  storeUrl: string;
  active: boolean;
  clickCount: number;
  roasterId: string;
  roaster: Roaster;
  flavorNotes: Taxonomy[];
  brewMethods: Taxonomy[];
};

export type Paginated<T> = {
  items: T[];
  meta: { total: number; page: number; perPage: number; totalPages: number };
};

/** Rótulos amigáveis para os enums do banco. */
export const BEAN_TYPE_LABELS: Record<BeanType, string> = {
  ARABICA: 'Arábica',
  ROBUSTA: 'Robusta',
  BLEND: 'Blend',
};

export const ROAST_LEVEL_LABELS: Record<RoastLevel, string> = {
  CLARA: 'Torra clara',
  MEDIA: 'Torra média',
  MEDIA_ESCURA: 'Torra média escura',
  ESCURA: 'Torra escura',
};

export const PROCESS_LABELS: Record<Process, string> = {
  NATURAL: 'Natural',
  LAVADO: 'Lavado',
  CEREJA_DESCASCADO: 'Cereja descascado',
  FERMENTADO: 'Fermentado',
  HONEY: 'Honey',
};
