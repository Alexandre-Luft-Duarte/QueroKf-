import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md rounded-xl border border-dashed border-latte bg-surface p-10 text-center">
      <p className="text-5xl" aria-hidden>
        ☕
      </p>
      <h1 className="mt-4 text-xl font-semibold text-espresso">Página não encontrada</h1>
      <p className="mt-2 text-muted">O café que você procura pode ter saído do catálogo.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-coffee px-5 py-2.5 font-semibold text-cream hover:bg-espresso">
        Voltar ao catálogo
      </Link>
    </div>
  );
}
