import Link from "next/link";
import spells from "@/data/spells.json";
import { CLASES_DISPONIBLES } from "@/lib/clases";

export default function Home() {
  const secciones = [
    {
      href: "/grimorio",
      titulo: "Grimorio",
      glifo: "✦",
      desc: "Biblioteca de conjuros filtrable por clase, nivel, escuela y más.",
      dato: `${spells.length} conjuros`,
    },
    {
      href: "/clases",
      titulo: "Clases",
      glifo: "❖",
      desc: "Guías para entender cada clase: rasgos, tabla de progresión y subclases.",
      dato: `${CLASES_DISPONIBLES.length} disponible${CLASES_DISPONIBLES.length === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
      <header className="text-center">
        <p className="font-display text-[0.7rem] uppercase tracking-[0.35em] text-gold-dim">
          Dungeons &amp; Dragons · Reglas 2024 · en español
        </p>
        <h1 className="mt-4 bg-gradient-to-b from-gold-soft to-gold-dim bg-clip-text font-display text-5xl font-bold tracking-wide text-transparent sm:text-7xl">
          Compendio
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-parch-dim">
          Tu mesa de juego, ordenada. Consulta conjuros y aprende cómo funciona
          cada clase, todo traducido y fácil de explorar.
        </p>
        <div className="mx-auto mt-8 flex max-w-xs items-center gap-3">
          <div className="filete flex-1" />
          <span className="text-gold-dim">✦</span>
          <div className="filete flex-1" />
        </div>
      </header>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {secciones.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="surgir group relative overflow-hidden rounded-2xl border border-line bg-panel/60 p-7 transition duration-200 hover:-translate-y-1 hover:border-gold/50 hover:bg-panel-2/70"
          >
            <div className="flex items-start justify-between">
              <span className="font-display text-4xl text-gold transition group-hover:scale-110">
                {s.glifo}
              </span>
              <span className="rounded-full border border-line bg-ink-2 px-2.5 py-1 text-xs text-parch-dim">
                {s.dato}
              </span>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold text-parch transition group-hover:text-gold-soft">
              {s.titulo}
            </h2>
            <p className="mt-2 text-parch-dim">{s.desc}</p>
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-gold-dim transition group-hover:gap-2.5 group-hover:text-gold-soft">
              Explorar
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
