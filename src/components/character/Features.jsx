"use client";

import { SKILLS, SUBCLASS_LEVEL } from "@/lib/character/constants";
import { Section, Label, SelectField, HelpTip, ToolHelp } from "./ui";

function FeatureList({ features }) {
  if (!features?.length) return null;
  return (
    <ul className="space-y-1.5">
      {features.map((f, i) => (
        <li key={f.slug || f.nombre || i}>
          <details className="rounded-lg border border-line bg-ink-2 px-3 py-2">
            <summary className="flex cursor-pointer items-center gap-2 text-sm text-parch">
              {typeof f.nivel === "number" ? (
                <span className="grid h-5 min-w-5 place-items-center rounded border border-gold/40 bg-gold/10 px-1 text-[0.65rem] font-semibold text-gold-soft">
                  {f.nivel}
                </span>
              ) : null}
              <span className="font-display">{f.nombre}</span>
            </summary>
            <p className="mt-1.5 text-sm leading-relaxed text-parch-dim">{f.descripcion}</p>
          </details>
        </li>
      ))}
    </ul>
  );
}

export default function Features({ character, derived, srd, update }) {
  const id = character.identity;
  const charClass = srd.classes?.[id.classSlug] || null;
  const species = srd.species?.[id.speciesSlug] || null;
  const background = srd.backgrounds?.[id.backgroundSlug] || null;
  const featList = srd.lists?.feats || [];
  const chosenFeats = character.traits.featSlugs;

  const classFeatures = (charClass?.rasgosPorNivel || []).filter(
    (f) => (f.nivel ?? 1) <= derived.level
  );

  // Subclass: only visible once the unlock level is reached; its features, only those
  // of levels you already have.
  const subclassUnlocked = derived.level >= SUBCLASS_LEVEL;
  const subclass = subclassUnlocked
    ? (charClass?.subclases || []).find((s) => s.slug === id.subclassSlug) || null
    : null;
  const subclassFeatures = (subclass?.rasgos || []).filter((f) => f.nivel <= derived.level);
  const nextSubclassFeature = (subclass?.rasgos || []).find((f) => f.nivel > derived.level);

  const addFeat = (slug) => {
    if (!slug || chosenFeats.includes(slug)) return;
    update(["traits", "featSlugs"], [...chosenFeats, slug]);
  };
  const removeFeat = (slug) =>
    update(["traits", "featSlugs"], chosenFeats.filter((x) => x !== slug));

  return (
    <Section title="Rasgos y trasfondo">
      {/* Rasgos de clase */}
      <div>
        <Label>
          Rasgos de clase {charClass ? `· ${charClass.nombre} (hasta nivel ${derived.level})` : ""}
        </Label>
        {classFeatures.length ? (
          <div className="mt-1.5">
            <FeatureList features={classFeatures} />
          </div>
        ) : (
          <p className="mt-1.5 text-sm text-parch-dim">Elige una clase para ver sus rasgos.</p>
        )}
      </div>

      {/* Subclase (solo desde el nivel de desbloqueo) */}
      {charClass && subclassUnlocked ? (
        <div className="mt-4">
          <Label>Subclase{subclass ? ` · ${subclass.nombre}` : ""}</Label>
          {subclass ? (
            <>
              {subclass.descripcion ? (
                <p className="mt-1.5 rounded-lg border border-line bg-ink-2 p-3 text-sm leading-relaxed text-parch-dim">
                  {subclass.descripcion}
                </p>
              ) : null}
              {subclassFeatures.length ? (
                <div className="mt-2">
                  <FeatureList features={subclassFeatures} />
                </div>
              ) : null}
              {nextSubclassFeature ? (
                <p className="mt-2 text-[0.7rem] text-parch-dim/70">
                  Siguiente rasgo de subclase a nivel {nextSubclassFeature.nivel}.
                </p>
              ) : null}
            </>
          ) : (
            <p className="mt-1.5 rounded-lg border border-dashed border-line bg-ink-2/50 py-3 text-center text-sm text-parch-dim">
              Ya puedes elegir subclase: hazlo en el apartado «Identidad».
            </p>
          )}
        </div>
      ) : null}

      {/* Rasgos de especie */}
      {species ? (
        <div className="mt-4">
          <Label>Rasgos de especie · {species.nombre}</Label>
          <div className="mt-1.5">
            <FeatureList features={species.rasgos} />
          </div>
        </div>
      ) : null}

      {/* Trasfondo */}
      {background ? (
        <div className="mt-4 rounded-lg border border-line bg-ink-2 p-3 text-sm">
          <Label>Trasfondo · {background.nombre}</Label>
          <ul className="mt-1.5 space-y-1 text-parch-dim">
            <li>
              <span className="text-parch">Dote:</span>{" "}
              {srd.feats?.[background.doteSlug] ? (
                <HelpTip
                  text={
                    <>
                      <b className="text-parch">{srd.feats[background.doteSlug].nombre}</b>.{" "}
                      {srd.feats[background.doteSlug].descripcion}
                    </>
                  }
                >
                  {background.dote}
                </HelpTip>
              ) : (
                background.dote
              )}
            </li>
            <li>
              <span className="text-parch">Habilidades:</span>{" "}
              {(background.competenciasHabilidades || []).map((name, i) => {
                const skill = SKILLS.find((s) => s.label === name);
                return (
                  <span key={name}>
                    {i > 0 ? ", " : ""}
                    {skill ? <HelpTip text={skill.description}>{name}</HelpTip> : name}
                  </span>
                );
              })}
            </li>
            {background.competenciaHerramientas?.length ? (
              <li>
                <span className="text-parch">Herramientas:</span>{" "}
                {background.competenciaHerramientas.map((name, i) => {
                  const tool = srd.tools?.[background.herramientasSlugs?.[i]];
                  return (
                    <span key={name}>
                      {i > 0 ? ", " : ""}
                      {tool ? <HelpTip text={<ToolHelp tool={tool} />}>{name}</HelpTip> : name}
                    </span>
                  );
                })}
              </li>
            ) : null}
            <li>
              <span className="text-parch">Características:</span>{" "}
              <HelpTip text="Tu trasfondo te deja repartir mejoras entre estas tres características: +2 a una y +1 a otra, o +1 a las tres (máximo 20). Aplícalas a las puntuaciones de la columna de características.">
                {(background.caracteristicas || []).join(", ")}
              </HelpTip>
            </li>
          </ul>
        </div>
      ) : null}

      {/* Dotes elegidas */}
      <div className="mt-4">
        <Label>Dotes</Label>
        <div className="mt-1.5">
          <SelectField
            value=""
            onChange={addFeat}
            options={featList
              .filter((f) => !chosenFeats.includes(f.slug))
              .map((f) => ({ value: f.slug, label: f.nombre }))}
            placeholder="Añadir dote…"
          />
        </div>
        {chosenFeats.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {chosenFeats.map((slug) => {
              const feat = srd.feats?.[slug];
              return (
                <span
                  key={slug}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs text-gold-soft"
                >
                  {feat ? (
                    <HelpTip
                      text={
                        <>
                          <b className="text-parch">{feat.nombre}</b>
                          {feat.categoria ? <span className="text-parch-dim"> · {feat.categoria}</span> : null}
                          {feat.requisitos ? (
                            <span className="block text-parch-dim">Requisito: {feat.requisitos}</span>
                          ) : null}{" "}
                          {feat.descripcion}
                        </>
                      }
                    >
                      {feat.nombre}
                    </HelpTip>
                  ) : (
                    slug
                  )}
                  <button onClick={() => removeFeat(slug)} aria-label="Quitar dote" className="hover:text-red-400">
                    ✕
                  </button>
                </span>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Notas */}
      <div className="mt-4">
        <Label>Notas</Label>
        <textarea
          value={character.notes}
          onChange={(e) => update(["notes"], e.target.value)}
          rows={4}
          placeholder="Trasfondo, personalidad, objetivos, recordatorios…"
          className="mt-1.5 w-full rounded-lg border border-line bg-ink-2 px-3 py-2 text-sm text-parch placeholder:text-parch-dim/60 outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/40"
        />
      </div>
    </Section>
  );
}
