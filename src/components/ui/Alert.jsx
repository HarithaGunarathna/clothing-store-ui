const TONES = {
  error: {
    wrap: "border-danger/25 bg-danger/5 text-danger",
    icon: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  },
  warning: {
    wrap: "border-warning/25 bg-warning/5 text-warning",
    icon: "M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  },
  info: {
    wrap: "border-info/25 bg-info/5 text-info",
    icon: "M12 16v-4m0-4h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  },
  success: {
    wrap: "border-success/25 bg-success/5 text-success",
    icon: "m9 12 2 2 4-4m7-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z",
  },
};

export default function Alert({ tone = "error", children, action }) {
  if (!children) return null;
  const { wrap, icon } = TONES[tone] ?? TONES.info;

  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${wrap}`}>
      <div className="flex gap-3">
        <svg
          className="mt-0.5 h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d={icon} />
        </svg>
        <div>
          <p className="leading-relaxed">{children}</p>
          {action ? <div className="mt-2">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
