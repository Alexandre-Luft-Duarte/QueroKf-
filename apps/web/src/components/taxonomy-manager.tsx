"use client";

import { useActionState, useState } from "react";
import { initialFormState, type FormState } from "@/lib/form-state";
import { DeleteButton, FormMessage, SubmitButton, fieldClass } from "@/components/form-controls";
import type { Taxonomy } from "@/lib/types";

type Action = (prev: FormState, formData: FormData) => Promise<FormState>;

type Props = {
  title: string;
  description: string;
  items: Taxonomy[];
  withDescription?: boolean;
  createAction: Action;
  updateAction: Action;
  deleteAction: (formData: FormData) => Promise<void>;
};

/**
 * CRUD compacto para as entidades de taxonomia (notas sensoriais e métodos de preparo):
 * criar no topo, editar in-place na lista e excluir.
 */
export function TaxonomyManager({
  title,
  description,
  items,
  withDescription = false,
  createAction,
  updateAction,
  deleteAction,
}: Props) {
  const [createState, createFormAction] = useActionState(createAction, initialFormState);
  const [updateState, updateFormAction] = useActionState(updateAction, initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-espresso">{title}</h1>
        <p className="mt-1 text-muted">{description}</p>
      </header>

      <form action={createFormAction} className="flex flex-col gap-3 rounded-xl border border-latte bg-surface p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Adicionar</h2>
        <FormMessage state={createState} />
        <div className="flex flex-col gap-3 sm:flex-row">
          <input name="name" required placeholder="Nome" className={fieldClass} />
          {withDescription ? <input name="description" placeholder="Descrição (opcional)" className={fieldClass} /> : null}
          <SubmitButton>Adicionar</SubmitButton>
        </div>
      </form>

      <FormMessage state={updateState} />

      <ul className="divide-y divide-latte overflow-hidden rounded-xl border border-latte bg-surface">
        {items.length === 0 ? <li className="p-6 text-center text-muted">Nada cadastrado ainda.</li> : null}

        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            {editingId === item.id ? (
              <form action={updateFormAction} className="flex w-full flex-col gap-3 sm:flex-row">
                <input type="hidden" name="id" value={item.id} />
                <input name="name" defaultValue={item.name} required className={fieldClass} />
                {withDescription ? (
                  <input name="description" defaultValue={item.description ?? ""} placeholder="Descrição" className={fieldClass} />
                ) : null}
                <SubmitButton>Salvar</SubmitButton>
                <button type="button" onClick={() => setEditingId(null)} className="text-sm text-muted underline">
                  Cancelar
                </button>
              </form>
            ) : (
              <>
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  {item.description ? <p className="text-sm text-muted">{item.description}</p> : null}
                  <p className="text-xs text-muted">
                    {item._count?.coffees ?? 0} {item._count?.coffees === 1 ? "café" : "cafés"} · /{item.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(item.id)}
                    className="rounded-lg border border-latte px-3 py-1.5 text-sm text-espresso transition hover:bg-latte"
                  >
                    Editar
                  </button>
                  <form action={deleteAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton />
                  </form>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
