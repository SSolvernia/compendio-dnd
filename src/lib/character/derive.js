// Derived-stats aggregator. Takes the character (inputs) plus the SRD data indexed by
// slug and returns everything computed. Pure: no React.

import * as C from "./calculations.js";
import { ABILITIES, SKILLS, BASE_SPEED } from "./constants.js";
import { maxNivelConjuro } from "@/lib/dnd";

// character: see schema.js. srd: { classes, species, backgrounds, feats, tools, equipment }.
export function deriveCharacter(character, srd = {}) {
  const { abilities, proficiencies } = character;
  const level = Math.max(1, Math.min(20, Number(character.identity.level) || 1));

  const charClass = srd.classes?.[character.identity.classSlug] || null;
  const species = srd.species?.[character.identity.speciesSlug] || null;
  const hitDie = charClass?.dadoGolpe ?? "d8";
  const castingAbility = charClass?.caracteristicaLanzamiento ?? null;
  const casterType =
    charClass?.lanzador && charClass.lanzador !== "ninguno" ? charClass.lanzador : null;

  const prof = C.proficiencyBonus(level);

  const mods = Object.fromEntries(
    ABILITIES.map((a) => [a, C.abilityModifier(abilities[a])])
  );

  const saves = Object.fromEntries(
    ABILITIES.map((a) => [a, C.saveBonus(a, abilities, proficiencies, level)])
  );

  const skills = Object.fromEntries(
    SKILLS.map((s) => [s.slug, C.skillBonus(s.slug, abilities, proficiencies, level)])
  );

  const ac = C.calculateAC(
    abilities,
    character.equipment,
    charClass?.formulasCA || [],
    character.combat?.acBonus || 0
  );

  const maxHP = C.calculateMaxHP({
    level,
    hitDie,
    abilities,
    mode: character.hp.mode,
    manualMax: character.hp.maxOverride,
  });

  const caster = castingAbility
    ? {
        ability: castingAbility,
        dc: C.spellSaveDC(abilities, level, castingAbility),
        attack: C.spellAttack(abilities, level, castingAbility),
        slots: C.spellSlots(casterType, level),
        maxSpellLevel: casterType ? maxNivelConjuro(casterType, level) : 0,
        type: casterType,
        // Class-table columns from the SRD (null when the class lacks them).
        knownCantrips: charClass?.trucosPorNivel?.[level - 1] ?? null,
        maxPrepared: charClass?.conjurosPreparadosPorNivel?.[level - 1] ?? null,
      }
    : null;

  return {
    level,
    prof,
    mods,
    saves,
    skills,
    ac,
    maxHP,
    initiative: C.initiative(abilities, character.combat?.initiativeBonus || 0),
    passivePerception: C.passivePerception(abilities, proficiencies, level),
    carryingCapacity: C.carryingCapacity(abilities),
    speed: species?.velocidad ?? BASE_SPEED,
    size: species?.tamaño ?? null,
    hitDie,
    caster,
    className: charClass?.nombre ?? null,
  };
}
