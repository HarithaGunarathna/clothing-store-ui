import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import logo from "../assets/brand_name.png";
import { useAuth } from "../auth/AuthContext";
import { useShop } from "../shop/ShopContext";
import Button from "./ui/Button";

const NAV = [
  { to: "/new", label: "New in" },
  { to: "/women", label: "Women" },
  { to: "/men", label: "Men" },
  { to: "/sale", label: "Sale" },
];

const ICONS = {
  wishlist:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z",
  cart: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6ZM3 6h18M16 10a4 4 0 0 1-8 0",
  search: "m21 21-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
};

function IconLink({ to, label, path, count = 0 }) {
  return (
    <Link
      to={to}
      aria-label={count > 0 ? `${label} (${count})` : label}
      className="relative rounded-pill p-2 text-muted transition hover:bg-surface-2 hover:text-ink"
    >
      <svg
        height="19"
        width="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={path} />
      </svg>
      {count > 0 ? (
        <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-pill bg-clay-500 px-1 text-[10px] font-medium text-surface">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

export default function Header() {
  const { status, user, signOut } = useAuth();
  const { favourites, cartCount } = useShop();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    setMenuOpen(false);
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center gap-6 px-4">
        <Link to="/" className="flex shrink-0 items-center">
          <img src={logo} alt="Luna" className="h-auto w-28 object-contain" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "rounded-pill px-3 py-2 text-sm font-medium transition",
                  isActive ? "bg-surface-2 text-ink" : "text-muted hover:text-ink",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-1">
          <IconLink to="/search" label="Search" path={ICONS.search} />
          <IconLink
            to="/wishlist"
            label="Wishlist"
            path={ICONS.wishlist}
            count={favourites.length}
          />
          <IconLink to="/cart" label="Cart" path={ICONS.cart} count={cartCount} />

          {/* "loading" renders neither branch, so the header never flashes
              signed-out for a user whose session is still being restored. */}
          {status === "anonymous" ? (
            <div className="ml-2 flex items-center gap-2">
              <Button to="/login" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button to="/register" size="sm" className="hidden sm:inline-flex">
                Join Luna
              </Button>
            </div>
          ) : null}

          {status === "authenticated" ? (
            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex h-9 w-9 items-center justify-center rounded-pill bg-ink text-sm font-medium text-surface"
              >
                {(user?.username ?? "L").charAt(0).toUpperCase()}
              </button>

              {menuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 overflow-hidden rounded-card border border-line bg-surface shadow-lift"
                >
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-medium text-ink">
                      {/* null for Google/Facebook users — the API never sets it. */}
                      {user?.username ?? "Your account"}
                    </p>
                    <p className="text-xs text-faint">Signed in</p>
                  </div>
                  <Link
                    to="/account"
                    role="menuitem"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm text-muted transition hover:bg-surface-2 hover:text-ink"
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2.5 text-left text-sm text-muted transition hover:bg-surface-2 hover:text-danger"
                  >
                    Sign out
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
