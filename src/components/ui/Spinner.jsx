export default function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center gap-4" role="status">
      <div className="h-8 w-8 animate-spin rounded-pill border-2 border-line border-t-ink" />
      {label ? <p className="text-sm text-muted">{label}</p> : null}
      <span className="sr-only">{label ?? "Loading"}</span>
    </div>
  );
}
