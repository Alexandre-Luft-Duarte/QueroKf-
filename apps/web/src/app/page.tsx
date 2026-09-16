import { Suspense } from "react";
import Link from "next/link";
import { api, ApiError, type CoffeeFilters } from "@/lib/api";
import { CoffeeCard } from "@/components/coffee-card";
import { CoffeeFilters as FiltersPanel } from "@/components/coffee-filters";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

/** Converte a query string da URL nos filtros aceitos pela API. */
function toFilters(params: Record<string, string | string[] | undefined>): CoffeeFilters {
  const single = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };
  const numeric = (key: string) => {
    const value = single(key);
    return value ? Number(value) : undefined;
  };

  return {
    search: single("search"),
    beanType: single("beanType"),
    roastLevel: single("roastLevel"),
    process: single("process"),
    roaster: single("roaster"),
    brewMethod: single("brewMethod"),
    flavorNote: single("flavorNote"),
    minPrice: numeric("minPrice"),
    maxPrice: numeric("maxPrice"),
    sort: single("sort"),
    page: numeric("page") ?? 1,
    perPage: 12,
  };
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = toFilters(params);

  try {
    const [coffees, roasters, flavorNotes, brewMethods] = await Promise.all([
      api.coffees.list(filters),
      api.roasters.list(),
      api.flavorNotes.list(),
      api.brewMethods.list(),
    ]);

    const { meta } = coffees;
    const buildPageHref = (page: number) => {
      const next = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (typeof value === "string" && key !== "page") next.set(key, value);
      }
      next.set("page", String(page));
      return `/?${next}`;
    };

    return (
      <div className="flex flex-col gap-8">
        <section className="rounded-2xl bg-espresso px-6 py-10 text-cream">
          <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            Todos os cafés especiais do Brasil em um só lugar
          </h1>
          <p className="mt-3 max-w-2xl text-cream/80">
            Compare grãos, torras, processos e preços de várias torrefações. Quando encontrar o café certo, você vai
            direto para a loja do parceiro.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Suspense fallback={<div className="rounded-xl border border-latte bg-surface p-4">Carregando filtros…</div>}>
            <FiltersPanel roasters={roasters} flavorNotes={flavorNotes} brewMethods={brewMethods} />
          </Suspense>

          <section>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-espresso">
                {meta.total} {meta.total === 1 ? "café encontrado" : "cafés encontrados"}
              </h2>
              <p className="text-sm text-muted">
                Página {meta.page} de {meta.totalPages}
              </p>
            </div>

            {coffees.items.length === 0 ? (
              <p className="rounded-xl border border-dashed border-latte bg-surface p-8 text-center text-muted">
                Nenhum café corresponde a esses filtros. Tente ampliar a busca.
              </p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {coffees.items.map((coffee) => (
                  <CoffeeCard key={coffee.id} coffee={coffee} />
                ))}
              </div>
            )}

            {meta.totalPages > 1 ? (
              <nav aria-label="Paginação" className="mt-6 flex items-center justify-center gap-2">
                {Array.from({ length: meta.totalPages }, (_, index) => index + 1).map((page) => (
                  <Link
                    key={page}
                    href={buildPageHref(page)}
                    aria-current={page === meta.page ? "page" : undefined}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      page === meta.page ? "border-coffee bg-coffee text-cream" : "border-latte bg-surface text-ink"
                    }`}
                  >
                    {page}
                  </Link>
                ))}
              </nav>
            ) : null}
          </section>
        </div>
      </div>
    );
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "Não foi possível falar com a API.";

    return (
      <div className="rounded-xl border border-dashed border-latte bg-surface p-8 text-center">
        <h1 className="text-lg font-semibold text-espresso">Catálogo indisponível</h1>
        <p className="mt-2 text-muted">{message}</p>
        <p className="mt-2 text-sm text-muted">
          Verifique se a API está rodando e se <code className="font-mono">NEXT_PUBLIC_API_URL</code> aponta para ela.
        </p>
      </div>
    );
  }
}
