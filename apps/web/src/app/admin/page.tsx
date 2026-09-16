import Link from "next/link";
import { api } from "@/lib/api";

export const metadata = { title: "Administração | QueroKafé" };

export default async function AdminHomePage() {
  const [coffees, roasters, flavorNotes, brewMethods] = await Promise.all([
    api.coffees.list({ perPage: 1, onlyActive: false }),
    api.roasters.list(),
    api.flavorNotes.list(),
    api.brewMethods.list(),
  ]);

  const cards = [
    { label: "Cafés no catálogo", value: coffees.meta.total, href: "/admin/cafes" },
    { label: "Torrefações parceiras", value: roasters.length, href: "/admin/torrefacoes" },
    { label: "Notas sensoriais", value: flavorNotes.length, href: "/admin/notas" },
    { label: "Métodos de preparo", value: brewMethods.length, href: "/admin/metodos" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-espresso">Administração</h1>
        <p className="mt-1 text-muted">
          Cadastre torrefações e cafés, e mantenha as taxonomias que alimentam os filtros do catálogo.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-latte bg-surface p-5 transition hover:border-coffee"
          >
            <p className="text-3xl font-bold text-espresso">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
