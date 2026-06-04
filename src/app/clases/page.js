import Link from "next/link";
import { CLASES_INDEX } from "@/lib/clases";

export const metadata = {
  title: "Clases",
  description: "Guías de clases de D&D 2024 en español.",
};

export default function ClasesPage() {
  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-10 text-center">
        <p className="font-display text-[0.7rem] uppercase tracking-[0.35em] text-gold-dim">
          Compendio · Guías de clase
        </p>
        <h1 className="mt-3 bg-gradient-to-b from-gold-soft to-gold-dim bg-clip-text font-display text-4xl font-bold tracking-wide text-transparent sm:text-5xl">
          Clases
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-parch-dim">
          Explicaciones claras de cada clase: rasgos, tabla de progresión nivel a
          nivel y subclases. Iremos añadiendo más.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CLASES_INDEX.map((c) => {
          if (!c.disponible) {
            return (
              <div
                key={c.slug}
                className="flex items-center justify-between rounded-xl border border-line/60 bg-panel/30 p-4 opacity-60"
              >
                <span className="font-display text-lg text-parch-dim">{c.nombre}</span>
                <span className="rounded-full border border-line bg-ink-2 px-2.5 py-1 text-[0.7rem] text-parch-dim/70">
                  Próximamente
                </span>
              </div>
            );
          }
          return (
            <Link
              key={c.slug}
              href={`/clases/${c.slug}`}
              className="surgir group relative overflow-hidden rounded-xl border bg-panel/60 p-4 transition duration-200 hover:-translate-y-0.5"
              style={{ borderColor: `${c.color}66` }}
            >
              <div
                className="absolute inset-x-0 top-0 h-0.5"
                style={{ background: c.color }}
              />
              <div className="flex items-center justify-between">
                <span
                  className="font-display text-xl font-semibold transition"
                  style={{ color: c.color }}
                >
                  {c.nombre}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 text-parch-dim transition group-hover:translate-x-1"
                  style={{ color: c.color }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </div>
              {c.lema ? (
                <p className="mt-2 text-sm text-parch-dim">{c.lema}</p>
              ) : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
