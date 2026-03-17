import { Outlet, NavLink } from "react-router";
import { useAuthContext } from "../context/AuthContext";

export default function Admin() {
  const { logout } = useAuthContext();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold font-heading">admin dashboard</h1>
        <button
          onClick={() => logout()}
          className="text-xs text-ink-muted hover:text-ink transition-colors"
        >
          logout
        </button>
      </div>
      <nav className="flex gap-4 mb-8 border-b border-ink-faint pb-4">
        {[
          { to: "/admin/links", label: "links" },
          { to: "/admin/shows", label: "shows" },
          { to: "/admin/media", label: "media" },
        ].map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              isActive ? "text-ink font-bold" : "text-ink-muted hover:text-ink"
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
