"use client";

import { useState } from "react";
import {
  ESCUELA_COLOR,
  SALVACION_LABEL,
  COMPONENTE_LABEL,
  COMPONENTE_DEF,
  PROP_DEF,
  SALVACION_DEF,
  nivelLabel,
} from "@/lib/dnd";

function Dato({ etiqueta, children }) {
  return (
    <div>
      <dt className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-dim">
        {etiqueta}
      </dt>
      <dd className="mt-0.5 text-[0.95rem] text-parch">{children}</dd>
    </div>
  );
}

// Término con explicación que se despliega al hacer clic.
function Termino({ texto, ayuda, setAyuda, children }) {
  const activo = ayuda === texto;
  return (
    <button
      type="button"
      onClick={() => setAyuda(activo ? null : texto)}
      aria-expanded={activo}
      className={`inline cursor-pointer underline decoration-dotted underline-offset-2 transition ${
        activo
          ? "text-gold-soft decoration-gold"
          : "decoration-gold-dim/60 hover:text-gold-soft hover:decoration-gold/70"
      }`}
    >
      {children}
    </button>
  );
}

export default function SpellDetail({ spell, onClose, unidad, setUnidad }) {
  const [ayuda, setAyuda] = useState(null);
  if (!spell) return null;
  const color = ESCUELA_COLOR[spell.escuela] || "#d8b15a";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={spell.nombre}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="surgir relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-gold/30 bg-panel shadow-[0_-10px_60px_rgba(0,0,0,0.7)] sm:rounded-2xl"
        style={{ boxShadow: `0 0 0 1px ${color}22, 0 24px 70px rgba(0,0,0,0.7)` }}
      >
        {/* franja de color de escuela */}
        <div className="h-1 w-full" style={{ background: color }} />

        {/* Encabezado */}
        <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-xl font-display text-2xl font-semibold"
            style={{ color, background: `${color}1a`, border: `1px solid ${color}55` }}
          >
            {spell.nivel === 0 ? "T" : spell.nivel}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-2xl font-semibold leading-tight text-parch">
              {spell.nombre}
            </h2>
            <p className="mt-1 text-sm">
              <span style={{ color }}>{nivelLabel(spell.nivel)}</span>
              <span className="text-parch-dim"> · {spell.escuela}</span>
            </p>
          </div>
          <button
            autoFocus
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-parch-dim transition hover:border-gold/50 hover:text-gold-soft"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo desplazable */}
        <div className="overflow-y-auto p-5 sm:p-6">
          {/* Toggle de unidades */}
          <div className="mb-4 flex items-center justify-end gap-2 text-xs">
            <span className="text-parch-dim">Unidades</span>
            <div className="inline-flex overflow-hidden rounded-lg border border-line">
              {[
                ["imperial", "Pies"],
                ["metrico", "Metros"],
              ].map(([val, txt]) => (
                <button
                  key={val}
                  onClick={() => setUnidad(val)}
                  className={`px-3 py-1 transition ${
                    unidad === val
                      ? "bg-gold/20 text-gold-soft"
                      : "text-parch-dim hover:text-parch"
                  }`}
                >
                  {txt}
                </button>
              ))}
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
            <Dato etiqueta="Tiempo">{spell.tiempo}</Dato>
            <Dato etiqueta="Alcance">{spell.alcance[unidad]}</Dato>
            <Dato etiqueta="Duración">{spell.duracion}</Dato>
            <Dato etiqueta="Componentes">
              <span className="flex flex-wrap gap-x-2 gap-y-1">
                {spell.componentes.map((c) => (
                  <Termino
                    key={c}
                    texto={COMPONENTE_DEF[c] || c}
                    ayuda={ayuda}
                    setAyuda={setAyuda}
                  >
                    {COMPONENTE_LABEL[c] || c}
                  </Termino>
                ))}
              </span>
            </Dato>
            <Dato etiqueta="Salvación">
              {spell.salvacion ? (
                <Termino
                  texto={SALVACION_DEF[spell.salvacion] || ""}
                  ayuda={ayuda}
                  setAyuda={setAyuda}
                >
                  {SALVACION_LABEL[spell.salvacion] || spell.salvacion}
                </Termino>
              ) : (
                "Ninguna"
              )}
            </Dato>
            <Dato etiqueta="Concentración">
              <Termino texto={PROP_DEF.concentracion} ayuda={ayuda} setAyuda={setAyuda}>
                {spell.concentracion ? "Sí" : "No"}
              </Termino>
            </Dato>
            <Dato etiqueta="Ritual">
              <Termino texto={PROP_DEF.ritual} ayuda={ayuda} setAyuda={setAyuda}>
                {spell.ritual ? "Sí" : "No"}
              </Termino>
            </Dato>
          </dl>

          {/* Panel de ayuda (se abre al hacer clic en un término subrayado) */}
          {ayuda ? (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-gold/30 bg-ink-2 p-3 text-xs leading-relaxed text-parch-dim">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-dim"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>{ayuda}</span>
              <button
                onClick={() => setAyuda(null)}
                aria-label="Cerrar ayuda"
                className="ml-auto shrink-0 text-parch-dim/70 transition hover:text-gold-soft"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : null}

          {spell.materiales ? (
            <p className="mt-4 rounded-lg border border-line bg-ink-2 p-3 text-sm text-parch-dim">
              <span className="font-semibold text-gold-dim">Materiales: </span>
              {spell.materiales}
            </p>
          ) : null}

          <div className="filete my-5" />

          <div
            className="conjuro-desc text-[0.98rem]"
            dangerouslySetInnerHTML={{ __html: spell.descripcion[unidad] }}
          />

          {/* Clases */}
          <div className="mt-6">
            <h3 className="mb-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-dim">
              Clases que pueden lanzarlo
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {spell.clases.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line bg-ink-2 px-2.5 py-1 text-xs text-parch-dim"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
