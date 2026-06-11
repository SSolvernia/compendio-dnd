// Index of the SRD 5.2.1 mechanical data. Indexes each list by slug for O(1) access in
// the character sheet and keeps the raw arrays for dropdowns.
// Note: the JSON field names stay in Spanish (they are content); only the index keys
// follow the English code convention.
import clases from "./clases.json";
import especies from "./especies.json";
import trasfondos from "./trasfondos.json";
import dotes from "./dotes.json";
import equipo from "./equipo.json";
import herramientas from "./herramientas.json";

const bySlug = (arr) => Object.fromEntries(arr.map((x) => [x.slug, x]));

export const SRD = {
  classes: bySlug(clases),
  species: bySlug(especies),
  backgrounds: bySlug(trasfondos),
  feats: bySlug(dotes),
  tools: bySlug(herramientas),
  equipment: equipo,
  lists: {
    classes: clases,
    species: especies,
    backgrounds: trasfondos,
    feats: dotes,
    tools: herramientas,
  },
};
