"use client";

import {
  CLASES,
  ESCUELAS,
  ESCUELA_COLOR,
  COMPONENTE_LABEL,
  nivelCorto,
} from "@/lib/dnd";

function Rotulo({ children }) {
  return (
    <h3 className="mb-2 font-display text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold-dim">
      {children}
    </h3>
  );
}

export default function Filters({
  clase,
  setClase,
  maxNivel,
  setMaxNivel,
  busqueda,
  setBusqueda,
  escuelas,
  setEscuelas,
  soloRitual,
  setSoloRitual,
  soloConc,
  setSoloConc,
  comps,
  setComps,
  total,
  limpiar,
}) {
  const toggleEscuela = (e) =>
    setEscuelas((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]
    );

  const toggleComp = (c) =>
    setComps((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const hayFiltros =
    clase ||
    maxNivel < 9 ||
    busqueda ||
    escuelas.length ||
    soloRitual ||
    soloConc ||
    comps.length;

  return (
    <aside className="flex flex-col gap-6 rounded-xl border border-line bg-panel/70 p-5 backdrop-blur-sm">
      {/* Cabecera con acción de limpiar */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-soft">
          Filtros
        </h2>
        {hayFiltros ? (
          <button
            onClick={limpiar}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-parch-dim transition hover:text-gold-soft"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            Limpiar
          </button>
        ) : null}
      </div>

      {/* Búsqueda */}
      <div>
        <Rotulo>Buscar</Rotulo>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-dim"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Nombre del conjuro…"
            className="w-full rounded-lg border border-line bg-ink-2 py-2 pl-9 pr-3 text-parch placeholder:text-parch-dim/60 outline-none transition focus:border-gold/60 focus:ring-1 focus:ring-gold/40"
          />
        </div>
      </div>

      {/* Clase */}
      <div>
        <Rotulo>Clase</Rotulo>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setClase("")}
            className={`col-span-2 rounded-lg border px-3 py-1.5 text-sm transition ${
              clase === ""
                ? "border-gold/70 bg-gold/15 text-gold-soft"
                : "border-line bg-ink-2 text-parch-dim hover:border-gold/40 hover:text-parch"
            }`}
          >
            Todas las clases
          </button>
          {CLASES.map((c) => (
            <button
              key={c}
              onClick={() => setClase(clase === c ? "" : c)}
              className={`rounded-lg border px-2 py-1.5 text-sm transition ${
                clase === c
                  ? "border-gold/70 bg-gold/15 text-gold-soft"
                  : "border-line bg-ink-2 text-parch-dim hover:border-gold/40 hover:text-parch"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Nivel máximo de conjuro */}
      <div>
        <Rotulo>Nivel de conjuro máximo</Rotulo>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 10 }, (_, n) => n).map((n) => {
            const incluido = n <= maxNivel;
            return (
              <button
                key={n}
                onClick={() => setMaxNivel(n)}
                title={n === 0 ? "Solo trucos" : `Hasta nivel ${n}`}
                className={`h-9 w-9 rounded-md border text-sm font-semibold transition ${
                  n === maxNivel
                    ? "border-gold bg-gold text-ink shadow-[0_0_12px_rgba(216,177,90,0.4)]"
                    : incluido
                      ? "border-gold/40 bg-gold/10 text-gold-soft"
                      : "border-line bg-ink-2 text-parch-dim/70 hover:border-gold/30"
                }`}
              >
                {nivelCorto(n)}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-parch-dim/70">
          Muestra trucos {maxNivel > 0 ? `y conjuros hasta nivel ${maxNivel}` : "únicamente"}.
        </p>
      </div>

      {/* Escuela */}
      <div>
        <Rotulo>Escuela de magia</Rotulo>
        <div className="flex flex-wrap gap-1.5">
          {ESCUELAS.map((e) => {
            const activa = escuelas.includes(e);
            return (
              <button
                key={e}
                onClick={() => toggleEscuela(e)}
                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition"
                style={{
                  borderColor: activa ? ESCUELA_COLOR[e] : "var(--color-line)",
                  background: activa ? `${ESCUELA_COLOR[e]}22` : "var(--color-ink-2)",
                  color: activa ? ESCUELA_COLOR[e] : "var(--color-parch-dim)",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: ESCUELA_COLOR[e] }}
                />
                {e}
              </button>
            );
          })}
        </div>
      </div>

      {/* Propiedades */}
      <div>
        <Rotulo>Propiedades</Rotulo>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSoloRitual((v) => !v)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              soloRitual
                ? "border-gold/70 bg-gold/15 text-gold-soft"
                : "border-line bg-ink-2 text-parch-dim hover:border-gold/40 hover:text-parch"
            }`}
          >
            Ritual
          </button>
          <button
            onClick={() => setSoloConc((v) => !v)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
              soloConc
                ? "border-gold/70 bg-gold/15 text-gold-soft"
                : "border-line bg-ink-2 text-parch-dim hover:border-gold/40 hover:text-parch"
            }`}
          >
            Concentración
          </button>
        </div>
      </div>

      {/* Componentes */}
      <div>
        <Rotulo>Componentes requeridos</Rotulo>
        <div className="flex gap-1.5">
          {["V", "S", "M"].map((c) => {
            const activo = comps.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleComp(c)}
                title={COMPONENTE_LABEL[c]}
                className={`flex-1 rounded-lg border py-1.5 text-sm font-semibold transition ${
                  activo
                    ? "border-gold/70 bg-gold/15 text-gold-soft"
                    : "border-line bg-ink-2 text-parch-dim hover:border-gold/40 hover:text-parch"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="filete" />
      <p className="text-center text-xs text-parch-dim/70">
        {total} {total === 1 ? "conjuro" : "conjuros"}
      </p>
    </aside>
  );
}
