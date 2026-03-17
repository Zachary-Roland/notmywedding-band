import { useState } from "react";
import { NavLink, Link } from "react-router";
import { navItems, externalLinks } from "../lib/navigation";
import { useAuthContext } from "../context/AuthContext";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-faint">
        <Link to="/" className="font-display text-2xl text-ink" onClick={() => setOpen(false)}>
          wedding
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="text-ink p-2"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {open && (
        <div className="bg-cream border-b border-ink-faint px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block font-heading text-xl ${isActive ? "text-ink font-semibold" : "text-ink-muted"}`
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
              onClick={() => setOpen(false)}
              className="block font-heading text-xl text-ink-muted"
            >
              {link.label} <span className="text-xs">&nearr;</span>
            </a>
          ))}
          {user && (
            <NavLink
              to="/admin"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block font-heading text-xl ${isActive ? "text-ink font-semibold" : "text-ink-muted"}`
              }
            >
              admin
            </NavLink>
          )}
        </div>
      )}
    </div>
  );
}
