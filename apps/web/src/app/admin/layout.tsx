import Link from "next/link";

const adminLinks = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/cafes", label: "Cafés" },
  { href: "/admin/torrefacoes", label: "Torrefações" },
  { href: "/admin/notas", label: "Notas sensoriais" },
  { href: "/admin/metodos", label: "Métodos de preparo" },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Administração" className="overflow-x-auto">
        <ul className="flex gap-2 text-sm">
          {adminLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-block whitespace-nowrap rounded-full border border-latte bg-surface px-4 py-2 text-espresso transition hover:bg-latte"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {children}
    </div>
  );
}
