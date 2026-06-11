// Character state schema: the sheet's single source of truth.
// Stores ONLY user inputs; derived values are computed at render time.
// v2: English state keys (v1 used Spanish keys; migrate() converts old exports).

export const SCHEMA_VERSION = 2;

// Creates an empty character with defaults.
export function createCharacter() {
  return {
    version: SCHEMA_VERSION,
    identity: {
      name: "",
      player: "",
      classSlug: "",
      subclassSlug: "",
      level: 1,
      speciesSlug: "",
      backgroundSlug: "",
      alignment: "",
    },
    abilities: { FUE: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: 10 },
    proficiencies: {
      // Per skill: "proficient" | "expert" (absent = none).
      skills: {},
      // Per ability: true when proficient in that saving throw.
      saves: { FUE: false, DES: false, CON: false, INT: false, SAB: false, CAR: false },
    },
    hp: {
      mode: "fixed", // "fixed" | "manual"
      maxOverride: null, // used only in "manual" mode
      current: null, // null => shown as max (resolved at render, no effects)
      temp: 0,
    },
    combat: {
      initiativeBonus: 0,
      acBonus: 0, // miscellaneous AC modifier
    },
    equipment: {
      equippedArmor: null, // { slug?, nombre, tipo, base, bonoMagico? } | null (data-shaped)
      equippedShield: null, // { slug?, nombre, bonus?, bonoMagico? } | null
      items: [], // [{ id, nombre, cantidad, peso, notas }]
      coins: { pc: 0, pp: 0, pe: 0, po: 0, ppt: 0 },
    },
    spells: {
      known: [], // [spellId] (reference src/data/spells.json)
      prepared: [], // [spellId] (subset of known)
      usedSlots: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 },
      usedPactSlots: 0,
    },
    traits: {
      featSlugs: [],
      notes: "",
    },
    notes: "",
  };
}

// Immutable setter by key path. setIn(obj, ["a","b"], v) clones along the path.
export function setIn(obj, path, value) {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  const base = Array.isArray(obj) ? [...obj] : { ...obj };
  base[key] = setIn(obj?.[key], rest, value);
  return base;
}

// Reads a value by key path (with optional default).
export function getIn(obj, path, fallback) {
  let current = obj;
  for (const key of path) {
    if (current == null) return fallback;
    current = current[key];
  }
  return current ?? fallback;
}

// --- v1 (Spanish keys) -> v2 (English keys) mapping ---

const V1_GRADE = { competente: "proficient", experto: "expert", media: "half" };

function migrateV1(d) {
  const grade = (g) => V1_GRADE[g] ?? g;
  return {
    version: 2,
    identity: {
      name: d.identidad?.nombre,
      player: d.identidad?.jugador,
      classSlug: d.identidad?.claseSlug,
      subclassSlug: d.identidad?.subclaseSlug,
      level: d.identidad?.nivel,
      speciesSlug: d.identidad?.especieSlug,
      backgroundSlug: d.identidad?.trasfondoSlug,
      alignment: d.identidad?.alineamiento,
    },
    abilities: d.caracteristicas,
    proficiencies: {
      skills: Object.fromEntries(
        Object.entries(d.competencias?.habilidades || {}).map(([k, v]) => [k, grade(v)])
      ),
      saves: d.competencias?.salvaciones,
    },
    hp: {
      mode: d.hp?.modo === "manual" ? "manual" : "fixed",
      maxOverride: d.hp?.maxOverride,
      current: d.hp?.actual,
      temp: d.hp?.temporal,
    },
    combat: {
      initiativeBonus: d.combate?.iniciativaExtra,
      acBonus: d.combate?.caExtra,
    },
    equipment: {
      equippedArmor: d.equipo?.armaduraEquipada,
      equippedShield: d.equipo?.escudoEquipado,
      items: d.equipo?.objetos,
      coins: d.equipo?.monedas,
    },
    spells: {
      known: d.conjuros?.conocidos,
      prepared: d.conjuros?.preparados,
      usedSlots: d.conjuros?.espaciosUsados,
      usedPactSlots: d.conjuros?.pactoUsados,
    },
    traits: {
      featSlugs: d.rasgos?.doteSlugs,
      notes: d.rasgos?.notas,
    },
    notes: d.notas,
  };
}

// Merges `data` over defaults so every section exists even if the imported JSON is
// older or partial. Unknown TOP-LEVEL keys are dropped (import hardening); extra keys
// inside known sections are preserved (e.g. individual skill slugs).
export function migrate(data) {
  const base = createCharacter();
  if (!data || typeof data !== "object") return base;

  // Detect a v1 export (Spanish top-level sections) and convert it first.
  if (data.identidad || data.caracteristicas || data.version === 1) {
    data = migrateV1(data);
  }

  const merge = (def, val) => {
    if (val == null) return def;
    if (Array.isArray(def)) return Array.isArray(val) ? val : def;
    // Note: typeof null === "object" — null defaults (e.g. maxOverride) take the value as-is.
    if (def !== null && typeof def === "object") {
      const out = { ...def };
      for (const k of Object.keys(def)) out[k] = merge(def[k], val[k]);
      for (const k of Object.keys(val)) if (!(k in out)) out[k] = val[k];
      return out;
    }
    return val;
  };
  const result = merge(base, data);
  for (const k of Object.keys(result)) {
    if (!(k in base)) delete result[k];
  }
  result.version = SCHEMA_VERSION;
  return result;
}
