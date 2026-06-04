import ClassGuide from "@/components/ClassGuide";
import monje from "@/data/clases/monje.json";

export const metadata = {
  title: "Monje",
  description:
    "Guía de la clase Monje de D&D 2024 en español: rasgos, tabla de progresión y subclase.",
};

export default function MonjePage() {
  return <ClassGuide data={monje} />;
}
