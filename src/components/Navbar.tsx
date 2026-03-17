import { NavLink, Link } from "react-router";
import { navItems, externalLinks } from "../lib/navigation";
import { useAuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuthContext();

  return (
    <nav className="hidden md:flex items-center justify-between px-8 py-4 border-b border-ink-faint">
      <Link to="/" className="font-display text-3xl text-ink hover:text-ink-muted transition-colors">
        wedding
      </Link>
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `font-heading text-lg ${isActive ? "text-ink font-semibold" : "text-ink-muted hover:text-ink"} transition-colors`
            }
          >
            {item.label}
          </NavLink>
        ))}
        {externalLinks.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-lg text-ink-muted hover:text-ink transition-colors"
          >
            {link.label}
            <span className="text-xs ml-0.5">↗</span>
          </a>
        ))}
        {user && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `font-heading text-lg ${isActive ? "text-ink font-semibold" : "text-ink-muted hover:text-ink"} transition-colors`
            }
          >
            admin
          </NavLink>
        )}
      </div>
    </nav>
  );
}
