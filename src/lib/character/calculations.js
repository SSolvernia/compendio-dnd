// D&D 2024 atomic formulas. Pure functions: plain data in, numbers/objects out.
// No React, no DOM, no state. Unit-testable.

import {
  SKILLS,
  DIE_AVERAGE,
  ARMOR_DEX_RULE,
  SPELL_SLOT_TABLE,
  WARLOCK_PACT,
} from "./constants.js";

// Ability modifier from an ability score.
export function abilityModifier(score) {
  return Math.floor(((Number(score) || 10) - 10) / 2);
}

// Formats a bonus with its sign (+3, -1, +0).
export function withSign(n) {
  const v = Number(n) || 0;
  return v >= 0 ? `+${v}` : `${v}`;
}

// Proficiency bonus by character level (2024: +2 to +6).
export function proficiencyBonus(level) {
  const n = Math.max(1, Math.min(20, Number(level) || 1));
  return 2 + Math.floor((n - 1) / 4);
}

// Bonus contributed by a skill proficiency grade.
export function gradeBonus(grade, prof) {
  if (grade === "expert") return prof * 2;
  if (grade === "proficient") return prof;
  if (grade === "half") return Math.floor(prof / 2);
  return 0;
}

// Number of die faces from "d8" or 8.
export function dieFaces(hitDie) {
  if (typeof hitDie === "number") return hitDie;
  const m = /d?(\d+)/i.exec(String(hitDie || "d8"));
  return m ? Number(m[1]) : 8;
}

// Total skill bonus: ability mod + proficiency grade + extra.
export function skillBonus(slug, abilities, proficiencies, level, extra = 0) {
  const def = SKILLS.find((s) => s.slug === slug);
  if (!def) return 0;
  const mod = abilityModifier(abilities[def.ability]);
  const prof = proficiencyBonus(level);
  const grade = proficiencies?.skills?.[slug] ?? "none";
  return mod + gradeBonus(grade, prof) + (Number(extra) || 0);
}

// Saving throw bonus: mod + (proficient ? prof : 0).
export function saveBonus(abi, abilities, proficiencies, level) {
  const mod = abilityModifier(abilities[abi]);
  const prof = proficiencyBonus(level);
  return mod + (proficiencies?.saves?.[abi] ? prof : 0);
}

// Passive Perception = 10 + Perception skill bonus.
export function passivePerception(abilities, proficiencies, level, extra = 0) {
  return 10 + skillBonus("percepcion", abilities, proficiencies, level, extra);
}

// Initiative = DEX modifier + extra.
export function initiative(abilities, extra = 0) {
  return abilityModifier(abilities.DES) + (Number(extra) || 0);
}

// Carrying capacity (2024) = Strength score × 15 (pounds per the rules; the Spanish SRD
// expresses weights in kg, but the numeric formula is kept as reference).
export function carryingCapacity(abilities) {
  return (Number(abilities.FUE) || 0) * 15;
}

// Armor Class formula registry. Each formula gets the context and returns a number,
// or null when it doesn't apply (e.g. unarmored defense while wearing armor).
// ctx: { dex, con, wis, armor, shieldBonus, acBonus }
export const AC_FORMULAS = {
  // Unarmored: 10 + DEX (+ shield + extra). Always available as baseline.
  base: ({ dex, shieldBonus, acBonus }) => 10 + dex + shieldBonus + acBonus,
  // Equipped armor: armor base + DEX capped by type (+ shield + extra).
  armor: ({ dex, armor, shieldBonus, acBonus }) => {
    if (!armor) return null;
    const rule = ARMOR_DEX_RULE[armor.tipo];
    const appliedDex = rule ? rule(dex) : dex;
    return (armor.base || 10) + appliedDex + (armor.bonoMagico || 0) + shieldBonus + acBonus;
  },
  // Monk unarmored defense: 10 + DEX + WIS. Requires no armor AND no shield.
  monk: ({ dex, wis, armor, shieldBonus, acBonus }) =>
    armor || shieldBonus ? null : 10 + dex + wis + acBonus,
  // Barbarian unarmored defense: 10 + DEX + CON. Shield allowed.
  barbarian: ({ dex, con, armor, shieldBonus, acBonus }) =>
    armor ? null : 10 + dex + con + shieldBonus + acBonus,
};

// Maps the data values in clases.json (`formulasCA: ["monje"|"barbaro"]`) to formula keys.
const AC_FORMULA_BY_DATA = { monje: "monk", barbaro: "barbarian" };

// Computes AC as the max of all applicable formulas. `dataFormulas` comes straight from
// the class SRD data (Spanish values).
export function calculateAC(abilities, equipment = {}, dataFormulas = [], acBonus = 0) {
  const armor = equipment.equippedArmor || null;
  const shield = equipment.equippedShield || null;
  const shieldBonus = shield ? (shield.bonus ?? 2) + (shield.bonoMagico || 0) : 0;
  const ctx = {
    dex: abilityModifier(abilities.DES),
    con: abilityModifier(abilities.CON),
    wis: abilityModifier(abilities.SAB),
    armor,
    shieldBonus,
    acBonus: Number(acBonus) || 0,
  };
  const keys = new Set(["base", "armor", ...dataFormulas.map((f) => AC_FORMULA_BY_DATA[f]).filter(Boolean)]);
  const candidates = [...keys]
    .map((k) => AC_FORMULAS[k]?.(ctx))
    .filter((v) => v != null);
  return candidates.length ? Math.max(...candidates) : 10 + ctx.dex + shieldBonus + ctx.acBonus;
}

// Maximum hit points. "fixed" mode uses die averages; "manual" uses the override.
export function calculateMaxHP({ level, hitDie, abilities, mode = "fixed", manualMax }) {
  if (mode === "manual") return Math.max(0, Number(manualMax) || 0);
  const con = abilityModifier(abilities.CON);
  const n = Math.max(1, Number(level) || 1);
  const faces = dieFaces(hitDie);
  const average = DIE_AVERAGE[faces] ?? Math.floor(faces / 2) + 1;
  // Level 1: max die + CON. Each further level: average + CON.
  return faces + con + (n - 1) * (average + con);
}

// Spell save DC = 8 + proficiency + casting ability modifier.
export function spellSaveDC(abilities, level, castingAbility) {
  if (!castingAbility) return null;
  return 8 + proficiencyBonus(level) + abilityModifier(abilities[castingAbility]);
}

// Spell attack bonus = proficiency + casting ability modifier.
export function spellAttack(abilities, level, castingAbility) {
  if (!castingAbility) return null;
  return proficiencyBonus(level) + abilityModifier(abilities[castingAbility]);
}

// Spell slots by caster type (clases.json `lanzador` value) and character level.
// Returns { type, slots:[9] } for completo/semi, or { type:"pacto", slotLevel, count }.
export function spellSlots(casterType, level) {
  const n = Math.max(1, Math.min(20, Number(level) || 1));
  if (casterType === "pacto") {
    const p = WARLOCK_PACT[n - 1];
    return { type: "pacto", slotLevel: p.level, count: p.count };
  }
  const table = SPELL_SLOT_TABLE[casterType];
  return { type: casterType, slots: table ? table[n - 1] : Array(9).fill(0) };
}
