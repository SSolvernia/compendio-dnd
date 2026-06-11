"use client";

import { useMemo, useState } from "react";
import spells from "@/data/spells.json";
import { normaliza, nivelLabel } from "@/lib/dnd";

export default function SpellPicker({ character, derived, srd, setCharacter, onClose, onViewDetail }) {
  const [search, setSearch] = useState("");
  const className = srd.classes?.[character.identity.classSlug]?.nombre || null;
  const maxLevel = derived.caster?.maxSpellLevel ?? 9;
  const known = new Set(character.spells.known);
  const q = normaliza(search);

  const filtered = useMemo(() => {
    return spells.filter((s) => {
      if (className && !s.clases.includes(className)) return false;
      if (s.nivel > maxLevel) return false;
      if (q && !normaliza(s.nombre).includes(q)) return false;
      return true;
    });
  }, [className, maxLevel, q]);

  const toggle = (id) =>
    setCharacter((prev) => {
      const has = prev.spells.known.includes(id);
      const newKnown = has
        ? prev.spells.known.filter((x) => x !== id)
        : [...prev.spells.known, id];
      // Removing a known spell also unprepares it.
      const newPrepared = has
        ? prev.spells.prepared.filter((x) => x !== id)
        : prev.spells.prepared;
      return { ...prev, spells: { ...prev.spells, known: newKnown, prepared: newPrepared } };
    });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Añadir conjuros"
      tabIndex={-1}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6 print:hidden"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="surgir flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-gold/30 bg-panel shadow-[0_-10px_60px_rgba(0,0,0,0.7)] sm:rounded-2xl"
      >
        <div className="flex items-center gap-3 border-b border-line p-4">
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-lg font-semibold text-parch">Añadir conjuros</h2>
            <p className="text-xs text-parch-dim">
              {className ? `Lista de ${className}` : "Todas las clases"} · hasta {nivelLabel(maxLevel).toLowerCase()}
            </p>
          </div>
          <button
            autoFocus
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-parch-dim transition hover:border-gold/50 hover:text-gold-soft"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-line p-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar conjuro…"
            className="w-full rounded-lg border border-line bg-ink-2 px-3 py-2 text-parch placeholder:text-parch-dim/60 outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/40"
          />
        </div>

        <div className="overflow-y-auto p-3">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-parch-dim">Ningún conjuro coincide.</p>
          ) : (
            <ul className="space-y-1.5">
              {filtered.map((s) => {
                const has = known.has(s.id);
                return (
                  <li key={s.id} className="flex items-stretch gap-1.5">
                    <button
                      onClick={() => toggle(s.id)}
                      className={`flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        has
                          ? "border-gold/60 bg-gold/10 text-parch"
                          : "border-line bg-ink-2 text-parch-dim hover:border-gold/40 hover:text-parch"
                      }`}
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md border border-line text-xs text-gold-soft">
                        {has ? "✓" : "+"}
                      </span>
                      <span className="flex-1 truncate">{s.nombre}</span>
                      <span className="shrink-0 text-xs text-parch-dim">
                        {s.nivel === 0 ? "Truco" : `Nv ${s.nivel}`} · {s.escuela}
                      </span>
                    </button>
                    {onViewDetail ? (
                      <button
                        onClick={() => onViewDetail(s)}
                        title="Ver detalle del conjuro"
                        aria-label={`Ver detalle de ${s.nombre}`}
                        className="grid w-9 shrink-0 place-items-center rounded-lg border border-line bg-ink-2 text-sm text-parch-dim transition hover:border-gold/50 hover:text-gold-soft"
                      >
                        ⓘ
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
