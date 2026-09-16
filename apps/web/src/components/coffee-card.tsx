import Link from "next/link";
import { formatPrice, formatPricePerKilo, formatWeight } from "@/lib/format";
import { BEAN_TYPE_LABELS, ROAST_LEVEL_LABELS, type Coffee } from "@/lib/types";

export function CoffeeCard({ coffee }: { coffee: Coffee }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-latte bg-surface shadow-sm transition hover:shadow-md">
      <Link href={`/cafes/${coffee.slug}`} className="flex flex-1 flex-col">
        <div className="aspect-square w-full overflow-hidden bg-latte">
          {coffee.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- imagens vêm de domínios arbitrários das torrefações parceiras
            <img src={coffee.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl" aria-hidden>
              ☕
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{coffee.roaster.name}</p>
          <h3 className="text-base font-semibold text-espresso">{coffee.name}</h3>

          <ul className="flex flex-wrap gap-1.5 text-xs text-coffee">
            <li className="rounded-full bg-latte px-2 py-0.5">{BEAN_TYPE_LABELS[coffee.beanType]}</li>
            <li className="rounded-full bg-latte px-2 py-0.5">{ROAST_LEVEL_LABELS[coffee.roastLevel]}</li>
            {coffee.scaScore ? <li className="rounded-full bg-latte px-2 py-0.5">SCA {coffee.scaScore}</li> : null}
          </ul>

          <div className="mt-auto pt-2">
            <p className="text-lg font-semibold text-espresso">{formatPrice(coffee.priceCents)}</p>
            <p className="text-xs text-muted">
              {formatWeight(coffee.weightGrams)} · {formatPricePerKilo(coffee.priceCents, coffee.weightGrams)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
}
