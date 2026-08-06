const TONES = {
  accent: "bg-clay-50 text-clay-600 border-clay-100",
  ink: "bg-stone-100 text-ink border-line",
  neutral: "bg-surface text-muted border-line",
  danger: "bg-danger/10 text-danger border-danger/25",
  info: "bg-info/10 text-info border-info/25",
};

export default function Badge({ tone = "accent", className = "", children }) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-pill border px-3 py-1",
        "text-xs font-medium uppercase tracking-[0.1em]",
        TONES[tone] ?? TONES.accent,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
