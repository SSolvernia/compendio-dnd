"use client";

import { useState } from "react";
import { Section, Label, SelectField, HelpTip } from "./ui";

function newItemId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `obj-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

const COINS = [
  ["pc", "Cobre"],
  ["pp", "Plata"],
  ["pe", "Electro"],
  ["po", "Oro"],
  ["ppt", "Platino"],
];

// Help text with an SRD armor's AC formula. `armor` is an equipo.json entry.
function armorHelp(armor) {
  if (!armor) return null;
  const ca = armor.ca || {};
  const rule =
    armor.tipo === "ligera"
      ? `CA ${ca.base} + tu modificador de Destreza completo`
      : armor.tipo === "media"
        ? `CA ${ca.base} + Destreza (máximo +2)`
        : `CA ${ca.base} fija (sin Destreza)`;
  const caveats = [
    armor.sigilo === "desventaja" ? "desventaja en Sigilo" : null,
    armor.fuerzaMinima ? `requiere Fuerza ${armor.fuerzaMinima}` : null,
  ].filter(Boolean);
  return `${armor.nombre} (${armor.tipo}): ${rule}.${caveats.length ? ` Ojo: ${caveats.join(" y ")}.` : ""}`;
}

export default function Equipment({ character, derived, srd, update }) {
  const [itemName, setItemName] = useState("");
  const eq = character.equipment;
  const armors = (srd.equipment?.armaduras || []).filter((a) => a.tipo !== "escudo");
  const shield = (srd.equipment?.armaduras || []).find((a) => a.tipo === "escudo");

  const equipArmor = (slug) => {
    if (!slug) return update(["equipment", "equippedArmor"], null);
    const a = armors.find((x) => x.slug === slug);
    if (!a) return;
    update(["equipment", "equippedArmor"], {
      slug: a.slug,
      nombre: a.nombre,
      tipo: a.tipo,
      base: a.ca?.base ?? 10,
      bonoMagico: 0,
    });
  };

  const toggleShield = () => {
    if (eq.equippedShield) return update(["equipment", "equippedShield"], null);
    update(["equipment", "equippedShield"], {
      slug: shield?.slug ?? "escudo",
      nombre: shield?.nombre ?? "Escudo",
      bonus: shield?.ca?.bonus ?? 2,
      bonoMagico: 0,
    });
  };

  const addItem = () => {
    const name = itemName.trim();
    if (!name) return;
    update(["equipment", "items"], [...eq.items, { id: newItemId(), nombre: name, cantidad: 1, peso: 0 }]);
    setItemName("");
  };

  const editItem = (id, field, value) =>
    update(
      ["equipment", "items"],
      eq.items.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );

  const removeItem = (id) =>
    update(["equipment", "items"], eq.items.filter((o) => o.id !== id));

  return (
    <Section title="Equipo">
      <div className="grid gap-3 sm:grid-cols-2">
        <SelectField
          label="Armadura equipada"
          value={eq.equippedArmor?.slug || ""}
          onChange={equipArmor}
          options={armors.map((a) => ({ value: a.slug, label: a.nombre }))}
          placeholder="Sin armadura"
        />
        <div>
          <Label className="mb-1 block">Escudo</Label>
          <button
            onClick={toggleShield}
            className={`w-full rounded-lg border px-3 py-2 text-sm transition ${
              eq.equippedShield
                ? "border-gold/70 bg-gold/15 text-gold-soft"
                : "border-line bg-ink-2 text-parch-dim hover:border-gold/40 hover:text-parch"
            }`}
          >
            {eq.equippedShield ? "Escudo embrazado (+2 CA)" : "Sin escudo"}
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-parch-dim">
        {eq.equippedArmor ? (
          <>
            <HelpTip text={armorHelp(armors.find((a) => a.slug === eq.equippedArmor.slug))}>
              CA resultante
            </HelpTip>
            : <span className="font-semibold text-gold-soft">{derived.ac}</span>
          </>
        ) : (
          <>
            CA resultante: <span className="font-semibold text-gold-soft">{derived.ac}</span>
          </>
        )}{" "}
        ·{" "}
        <HelpTip text="Peso máximo que puedes llevar sin penalización: tu puntuación de Fuerza × 15 (en libras; ≈ ×7,5 kg).">
          Capacidad de carga
        </HelpTip>
        : {derived.carryingCapacity}
      </p>

      {/* Objetos */}
      <div className="mt-4">
        <Label>Objetos</Label>
        <div className="mt-1.5 flex gap-2">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Añadir objeto…"
            className="flex-1 rounded-lg border border-line bg-ink-2 px-3 py-2 text-sm text-parch placeholder:text-parch-dim/60 outline-none focus:border-gold/60"
          />
          <button
            onClick={addItem}
            className="rounded-lg border border-gold/50 bg-gold/10 px-3 py-2 text-sm text-gold-soft transition hover:bg-gold/20"
          >
            +
          </button>
        </div>
        {eq.items.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {eq.items.map((o) => (
              <li
                key={o.id}
                className="flex items-center gap-2 rounded-lg border border-line bg-ink-2 px-2.5 py-1.5 text-sm"
              >
                <input
                  type="number"
                  min={1}
                  value={o.cantidad}
                  onChange={(e) => editItem(o.id, "cantidad", Math.max(1, Number(e.target.value) || 1))}
                  className="w-12 rounded border border-line bg-panel px-1 py-0.5 text-center text-parch outline-none focus:border-gold/60"
                  aria-label="Cantidad"
                />
                <span className="flex-1 truncate text-parch">{o.nombre}</span>
                <button
                  onClick={() => removeItem(o.id)}
                  aria-label="Quitar objeto"
                  className="text-parch-dim/60 transition hover:text-red-400"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Monedas */}
      <div className="mt-4">
        <Label>Monedas</Label>
        <div className="mt-1.5 grid grid-cols-5 gap-1.5">
          {COINS.map(([key, label]) => (
            <label key={key} className="block text-center">
              <span className="text-[0.6rem] uppercase text-parch-dim">{label}</span>
              <input
                type="number"
                min={0}
                value={eq.coins[key] ?? 0}
                onChange={(e) =>
                  update(["equipment", "coins", key], Math.max(0, Number(e.target.value) || 0))
                }
                className="mt-0.5 w-full rounded border border-line bg-panel px-1 py-1 text-center text-sm text-parch outline-none focus:border-gold/60"
              />
            </label>
          ))}
        </div>
      </div>
    </Section>
  );
}
