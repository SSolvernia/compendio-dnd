#!/usr/bin/env node
// Assembles the per-class JSON files (reference/raw/clases/<slug>.json) into a single
// src/data/srd/clases.json, in canonical order, injecting the "Trucos" and "Conjuros
// preparados" columns parsed from the SRD layout text.
//
// The per-class files are produced by the extraction agents from the local SRD text.
// On a fresh clone without reference/ this script ABORTS without writing, so it never
// overwrites the committed clases.json with partial data.

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { LAYOUT, casterProgression } from "./class-tables.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INPUT_DIR = resolve(ROOT, "reference/raw/clases");
const OUTPUT = resolve(ROOT, "src/data/srd/clases.json");

const ORDER = [
  "barbaro", "bardo", "brujo", "clerigo", "druida", "explorador",
  "guerrero", "hechicero", "mago", "monje", "paladin", "picaro",
];

// Guard: never write a partial clases.json.
const missing = ORDER.filter((slug) => !existsSync(resolve(INPUT_DIR, `${slug}.json`)));
if (missing.length || !existsSync(LAYOUT)) {
  console.error(
    "✗ Faltan fuentes locales para ensamblar (reference/ no está completo):\n" +
      (missing.length ? `  clases sin JSON: ${missing.join(", ")}\n` : "") +
      (!existsSync(LAYOUT) ? `  falta ${LAYOUT}\n` : "") +
      "  No se escribe src/data/srd/clases.json (se conserva el commiteado).\n" +
      "  Para regenerar: copia el PDF a reference/ y corre `npm run srd:extract`."
  );
  process.exit(1);
}

// Guarantees unique feature slugs within a class: features sharing a name across levels
// (e.g. "Metamagia" at 2/10/17) collide; later ones get the level appended.
function dedupeFeatureSlugs(charClass) {
  const seen = new Set();
  for (const f of charClass.rasgosPorNivel || []) {
    let slug = f.slug;
    if (seen.has(slug)) {
      slug = `${f.slug}-${f.nivel}`;
      let i = 2;
      while (seen.has(slug)) slug = `${f.slug}-${f.nivel}-${i++}`;
      f.slug = slug;
    }
    seen.add(slug);
  }
  return charClass;
}

const classes = [];
for (const slug of ORDER) {
  const charClass = dedupeFeatureSlugs(
    JSON.parse(readFileSync(resolve(INPUT_DIR, `${slug}.json`), "utf8"))
  );
  // Inject the "Trucos" and "Conjuros preparados" columns parsed from the SRD table.
  const progression = casterProgression(slug);
  charClass.trucosPorNivel = progression?.trucosPorNivel ?? null;
  charClass.conjurosPreparadosPorNivel = progression?.conjurosPreparadosPorNivel ?? null;
  classes.push(charClass);
}

writeFileSync(OUTPUT, JSON.stringify(classes, null, 2) + "\n", "utf8");
console.log(`✓ ${classes.length}/12 clases → ${OUTPUT}`);
