import Link from "next/link";
import { api } from "@/lib/api";
import { deleteCoffeeAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/form-controls";
import { formatPrice, formatWeight } from "@/lib/format";
import { ROAST_LEVEL_LABELS } from "@/lib/types";

export const metadata = { title: "Cafés | Administração QueroKafé" };

export default async function AdminCoffeesPage() {
  const coffees = await api.coffees.list({ perPage: 60, onlyActive: false });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Cafés</h1>
          <p className="mt-1 text-muted">{coffees.meta.total} anúncios cadastrados.</p>
        </div>
        <Link href="/admin/cafes/novo" className="rounded-lg bg-coffee px-4 py-2 font-semibold text-cream hover:bg-espresso">
          Novo café
        </Link>
      </header>

      <div className="overflow-x-auto rounded-xl border border-latte bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-latte text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="p-3">Café</th>
              <th className="p-3">Torrefação</th>
              <th className="p-3">Torra</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Cliques</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-latte">
            {coffees.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted">
                  Nenhum café cadastrado. Comece criando uma torrefação e depois um café.
                </td>
              </tr>
            ) : null}

            {coffees.items.map((coffee) => (
              <tr key={coffee.id}>
                <td className="p-3">
                  <Link href={`/cafes/${coffee.slug}`} className="font-medium text-espresso underline">
                    {coffee.name}
                  </Link>
                  <p className="text-xs text-muted">{formatWeight(coffee.weightGrams)}</p>
                </td>
                <td className="p-3">{coffee.roaster.name}</td>
                <td className="p-3">{ROAST_LEVEL_LABELS[coffee.roastLevel]}</td>
                <td className="p-3">{formatPrice(coffee.priceCents)}</td>
                <td className="p-3">{coffee.clickCount}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      coffee.active ? "bg-green-100 text-green-800" : "bg-latte text-muted"
                    }`}
                  >
                    {coffee.active ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/cafes/${coffee.id}`}
                      className="rounded-lg border border-latte px-3 py-1.5 text-espresso transition hover:bg-latte"
                    >
                      Editar
                    </Link>
                    <form action={deleteCoffeeAction}>
                      <input type="hidden" name="id" value={coffee.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
