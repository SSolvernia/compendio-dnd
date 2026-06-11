"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio", match: (p) => p === "/" },
  { href: "/grimorio", label: "Grimorio", match: (p) => p.startsWith("/grimorio") },
  { href: "/clases", label: "Clases", match: (p) => p.startsWith("/clases") },
  { href: "/personaje", label: "Ficha", match: (p) => p.startsWith("/personaje") },
];

export default function SiteNav() {
  const pathname = usePathname() || "/";

  return (
    <header className="relative z-20 border-b border-line/80 bg-ink/70 backdrop-blur-md print:hidden">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-gold transition group-hover:rotate-12">✦</span>
          <span className="truncate font-display text-base font-semibold tracking-wide text-parch sm:text-lg">
            Compendio
            <span className="ml-1 hidden text-xs font-normal text-parch-dim sm:inline">
              D&amp;D 2024
            </span>
          </span>
        </Link>

        <ul className="flex shrink-0 items-center gap-0.5 text-sm sm:gap-1">
          {LINKS.map((l) => {
            const activo = l.match(pathname);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-lg px-2.5 py-1.5 font-display tracking-wide transition sm:px-3 ${
                    activo
                      ? "bg-gold/15 text-gold-soft"
                      : "text-parch-dim hover:bg-panel hover:text-parch"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
