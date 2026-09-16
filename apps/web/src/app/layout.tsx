import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QueroKafé — encontre o café certo entre várias torrefações",
  description:
    "Agregador de cafés especiais: compare grãos, torras, métodos de preparo e preços de diversas torrefações em um só lugar.",
};

const apiDocsUrl = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333/api"}/docs`;

const navLinks = [
  { href: "/", label: "Catálogo" },
  { href: "/torrefacoes", label: "Torrefações" },
  { href: "/admin", label: "Administração" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <header className="border-b border-latte bg-espresso text-cream">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <span aria-hidden className="text-2xl">☕</span>
              QueroKafé
            </Link>
            <nav aria-label="Navegação principal">
              <ul className="flex flex-wrap items-center gap-1 text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-full px-3 py-1.5 transition hover:bg-coffee/40"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>

        <footer className="border-t border-latte bg-surface">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-muted">
            <p>
              QueroKafé é um agregador: a compra acontece no site da torrefação parceira. Projeto acadêmico —{" "}
              <a href={apiDocsUrl} className="underline">
                documentação da API
              </a>
              .
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
