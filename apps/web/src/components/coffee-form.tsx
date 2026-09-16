"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createCoffeeAction, updateCoffeeAction } from "@/app/admin/actions";
import { initialFormState } from "@/lib/form-state";
import { Field, FormMessage, SubmitButton, fieldClass } from "@/components/form-controls";
import { BEAN_TYPE_LABELS, PROCESS_LABELS, ROAST_LEVEL_LABELS, type Coffee, type Roaster, type Taxonomy } from "@/lib/types";

type Props = {
  roasters: Roaster[];
  flavorNotes: Taxonomy[];
  brewMethods: Taxonomy[];
  coffee?: Coffee;
};

export function CoffeeForm({ roasters, flavorNotes, brewMethods, coffee }: Props) {
  const isEditing = Boolean(coffee);
  const [state, formAction] = useActionState(isEditing ? updateCoffeeAction : createCoffeeAction, initialFormState);

  const selectedNotes = new Set(coffee?.flavorNotes.map((note) => note.id));
  const selectedMethods = new Set(coffee?.brewMethods.map((method) => method.id));

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {coffee ? <input type="hidden" name="id" value={coffee.id} /> : null}
      <FormMessage state={state} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome do café">
          <input name="name" defaultValue={coffee?.name} required className={fieldClass} />
        </Field>

        <Field label="Torrefação">
          <select name="roasterId" defaultValue={coffee?.roasterId ?? ""} required className={fieldClass}>
            <option value="" disabled>
              Selecione...
            </option>
            {roasters.map((roaster) => (
              <option key={roaster.id} value={roaster.id}>
                {roaster.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Descrição">
        <textarea name="description" defaultValue={coffee?.description ?? ""} rows={3} className={fieldClass} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Preço (R$)" hint="Ex.: 54,90">
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={coffee ? (coffee.priceCents / 100).toFixed(2) : ""}
            className={fieldClass}
          />
        </Field>

        <Field label="Peso (g)">
          <input name="weightGrams" type="number" min="1" required defaultValue={coffee?.weightGrams ?? 250} className={fieldClass} />
        </Field>

        <Field label="Pontuação SCA" hint="Opcional, de 80 a 100">
          <input name="scaScore" type="number" min="0" max="100" defaultValue={coffee?.scaScore ?? ""} className={fieldClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Tipo de grão">
          <select name="beanType" defaultValue={coffee?.beanType ?? "ARABICA"} required className={fieldClass}>
            {Object.entries(BEAN_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Torra">
          <select name="roastLevel" defaultValue={coffee?.roastLevel ?? "MEDIA"} required className={fieldClass}>
            {Object.entries(ROAST_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Processo">
          <select name="process" defaultValue={coffee?.process ?? "NATURAL"} className={fieldClass}>
            {Object.entries(PROCESS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Origem">
          <input name="origin" defaultValue={coffee?.origin} required className={fieldClass} />
        </Field>

        <Field label="Região">
          <input name="region" defaultValue={coffee?.region ?? ""} className={fieldClass} />
        </Field>

        <Field label="Altitude (m)">
          <input name="altitude" type="number" min="0" max="3000" defaultValue={coffee?.altitude ?? ""} className={fieldClass} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="URL na loja parceira" hint="Para onde o usuário é redirecionado">
          <input name="storeUrl" type="url" defaultValue={coffee?.storeUrl} required className={fieldClass} />
        </Field>

        <Field label="URL da imagem">
          <input name="imageUrl" type="url" defaultValue={coffee?.imageUrl ?? ""} className={fieldClass} />
        </Field>
      </div>

      <fieldset className="rounded-lg border border-latte p-4">
        <legend className="px-1 text-sm font-medium">Notas sensoriais</legend>
        <div className="flex flex-wrap gap-3">
          {flavorNotes.map((note) => (
            <label key={note.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="flavorNoteIds" value={note.id} defaultChecked={selectedNotes.has(note.id)} />
              {note.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="rounded-lg border border-latte p-4">
        <legend className="px-1 text-sm font-medium">Métodos de preparo</legend>
        <div className="flex flex-wrap gap-3">
          {brewMethods.map((method) => (
            <label key={method.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="brewMethodIds" value={method.id} defaultChecked={selectedMethods.has(method.id)} />
              {method.name}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={coffee?.active ?? true} />
        Anúncio ativo (visível no catálogo)
      </label>

      <div className="flex items-center gap-3">
        <SubmitButton>{isEditing ? "Salvar alterações" : "Cadastrar café"}</SubmitButton>
        <Link href="/admin/cafes" className="text-sm text-muted underline">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
