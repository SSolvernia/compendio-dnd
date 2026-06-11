#!/usr/bin/env node
// Slices the clean SRD text into small focused sections using the `[[ PÁGINA n ]]`
// markers. Each section lands in reference/clean/secciones/ so parsing (human or agent)
// reads only what it needs, at zero token cost.
//
// Usage:  node scripts/slice-srd.mjs   (run scripts/extract-srd.mjs first)

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CLEAN_DIR = resolve(ROOT, "reference/clean");
const OUT_DIR = resolve(CLEAN_DIR, "secciones");

// Page ranges confirmed by grepping the markers.
const SECTIONS = [
  // Classes (prose): "Atributos básicos" block + "Nivel N: …" features + subclasses.
  { file: "clase-barbaro", mode: "prose", from: 32, to: 34 },
  { file: "clase-bardo", mode: "prose", from: 35, to: 39 },
  { file: "clase-brujo", mode: "prose", from: 40, to: 46 },
  { file: "clase-clerigo", mode: "prose", from: 47, to: 51 },
  { file: "clase-druida", mode: "prose", from: 52, to: 57 },
  { file: "clase-explorador", mode: "prose", from: 58, to: 61 },
  { file: "clase-guerrero", mode: "prose", from: 62, to: 63 },
  { file: "clase-hechicero", mode: "prose", from: 64, to: 70 },
  { file: "clase-mago", mode: "prose", from: 71, to: 76 },
  { file: "clase-monje", mode: "prose", from: 77, to: 80 },
  { file: "clase-paladin", mode: "prose", from: 81, to: 85 },
  { file: "clase-picaro", mode: "prose", from: 86, to: 88 },
  // Character origins
  { file: "trasfondos", mode: "prose", from: 89, to: 90 },
  { file: "especies", mode: "prose", from: 90, to: 93 },
  { file: "dotes", mode: "prose", from: 94, to: 96 },
  // Equipment: weapon (p99) and armor (p100-101) tables in layout mode (columns).
  { file: "equipo-armas-armaduras", mode: "layout", from: 99, to: 101 },
];

function loadPages(path) {
  const text = readFileSync(path, "utf8");
  const map = new Map();
  const re = /\[\[ PÁGINA (\d+) \]\]\n([\s\S]*?)(?=\n\[\[ PÁGINA \d+ \]\]|$)/g;
  let m;
  while ((m = re.exec(text)) !== null) map.set(Number(m[1]), m[2]);
  return map;
}

function main() {
  const prose = loadPages(resolve(CLEAN_DIR, "srd-completo.txt"));
  const layout = loadPages(resolve(CLEAN_DIR, "srd-layout.txt"));
  mkdirSync(OUT_DIR, { recursive: true });

  for (const s of SECTIONS) {
    const source = s.mode === "layout" ? layout : prose;
    let out = "";
    for (let p = s.from; p <= s.to; p++) {
      if (source.has(p)) out += `\n[[ PÁGINA ${p} ]]\n${source.get(p)}`;
    }
    const path = resolve(OUT_DIR, `${s.file}.txt`);
    writeFileSync(path, out.trimStart() + "\n", "utf8");
    console.log(`  ${s.file}.txt  (p${s.from}-${s.to}, ${out.length.toLocaleString()} car.)`);
  }
  console.log(`\n✓ ${SECTIONS.length} secciones en ${OUT_DIR}`);
}

if (!existsSync(resolve(CLEAN_DIR, "srd-completo.txt"))) {
  console.error("✗ Falta reference/clean/srd-completo.txt. Corre antes: node scripts/extract-srd.mjs");
  process.exit(1);
}
main();
