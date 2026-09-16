"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createRoasterAction, updateRoasterAction } from "@/app/admin/actions";
import { initialFormState } from "@/lib/form-state";
import { Field, FormMessage, SubmitButton, fieldClass } from "@/components/form-controls";
import type { Roaster } from "@/lib/types";

export function RoasterForm({ roaster }: { roaster?: Roaster }) {
  const isEditing = Boolean(roaster);
  const [state, formAction] = useActionState(isEditing ? updateRoasterAction : createRoasterAction, initialFormState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {roaster ? <input type="hidden" name="id" value={roaster.id} /> : null}
      <FormMessage state={state} />

      <Field label="Nome da torrefação">
        <input name="name" defaultValue={roaster?.name} required className={fieldClass} />
      </Field>

      <Field label="Descrição">
        <textarea name="description" defaultValue={roaster?.description ?? ""} rows={3} className={fieldClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Site oficial">
          <input name="websiteUrl" type="url" defaultValue={roaster?.websiteUrl} required className={fieldClass} />
        </Field>

        <Field label="URL do logo">
          <input name="logoUrl" type="url" defaultValue={roaster?.logoUrl ?? ""} className={fieldClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cidade">
          <input name="city" defaultValue={roaster?.city ?? ""} className={fieldClass} />
        </Field>

        <Field label="UF" hint="Duas letras, ex.: MG">
          <input name="state" maxLength={2} defaultValue={roaster?.state ?? ""} className={fieldClass} />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{isEditing ? "Salvar alterações" : "Cadastrar torrefação"}</SubmitButton>
        <Link href="/admin/torrefacoes" className="text-sm text-muted underline">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
