import "./globals.css";
import Script from "next/script";
import SiteNav from "@/components/SiteNav";

export const metadata = {
  title: {
    default: "Compendio D&D 2024",
    template: "%s · Compendio D&D 2024",
  },
  description:
    "Compendio de Dungeons & Dragons (reglas 2024) en español: biblioteca de conjuros y guías de clases.",
  applicationName: "Compendio D&D 2024",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Compendio",
  },
};

export const viewport = {
  themeColor: "#0b0a12",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        <SiteNav />
        {children}
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
              navigator.serviceWorker.register('/sw.js').catch(function () {});
            });
          }`}
        </Script>
      </body>
    </html>
  );
}
