import Link from "next/link";
import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { StoreRedirectButton } from "@/components/store-redirect-button";
import { formatPrice, formatPricePerKilo, formatWeight } from "@/lib/format";
import { BEAN_TYPE_LABELS, PROCESS_LABELS, ROAST_LEVEL_LABELS } from "@/lib/types";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;

  try {
    const coffee = await api.coffees.get(slug);
    return {
      title: `${coffee.name} — ${coffee.roaster.name} | QueroKafé`,
      description: coffee.description ?? undefined,
    };
  } catch {
    return { title: "Café não encontrado | QueroKafé" };
  }
}

export default async function CoffeeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let coffee;
  try {
    coffee = await api.coffees.get(slug);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const specs = [
    { label: "Torrefação", value: coffee.roaster.name },
    { label: "Tipo de grão", value: BEAN_TYPE_LABELS[coffee.beanType] },
    { label: "Torra", value: ROAST_LEVEL_LABELS[coffee.roastLevel] },
    { label: "Processo", value: PROCESS_LABELS[coffee.process] },
    { label: "Origem", value: [coffee.origin, coffee.region].filter(Boolean).join(" · ") },
    { label: "Altitude", value: coffee.altitude ? `${coffee.altitude} m` : "—" },
    { label: "Pontuação SCA", value: coffee.scaScore ? String(coffee.scaScore) : "—" },
    { label: "Pacote", value: formatWeight(coffee.weightGrams) },
  ];

  return (
    <article className="flex flex-col gap-8">
      <nav className="text-sm text-muted">
        <Link href="/" className="underline">
          Catálogo
        </Link>{" "}
        / <span>{coffee.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-latte bg-latte">
          {coffee.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- imagens hospedadas pelas torrefações parceiras
            <img src={coffee.imageUrl} alt={coffee.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl" aria-hidden>
              ☕
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted">{coffee.roaster.name}</p>
            <h1 className="text-3xl font-bold text-espresso">{coffee.name}</h1>
          </div>

          {coffee.description ? <p className="text-ink/80">{coffee.description}</p> : null}

          <div>
            <p className="text-3xl font-bold text-espresso">{formatPrice(coffee.priceCents)}</p>
            <p className="text-sm text-muted">
              {formatWeight(coffee.weightGrams)} · {formatPricePerKilo(coffee.priceCents, coffee.weightGrams)}
            </p>
          </div>

          <StoreRedirectButton coffeeSlug={coffee.slug} storeUrl={coffee.storeUrl} />
          <p className="-mt-2 text-xs text-muted">
            A compra é finalizada no site da {coffee.roaster.name}. O QueroKafé não vende cafés diretamente.
          </p>

          {coffee.flavorNotes.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Notas sensoriais</h2>
              <ul className="flex flex-wrap gap-2">
                {coffee.flavorNotes.map((note) => (
                  <li key={note.id}>
                    <Link href={`/?flavorNote=${note.slug}`} className="rounded-full bg-latte px-3 py-1 text-sm text-coffee">
                      {note.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {coffee.brewMethods.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted">Métodos recomendados</h2>
              <ul className="flex flex-wrap gap-2">
                {coffee.brewMethods.map((method) => (
                  <li key={method.id}>
                    <Link href={`/?brewMethod=${method.slug}`} className="rounded-full bg-latte px-3 py-1 text-sm text-coffee">
                      {method.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-espresso">Ficha técnica</h2>
        <dl className="grid gap-px overflow-hidden rounded-xl border border-latte bg-latte sm:grid-cols-2 lg:grid-cols-4">
          {specs.map((spec) => (
            <div key={spec.label} className="bg-surface p-4">
              <dt className="text-xs uppercase tracking-wide text-muted">{spec.label}</dt>
              <dd className="mt-1 font-medium text-ink">{spec.value || "—"}</dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
