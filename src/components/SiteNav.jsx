"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Inicio", match: (p) => p === "/" },
  { href: "/grimorio", label: "Grimorio", match: (p) => p.startsWith("/grimorio") },
  { href: "/clases", label: "Clases", match: (p) => p.startsWith("/clases") },
];

export default function SiteNav() {
  const pathname = usePathname() || "/";

  return (
    <header className="relative z-20 border-b border-line/80 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-gold transition group-hover:rotate-12">✦</span>
          <span className="font-display text-lg font-semibold tracking-wide text-parch">
            Compendio
            <span className="ml-1 text-xs font-normal text-parch-dim">D&amp;D 2024</span>
          </span>
        </Link>

        <ul className="flex items-center gap-1 text-sm">
          {LINKS.map((l) => {
            const activo = l.match(pathname);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`rounded-lg px-3 py-1.5 font-display tracking-wide transition ${
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
