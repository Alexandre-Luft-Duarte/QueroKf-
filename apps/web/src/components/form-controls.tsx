"use client";

import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/form-state";

export const fieldClass =
  "w-full rounded-lg border border-latte bg-surface px-3 py-2 text-sm text-ink focus:border-coffee";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function SubmitButton({ children = "Salvar" }: { children?: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-coffee px-5 py-2.5 font-semibold text-cream transition hover:bg-espresso disabled:opacity-60"
    >
      {pending ? "Salvando..." : children}
    </button>
  );
}

/** Botão de exclusão com confirmação — usado nas tabelas do admin. */
export function DeleteButton({ label = "Excluir" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm("Tem certeza que deseja excluir? Essa ação não pode ser desfeita.")) {
          event.preventDefault();
        }
      }}
      className="rounded-lg border border-latte px-3 py-1.5 text-sm text-espresso transition hover:bg-latte disabled:opacity-60"
    >
      {pending ? "Excluindo..." : label}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  if (state.status === "idle" || !state.message) return null;

  return (
    <p
      role="status"
      className={`rounded-lg px-3 py-2 text-sm ${
        state.status === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
      }`}
    >
      {state.message}
    </p>
  );
}
