/** Converte centavos para o formato "R$ 54,90". */
export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceCents / 100);
}

/** Preço por quilo, útil para comparar pacotes de tamanhos diferentes. */
export function formatPricePerKilo(priceCents: number, weightGrams: number): string {
  if (weightGrams <= 0) return '—';

  return `${formatPrice((priceCents / weightGrams) * 1000)}/kg`;
}

export function formatWeight(weightGrams: number): string {
  return weightGrams >= 1000 ? `${(weightGrams / 1000).toFixed(1).replace('.', ',')} kg` : `${weightGrams} g`;
}
