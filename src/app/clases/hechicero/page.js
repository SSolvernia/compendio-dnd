import ClassGuide from "@/components/ClassGuide";
import hechicero from "@/data/clases/hechicero.json";

export const metadata = {
  title: "Hechicero",
  description:
    "Guía de la clase Hechicero de D&D 2024 en español: lanzamiento de conjuros, metamagia, rasgos y subclase.",
};

export default function HechiceroPage() {
  return <ClassGuide data={hechicero} />;
}
