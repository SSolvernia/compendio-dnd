"use client";

import { useState } from "react";
import Link from "next/link";

export default function ClassGuide({ data }) {
  const [abierto, setAbierto] = useState(null);
  const color = data.color || "#d8b15a";

  const rasgoPorSlug = Object.fromEntries(data.rasgos.map((r) => [r.slug, r]));

  const toggle = (slug) => setAbierto((a) => (a === slug ? null : slug));

  const abrirYDesplazar = (slug) => {
    setAbierto(slug);
    requestAnimationFrame(() => {
      const el = document.getElementById(`rasgo-${slug}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Volver */}
      <Link
        href="/clases"
        className="inline-flex items-center gap-1.5 text-sm text-parch-dim transition hover:text-gold-soft"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Clases
      </Link>

      {/* Hero */}
      <header className="relative mt-4 overflow-hidden rounded-2xl border border-line bg-panel/50 p-5 sm:p-9">
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: color }} />
        {!data.imagen ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[10rem] leading-none opacity-10"
            style={{ color }}
          >
            ❖
          </span>
        ) : null}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="font-display text-[0.7rem] uppercase tracking-[0.25em] text-parch-dim sm:tracking-[0.3em]">
              Clase · D&amp;D 2024
            </p>
            <h1
              className="mt-2 break-words font-display text-4xl font-bold tracking-wide sm:text-6xl"
              style={{ color }}
            >
              {data.nombre}
            </h1>
            {data.lema ? (
              <p className="mt-2 font-display text-lg italic text-gold-soft/90">{data.lema}</p>
            ) : null}
            <p className="mt-4 max-w-2xl leading-relaxed text-parch-dim">{data.descripcion}</p>
          </div>
          {data.imagen ? (
            <figure className="relative z-10 mx-auto shrink-0 sm:mx-0">
              <img
                src={data.imagen.url}
                alt={data.imagen.alt || `Ilustración de ${data.nombre}`}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="h-72 w-56 rounded-xl border object-cover object-top shadow-lg sm:h-56 sm:w-44"
                style={{ borderColor: `${color}66` }}
              />
              {data.imagen.credito ? (
                <figcaption className="mt-1.5 text-center text-[0.65rem] text-parch-dim/60">
                  {data.imagen.credito}
                </figcaption>
              ) : null}
            </figure>
          ) : null}
        </div>
      </header>

      {/* Ficha rápida */}
      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Dado de Golpe", data.ficha.dadoGolpe],
          ["Características", data.ficha.caracteristicas],
          ["Origen", data.ficha.origen],
          ["Multiclase", data.ficha.multiclase],
        ].map(([label, valor]) => (
          <div key={label} className="rounded-xl border border-line bg-panel/40 p-3.5">
            <div className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold-dim">
              {label}
            </div>
            <div className="mt-1 text-[0.95rem] text-parch">{valor}</div>
          </div>
        ))}
      </section>

      {/* Equipo */}
      {data.equipo ? (
        <section className="mt-6 rounded-xl border border-line bg-panel/40 p-5">
          <h2 className="font-display text-lg font-semibold text-parch">Equipo inicial</h2>
          <p className="mt-1 text-sm text-parch-dim">{data.equipo.intro}</p>
          <ul className="mt-3 space-y-2">
            {data.equipo.opciones.map((o, i) => (
              <li key={i} className="flex gap-2.5 text-[0.95rem] text-parch">
                <span className="mt-0.5 shrink-0 font-display text-sm" style={{ color }}>
                  ◆
                </span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Magia (lanzadores de conjuros) */}
      {data.magia ? (
        <section className="mt-6">
          <h2 className="mb-3 font-display text-xl font-semibold text-parch">Magia</h2>
          {data.magia.resumen?.length ? (
            <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {data.magia.resumen.map((r) => (
                <div key={r.label} className="rounded-xl border border-line bg-panel/40 p-3.5">
                  <div className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold-dim">
                    {r.label}
                  </div>
                  <div className="mt-1 text-[0.95rem] text-parch">{r.valor}</div>
                </div>
              ))}
            </div>
          ) : null}
          {data.magia.puntosNota ? (
            <p
              className="mb-3 flex items-start gap-2.5 rounded-xl border bg-ink-2 p-4 text-sm text-parch-dim"
              style={{ borderColor: `${color}40` }}
            >
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color }}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <span>{data.magia.puntosNota}</span>
            </p>
          ) : null}
          {data.magia.tabla?.length ? (
            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-center text-sm">
                <thead>
                  <tr className="bg-panel-2/60">
                    <th className="px-2 py-2 font-display text-[0.65rem] font-semibold uppercase tracking-wider text-gold-dim">
                      Nv
                    </th>
                    <th className="px-2 py-2 font-display text-[0.65rem] font-semibold uppercase tracking-wider text-gold-dim">
                      Trucos
                    </th>
                    <th className="px-2 py-2 font-display text-[0.65rem] font-semibold uppercase tracking-wider text-gold-dim">
                      Prep.
                    </th>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <th
                        key={n}
                        className="px-2 py-2 font-display text-[0.65rem] font-semibold text-gold-dim"
                      >
                        {n}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.magia.tabla.map((f, i) => (
                    <tr
                      key={f.nivel}
                      className={`border-t border-line/70 ${i % 2 ? "bg-panel/20" : ""}`}
                    >
                      <td className="px-2 py-1.5 font-semibold" style={{ color }}>
                        {f.nivel}
                      </td>
                      <td className="px-2 py-1.5 text-parch-dim">{f.trucos}</td>
                      <td className="px-2 py-1.5 text-parch-dim">{f.preparados}</td>
                      {f.espacios.map((s, j) => (
                        <td
                          key={j}
                          className={`px-2 py-1.5 ${s ? "text-parch" : "text-parch-dim/30"}`}
                        >
                          {s ? s : "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
          <p className="mt-2 text-xs text-parch-dim/70">
            Columnas 1–9 = espacios de conjuro disponibles por nivel de conjuro.
          </p>
        </section>
      ) : null}

      {/* Progresiones */}
      {data.progresiones?.length ? (
        <section className="mt-6 grid gap-3 sm:grid-cols-2">
          {data.progresiones.map((p) => (
            <div key={p.nombre} className="rounded-xl border border-line bg-panel/40 p-5">
              <h3 className="font-display text-base font-semibold text-parch">{p.nombre}</h3>
              {p.nota ? <p className="mt-1 text-xs text-parch-dim">{p.nota}</p> : null}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.valores.map((v) => (
                  <span
                    key={v.nivel}
                    className="inline-flex items-center gap-1.5 rounded-lg border bg-ink-2 px-2 py-1 text-xs"
                    style={{ borderColor: `${color}40` }}
                  >
                    <span className="text-parch-dim">Nv {v.nivel}</span>
                    <span className="font-semibold" style={{ color }}>
                      {v.valor}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>
      ) : null}

      {data.concentracionNota ? (
        <section
          className="mt-3 flex items-start gap-2.5 rounded-xl border bg-ink-2 p-4 text-sm text-parch-dim"
          style={{ borderColor: `${color}40` }}
        >
          <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span>{data.concentracionNota}</span>
        </section>
      ) : null}

      {/* Tabla de clase */}
      <section className="mt-8">
        <h2 className="mb-1 font-display text-xl font-semibold text-parch">
          Tabla de {data.nombre}
        </h2>
        <p className="mb-3 text-sm text-parch-dim">
          Rasgos que obtienes a cada nivel. Toca cualquier rasgo para leer su descripción.
        </p>
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-panel-2/60 text-left">
                <th className="w-14 px-3 py-2 text-center font-display text-[0.7rem] font-semibold uppercase tracking-wider text-gold-dim">
                  Nivel
                </th>
                <th className="px-3 py-2 font-display text-[0.7rem] font-semibold uppercase tracking-wider text-gold-dim">
                  Rasgos de clase
                </th>
              </tr>
            </thead>
            <tbody>
              {data.tabla.map((fila, i) => (
                <tr
                  key={fila.nivel}
                  className={`border-t border-line/70 ${i % 2 ? "bg-panel/20" : ""}`}
                >
                  <td className="px-3 py-2.5 text-center align-top">
                    <span
                      className="inline-grid h-7 w-7 place-items-center rounded-md font-display text-sm font-semibold"
                      style={{ color, background: `${color}1a`, border: `1px solid ${color}44` }}
                    >
                      {fila.nivel}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex flex-wrap gap-1.5">
                      {fila.rasgos.map((r, j) => {
                        const rasgo = rasgoPorSlug[r.slug];
                        if (!rasgo) return null;
                        return (
                          <button
                            key={`${r.slug}-${j}`}
                            onClick={() => abrirYDesplazar(r.slug)}
                            className="inline-flex items-center gap-1 rounded-md border border-line bg-ink-2 px-2 py-1 text-xs text-parch transition hover:border-gold/50 hover:text-gold-soft"
                          >
                            {rasgo.nombre}
                            {r.mejora ? (
                              <span title="Mejora del rasgo" style={{ color }}>
                                ▲
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data.tablaNota ? (
          <p className="mt-2 text-sm text-parch-dim">{data.tablaNota}</p>
        ) : null}
      </section>

      {/* Rasgos (acordeón) */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-xl font-semibold text-parch">Rasgos de clase</h2>
        <div className="space-y-2">
          {data.rasgos.map((r) => {
            const activo = abierto === r.slug;
            return (
              <div
                key={r.slug}
                id={`rasgo-${r.slug}`}
                className="overflow-hidden rounded-xl border bg-panel/40 transition"
                style={{ borderColor: activo ? `${color}66` : "var(--color-line)" }}
              >
                <button
                  onClick={() => toggle(r.slug)}
                  aria-expanded={activo}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-panel-2/40"
                >
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-md font-display text-xs font-semibold"
                    style={{ color, background: `${color}1a`, border: `1px solid ${color}44` }}
                  >
                    {r.nivel}
                  </span>
                  <span className="flex-1 font-display text-base font-semibold text-parch">
                    {r.nombre}
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 shrink-0 text-parch-dim transition-transform ${activo ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {activo ? (
                  <div className="border-t border-line/70 px-4 py-3.5">
                    <p className="leading-relaxed text-parch-dim">{r.descripcion}</p>
                    {r.escalado ? (
                      <div className="mt-3">
                        <div className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-gold-dim">
                          {r.escalado.etiqueta}
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                          {r.escalado.valores.map((v) => (
                            <span
                              key={v.nivel}
                              className="inline-flex items-center gap-1.5 rounded-lg border bg-ink-2 px-2 py-1 text-xs"
                              style={{ borderColor: `${color}40` }}
                            >
                              <span className="text-parch-dim">Nv {v.nivel}</span>
                              <span className="font-semibold" style={{ color }}>
                                {v.valor}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {/* Metamagia */}
      {data.metamagia ? (
        <section className="mt-8">
          <h2 className="mb-1 font-display text-xl font-semibold text-parch">Metamagia</h2>
          {data.metamagia.intro ? (
            <p className="mb-3 text-sm text-parch-dim">{data.metamagia.intro}</p>
          ) : null}
          <div className="grid gap-2.5 sm:grid-cols-2">
            {data.metamagia.opciones.map((m) => (
              <div key={m.nombre} className="rounded-xl border border-line bg-panel/40 p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold" style={{ color }}>
                    {m.nombre}
                  </h3>
                  {m.coste ? (
                    <span
                      className="shrink-0 rounded-full border bg-ink-2 px-2 py-0.5 text-[0.65rem] text-parch-dim"
                      style={{ borderColor: `${color}40` }}
                    >
                      {m.coste}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-parch-dim">{m.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Subclase */}
      {data.subclase ? (
        <section className="mt-8">
          <h2 className="mb-1 font-display text-xl font-semibold text-parch">Subclases</h2>
          {data.subclase.intro ? (
            <p className="mb-3 text-sm text-parch-dim">{data.subclase.intro}</p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2">
            {data.subclase.opciones.map((s) => (
              <div
                key={s.nombre}
                className="rounded-xl border bg-panel/40 p-5"
                style={{ borderColor: `${color}40` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-semibold" style={{ color }}>
                    {s.nombre}
                  </h3>
                  {s.origen ? (
                    <span className="shrink-0 rounded-full border border-line bg-ink-2 px-2 py-0.5 text-[0.7rem] text-parch-dim">
                      {s.origen}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-parch-dim">{s.descripcion}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Fuente */}
      {data.fuente ? (
        <footer className="mt-12 border-t border-line pt-5 text-center text-xs leading-relaxed text-parch-dim/70">
          <p>
            {data.fuente.texto}
            {data.fuente.url ? (
              <>
                {" · "}
                <a
                  href={data.fuente.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gold-dim underline decoration-dotted underline-offset-2 hover:text-gold-soft"
                >
                  fuente
                </a>
              </>
            ) : null}
          </p>
          <p className="mt-1">
            D&amp;D y sus marcas pertenecen a Wizards of the Coast. Material usado con
            fines informativos.
          </p>
        </footer>
      ) : null}
    </div>
  );
}
