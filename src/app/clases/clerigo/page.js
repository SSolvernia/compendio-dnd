import ClassGuide from "@/components/ClassGuide";
import clerigo from "@/data/clases/clerigo.json";

export const metadata = {
  title: "Clérigo",
  description: "Guía de la clase Clérigo de D&D 2024 en español: rasgos, tabla de magia, progresión y dominios divinos.",
};

export default function ClerigoPage() {
  return <ClassGuide data={clerigo} />;
}
