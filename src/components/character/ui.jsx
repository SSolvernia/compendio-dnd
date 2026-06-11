// Shared visual primitives for the character sheet. They reuse the compendium tokens
// (gold/parch/panel/line) and the Grimorio input styling. Visible text stays in Spanish.

export function Section({ title, action, children, className = "" }) {
  return (
    <section className={`rounded-xl border border-line bg-panel/60 p-4 sm:p-5 ${className}`}>
      {title ? (
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-gold-soft">
            {title}
          </h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Label({ children, className = "" }) {
  return (
    <span
      className={`font-display text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-gold-dim ${className}`}
    >
      {children}
    </span>
  );
}

const INPUT =
  "w-full rounded-lg border border-line bg-ink-2 px-3 py-2 text-parch placeholder:text-parch-dim/60 outline-none transition focus:border-gold/60 focus:ring-1 focus:ring-gold/40";

export function TextField({ label, value, onChange, placeholder, type = "text", className = "", ...rest }) {
  return (
    <label className={`block ${className}`}>
      {label ? <Label className="mb-1 block">{label}</Label> : null}
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={INPUT}
        {...rest}
      />
    </label>
  );
}

export function NumberField({ label, value, onChange, min, max, ...rest }) {
  return (
    <label className="block">
      {label ? <Label className="mb-1 block">{label}</Label> : null}
      <input
        type="number"
        value={value ?? 0}
        min={min}
        max={max}
        onChange={(e) => {
          const n = e.target.value === "" ? "" : Number(e.target.value);
          onChange(n === "" ? "" : Math.max(min ?? -Infinity, Math.min(max ?? Infinity, n)));
        }}
        className={INPUT}
        {...rest}
      />
    </label>
  );
}

export function SelectField({ label, value, onChange, options, placeholder = "—" }) {
  return (
    <label className="block">
      {label ? <Label className="mb-1 block">{label}</Label> : null}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT} appearance-none`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

// Large stat box (AC, initiative, …). `help` adds an explanatory popover.
// `size="lg"` renders a taller box with a bigger number (used for AC on the
// combat band, mirroring the prominent boxes of the official sheet).
export function StatBox({ label, value, sub, help, size = "md" }) {
  const lg = size === "lg";
  const box = (
    <div
      className={`flex h-full flex-col items-center justify-center rounded-xl border border-line bg-ink-2 px-2 text-center ${
        lg ? "py-6" : "py-3"
      }`}
    >
      <Label>{label}</Label>
      <span className={`mt-1 font-display font-bold text-parch ${lg ? "text-5xl" : "text-2xl"}`}>
        {value}
      </span>
      {sub ? <span className="text-[0.65rem] text-parch-dim">{sub}</span> : null}
    </div>
  );
  if (!help) return box;
  return <HelpTip text={help} block>{box}</HelpTip>;
}

// Contextual help without useEffect or state: the popover shows on hover and on focus
// (pure CSS via group-hover/group-focus-within). On touch, tapping focuses the trigger
// (tabIndex) and shows the help; tapping elsewhere closes it.
// `text` accepts a string or JSX. `block` makes the trigger fill its container.
// `align` positions the popover relative to the trigger: "center" (default) or "start"
// (left-aligned — use near the viewport's left edge so the popover isn't cut off).
const TIP_ALIGN = {
  center: "left-1/2 -translate-x-1/2",
  start: "left-0",
};

export function HelpTip({ text, children, block = false, align = "center", className = "" }) {
  return (
    <span className={`group relative ${block ? "block" : "inline-flex items-center"} ${className}`}>
      <span
        tabIndex={0}
        className={`${
          block
            ? "block cursor-help outline-none"
            : "inline cursor-help underline decoration-dotted decoration-gold-dim/60 underline-offset-2 outline-none transition hover:text-gold-soft hover:decoration-gold/70 focus-visible:text-gold-soft"
        }`}
      >
        {children}
      </span>
      <span
        role="tooltip"
        className={`invisible absolute bottom-full z-40 mb-2 w-64 max-w-[80vw] whitespace-normal rounded-lg border border-gold/30 bg-ink-2 p-2.5 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-parch-dim opacity-0 shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${TIP_ALIGN[align] || TIP_ALIGN.center}`}
      >
        {text}
      </span>
    </span>
  );
}

// Popover body with a tool's stat block (use, ability, crafting). `tool` is an entry
// from herramientas.json (Spanish data fields).
export function ToolHelp({ tool }) {
  return (
    <>
      <b className="text-parch">{tool.nombre}</b> ({tool.precio}).{" "}
      <span className="text-gold-soft">Característica:</span> {tool.caracteristica}.{" "}
      <span className="text-gold-soft">Utilizar:</span> {tool.utilizar}
      {tool.fabricar?.length ? (
        <>
          {" "}
          <span className="text-gold-soft">Fabricar:</span> {tool.fabricar.join(", ")}.
        </>
      ) : null}
    </>
  );
}
