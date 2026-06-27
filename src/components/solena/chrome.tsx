import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/solena-logo.png.asset.json";
import wordmarkAsset from "@/assets/solena-wordmark.png.asset.json";

const NAV = [
  { to: "/thesis", label: "Thesis" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function NavBar() {
  const [open, setOpen] = useState(false);

  // Close on Escape + lock scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-6 py-6 md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logoAsset.url} alt="Solena" className="h-8 w-8" />
          <span className="hidden font-display text-sm tracking-[0.45em] text-ivory sm:inline">
            SOLENA
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.35em] text-stone/80 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="bronze-line"
              activeProps={{ className: "bronze-line text-ivory" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 bg-obsidian/60 text-ivory backdrop-blur md:hidden"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu sheet */}
      <div
        className={`fixed inset-0 z-50 transform-gpu transition-opacity duration-500 md:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 bg-obsidian/92 backdrop-blur-2xl" onClick={() => setOpen(false)} />
        <nav className="relative flex h-full flex-col items-start justify-center gap-8 px-10">
          {NAV.map((n, i) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className="font-display text-3xl font-light tracking-[0.04em] text-ivory/90 transition-colors hover:text-bronze-glow"
              activeProps={{ className: "text-bronze-glow" }}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(8px)",
                transition: `opacity 500ms ${120 + i * 60}ms ease, transform 600ms ${120 + i * 60}ms cubic-bezier(0.16,1,0.3,1)`,
              }}
            >
              {n.label}
            </Link>
          ))}
          <p className="mt-12 font-signature text-xs italic tracking-[0.3em] text-stone/55">
            Engineered, not advertised.
          </p>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-ivory/5 px-6 py-16 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <img src={wordmarkAsset.url} alt="Solena" className="h-8 opacity-80" />
          <p className="mt-6 max-w-xs text-xs leading-relaxed text-stone/60">
            A civilizational luxury growth studio. We build gravity for culture,
            capital, and legacy.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-xs uppercase tracking-[0.3em] text-stone/60">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="bronze-line">
              {n.label}
            </Link>
          ))}
        </div>
        <p className="font-signature text-xs italic text-stone/50">
          © {new Date().getFullYear()} Solena. Engineered, not advertised.
        </p>
      </div>
    </footer>
  );
}
