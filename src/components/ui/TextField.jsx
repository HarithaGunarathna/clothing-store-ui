export default function TextField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  autoComplete,
  placeholder,
  hint,
  invalid = false,
}) {
  const id = `field-${name}`;
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-[0.08em] text-muted"
      >
        {label}
        {required ? <span className="text-clay-500"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        aria-describedby={hintId}
        className={[
          "h-11 rounded-lg border bg-canvas px-4 text-ink transition",
          "placeholder:text-faint",
          "focus:border-ink focus:bg-surface focus:outline-none focus:ring-2 focus:ring-clay-500/25",
          invalid ? "border-danger" : "border-line hover:border-line-strong",
        ].join(" ")}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
