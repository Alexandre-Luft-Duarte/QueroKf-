import Link from "next/link";
import { api } from "@/lib/api";
import { deleteRoasterAction } from "@/app/admin/actions";
import { DeleteButton } from "@/components/form-controls";

export const metadata = { title: "Torrefações | Administração QueroKafé" };

export default async function AdminRoastersPage() {
  const roasters = await api.roasters.list();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-espresso">Torrefações</h1>
          <p className="mt-1 text-muted">{roasters.length} parceiros cadastrados.</p>
        </div>
        <Link
          href="/admin/torrefacoes/nova"
          className="rounded-lg bg-coffee px-4 py-2 font-semibold text-cream hover:bg-espresso"
        >
          Nova torrefação
        </Link>
      </header>

      <ul className="divide-y divide-latte overflow-hidden rounded-xl border border-latte bg-surface">
        {roasters.length === 0 ? <li className="p-6 text-center text-muted">Nenhuma torrefação cadastrada.</li> : null}

        {roasters.map((roaster) => (
          <li key={roaster.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-medium text-espresso">{roaster.name}</p>
              <p className="text-sm text-muted">
                {[roaster.city, roaster.state].filter(Boolean).join(" — ") || "Local não informado"} ·{" "}
                {roaster._count?.coffees ?? 0} cafés
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/torrefacoes/${roaster.id}`}
                className="rounded-lg border border-latte px-3 py-1.5 text-sm text-espresso transition hover:bg-latte"
              >
                Editar
              </Link>
              <form action={deleteRoasterAction}>
                <input type="hidden" name="id" value={roaster.id} />
                <DeleteButton />
              </form>
            </div>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted">
        Excluir uma torrefação remove também os cafés vinculados a ela (cascata definida no schema do Prisma).
      </p>
    </div>
  );
}
