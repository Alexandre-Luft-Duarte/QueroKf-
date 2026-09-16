import { RoasterForm } from "@/components/roaster-form";

export const metadata = { title: "Nova torrefação | Administração QueroKafé" };

export default function NewRoasterPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold text-espresso">Nova torrefação</h1>
        <p className="mt-1 text-muted">Parceiro que terá seus cafés listados no agregador.</p>
      </header>

      <RoasterForm />
    </div>
  );
}
