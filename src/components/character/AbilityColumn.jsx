"use client";

import { ABILITIES, SKILLS } from "@/lib/character/constants";
import { withSign, gradeBonus } from "@/lib/character/calculations";
import { SALVACION_LABEL } from "@/lib/dnd";
import { Label, HelpTip, ToolHelp } from "./ui";

// Proficiency grade cycle for the skill toggles.
const CYCLE = { none: "proficient", proficient: "expert", expert: "none" };
const GLYPH = { none: "○", proficient: "●", expert: "★" };
const GRADE_LABEL = { none: "Sin competencia", proficient: "Competente", expert: "Experto", half: "Media competencia" };

// Column matching the official 2024 sheet: proficiency bonus on top, one block per
// ability with its saving throw and skills inside, equipment training at the bottom.
export default function AbilityColumn({ character, derived, srd, update }) {
  const grades = character.proficiencies.skills;
  const charClass = srd.classes?.[character.identity.classSlug];
  const background = srd.backgrounds?.[character.identity.backgroundSlug];

  // Skills the class offers to pick (✦). Bardo lists "Cualquiera" = all of them.
  const offered = charClass?.competenciasHabilidades?.opciones || [];
  const allOffered = offered.includes("Cualquiera");
  const offeredSet = new Set(offered);

  const cycleSkill = (slug) => {
    const current = grades[slug] ?? "none";
    update(["proficiencies", "skills", slug], CYCLE[current]);
  };

  return (
    <div className="space-y-3">
      {/* Bonificador por competencia (arriba, como la hoja oficial) */}
      <div className="flex items-center justify-between gap-2 rounded-xl border border-line bg-panel/60 px-4 py-3">
        <HelpTip
          align="start"
          text={`Se suma a las tiradas en las que eres competente: habilidades, salvaciones, ataques y conjuros. Sube con tu nivel (nivel ${derived.level}).`}
        >
          <Label>Bonificador por competencia</Label>
        </HelpTip>
        <span className="font-display text-2xl font-bold text-gold-soft">
          {withSign(derived.prof)}
        </span>
      </div>

      {/* Un bloque por característica */}
      {ABILITIES.map((abi) => (
        <AbilityBlock
          key={abi}
          abi={abi}
          character={character}
          derived={derived}
          update={update}
          grades={grades}
          cycleSkill={cycleSkill}
          allOffered={allOffered}
          offeredSet={offeredSet}
        />
      ))}

      {/* Entrenamiento y competencias con equipo (abajo, como la hoja oficial) */}
      {charClass || background ? (
        <div className="rounded-xl border border-line bg-panel/60 p-4 text-sm">
          <Label>Entrenamiento con equipo</Label>
          <ul className="mt-1.5 space-y-1 text-parch-dim">
            {charClass ? (
              <>
                <li>
                  <span className="text-parch">Armaduras:</span>{" "}
                  {charClass.armaduras?.length ? charClass.armaduras.join(", ") : "Ninguna"}
                </li>
                <li>
                  <span className="text-parch">Armas:</span>{" "}
                  {charClass.armas?.length ? charClass.armas.join(", ") : "Ninguna"}
                </li>
              </>
            ) : null}
            {background?.competenciaHerramientas?.length ? (
              <li>
                <span className="text-parch">Herramientas:</span>{" "}
                {background.competenciaHerramientas.map((name, i) => {
                  const tool = srd.tools?.[background.herramientasSlugs?.[i]];
                  return (
                    <span key={name}>
                      {i > 0 ? ", " : ""}
                      {tool ? (
                        <HelpTip align="start" text={<ToolHelp tool={tool} />}>{name}</HelpTip>
                      ) : (
                        name
                      )}
                    </span>
                  );
                })}
              </li>
            ) : null}
          </ul>
        </div>
      ) : null}

      <p className="px-1 text-[0.65rem] text-parch-dim/70">
        Pulsa el círculo para alternar: ○ nada · ● competente · ★ experto. ✦ = habilidad
        ofrecida por tu clase. Pasa el cursor por los nombres para ver qué hacen.
      </p>
    </div>
  );
}

