import type { Coffee, Paginated, Roaster, Taxonomy } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions = RequestInit & { searchParams?: Record<string, string | number | boolean | undefined> };

/** Wrapper único sobre o fetch: monta a URL, trata erros da API e desserializa o JSON. */
export async function apiFetch<T>(path: string, { searchParams, ...init }: RequestOptions = {}): Promise<T> {
  const url = new URL(`${API_URL}${path}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init.headers },
    // O catálogo muda a cada operação do admin, então não cacheamos as respostas.
    cache: 'no-store',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : (body?.message ?? response.statusText);

    throw new ApiError(message, response.status);
  }

  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}

export type CoffeeFilters = {
  search?: string;
  beanType?: string;
  roastLevel?: string;
  process?: string;
  roaster?: string;
  brewMethod?: string;
  flavorNote?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  onlyActive?: boolean;
  page?: number;
  perPage?: number;
};

export const api = {
  coffees: {
    list: (filters: CoffeeFilters = {}) => apiFetch<Paginated<Coffee>>('/coffees', { searchParams: filters }),
    get: (idOrSlug: string) => apiFetch<Coffee>(`/coffees/${idOrSlug}`),
    create: (data: unknown) => apiFetch<Coffee>('/coffees', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => apiFetch<Coffee>(`/coffees/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => apiFetch<{ id: string }>(`/coffees/${id}`, { method: 'DELETE' }),
    registerRedirect: (idOrSlug: string) =>
      apiFetch<{ storeUrl: string; clickCount: number }>(`/coffees/${idOrSlug}/redirect`, { method: 'POST' }),
  },
  roasters: {
    list: (search?: string) => apiFetch<Roaster[]>('/roasters', { searchParams: { search } }),
    get: (id: string) => apiFetch<Roaster & { coffees: Coffee[] }>(`/roasters/${id}`),
    create: (data: unknown) => apiFetch<Roaster>('/roasters', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => apiFetch<Roaster>(`/roasters/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => apiFetch<{ id: string }>(`/roasters/${id}`, { method: 'DELETE' }),
  },
  flavorNotes: {
    list: () => apiFetch<Taxonomy[]>('/flavor-notes'),
    create: (data: unknown) => apiFetch<Taxonomy>('/flavor-notes', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => apiFetch<Taxonomy>(`/flavor-notes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => apiFetch<{ id: string }>(`/flavor-notes/${id}`, { method: 'DELETE' }),
  },
  brewMethods: {
    list: () => apiFetch<Taxonomy[]>('/brew-methods'),
    create: (data: unknown) => apiFetch<Taxonomy>('/brew-methods', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: unknown) => apiFetch<Taxonomy>(`/brew-methods/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    remove: (id: string) => apiFetch<{ id: string }>(`/brew-methods/${id}`, { method: 'DELETE' }),
  },
};
