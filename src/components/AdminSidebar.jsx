import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { UserRoles } from "../constants/userConstants";

const COLLAPSED_KEY = "luna:admin-sidebar-collapsed";

const ICONS = {
  home: "M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z",
  dashboard: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  admins: "M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z",
};

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: ICONS.home, end: true },
  // Not built yet — see AdminPlaceholder.
  { to: "/admin/dashboard", label: "Dashboard", icon: ICONS.dashboard },
  { to: "/admin/admins", label: "Admins", icon: ICONS.admins, roles: [UserRoles.SuperAdmin] },
];

/** Rendered by App.jsx only when the signed-in user is admin/super admin. */
export default function AdminSidebar() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSED_KEY, collapsed ? "1" : "0");
    } catch {
      // Storage unavailable (private mode, quota) — collapse state just
      // won't survive a reload. Not worth failing over.
    }
  }, [collapsed]);

  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-3">
        {!collapsed ? (
          <p className="px-2 text-xs font-medium uppercase tracking-[0.12em] text-faint">
            Admin
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-pill text-muted transition hover:bg-surface-2 hover:text-ink"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform duration-200 ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M15 6 9 12l6 6" />
          </svg>
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-2 py-2">
        {items.map(({ to, label, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                collapsed ? "justify-center px-0" : "",
                isActive ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink",
              ].join(" ")
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              aria-hidden="true"
            >
              <path d={icon} />
            </svg>
            {!collapsed ? <span className="truncate">{label}</span> : null}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
