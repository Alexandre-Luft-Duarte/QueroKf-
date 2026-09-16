"use client";

import { useState, useTransition } from "react";
import { api } from "@/lib/api";

/**
 * Leva o usuário para a loja parceira e contabiliza o clique de saída.
 * Se a API falhar, o link ainda abre — a métrica nunca bloqueia a compra.
 */
export function StoreRedirectButton({ coffeeSlug, storeUrl }: { coffeeSlug: string; storeUrl: string }) {
  const [isPending, startTransition] = useTransition();
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    setClicked(true);
    startTransition(async () => {
      try {
        await api.coffees.registerRedirect(coffeeSlug);
      } catch {
        // métrica é best-effort
      }
      window.open(storeUrl, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending && clicked}
      className="w-full rounded-lg bg-coffee px-5 py-3 text-center font-semibold text-cream transition hover:bg-espresso disabled:opacity-70"
    >
      {isPending && clicked ? "Abrindo a loja..." : "Comprar na loja parceira →"}
    </button>
  );
}
