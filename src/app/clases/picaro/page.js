import ClassGuide from "@/components/ClassGuide";
import picaro from "@/data/clases/picaro.json";

export const metadata = {
  title: "Pícaro",
  description:
    "Guía de la clase Pícaro de D&D 2024 en español: rasgos, tabla de progresión y subclase.",
};

export default function PicaroPage() {
  return <ClassGuide data={picaro} />;
}
