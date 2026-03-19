import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { navItems, externalLinks } from "../lib/navigation";
import { useAuthContext } from "../context/AuthContext";

const rotations = [-1.2, 0.7, -0.5, 1.0, -0.8, 1.3];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  function handleNavClick(path: string) {
    setOpen(false);
    navigate(path);
  }

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-faint">
        <Link to="/" className="hover:opacity-80 transition-opacity" onClick={() => setOpen(false)}>
          <img src="/images/chalk_logo_dark.png" alt="Wedding" className="h-8" />
        </Link>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="torn-paper bg-paper px-4 py-1.5 font-heading text-sm text-ink transition-all duration-200"
          style={{ transform: "rotate(1.5deg)" }}
        >
          {open ? "close" : "menu"}
        </button>
      </div>
      {open && (
        <div className="bg-cream border-b border-ink-faint px-4 py-6 flex flex-col items-center gap-3">
          {navItems.map((item, i) => (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="torn-paper block w-full max-w-xs bg-paper px-5 py-3 text-center font-heading text-lg text-ink transition-all duration-200"
              style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}
            >
              {item.label}
            </button>
          ))}
          {externalLinks.map((link, i) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="torn-paper block w-full max-w-xs bg-paper px-5 py-3 text-center font-heading text-lg text-ink transition-all duration-200"
              style={{ transform: `rotate(${rotations[(i + navItems.length) % rotations.length]}deg)` }}
            >
              {link.label}
            </a>
          ))}
          {user && (
            <button
              onClick={() => handleNavClick("/admin")}
              className="text-sm text-ink-muted hover:text-ink transition-colors font-heading mt-2"
            >
              admin
            </button>
          )}
        </div>
      )}
    </div>
  );
}
