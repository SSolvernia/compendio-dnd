export default function manifest() {
  return {
    name: "Compendio · D&D 2024",
    short_name: "Compendio",
    description:
      "Conjuros y guías de clases de Dungeons & Dragons (reglas 2024) en español.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0b0a12",
    theme_color: "#0b0a12",
    lang: "es",
    categories: ["games", "reference", "books"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
