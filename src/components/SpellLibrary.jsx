"use client";

import { useMemo, useState } from "react";
import spells from "@/data/spells.json";
import { normaliza, nivelLabel } from "@/lib/dnd";
import Filters from "./Filters";
import SpellCard from "./SpellCard";
import SpellDetail from "./SpellDetail";

export default function SpellLibrary() {
  const [clase, setClase] = useState("");
  const [maxNivel, setMaxNivel] = useState(9);
  const [busqueda, setBusqueda] = useState("");
  const [escuelas, setEscuelas] = useState([]);
  const [soloRitual, setSoloRitual] = useState(false);
  const [soloConc, setSoloConc] = useState(false);
  const [comps, setComps] = useState([]);
  const [unidad, setUnidad] = useState("imperial");
  const [seleccion, setSeleccion] = useState(null);

  const q = normaliza(busqueda);

  const filtrados = useMemo(() => {
    return spells.filter((s) => {
      if (clase && !s.clases.includes(clase)) return false;
      if (s.nivel > maxNivel) return false;
      if (escuelas.length && !escuelas.includes(s.escuela)) return false;
      if (soloRitual && !s.ritual) return false;
      if (soloConc && !s.concentracion) return false;
      if (comps.length && !comps.every((c) => s.componentes.includes(c)))
        return false;
      if (q && !normaliza(s.nombre).includes(q)) return false;
      return true;
    });
  }, [clase, maxNivel, escuelas, soloRitual, soloConc, comps, q]);

  const porNivel = useMemo(() => {
    const grupos = new Map();
    for (const s of filtrados) {
      if (!grupos.has(s.nivel)) grupos.set(s.nivel, []);
      grupos.get(s.nivel).push(s);
    }
    return [...grupos.entries()].sort((a, b) => a[0] - b[0]);
  }, [filtrados]);

  const limpiar = () => {
    setClase("");
    setMaxNivel(9);
    setBusqueda("");
    setEscuelas([]);
    setSoloRitual(false);
    setSoloConc(false);
    setComps([]);
  };

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Encabezado */}
      <header className="mb-10 text-center">
        <p className="font-display text-[0.7rem] uppercase tracking-[0.35em] text-gold-dim">
          Dungeons &amp; Dragons · Reglas 2024
        </p>
        <h1 className="mt-3 bg-gradient-to-b from-gold-soft to-gold-dim bg-clip-text font-display text-5xl font-bold tracking-wide text-transparent sm:text-6xl">
          Grimorio
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-parch-dim">
          Biblioteca de conjuros en español. Elige tu clase y nivel para ver
          qué hechizos tienes a tu disposición.
        </p>
        <div className="mx-auto mt-6 flex max-w-xs items-center gap-3">
          <div className="filete flex-1" />
          <span className="text-gold-dim">✦</span>
          <div className="filete flex-1" />
        </div>
      </header>

      {/* Cuerpo */}
      <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
        <div className="lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto lg:pr-1">
          <Filters
            clase={clase}
            setClase={setClase}
            maxNivel={maxNivel}
            setMaxNivel={setMaxNivel}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            escuelas={escuelas}
            setEscuelas={setEscuelas}
            soloRitual={soloRitual}
            setSoloRitual={setSoloRitual}
            soloConc={soloConc}
            setSoloConc={setSoloConc}
            comps={comps}
            setComps={setComps}
            total={filtrados.length}
            limpiar={limpiar}
          />
        </div>

        <main className="min-w-0">
          {filtrados.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-panel/40 py-20 text-center">
              <p className="font-display text-xl text-parch">Ningún conjuro coincide</p>
              <p className="mt-2 text-sm text-parch-dim">
                Prueba a ampliar el nivel o quitar algún filtro.
              </p>
              <button
                onClick={limpiar}
                className="mt-5 rounded-lg border border-gold/50 bg-gold/10 px-4 py-2 text-sm text-gold-soft transition hover:bg-gold/20"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {porNivel.map(([nivel, lista]) => (
                <section key={nivel}>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="font-display text-lg font-semibold text-parch">
                      {nivelLabel(nivel)}
                    </h2>
                    <span className="rounded-full border border-line bg-ink-2 px-2 py-0.5 text-xs text-parch-dim">
                      {lista.length}
                    </span>
                    <div className="filete flex-1" />
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {lista.map((s, i) => (
                      <SpellCard
                        key={s.id}
                        spell={s}
                        onClick={() => setSeleccion(s)}
                        style={{ animationDelay: `${Math.min(i, 12) * 28}ms` }}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Pie con atribución (licencia CC BY 4.0) */}
      <footer className="mt-16 border-t border-line pt-6 text-center text-xs leading-relaxed text-parch-dim/70">
        <p>
          Conjuros bajo licencia{" "}
          <a
            className="text-gold-dim underline decoration-dotted underline-offset-2 hover:text-gold-soft"
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
          >
            CC BY 4.0
          </a>{" "}
          · contenido del SRD 5.2 © Wizards of the Coast.
        </p>
        <p className="mt-1">
          Datos en español adaptados del proyecto{" "}
          <a
            className="text-gold-dim underline decoration-dotted underline-offset-2 hover:text-gold-soft"
            href="https://github.com/Jtachan/DnD-5.5-Spells-ES"
            target="_blank"
            rel="noreferrer"
          >
            DnD-5.5-Spells-ES
          </a>
          . Pueden existir erratas.
        </p>
      </footer>

      {seleccion ? (
        <SpellDetail
          spell={seleccion}
          onClose={() => setSeleccion(null)}
          unidad={unidad}
          setUnidad={setUnidad}
        />
      ) : null}
    </div>
  );
}
