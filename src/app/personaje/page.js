import CharacterSheet from "@/components/character/CharacterSheet";

export const metadata = {
  title: "Ficha de personaje",
  description:
    "Hoja de personaje interactiva de D&D 2024 en español, con cálculo automático de estadísticas.",
};

export default function PersonajePage() {
  return <CharacterSheet />;
}
