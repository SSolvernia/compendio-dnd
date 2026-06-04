import SpellLibrary from "@/components/SpellLibrary";

export const metadata = {
  title: "Grimorio",
  description:
    "Biblioteca de conjuros de D&D 2024 en español, filtrable por clase y nivel.",
};

export default function GrimorioPage() {
  return <SpellLibrary />;
}
