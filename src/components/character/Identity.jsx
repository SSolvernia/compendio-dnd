"use client";

import { setIn } from "@/lib/character/schema";
import { ABILITIES, SUBCLASS_LEVEL } from "@/lib/character/constants";
import { Section, Label, TextField, NumberField, SelectField } from "./ui";

const ALIGNMENTS = [
  "Legal bueno", "Neutral bueno", "Caótico bueno",
  "Legal neutral", "Neutral", "Caótico neutral",
  "Legal malvado", "Neutral malvado", "Caótico malvado",
];

export default function Identity({ character, derived, srd, update, setCharacter, className = "" }) {
  const id = character.identity;
  const charClass = srd.classes?.[id.classSlug] || null;
  const subclassUnlocked = derived.level >= SUBCLASS_LEVEL;

  const opts = (list) => (list || []).map((x) => ({ value: x.slug, label: x.nombre }));

  // Picking a class resets the subclass and initializes proficient saves.
  const pickClass = (slug) => {
    const c = srd.classes?.[slug] || null;
    setCharacter((prev) => {
      let next = setIn(prev, ["identity", "classSlug"], slug);
      next = setIn(next, ["identity", "subclassSlug"], "");
      const saves = Object.fromEntries(ABILITIES.map((a) => [a, false]));
      (c?.salvaciones || []).forEach((a) => (saves[a] = true));
      next = setIn(next, ["proficiencies", "saves"], saves);
      return next;
    });
  };

  return (
    <Section title="Identidad" className={className}>
      <div className="grid grid-cols-2 gap-3">
        <TextField
          className="col-span-2"
          label="Nombre del personaje"
          value={id.name}
          onChange={(v) => update(["identity", "name"], v)}
          placeholder="Tu héroe…"
        />
        <SelectField
          label="Clase"
          value={id.classSlug}
          onChange={pickClass}
          options={opts(srd.lists?.classes)}
          placeholder="Elige una clase"
        />
        {subclassUnlocked ? (
          <SelectField
            label="Subclase"
            value={id.subclassSlug}
            onChange={(v) => update(["identity", "subclassSlug"], v)}
            options={(charClass?.subclases || []).map((s) => ({ value: s.slug, label: s.nombre }))}
            placeholder={charClass ? "Elige subclase" : "—"}
          />
        ) : (
          <div>
            <Label className="mb-1 block">Subclase</Label>
            <div className="rounded-lg border border-dashed border-line bg-ink-2/50 px-3 py-2 text-sm text-parch-dim/70">
              Se desbloquea a nivel {SUBCLASS_LEVEL}
            </div>
          </div>
        )}
        <NumberField
          label="Nivel"
          value={id.level}
          min={1}
          max={20}
          onChange={(v) => update(["identity", "level"], v || 1)}
        />
        <SelectField
          label="Especie"
          value={id.speciesSlug}
          onChange={(v) => update(["identity", "speciesSlug"], v)}
          options={opts(srd.lists?.species)}
          placeholder="Elige especie"
        />
        <SelectField
          label="Trasfondo"
          value={id.backgroundSlug}
          onChange={(v) => update(["identity", "backgroundSlug"], v)}
          options={opts(srd.lists?.backgrounds)}
          placeholder="Elige trasfondo"
        />
        <SelectField
          label="Alineamiento"
          value={id.alignment}
          onChange={(v) => update(["identity", "alignment"], v)}
          options={ALIGNMENTS.map((a) => ({ value: a, label: a }))}
          placeholder="—"
        />
        <TextField
          label="Jugador"
          value={id.player}
          onChange={(v) => update(["identity", "player"], v)}
          placeholder="Tu nombre"
        />
      </div>
    </Section>
  );
}
