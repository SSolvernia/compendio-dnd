#!/usr/bin/env node
// Extracts the Spanish SRD 5.2.1 to local text ONCE using `pdftotext`.
//
// Produces two views of the whole document, each with `[[ PÁGINA n ]]` page markers so
// content can be cited and sliced without reopening the PDF:
//   reference/clean/srd-completo.txt  -> raw mode (prose): features, feats, species…
//   reference/clean/srd-layout.txt    -> layout mode (columns): class tables, weapons, armor
//
// All later grep/parsing runs against these .txt files at zero token cost.
//
// Usage:  node scripts/extract-srd.mjs
// Requires `pdftotext` (poppler) on PATH and reference/SP_SRD_CC_v5.2.1.pdf.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PDF = resolve(ROOT, "reference/SP_SRD_CC_v5.2.1.pdf");
const RAW_DIR = resolve(ROOT, "reference/raw");
const CLEAN_DIR = resolve(ROOT, "reference/clean");

const SOFT_HYPHEN = "­"; // soft hyphen (stuck to the start of split words)
const NB_HYPHEN = "‑"; // non-breaking hyphen (line-end word splits)

function checkEnvironment() {
  if (!existsSync(PDF)) {
    console.error(
      `\n✗ No se encuentra el PDF en:\n  ${PDF}\n\n` +
        `Copia el fuente ahí primero, por ejemplo:\n` +
        `  cp ~/Downloads/SP_SRD_CC_v5.2.1.pdf reference/\n`
    );
    process.exit(1);
  }
  try {
    execFileSync("pdftotext", ["-v"], { stdio: "ignore" });
  } catch {
    console.error("\n✗ `pdftotext` (poppler) no está instalado o no está en el PATH.\n");
    process.exit(1);
  }
  mkdirSync(RAW_DIR, { recursive: true });
  mkdirSync(CLEAN_DIR, { recursive: true });
}

// Runs pdftotext keeping form feeds (\f) so pages can be numbered.
function pdftotext(args, outFile) {
  execFileSync("pdftotext", [...args, PDF, outFile], { stdio: "inherit" });
  return readFileSync(outFile, "utf8");
}

// Joins words split at end of line (soft or non-breaking hyphen + newline).
function joinHyphenated(text) {
  return text.replace(
    new RegExp(`[${SOFT_HYPHEN}${NB_HYPHEN}][ \\t]*\\n[ \\t]*`, "g"),
    ""
  );
}

// Cleanup shared by both modes: join hyphenated words, drop stray soft hyphens,
// turn remaining non-breaking hyphens into plain ones, trim line endings.
function baseClean(text) {
  let t = joinHyphenated(text);
  t = t.split(SOFT_HYPHEN).join("");
  t = t.split(NB_HYPHEN).join("-");
  t = t.replace(/[ \t]+\n/g, "\n");
  return t;
}

// Replaces each form feed (\f) with a readable page header.
// pdftotext emits \f BEFORE every page except the first.
function numberPages(text) {
  const pages = text.split("\f");
  return pages
    .map((p, i) => `\n[[ PÁGINA ${i + 1} ]]\n${p.replace(/^\n+/, "")}`)
    .join("\n");
}

// Prose profile (raw mode): collapse space runs and excess blank lines.
function cleanProse(text) {
  let t = baseClean(text);
  t = t.replace(/[ \t]{2,}/g, " "); // space runs are not structure in prose
  t = numberPages(t);
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.trimStart() + "\n";
}

// Table profile (layout mode): do NOT touch spaces (they ARE the columns).
function cleanLayout(text) {
  let t = baseClean(text);
  t = numberPages(t);
  t = t.replace(/\n{4,}/g, "\n\n\n");
  return t.trimStart() + "\n";
}

function count(text, needle) {
  return text.split(needle).length - 1;
}

function main() {
  checkEnvironment();

  console.log("→ Extrayendo modo raw (prosa)…");
  const raw = pdftotext(["-enc", "UTF-8"], resolve(RAW_DIR, "completo.raw.txt"));

  console.log("→ Extrayendo modo layout (tablas)…");
  const layout = pdftotext(
    ["-layout", "-enc", "UTF-8"],
    resolve(RAW_DIR, "completo.layout.txt")
  );

  const prose = cleanProse(raw);
  const tables = cleanLayout(layout);

  const proseFile = resolve(CLEAN_DIR, "srd-completo.txt");
  const tablesFile = resolve(CLEAN_DIR, "srd-layout.txt");
  writeFileSync(proseFile, prose, "utf8");
  writeFileSync(tablesFile, tables, "utf8");

  // Verification report: residual artifacts (target: ~0).
  const pageCount = count(raw, "\f") + 1;
  console.log("\n✓ Extracción completa.");
  console.log(`  Páginas:                 ${pageCount}`);
  console.log(`  ${proseFile}  (${prose.length.toLocaleString()} car.)`);
  console.log(`  ${tablesFile}  (${tables.length.toLocaleString()} car.)`);
  console.log("\n  Artefactos residuales (objetivo: 0):");
  for (const [name, txt] of [["prosa", prose], ["layout", tables]]) {
    console.log(
      `    ${name}: guión-suave=${count(txt, SOFT_HYPHEN)}  ` +
        `guión-noSep=${count(txt, NB_HYPHEN)}  ` +
        `"f inal"=${count(txt, "f inal")}`
    );
  }
}

main();
