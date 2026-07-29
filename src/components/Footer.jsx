import { Link } from "react-router";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { to: "/new", label: "New in" },
      { to: "/women", label: "Women" },
      { to: "/men", label: "Men" },
      { to: "/sale", label: "Sale" },
    ],
  },
  {
    title: "Help",
    links: [
      { to: "/shipping", label: "Shipping" },
      { to: "/returns", label: "Returns" },
      { to: "/size-guide", label: "Size guide" },
      { to: "/contact", label: "Contact us" },
    ],
  },
  {
    title: "Luna",
    links: [
      { to: "/about", label: "Our story" },
      { to: "/careers", label: "Careers" },
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
];

export default function Footer() {
  return (
    /* In normal flow — the layout's flex column pins it to the bottom. */
    <footer className="mt-auto w-full border-t border-line">
      <div className="container mx-auto grid gap-10 px-4 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg italic text-ink">Luna</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            Considered clothing, quietly made.
          </p>
        </div>

        {COLUMNS.map(({ title, links }) => (
          <div key={title}>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-faint">
              {title}
            </p>
            <ul className="space-y-2.5">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted transition hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="container mx-auto flex flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-faint sm:flex-row">
          <p>© {new Date().getFullYear()} Luna. All rights reserved.</p>
          <p>Colombo, Sri Lanka.</p>
        </div>
      </div>
    </footer>
  );
}
