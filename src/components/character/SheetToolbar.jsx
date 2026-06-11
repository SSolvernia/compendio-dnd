"use client";

import { exportCharacter, importCharacter } from "@/lib/character/io";
import { createCharacter } from "@/lib/character/schema";

const BTN =
  "inline-flex items-center gap-1.5 rounded-lg border border-line bg-ink-2 px-3 py-2 text-sm text-parch-dim transition hover:border-gold/50 hover:text-gold-soft";

export default function SheetToolbar({ character, setCharacter }) {
  const onImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setCharacter(await importCharacter(file));
    } catch {
      alert("El archivo no es una ficha válida.");
    }
    e.target.value = ""; // allows re-importing the same file
  };

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      <button onClick={() => exportCharacter(character)} className={BTN}>
        ⬇ Exportar JSON
      </button>
      <label className={`${BTN} cursor-pointer`}>
        ⬆ Importar JSON
        <input type="file" accept="application/json" onChange={onImport} className="hidden" />
      </label>
      <button
        onClick={() => {
          if (confirm("¿Vaciar la ficha y empezar de cero?")) setCharacter(createCharacter());
        }}
        className={`${BTN} ml-auto`}
      >
        ✦ Nueva
      </button>
    </div>
  );
}
