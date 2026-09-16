import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { CoffeeForm } from "@/components/coffee-form";

export const metadata = { title: "Editar café | Administração QueroKafé" };

export default async function EditCoffeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let coffee;
  try {
    coffee = await api.coffees.get(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const [roasters, flavorNotes, brewMethods] = await Promise.all([
    api.roasters.list(),
    api.flavorNotes.list(),
    api.brewMethods.list(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-espresso">Editar {coffee.name}</h1>
        <p className="mt-1 text-muted">Alterações aparecem no catálogo imediatamente.</p>
      </header>

      <CoffeeForm roasters={roasters} flavorNotes={flavorNotes} brewMethods={brewMethods} coffee={coffee} />
    </div>
  );
}
