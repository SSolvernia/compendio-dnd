import ClassGuide from "@/components/ClassGuide";
import barbaro from "@/data/clases/barbaro.json";

export const metadata = {
  title: "Bárbaro",
  description: "Guía de la clase Bárbaro de D&D 2024 en español: rasgos, tabla de progresión y subclase.",
};

export default function BarbaroPage() {
  return <ClassGuide data={barbaro} />;
}
