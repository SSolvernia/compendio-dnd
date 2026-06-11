// Export/import the character sheet as JSON. Everything runs in event handlers (no useEffect).

import { normaliza } from "@/lib/dnd";
import { SCHEMA_VERSION, migrate } from "./schema.js";

// Reasonable maximum size for an exported sheet.
const MAX_IMPORT_BYTES = 2 * 1024 * 1024; // 2 MB

// Downloads the character as a .json file.
export function exportCharacter(character) {
  const data = { ...character, version: SCHEMA_VERSION };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const name = normaliza(character.identity?.name || "personaje")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  a.download = `${name || "personaje"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Reads a File from an <input type="file"> and resolves with the migrated character.
export function importCharacter(file) {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMPORT_BYTES) {
      reject(new Error("Archivo demasiado grande"));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(migrate(JSON.parse(reader.result)));
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
