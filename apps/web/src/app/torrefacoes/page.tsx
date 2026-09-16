import Link from "next/link";
import { api } from "@/lib/api";

export const metadata = {
  title: "Torrefações parceiras | QueroKafé",
  description: "Conheça as torrefações que anunciam seus cafés especiais no QueroKafé.",
};

export default async function RoastersPage() {
  const roasters = await api.roasters.list();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-espresso">Torrefações parceiras</h1>
        <p className="mt-1 text-muted">
          {roasters.length} {roasters.length === 1 ? "torrefação anuncia" : "torrefações anunciam"} seus cafés no
          QueroKafé.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roasters.map((roaster) => (
          <li key={roaster.id} className="flex flex-col gap-2 rounded-xl border border-latte bg-surface p-5">
            <h2 className="text-lg font-semibold text-espresso">{roaster.name}</h2>
            {roaster.city ? (
              <p className="text-sm text-muted">
                {roaster.city}
                {roaster.state ? ` — ${roaster.state}` : ""}
              </p>
            ) : null}
            {roaster.description ? <p className="text-sm text-ink/80">{roaster.description}</p> : null}

            <div className="mt-auto flex flex-wrap gap-3 pt-3 text-sm">
              <Link href={`/?roaster=${roaster.slug}`} className="font-medium text-coffee underline">
                Ver {roaster._count?.coffees ?? 0} cafés
              </Link>
              <a href={roaster.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-muted underline">
                Site oficial ↗
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
