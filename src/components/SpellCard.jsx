"use client";

import { ESCUELA_COLOR, nivelCorto } from "@/lib/dnd";

export default function SpellCard({ spell, onClick, style }) {
  const color = ESCUELA_COLOR[spell.escuela] || "#d8b15a";

  return (
    <button
      onClick={onClick}
      style={style}
      className="surgir group flex w-full min-w-0 items-center gap-3 rounded-xl border border-line bg-panel/60 p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:bg-panel-2/70 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)] focus:outline-none focus-visible:border-gold/70 focus-visible:ring-1 focus-visible:ring-gold/40 sm:gap-3.5"
    >
      {/* Sigilo de nivel */}
      <span
        className="relative grid h-11 w-11 shrink-0 place-items-center rounded-lg font-display text-lg font-semibold"
        style={{
          color,
          background: `${color}1a`,
          border: `1px solid ${color}55`,
        }}
      >
        {nivelCorto(spell.nivel)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate font-display text-[1.05rem] font-semibold text-parch transition group-hover:text-gold-soft">
          {spell.nombre}
        </span>
        <span className="mt-0.5 block truncate text-xs text-parch-dim">
          <span style={{ color }}>{spell.escuela}</span>
          <span className="text-line"> · </span>
          {spell.tiempo}
        </span>
      </span>

      {/* Marcadores */}
      <span className="flex shrink-0 items-center gap-1">
        {spell.ritual ? (
          <span
            title="Ritual"
            className="grid h-6 w-6 place-items-center rounded-md border border-[#a974ff55] bg-[#a974ff1a] text-[0.7rem] font-semibold text-[#c4a0ff]"
          >
            R
          </span>
        ) : null}
        {spell.concentracion ? (
          <span
            title="Concentración"
            className="grid h-6 w-6 place-items-center rounded-md border border-[#38bdf855] bg-[#38bdf81a] text-[0.7rem] font-semibold text-[#7dd3fc]"
          >
            C
          </span>
        ) : null}
        <span className="ml-0.5 hidden font-mono text-[0.7rem] tracking-tight text-parch-dim/60 sm:inline">
          {spell.componentes.join("·")}
        </span>
      </span>
    </button>
  );
}
