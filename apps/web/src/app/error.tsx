"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-dashed border-latte bg-surface p-10 text-center">
      <h1 className="text-xl font-semibold text-espresso">Algo deu errado</h1>
      <p className="mt-2 text-muted">{error.message || "Não foi possível carregar esta página."}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-coffee px-5 py-2.5 font-semibold text-cream hover:bg-espresso"
      >
        Tentar novamente
      </button>
    </div>
  );
}