function AbilityBlock({ abi, character, derived, update, grades, cycleSkill, allOffered, offeredSet }) {
  const skills = SKILLS.filter((s) => s.ability === abi);
  const saveProficient = !!character.proficiencies.saves[abi];

  const saveHelp = (
    <>
      Tirada para resistir efectos que ponen a prueba tu {SALVACION_LABEL[abi]}.
      <span className="mt-1.5 block border-t border-line pt-1.5 text-gold-soft">
        Bono: {withSign(derived.mods[abi])} ({abi})
        {saveProficient ? ` ${withSign(derived.prof)} (competencia)` : ""} ={" "}
        {withSign(derived.saves[abi])}
      </span>
    </>
  );

  return (
    <div className="rounded-xl border border-line bg-panel/60 p-3">
      {/* Cabecera: nombre arriba; modificador grande y puntuación centrados (como la hoja oficial) */}
      <Label className="block text-center">{SALVACION_LABEL[abi]}</Label>
      <div className="mt-1 flex items-center justify-center gap-3">
        <span className="font-display text-3xl font-bold leading-tight text-gold-soft">
          {withSign(derived.mods[abi])}
        </span>
        <input
          type="number"
          min={1}
          max={30}
          value={character.abilities[abi]}
          onChange={(e) =>
            update(["abilities", abi], Math.max(1, Math.min(30, Number(e.target.value) || 0)))
          }
          aria-label={`Puntuación de ${SALVACION_LABEL[abi]}`}
          title="Puntuación de característica"
          className="w-14 rounded-lg border border-line bg-ink-2 px-2 py-1 text-center font-display text-lg text-parch outline-none transition focus:border-gold/60 focus:ring-1 focus:ring-gold/40"
        />
      </div>

      {/* Salvación + habilidades de esta característica */}
      <ul className="mt-2 space-y-1 border-t border-line pt-2">
        <li className="flex items-center gap-2 rounded-lg bg-ink-2 px-2 py-1.5">
          <button
            onClick={() => update(["proficiencies", "saves", abi], !saveProficient)}
            aria-label={`Competencia en salvación de ${SALVACION_LABEL[abi]}`}
            className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border text-[0.6rem] transition ${
              saveProficient
                ? "border-gold bg-gold text-ink"
                : "border-line text-transparent hover:border-gold/40"
            }`}
          >
            ●
          </button>
          <span className="min-w-0 flex-1 text-sm text-parch">
            <HelpTip align="start" text={saveHelp}>Tirada de salvación</HelpTip>
          </span>
          <span className="font-mono text-sm text-gold-soft">{withSign(derived.saves[abi])}</span>
        </li>

        {skills.map((s) => {
          const grade = grades[s.slug] ?? "none";
          const bonus = derived.skills[s.slug];
          const isOffered = allOffered || offeredSet.has(s.label);
          const compBonus = gradeBonus(grade, derived.prof);
          return (
            <li key={s.slug} className="flex items-center gap-2 rounded-lg bg-ink-2 px-2 py-1.5">
              <button
                onClick={() => cycleSkill(s.slug)}
                title={GRADE_LABEL[grade]}
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs transition ${
                  grade === "none"
                    ? "border-line text-parch-dim/60 hover:border-gold/40"
                    : "border-gold/60 bg-gold/10 text-gold-soft"
                }`}
              >
                {GLYPH[grade]}
              </button>
              <span className="min-w-0 flex-1 text-sm leading-tight text-parch">
                <HelpTip
                  align="start"
                  text={
                    <>
                      <b className="text-parch">{s.label}</b> ({SALVACION_LABEL[abi]}). {s.description}
                      <span className="mt-1.5 block border-t border-line pt-1.5 text-gold-soft">
                        Bono: {withSign(derived.mods[abi])} ({abi})
                        {compBonus ? ` ${withSign(compBonus)} (${GRADE_LABEL[grade].toLowerCase()})` : ""}{" "}
                        = {withSign(bonus)}
                      </span>
                    </>
                  }
                >
                  {s.label}
                </HelpTip>
                {isOffered ? (
                  <span title="Habilidad ofrecida por tu clase" className="ml-1 text-gold-dim">
                    ✦
                  </span>
                ) : null}
              </span>
              <span className="font-mono text-sm text-gold-soft">{withSign(bonus)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
