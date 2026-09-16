import { api } from "@/lib/api";
import {
  createFlavorNoteAction,
  deleteFlavorNoteAction,
  updateFlavorNoteAction,
} from "@/app/admin/actions";
import { TaxonomyManager } from "@/components/taxonomy-manager";

export const metadata = { title: "Notas sensoriais | Administração QueroKafé" };

export default async function AdminFlavorNotesPage() {
  const flavorNotes = await api.flavorNotes.list();

  return (
    <TaxonomyManager
      title="Notas sensoriais"
      description="Descritores de sabor usados como filtro no catálogo."
      items={flavorNotes}
      createAction={createFlavorNoteAction}
      updateAction={updateFlavorNoteAction}
      deleteAction={deleteFlavorNoteAction}
    />
  );
}
