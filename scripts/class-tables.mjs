// Parsing of SRD class-progression tables (reference/clean/srd-layout.txt).
// Each useful row is "  N  +B  <features…>  <numeric columns>"; column values come from
// the FINAL run of tokens that are numbers or "—" (robust against feature text). "—" → 0.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const LAYOUT = resolve(ROOT, "reference/clean/srd-layout.txt");

// Per caster class: page range of its table, number of trailing numeric columns, and the
// index (within those columns) of cantrips and prepared spells. Keys = class slugs (data).
export const CLASS_PROGRESSION = {
  bardo: { pages: [35, 37], cols: 11, cantrips: 0, prepared: 1 },
  brujo: { pages: [40, 42], cols: 5, cantrips: 1, prepared: 2 },
  clerigo: { pages: [47, 49], cols: 12, cantrips: 1, prepared: 2 },
  druida: { pages: [52, 54], cols: 12, cantrips: 1, prepared: 2 },
  explorador: { pages: [58, 60], cols: 7, cantrips: null, prepared: 1 },
  hechicero: { pages: [64, 66], cols: 12, cantrips: 1, prepared: 2 },
  mago: { pages: [71, 73], cols: 11, cantrips: 0, prepared: 1 },
  paladin: { pages: [81, 83], cols: 7, cantrips: null, prepared: 1 },
};

// Returns Map level(1-20) -> array of `nCols` numbers ("—" mapped to 0).
export function tableRows(from, to, nCols) {
  const text = readFileSync(LAYOUT, "utf8");
  const pages = Array.from({ length: to - from + 1 }, (_, i) => from + i);
  const re = new RegExp(
    `\\[\\[ PÁGINA (?:${pages.join("|")}) \\]\\]\\n([\\s\\S]*?)(?=\\n\\[\\[ PÁGINA |$)`,
    "g"
  );
  let body = "";
  let m;
  while ((m = re.exec(text)) !== null) body += m[1] + "\n";

  const rows = new Map();
  for (const line of body.split("\n")) {
    const row = /^\s{1,12}(\d{1,2})\s+\+\d+\s+(.*)$/.exec(line);
    if (!row) continue;
    const level = Number(row[1]);
    if (level < 1 || level > 20 || rows.has(level)) continue;
    const tokens = row[2].trim().split(/\s+/);
    const tail = [];
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (/^\d+$/.test(tokens[i]) || tokens[i] === "—") tail.unshift(tokens[i]);
      else break;
    }
    if (tail.length < nCols) continue; // split row without complete columns
    rows.set(level, tail.slice(-nCols).map((t) => (t === "—" ? 0 : Number(t))));
  }
  return rows;
}

// Extracts { trucosPorNivel, conjurosPreparadosPorNivel } (arrays of 20, Spanish data
// field names) for one class, or null if the class is not configured (non-caster).
// Throws when rows are missing.
export function casterProgression(slug) {
  const cfg = CLASS_PROGRESSION[slug];
  if (!cfg) return null;
  const rows = tableRows(cfg.pages[0], cfg.pages[1], cfg.cols);
  if (rows.size !== 20)
    throw new Error(`progresión de ${slug}: ${rows.size}/20 filas parseadas del PDF`);
  const cantrips = [];
  const prepared = [];
  for (let n = 1; n <= 20; n++) {
    const v = rows.get(n);
    cantrips.push(cfg.cantrips == null ? 0 : v[cfg.cantrips]);
    prepared.push(v[cfg.prepared]);
  }
  return {
    trucosPorNivel: cfg.cantrips == null ? null : cantrips,
    conjurosPreparadosPorNivel: prepared,
  };
}
