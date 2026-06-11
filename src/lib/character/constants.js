// D&D 2024 rule constants for the character sheet.
// Convention: code identifiers in English; data-linked codes and visible text in Spanish
// (FUE/DES/…, armor types "ligera/media/pesada", caster types "completo/semi/pacto").

// The six ability codes, in sheet order. Values match the SRD data files.
export const ABILITIES = ["FUE", "DES", "CON", "INT", "SAB", "CAR"];

// The 18 skills (names and descriptions from the Spanish SRD 5.2.1, p9) keyed to abilities.
export const SKILLS = [
  { slug: "acrobacias", label: "Acrobacias", ability: "DES", description: "Mantenerte en pie en una situación complicada." },
  { slug: "atletismo", label: "Atletismo", ability: "FUE", description: "Subirte por una cuerda o una pared, nadar o trepar." },
  { slug: "conocimiento-arcano", label: "Conocimiento arcano", ability: "INT", description: "Recordar información acerca de conjuros, objetos mágicos y los planos de existencia." },
  { slug: "engano", label: "Engaño", ability: "CAR", description: "Contar una mentira convincente o llevar un disfraz de manera creíble." },
  { slug: "historia", label: "Historia", ability: "INT", description: "Recordar información sobre acontecimientos, personas, naciones y culturas de carácter histórico." },
  { slug: "interpretacion", label: "Interpretación", ability: "CAR", description: "Actuar, contar una historia, tocar un instrumento o bailar." },
  { slug: "intimidacion", label: "Intimidación", ability: "CAR", description: "Asustar o amenazar a alguien para que haga lo que tú quieres." },
  { slug: "investigacion", label: "Investigación", ability: "INT", description: "Encontrar información oculta en libros o deducir cómo funciona algo." },
  { slug: "juego-de-manos", label: "Juego de manos", ability: "DES", description: "Vaciar los bolsillos a alguien, ocultar un objeto que llevas en la mano o hacer trucos de prestidigitación." },
  { slug: "medicina", label: "Medicina", ability: "SAB", description: "Diagnosticar una enfermedad o determinar de qué ha muerto un fallecido reciente." },
  { slug: "naturaleza", label: "Naturaleza", ability: "INT", description: "Recordar información acerca del terreno, la flora, la fauna y el clima." },
  { slug: "percepcion", label: "Percepción", ability: "SAB", description: "Mediante una combinación de sentidos, darse cuenta de algo que es fácil pasar por alto." },
  { slug: "perspicacia", label: "Perspicacia", ability: "SAB", description: "Discernir el estado de ánimo y las intenciones de una persona." },
  { slug: "persuasion", label: "Persuasión", ability: "CAR", description: "Convencer a alguien de algo de una manera sincera y amable." },
  { slug: "religion", label: "Religión", ability: "INT", description: "Recordar información sobre dioses, rituales religiosos y símbolos sagrados." },
  { slug: "sigilo", label: "Sigilo", ability: "DES", description: "Pasar desapercibido al caminar en silencio y ocultarse detrás de las cosas." },
  { slug: "supervivencia", label: "Supervivencia", ability: "SAB", description: "Seguir huellas, forrajear, encontrar un camino o evitar peligros naturales." },
  { slug: "trato-con-animales", label: "Trato con animales", ability: "SAB", description: "Tranquilizar o adiestrar a un animal, o conseguir que se comporte de una determinada forma." },
];

// Fixed HP gained per level above 1 (die average rounded up, 2024 "fixed value" rule).
export const DIE_AVERAGE = { 4: 3, 6: 4, 8: 5, 10: 6, 12: 7 };

// How the Dexterity modifier applies to AC per armor type (keys = equipo.json data values).
export const ARMOR_DEX_RULE = {
  ligera: (dex) => dex,
  media: (dex) => Math.min(dex, 2),
  pesada: () => 0,
};

// Default speed in meters when no species is selected.
export const BASE_SPEED = 9;

// Level at which every class picks its subclass under the 2024 rules.
export const SUBCLASS_LEVEL = 3;

// Canonical 2024 spell-slot tables by caster type (keys = clases.json `lanzador` values).
// Index 0 = character level 1. Each row = slots for spell levels 1..9.
export const SPELL_SLOT_TABLE = {
  // Full casters: Bardo, Clérigo, Druida, Hechicero, Mago.
  completo: [
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 2, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 2, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 1, 0, 0, 0, 0, 0],
    [4, 3, 3, 2, 0, 0, 0, 0, 0],
    [4, 3, 3, 3, 1, 0, 0, 0, 0],
    [4, 3, 3, 3, 2, 0, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 0, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 0, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 0],
    [4, 3, 3, 3, 2, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 1, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 1, 1, 1],
    [4, 3, 3, 3, 3, 2, 2, 1, 1],
  ],
  // Half casters: Paladín, Explorador (they cast from level 1 in 2024).
  semi: [
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 0],
    [3, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 2, 0, 0, 0, 0, 0, 0, 0],
    [4, 2, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 2, 0, 0, 0, 0, 0, 0],
    [4, 3, 2, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 0, 0, 0, 0, 0, 0],
    [4, 3, 3, 1, 0, 0, 0, 0, 0],
    [4, 3, 3, 1, 0, 0, 0, 0, 0],
    [4, 3, 3, 2, 0, 0, 0, 0, 0],
    [4, 3, 3, 2, 0, 0, 0, 0, 0],
    [4, 3, 3, 3, 1, 0, 0, 0, 0],
    [4, 3, 3, 3, 1, 0, 0, 0, 0],
    [4, 3, 3, 3, 2, 0, 0, 0, 0],
    [4, 3, 3, 3, 2, 0, 0, 0, 0],
  ],
};

// Warlock pact magic: a single slot level and count per character level 1..20.
export const WARLOCK_PACT = [
  { level: 1, count: 1 },
  { level: 1, count: 2 },
  { level: 2, count: 2 },
  { level: 2, count: 2 },
  { level: 3, count: 2 },
  { level: 3, count: 2 },
  { level: 4, count: 2 },
  { level: 4, count: 2 },
  { level: 5, count: 2 },
  { level: 5, count: 2 },
  { level: 5, count: 3 },
  { level: 5, count: 3 },
  { level: 5, count: 3 },
  { level: 5, count: 3 },
  { level: 5, count: 3 },
  { level: 5, count: 3 },
  { level: 5, count: 4 },
  { level: 5, count: 4 },
  { level: 5, count: 4 },
  { level: 5, count: 4 },
];
