"use client";

import { useMemo, useState } from "react";
import spells from "@/data/spells.json";
import { withSign } from "@/lib/character/calculations";
import { SALVACION_LABEL, nivelLabel } from "@/lib/dnd";
import { Section, Label, StatBox } from "./ui";
import SpellPicker from "./SpellPicker";
import SpellDetail from "@/components/SpellDetail";

const byId = new Map(spells.map((s) => [s.id, s]));

export default function Spells({ character, derived, srd, setCharacter, update }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selected, setSelected] = useState(null); // spell open in the detail modal
  const [units, setUnits] = useState("metrico");
  const caster = derived.caster;

  // Known spells resolved and grouped by level.
  const byLevel = useMemo(() => {
    const groups = new Map();
    for (const id of character.spells.known) {
      const s = byId.get(id);
      if (!s) continue;
      if (!groups.has(s.nivel)) groups.set(s.nivel, []);
      groups.get(s.nivel).push(s);
    }
    for (const list of groups.values()) list.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return [...groups.entries()].sort((a, b) => a[0] - b[0]);
  }, [character.spells.known]);

  if (!caster) {
    return (
      <Section title="Conjuros">
        <p className="text-sm text-parch-dim">
          Esta clase no lanza conjuros de forma innata. (Algunas subclases sí pueden hacerlo.)
        </p>
      </Section>
    );
  }

  const prepared = new Set(character.spells.prepared);
  const chosenCantrips = character.spells.known.filter((id) => byId.get(id)?.nivel === 0).length;

  const removeSpell = (id) =>
    setCharacter((prev) => ({
      ...prev,
      spells: {
        ...prev.spells,
        known: prev.spells.known.filter((x) => x !== id),
        prepared: prev.spells.prepared.filter((x) => x !== id),
      },
    }));
  const togglePrepared = (id) =>
    setCharacter((prev) => {
      const has = prev.spells.prepared.includes(id);
      return {
        ...prev,
        spells: {
          ...prev.spells,
          prepared: has
            ? prev.spells.prepared.filter((x) => x !== id)
            : [...prev.spells.prepared, id],
        },
      };
    });

  return (
    <Section
      title="Conjuros"
      action={
        <button
          onClick={() => setPickerOpen(true)}
          className="rounded-lg border border-gold/50 bg-gold/10 px-3 py-1.5 text-sm text-gold-soft transition hover:bg-gold/20"
        >
          + Añadir
        </button>
      }
    >
      {/* Estadísticas de lanzamiento */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox
          label="Característica"
          value={SALVACION_LABEL[caster.ability].slice(0, 3)}
          help={`Tu aptitud mágica es ${SALVACION_LABEL[caster.ability]}: su modificador alimenta la CD y el ataque de tus conjuros.`}
        />
        <StatBox
          label="CD de salvación"
          value={caster.dc}
          help={`Dificultad que deben superar las salvaciones contra tus conjuros: 8 + competencia (${withSign(derived.prof)}) + modificador de ${SALVACION_LABEL[caster.ability]} (${withSign(derived.mods[caster.ability])}).`}
        />
        <StatBox
          label="Ataque"
          value={withSign(caster.attack)}
          help={`Bono de tus tiradas de ataque con conjuros: competencia (${withSign(derived.prof)}) + modificador de ${SALVACION_LABEL[caster.ability]} (${withSign(derived.mods[caster.ability])}).`}
        />
      </div>

      {/* Contadores de la tabla de clase */}
      {caster.knownCantrips != null || caster.maxPrepared != null ? (
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-parch-dim">
          {caster.knownCantrips != null ? (
            <span
              className={`rounded-full border px-2.5 py-1 ${
                chosenCantrips > caster.knownCantrips
                  ? "border-red-400/60 bg-red-400/10 text-red-300"
                  : "border-line bg-ink-2"
              }`}
            >
              Trucos: {chosenCantrips}/{caster.knownCantrips}
            </span>
          ) : null}
          {caster.maxPrepared != null ? (
            <span
              className={`rounded-full border px-2.5 py-1 ${
                prepared.size > caster.maxPrepared
                  ? "border-red-400/60 bg-red-400/10 text-red-300"
                  : "border-line bg-ink-2"
              }`}
            >
              Preparados: {prepared.size}/{caster.maxPrepared}
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Espacios de conjuro */}
      <div className="mt-3">
        <Label>Espacios de conjuro</Label>
        {caster.slots.type === "pacto" ? (
          <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-line bg-ink-2 px-3 py-2 text-sm">
            <span className="text-parch">
              Pacto · {caster.slots.count}× espacios de {nivelLabel(caster.slots.slotLevel).toLowerCase()}
            </span>
            <UsageCounter
              className="ml-auto"
              used={character.spells.usedPactSlots}
              max={caster.slots.count}
              onChange={(v) => update(["spells", "usedPactSlots"], v)}
            />
          </div>
        ) : (
          <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {caster.slots.slots.map((max, i) => {
              if (max <= 0) return null;
              const level = i + 1;
              return (
                <div
                  key={level}
                  className="flex items-center gap-2 rounded-lg border border-line bg-ink-2 px-2.5 py-1.5 text-sm"
                >
                  <span className="text-parch-dim">Nv {level}</span>
                  <UsageCounter
                    className="ml-auto"
                    used={character.spells.usedSlots[level] || 0}
                    max={max}
                    onChange={(v) => update(["spells", "usedSlots", level], v)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lista de conjuros conocidos */}
      <div className="mt-4">
        <Label>Conocidos ({character.spells.known.length})</Label>
        {byLevel.length === 0 ? (
          <p className="mt-1.5 rounded-lg border border-dashed border-line bg-ink-2/50 py-4 text-center text-sm text-parch-dim">
            Aún no has añadido conjuros. Pulsa «+ Añadir».
          </p>
        ) : (
          <div className="mt-1.5 space-y-2">
            {byLevel.map(([level, list]) => (
              <div key={level}>
                <p className="mb-1 text-xs text-parch-dim">{nivelLabel(level)}</p>
                <ul className="space-y-1">
                  {list.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center gap-2 rounded-lg border border-line bg-ink-2 px-2.5 py-1.5 text-sm"
                    >
                      {level > 0 ? (
                        <button
                          onClick={() => togglePrepared(s.id)}
                          title={prepared.has(s.id) ? "Preparado" : "No preparado"}
                          className={`text-base transition ${
                            prepared.has(s.id) ? "text-gold-soft" : "text-parch-dim/50 hover:text-gold-dim"
                          }`}
                        >
                          ★
                        </button>
                      ) : (
                        <span className="text-base text-gold-dim" title="Truco (siempre disponible)">
                          ✦
                        </span>
                      )}
                      <button
                        onClick={() => setSelected(s)}
                        title="Ver detalle del conjuro"
                        className="min-w-0 flex-1 truncate text-left text-parch underline decoration-dotted decoration-gold-dim/40 underline-offset-2 transition hover:text-gold-soft hover:decoration-gold/70"
                      >
                        {s.nombre}
                      </button>
                      <span className="shrink-0 text-xs text-parch-dim">{s.escuela}</span>
                      <button
                        onClick={() => removeSpell(s.id)}
                        aria-label="Quitar"
                        className="shrink-0 text-parch-dim/60 transition hover:text-red-400"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {pickerOpen ? (
        <SpellPicker
          character={character}
          derived={derived}
          srd={srd}
          setCharacter={setCharacter}
          onClose={() => setPickerOpen(false)}
          onViewDetail={setSelected}
        />
      ) : null}

      {selected ? (
        <SpellDetail
          spell={selected}
          onClose={() => setSelected(null)}
          unidad={units}
          setUnidad={setUnits}
        />
      ) : null}
    </Section>
  );
}

function UsageCounter({ used: rawUsed, max, onChange, className = "" }) {
  // If the level drops, stored uses can exceed the new max: clamp at render time.
  const used = Math.min(rawUsed, max);
  const remaining = max - used;
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <button
        onClick={() => onChange(Math.max(0, used - 1))}
        className="grid h-6 w-6 place-items-center rounded-md border border-line text-parch-dim transition hover:border-gold/50 hover:text-gold-soft"
        aria-label="Recuperar espacio"
      >
        −
      </button>
      <span className="min-w-[2.5rem] text-center font-mono text-xs text-parch">
        {remaining}/{max}
      </span>
      <button
        onClick={() => onChange(Math.min(max, used + 1))}
        className="grid h-6 w-6 place-items-center rounded-md border border-line text-parch-dim transition hover:border-gold/50 hover:text-gold-soft"
        aria-label="Gastar espacio"
      >
        +
      </button>
    </span>
  );
}
