import { Link } from "@tanstack/react-router";
import logoAsset from "@/assets/solena-logo.png.asset.json";
import wordmarkAsset from "@/assets/solena-wordmark.png.asset.json";

const NAV = [
  { to: "/thesis", label: "Thesis" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/journal", label: "Journal" },
  { to: "/contact", label: "Contact" },
] as const;

export function NavBar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-6 py-6 md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoAsset.url} alt="Solena" className="h-8 w-8" />
          <span className="hidden font-display text-sm tracking-[0.45em] text-ivory sm:inline">
            SOLENA
          </span>
        </Link>
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
        {/* Mobile compact nav */}
        <nav className="flex gap-4 text-[0.6rem] uppercase tracking-[0.28em] text-stone/80 md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeProps={{ className: "text-ivory" }}
            >
              {n.label}
            </Link>
          ))}
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
          <img
            src={wordmarkAsset.url}
            alt="Solena"
            className="h-8 opacity-80"
          />
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
