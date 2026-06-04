// Constantes y utilidades de D&D (reglas 2024 / 5.5e) en español.

export const CLASES = [
  "Bardo",
  "Brujo",
  "Clérigo",
  "Druida",
  "Explorador",
  "Hechicero",
  "Mago",
  "Paladín",
];

export const ESCUELAS = [
  "Abjuración",
  "Adivinación",
  "Conjuración",
  "Encantamiento",
  "Evocación",
  "Ilusionismo",
  "Nigromancia",
  "Transmutación",
];

// Color identitario por escuela de magia.
export const ESCUELA_COLOR = {
  Abjuración: "#4f7cff",
  Adivinación: "#38bdf8",
  Conjuración: "#e8a13a",
  Encantamiento: "#ec6cb9",
  Evocación: "#ef5350",
  Ilusionismo: "#a974ff",
  Nigromancia: "#5fae6b",
  Transmutación: "#2dd4bf",
};

export const SALVACION_LABEL = {
  FUE: "Fuerza",
  DES: "Destreza",
  CON: "Constitución",
  INT: "Inteligencia",
  SAB: "Sabiduría",
  CAR: "Carisma",
};

export const COMPONENTE_LABEL = {
  V: "Verbal",
  S: "Somático",
  M: "Material",
};

// Significado de cada componente / propiedad (para tooltips de ayuda).
export const COMPONENTE_DEF = {
  V: "Verbal: debes pronunciar palabras mágicas en voz alta.",
  S: "Somático: requiere un gesto enérgico con una mano libre.",
  M: "Material: requiere los componentes materiales indicados.",
};

export const PROP_DEF = {
  ritual:
    "Ritual: puede lanzarse sin gastar espacio de conjuro, tardando 10 minutos más de lo normal.",
  concentracion:
    "Concentración: el efecto dura mientras te concentras. Solo puedes concentrarte en un conjuro a la vez, y recibir daño obliga a una salvación de Constitución para mantenerlo.",
};

export const SALVACION_DEF = {
  FUE: "El objetivo hace una tirada de salvación de Fuerza.",
  DES: "El objetivo hace una tirada de salvación de Destreza.",
  CON: "El objetivo hace una tirada de salvación de Constitución.",
  INT: "El objetivo hace una tirada de salvación de Inteligencia.",
  SAB: "El objetivo hace una tirada de salvación de Sabiduría.",
  CAR: "El objetivo hace una tirada de salvación de Carisma.",
};

// Tipo de lanzador (por si en el futuro se filtra por nivel de personaje).
export const TIPO_LANZADOR = {
  Bardo: "completo",
  Clérigo: "completo",
  Druida: "completo",
  Hechicero: "completo",
  Mago: "completo",
  Paladín: "semi",
  Explorador: "semi",
  Brujo: "pacto",
};

// Nivel máximo de conjuro lanzable según el nivel de personaje (reglas 2024).
export function maxNivelConjuro(tipo, nivelPersonaje) {
  const n = Math.max(1, Math.min(20, nivelPersonaje || 1));
  if (tipo === "completo") return Math.min(9, Math.ceil(n / 2));
  if (tipo === "semi") return Math.min(5, Math.ceil(n / 4));
  if (tipo === "pacto") return Math.min(5, Math.ceil(n / 2));
  return 9;
}

export function nivelLabel(n) {
  return n === 0 ? "Truco" : `Nivel ${n}`;
}

export function nivelCorto(n) {
  return n === 0 ? "T" : String(n);
}

// Normaliza texto para búsquedas (sin tildes, minúsculas).
// Elimina marcas diacríticas (rango Unicode 0x0300–0x036f) sin usar
// caracteres combinantes en el código fuente.
export function normaliza(s = "") {
  const descompuesto = s.normalize("NFD");
  let salida = "";
  for (const ch of descompuesto) {
    const c = ch.charCodeAt(0);
    if (c < 0x0300 || c > 0x036f) salida += ch;
  }
  return salida.toLowerCase().trim();
}
