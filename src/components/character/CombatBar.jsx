"use client";

import { Section, Label, StatBox } from "./ui";

// Header combat band, mirroring the top of the official 2024 sheet: AC | HP | hit dice.
export default function CombatBar({ character, derived, update, className = "" }) {
  const hp = character.hp;
  // Resolved at render (no effects). If the max drops (level/CON), current clamps.
  const current = Math.min(hp.current ?? derived.maxHP, derived.maxHP);

  const adjustCurrent = (delta) =>
    update(["hp", "current"], Math.max(0, Math.min(derived.maxHP, current + delta)));

  const acHelp = character.equipment.equippedArmor
    ? `Con ${character.equipment.equippedArmor.nombre}: base de la armadura + Destreza (limitada según el tipo)${character.equipment.equippedShield ? " + 2 de escudo" : ""}. Un ataque te impacta si iguala o supera este número.`
    : `Sin armadura: 10 + tu modificador de Destreza${character.equipment.equippedShield ? " + 2 de escudo" : ""} (las clases con defensa sin armadura usan su propia fórmula si es mayor). Un ataque te impacta si iguala o supera este número.`;

  return (
    <Section title="Combate" className={className}>
      <div className="grid gap-2 sm:grid-cols-2">
        <StatBox label="Clase de armadura" value={derived.ac} help={acHelp} size="lg" />
        <StatBox
          label="Dados de golpe"
          value={derived.hitDie}
          sub={`× ${derived.level}`}
          help="Dado de tu clase para recuperar Puntos de Golpe al descansar. Tienes tantos como tu nivel."
          size="lg"
        />
      </div>

      {/* Puntos de golpe: caja prominente a todo el ancho, como la hoja oficial */}
      <div className="mt-2 rounded-xl border border-line bg-ink-2 p-4">
        <div className="flex items-center justify-between">
          <Label>Puntos de golpe</Label>
          <div className="inline-flex overflow-hidden rounded-md border border-line text-[0.65rem]">
            {[
              ["fixed", "Auto"],
              ["manual", "Manual"],
            ].map(([mode, txt]) => (
              <button
                key={mode}
                onClick={() => update(["hp", "mode"], mode)}
                className={`px-2 py-0.5 transition ${
                  hp.mode === mode ? "bg-gold/20 text-gold-soft" : "text-parch-dim hover:text-parch"
                }`}
              >
                {txt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => adjustCurrent(-1)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-lg text-parch-dim transition hover:border-gold/50 hover:text-gold-soft"
            aria-label="Restar 1 PG"
          >
            −
          </button>
          <div className="text-center">
            <span className="font-display text-6xl font-bold text-parch">{current}</span>
            <span className="text-3xl text-parch-dim"> / {derived.maxHP}</span>
          </div>
          <button
            onClick={() => adjustCurrent(1)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-line text-lg text-parch-dim transition hover:border-gold/50 hover:text-gold-soft"
            aria-label="Sumar 1 PG"
          >
            +
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {hp.mode === "manual" ? (
            <label className="block">
              <Label className="mb-0.5 block">Máximo manual</Label>
              <input
                type="number"
                min={0}
                value={hp.maxOverride ?? ""}
                onChange={(e) =>
                  update(["hp", "maxOverride"], e.target.value === "" ? null : Number(e.target.value))
                }
                placeholder={`${derived.maxHP}`}
                className="w-full rounded-lg border border-line bg-panel px-2 py-1 text-center text-sm text-parch outline-none focus:border-gold/60"
              />
            </label>
          ) : (
            <div className="flex flex-col justify-center">
              <Label>Máx. automático</Label>
              <span className="text-xs text-parch-dim">
                {derived.hitDie} · nivel {derived.level}
              </span>
            </div>
          )}
          <label className="block">
            <Label className="mb-0.5 block">PG temporales</Label>
            <input
              type="number"
              min={0}
              value={hp.temp ?? 0}
              onChange={(e) => update(["hp", "temp"], Math.max(0, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-line bg-panel px-2 py-1 text-center text-sm text-parch outline-none focus:border-gold/60"
            />
          </label>
        </div>
      </div>

      {/* Modificadores misceláneos */}
      <details className="mt-2 rounded-lg border border-line bg-ink-2 px-3 py-2 text-sm">
        <summary className="cursor-pointer text-parch-dim">Modificadores extra</summary>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="block">
            <Label className="mb-1 block">CA extra</Label>
            <input
              type="number"
              value={character.combat.acBonus ?? 0}
              onChange={(e) => update(["combat", "acBonus"], Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-line bg-panel px-2 py-1 text-center text-parch outline-none focus:border-gold/60"
            />
          </label>
          <label className="block">
            <Label className="mb-1 block">Iniciativa extra</Label>
            <input
              type="number"
              value={character.combat.initiativeBonus ?? 0}
              onChange={(e) => update(["combat", "initiativeBonus"], Number(e.target.value) || 0)}
              className="w-full rounded-lg border border-line bg-panel px-2 py-1 text-center text-parch outline-none focus:border-gold/60"
            />
          </label>
        </div>
      </details>
    </Section>
  );
}
