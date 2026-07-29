import { Link } from "react-router";

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium " +
  "rounded-pill transition duration-150 whitespace-nowrap " +
  "disabled:opacity-40 disabled:pointer-events-none";

const VARIANTS = {
  // The one solid, high-contrast action per screen.
  primary: "bg-ink text-surface hover:bg-stone-700",
  // Outlined, for the secondary action beside a primary.
  secondary: "border border-line-strong text-ink hover:bg-surface-2",
  // Low-emphasis, sits directly on the canvas.
  ghost: "text-muted hover:text-ink hover:bg-surface-2",
  // Provider sign-in and other neutral full-width actions.
  surface: "bg-surface border border-line text-ink hover:border-line-strong",
  // The single accent colour — reserve for the one moment that should pop.
  accent: "bg-clay-500 text-surface hover:bg-clay-600",
  danger: "border border-danger/30 text-danger hover:bg-danger/5",
};

const SIZES = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  to,
  href,
  fullWidth = false,
  className = "",
  children,
  ...props
}) {
  const classes = [
    BASE,
    VARIANTS[variant] ?? VARIANTS.primary,
    SIZES[size] ?? SIZES.md,
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
