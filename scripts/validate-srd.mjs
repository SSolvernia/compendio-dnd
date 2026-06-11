#!/usr/bin/env node
// Validates the SRD mechanical data in src/data/srd/. Exits 1 on inconsistencies.
// D&D 2024 business rules + schema integrity. When the local SRD text is available
// (reference/clean/), it also compares the hardcoded spell-slot tables against the PDF.
//
// Usage:  node scripts/validate-srd.mjs

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SPELL_SLOT_TABLE, WARLOCK_PACT } from "../src/lib/character/constants.js";
import { LAYOUT, tableRows } from "./class-tables.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SRD_DIR = resolve(ROOT, "src/data/srd");
const load = (f) => JSON.parse(readFileSync(resolve(SRD_DIR, f), "utf8"));

const ABILITY_CODES = ["FUE", "DES", "CON", "INT", "SAB", "CAR"];
const CASTER_TYPES = ["completo", "semi", "pacto", "ninguno"];
const ARMOR_TYPES = ["ligera", "media", "pesada", "escudo"];
const AC_FORMULA_VALUES = ["monje", "barbaro"]; // data values in clases.json

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);

// --- Classes ---
const classes = load("clases.json");
if (classes.length !== 12) err(`Se esperaban 12 clases, hay ${classes.length}`);
for (const c of classes) {
  const id = c.slug || "(sin slug)";
  if (!c.nombre) err(`${id}: falta nombre`);
  if (!/^d\d+$/.test(c.dadoGolpe || "")) err(`${id}: dadoGolpe inválido (${c.dadoGolpe})`);
  if (!ABILITY_CODES.includes(c.caracteristicaPrincipal)) err(`${id}: caracteristicaPrincipal inválida`);
  if (!Array.isArray(c.salvaciones) || c.salvaciones.length !== 2)
    err(`${id}: salvaciones debe tener 2 elementos`);
  else if (!c.salvaciones.every((s) => ABILITY_CODES.includes(s)))
    err(`${id}: salvaciones con valor inválido`);
  if (!CASTER_TYPES.includes(c.lanzador)) err(`${id}: lanzador inválido (${c.lanzador})`);
  const isCaster = c.lanzador && c.lanzador !== "ninguno";
  if (isCaster && !ABILITY_CODES.includes(c.caracteristicaLanzamiento))
    err(`${id}: caracteristicaLanzamiento debe estar definida si lanza conjuros`);
  if (!isCaster && c.caracteristicaLanzamiento != null)
    err(`${id}: caracteristicaLanzamiento debe ser null si no lanza conjuros`);
  if (!Array.isArray(c.formulasCA) || !c.formulasCA.every((f) => AC_FORMULA_VALUES.includes(f)))
    err(`${id}: formulasCA inválida (${JSON.stringify(c.formulasCA)})`);
  if (!Array.isArray(c.rasgosPorNivel) || c.rasgosPorNivel.length === 0)
    err(`${id}: rasgosPorNivel vacío`);
  else
    for (const f of c.rasgosPorNivel) {
      if (!f.slug || !f.nombre || typeof f.nivel !== "number" || !f.descripcion)
        err(`${id}: rasgo mal formado (${f.nombre || f.slug || "?"})`);
    }
  const slugs = (c.rasgosPorNivel || []).map((f) => f.slug);
  if (new Set(slugs).size !== slugs.length) err(`${id}: slugs de rasgo duplicados`);
  if (!Array.isArray(c.subclases) || c.subclases.length === 0) warnings.push(`${id}: sin subclases`);
  for (const s of c.subclases || []) {
    if (!Array.isArray(s.rasgos) || s.rasgos.length === 0) {
      err(`${id}/${s.slug}: subclase sin rasgos por nivel`);
      continue;
    }
    for (const f of s.rasgos)
      if (!f.slug || !f.nombre || typeof f.nivel !== "number" || f.nivel < 3 || f.nivel > 20 || !f.descripcion)
        err(`${id}/${s.slug}: rasgo de subclase mal formado (${f.nombre || f.slug || "?"})`);
    const subSlugs = s.rasgos.map((f) => f.slug);
    if (new Set(subSlugs).size !== subSlugs.length)
      err(`${id}/${s.slug}: slugs de rasgo de subclase duplicados`);
    if (s.rasgos.some((f, i, a) => i > 0 && f.nivel < a[i - 1].nivel))
      err(`${id}/${s.slug}: rasgos de subclase desordenados por nivel`);
  }
}

// --- Species ---
const species = load("especies.json");
if (species.length !== 9) err(`Se esperaban 9 especies, hay ${species.length}`);
for (const e of species) {
  if (!e.slug || !e.nombre) err(`especie sin slug/nombre`);
  if (typeof e.velocidad !== "number") err(`${e.slug}: velocidad debe ser número`);
  if (!Array.isArray(e.rasgos) || e.rasgos.length === 0) err(`${e.slug}: sin rasgos`);
}

// --- Backgrounds ---
const backgrounds = load("trasfondos.json");
if (backgrounds.length !== 4) err(`Se esperaban 4 trasfondos, hay ${backgrounds.length}`);
for (const b of backgrounds) {
  if (!b.slug || !b.nombre) err(`trasfondo sin slug/nombre`);
  if (!Array.isArray(b.caracteristicas) || b.caracteristicas.length !== 3)
    err(`${b.slug}: caracteristicas debe tener 3`);
}

// --- Feats ---
const feats = load("dotes.json");
if (feats.length === 0) err(`dotes.json vacío`);
for (const f of feats) if (!f.slug || !f.nombre) err(`dote sin slug/nombre`);

