import { api } from "@/lib/api";
import {
  createBrewMethodAction,
  deleteBrewMethodAction,
  updateBrewMethodAction,
} from "@/app/admin/actions";
import { TaxonomyManager } from "@/components/taxonomy-manager";

export const metadata = { title: "Métodos de preparo | Administração QueroKafé" };

export default async function AdminBrewMethodsPage() {
  const brewMethods = await api.brewMethods.list();

  return (
    <TaxonomyManager
      title="Métodos de preparo"
      description="Formas de extração recomendadas para cada café."
      items={brewMethods}
      withDescription
      createAction={createBrewMethodAction}
      updateAction={updateBrewMethodAction}
      deleteAction={deleteBrewMethodAction}
    />
  );
}
