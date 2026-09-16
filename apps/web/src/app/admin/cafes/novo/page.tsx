import { api } from "@/lib/api";
import { CoffeeForm } from "@/components/coffee-form";

export const metadata = { title: "Novo café | Administração QueroKafé" };

export default async function NewCoffeePage() {
  const [roasters, flavorNotes, brewMethods] = await Promise.all([
    api.roasters.list(),
    api.flavorNotes.list(),
    api.brewMethods.list(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-espresso">Novo café</h1>
        <p className="mt-1 text-muted">O anúncio aparece no catálogo e leva o usuário até a loja da torrefação.</p>
      </header>

      {roasters.length === 0 ? (
        <p className="rounded-xl border border-dashed border-latte bg-surface p-6 text-center text-muted">
          Cadastre uma torrefação antes de criar um café.
        </p>
      ) : (
        <CoffeeForm roasters={roasters} flavorNotes={flavorNotes} brewMethods={brewMethods} />
      )}
    </div>
  );
}
