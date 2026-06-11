"use client";

import { withSign } from "@/lib/character/calculations";
import { StatBox } from "./ui";

// Quick-stats row matching the official 2024 sheet:
// Iniciativa · Velocidad · Tamaño · Percepción pasiva.
export default function StatsRow({ derived }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <StatBox
        label="Iniciativa"
        value={withSign(derived.initiative)}
        help="Se suma a tu d20 al empezar el combate para decidir el orden de turnos. Es tu modificador de Destreza más cualquier extra."
      />
      <StatBox
        label="Velocidad"
        value={`${derived.speed} m`}
        help="Distancia que puedes moverte en tu turno (la determina tu especie)."
      />
      <StatBox
        label="Tamaño"
        value={derived.size ?? "—"}
        help="Categoría de tamaño de tu especie. Afecta a agarres, espacios y monturas."
      />
      <StatBox
        label="Percepción pasiva"
        value={derived.passivePerception}
        help="10 + tu bono de Percepción. El GM la usa para saber si notas algo sin tirar dados (emboscadas, criaturas ocultas…)."
      />
    </div>
  );
}
