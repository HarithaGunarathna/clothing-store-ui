/**
 * Plain surface, hairline border, soft shadow. `lift` adds a heavier shadow
 * for the one card that should feel closest to the user — an auth form, a
 * featured product — never a whole grid of them.
 */
export default function Card({ lift = false, className = "", children }) {
  return (
    <div
      className={[
        "rounded-card border border-line bg-surface",
        lift ? "shadow-lift" : "shadow-card",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