// --- Caster progression (cantrips / prepared spells) ---
for (const c of classes) {
  const isCaster = c.lanzador && c.lanzador !== "ninguno";
  if (!isCaster) {
    if (c.trucosPorNivel != null || c.conjurosPreparadosPorNivel != null)
      err(`${c.slug}: clase no lanzadora con columnas de progresión`);
    continue;
  }
  if (!Array.isArray(c.conjurosPreparadosPorNivel) || c.conjurosPreparadosPorNivel.length !== 20)
    err(`${c.slug}: conjurosPreparadosPorNivel debe tener 20 niveles`);
  else if (c.conjurosPreparadosPorNivel.some((v, i, a) => i > 0 && v < a[i - 1]))
    err(`${c.slug}: conjurosPreparadosPorNivel debe ser no decreciente`);
  // Paladín and Explorador have no class cantrips in 2024.
  if (c.trucosPorNivel != null && c.trucosPorNivel.length !== 20)
    err(`${c.slug}: trucosPorNivel debe tener 20 niveles`);
}

// --- Tools ---
const tools = load("herramientas.json");
if (tools.length === 0) err(`herramientas.json vacío`);
for (const t of tools) {
  if (!t.slug || !t.nombre) err(`herramienta sin slug/nombre`);
  if (!ABILITY_CODES.includes(t.caracteristica)) err(`herramienta ${t.slug}: característica inválida`);
  if (!t.utilizar) err(`herramienta ${t.slug}: falta "utilizar"`);
}
const toolSlugs = new Set(tools.map((t) => t.slug));
const featSlugs = new Set(feats.map((f) => f.slug));
for (const b of backgrounds) {
  if (b.doteSlug && !featSlugs.has(b.doteSlug))
    err(`trasfondo ${b.slug}: doteSlug "${b.doteSlug}" no existe en dotes.json`);
  for (const ts of b.herramientasSlugs || [])
    if (!toolSlugs.has(ts))
      err(`trasfondo ${b.slug}: herramienta "${ts}" no existe en herramientas.json`);
}

// --- Equipment ---
const equipment = load("equipo.json");
if (!Array.isArray(equipment.armas) || equipment.armas.length === 0) err(`equipo.armas vacío`);
if (!Array.isArray(equipment.armaduras) || equipment.armaduras.length === 0)
  err(`equipo.armaduras vacío`);
for (const a of equipment.armaduras) {
  if (!ARMOR_TYPES.includes(a.tipo)) err(`armadura ${a.slug}: tipo inválido (${a.tipo})`);
  if (a.tipo === "escudo") {
    if (typeof a.ca?.bonus !== "number") err(`escudo ${a.slug}: ca.bonus debe ser número`);
  } else if (typeof a.ca?.base !== "number") {
    err(`armadura ${a.slug}: ca.base debe ser número`);
  }
}

// --- Spell-slot tables vs PDF (layout text) — skipped without local reference ---
if (!existsSync(LAYOUT)) {
  warnings.push(
    "reference/clean/srd-layout.txt no disponible: se omite la comparación de tablas de " +
      "espacios contra el PDF (solo validación de esquema)."
  );
} else {
  // Mago (full caster, p71-73): trailing columns = Trucos, Preparados, slots 1..9 → 11.
  {
    const rows = tableRows(71, 73, 11);
    if (rows.size === 20)
      for (let n = 1; n <= 20; n++) {
        const pdfSlots = rows.get(n).slice(2);
        const code = SPELL_SLOT_TABLE.completo[n - 1];
        if (JSON.stringify(pdfSlots) !== JSON.stringify(code))
          err(`slots completo nivel ${n}: PDF=${JSON.stringify(pdfSlots)} ≠ código=${JSON.stringify(code)}`);
      }
    else err(`tabla completo: ${rows.size}/20 filas parseadas del PDF`);
  }
  // Paladín (half caster, p81-83): trailing = Canalizar, Preparados, slots 1..5 → 7.
  {
    const rows = tableRows(81, 83, 7);
    if (rows.size === 20)
      for (let n = 1; n <= 20; n++) {
        const pdfSlots = [...rows.get(n).slice(2), 0, 0, 0, 0]; // pad to 9 levels
        const code = SPELL_SLOT_TABLE.semi[n - 1];
        if (JSON.stringify(pdfSlots) !== JSON.stringify(code))
          err(`slots semi nivel ${n}: PDF=${JSON.stringify(pdfSlots)} ≠ código=${JSON.stringify(code)}`);
      }
    else err(`tabla semi: ${rows.size}/20 filas parseadas del PDF`);
  }
  // Brujo (pact, p40-42): trailing = Invocaciones, Trucos, Preparados, Espacios, Nivel → 5.
  {
    const rows = tableRows(40, 42, 5);
    if (rows.size === 20)
      for (let n = 1; n <= 20; n++) {
        const [count, slotLevel] = rows.get(n).slice(3);
        const code = WARLOCK_PACT[n - 1];
        if (count !== code.count || slotLevel !== code.level)
          err(`pacto nivel ${n}: PDF={count:${count},level:${slotLevel}} ≠ código=${JSON.stringify(code)}`);
      }
    else err(`tabla pacto: ${rows.size}/20 filas parseadas del PDF`);
  }
}

// --- Report ---
console.log(
  `Clases: ${classes.length} · Especies: ${species.length} · Trasfondos: ${backgrounds.length} · ` +
    `Dotes: ${feats.length} · Herramientas: ${tools.length} · Armas: ${equipment.armas.length} · ` +
    `Armaduras: ${equipment.armaduras.length}`
);
if (warnings.length) {
  console.log("\nAvisos:");
  for (const w of warnings) console.log(`  · ${w}`);
}
if (errors.length) {
  console.error(`\n✗ ${errors.length} error(es) de validación:`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log("\n✓ Todos los datos del SRD pasan la validación.");
