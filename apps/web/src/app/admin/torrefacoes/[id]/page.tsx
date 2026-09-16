import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { RoasterForm } from "@/components/roaster-form";

export const metadata = { title: "Editar torrefação | Administração QueroKafé" };

export default async function EditRoasterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let roaster;
  try {
    roaster = await api.roasters.get(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-espresso">Editar {roaster.name}</h1>
      </header>

      <RoasterForm roaster={roaster} />
    </div>
  );
}
