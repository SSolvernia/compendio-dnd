"use client";

import { useMemo, useState } from "react";
import { SRD } from "@/data/srd";
import { createCharacter, setIn } from "@/lib/character/schema";
import { deriveCharacter } from "@/lib/character/derive";
import SheetToolbar from "./SheetToolbar";
import Identity from "./Identity";
import CombatBar from "./CombatBar";
import AbilityColumn from "./AbilityColumn";
import StatsRow from "./StatsRow";
import Features from "./Features";
import Spells from "./Spells";
import Equipment from "./Equipment";

// Layout modeled after the official 2024 player sheet: identity + combat band on top,
// ability column (saves + skills inside each ability) on the left, quick stats and the
// rest of the content on the right.
export default function CharacterSheet() {
  const srd = SRD;
  const [character, setCharacter] = useState(() => createCharacter());

  // Immutable update by key path: update(["abilities","FUE"], 16).
  const update = (path, value) => setCharacter((c) => setIn(c, path, value));

  // Every derived stat recomputes here (no useEffect).
  const derived = useMemo(() => deriveCharacter(character, srd), [character, srd]);

  const props = { character, derived, srd, update, setCharacter };

  return (
    <div className="relative z-10 mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-6 text-center print:hidden">
        <p className="font-display text-[0.7rem] uppercase tracking-[0.35em] text-gold-dim">
          Dungeons &amp; Dragons · Reglas 2024
        </p>
        <h1 className="mt-2 bg-gradient-to-b from-gold-soft to-gold-dim bg-clip-text font-display text-4xl font-bold tracking-wide text-transparent sm:text-5xl">
          Ficha de personaje
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-parch-dim">
          Edita los campos y todo se calcula solo: modificadores, CA, competencia,
          salvaciones, CD de conjuros y más.
        </p>
      </header>

      <SheetToolbar character={character} setCharacter={setCharacter} />

      <div className="mt-5 space-y-5">
        {/* Banda superior: identidad + combate (como la cabecera de la hoja oficial) */}
        <div className="grid items-start gap-5 xl:grid-cols-[2fr_3fr]">
          <Identity {...props} className="xl:order-last" />
          <CombatBar {...props} />
        </div>

        {/* Cuerpo: columna de características | contenido */}
        <div className="grid items-start gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
          <AbilityColumn {...props} />
          <div className="min-w-0 space-y-5">
            <StatsRow {...props} />
            <div className="grid items-start gap-5 2xl:grid-cols-2">
              <Features {...props} />
              <div className="min-w-0 space-y-5">
                <Spells {...props} />
                <Equipment {...props} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 border-t border-line pt-6 text-center text-xs leading-relaxed text-parch-dim/70 print:hidden">
        <p>
          Reglas y datos de juego del{" "}
          <a
            className="text-gold-dim underline decoration-dotted underline-offset-2 hover:text-gold-soft"
            href="https://www.dndbeyond.com/srd"
            target="_blank"
            rel="noreferrer"
          >
            SRD 5.2.1
          </a>{" "}
          © Wizards of the Coast, bajo licencia{" "}
          <a
            className="text-gold-dim underline decoration-dotted underline-offset-2 hover:text-gold-soft"
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY 4.0
          </a>
          . Proyecto de fans sin ánimo de lucro.
        </p>
      </footer>
    </div>
  );
}
