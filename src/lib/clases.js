// Índice de clases del compendio. Marca `disponible: true` las que ya tienen guía.
export const CLASES_INDEX = [
  {
    slug: "barbaro",
    nombre: "Bárbaro",
    disponible: true,
    color: "#c0563a",
    lema: "La furia es tu mejor arma.",
  },
  { slug: "bardo", nombre: "Bardo", disponible: false },
  { slug: "brujo", nombre: "Brujo", disponible: false },
  {
    slug: "clerigo",
    nombre: "Clérigo",
    disponible: true,
    color: "#d9d2c0",
    lema: "El poder de los dioses fluye a través de ti.",
  },
  { slug: "druida", nombre: "Druida", disponible: false },
  { slug: "explorador", nombre: "Explorador", disponible: false },
  { slug: "guerrero", nombre: "Guerrero", disponible: false },
  {
    slug: "hechicero",
    nombre: "Hechicero",
    disponible: true,
    color: "#df5b9b",
    lema: "La magia corre por tus venas.",
  },
  { slug: "mago", nombre: "Mago", disponible: false },
  {
    slug: "monje",
    nombre: "Monje",
    disponible: true,
    color: "#3fb89a",
    lema: "Un arma viviente forjada por la disciplina.",
  },
  { slug: "paladin", nombre: "Paladín", disponible: false },
  {
    slug: "picaro",
    nombre: "Pícaro",
    disponible: true,
    color: "#9d7fce",
    lema: "La sombra que acecha en la oscuridad.",
  },
];

export const CLASES_DISPONIBLES = CLASES_INDEX.filter((c) => c.disponible);
