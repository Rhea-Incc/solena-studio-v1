import { useEffect, useMemo, useState } from "react";

/**
 * Scroll tracker. Two presentations, driven by media query:
 * - Desktop (>= sm): right rail spanning ~80vh, hierarchical indent for
 *   subsections, active label revealed on the right.
 * - Mobile (< sm): a horizontal rail pinned to the bottom of the viewport;
 *   the active tick sweeps left→right as the reader scrolls.
 */
type Item = { id: string; label: string; level: number };

export function ScrollTracker() {
  const [sections, setSections] = useState<Item[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scan = () => {
      const els = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section]"),
      );
      setSections(
        els.map((el) => ({
          id: el.dataset.section!,
          label:
            el.dataset.sectionLabel ||
            el.dataset.section!.replace(/[-_]/g, " "),
          level: Math.max(1, Math.min(3, Number(el.dataset.sectionLevel) || 1)),
        })),
      );
    };
    scan();
    const t = window.setTimeout(scan, 250);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!sections.length) return;
    const els = sections
      .map((s) => document.querySelector(`[data-section="${s.id}"]`))
      .filter(Boolean) as Element[];

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible[0])
          setActive(
            (visible[0].target as HTMLElement).dataset.section || null,
          );
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.6, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  // Scroll progress for mobile sweep + desktop rail fill.
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, h.scrollTop / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const activeIndex = useMemo(
    () => Math.max(0, sections.findIndex((s) => s.id === active)),
    [active, sections],
  );

  if (!sections.length) return null;

  const indentFor = (lvl: number) => (lvl - 1) * 16;
  const tickWidthFor = (lvl: number) => 22 - (lvl - 1) * 6;

  return (
    <>
      {/* Desktop rail — 80vh, hierarchical */}
      <nav
        aria-label="Page sections"
        className="pointer-events-auto fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 sm:flex md:right-6"
        style={{ height: "80vh" }}
      >
        <div className="relative flex h-full flex-col justify-between py-4">
          {/* Rail spine */}
          <div className="pointer-events-none absolute right-[7px] top-0 h-full w-px bg-ivory/8" />
          <div
            className="pointer-events-none absolute right-[7px] top-0 w-px bg-gradient-to-b from-bronze-glow/70 to-bronze/0"
            style={{ height: `${Math.min(100, progress * 100)}%` }}
          />
          <ul className="relative flex h-full flex-col justify-between">
            {sections.map((s) => {
              const isActive = s.id === active;
              return (
                <li
                  key={s.id}
                  className={`tracker-row flex items-center justify-end gap-3 ${isActive ? "is-active" : ""}`}
                  style={{ paddingRight: `${indentFor(s.level)}px` }}
                >
                  <span
                    className={`tracker-label font-signature text-[0.65rem] uppercase tracking-[0.3em] text-stone/70 opacity-0 transition-opacity duration-300 ${isActive ? "text-bronze-glow" : ""}`}
                    style={{ fontSize: s.level > 1 ? "0.55rem" : undefined }}
                  >
                    {s.label}
                  </span>
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .querySelector(`[data-section="${s.id}"]`)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="tracker-tick block h-px bg-ivory/60"
                    style={{
                      width: `${tickWidthFor(s.level)}px`,
                      opacity: s.level > 1 ? 0.4 : 0.75,
                    }}
                    aria-label={`Jump to ${s.label}`}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile rail — bottom horizontal, sweeps L→R with scroll */}
      <nav
        aria-label="Page sections"
        className="pointer-events-auto fixed inset-x-0 bottom-3 z-40 flex justify-center px-4 sm:hidden"
      >
        <div className="relative w-full max-w-md rounded-full border border-ivory/8 bg-obsidian/55 px-4 py-2 backdrop-blur">
          <div className="relative flex items-center gap-1.5">
            {sections.map((s, i) => {
              const isActive = s.id === active;
              return (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector(`[data-section="${s.id}"]`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="group flex flex-1 flex-col items-center gap-1"
                  aria-label={`Jump to ${s.label}`}
                >
                  <span
                    className={`h-[2px] w-full rounded-full transition-colors ${isActive ? "bg-bronze-glow" : "bg-ivory/25"}`}
                    style={{
                      transform: s.level > 1 ? "scaleY(0.6)" : undefined,
                      opacity: s.level > 1 ? 0.6 : 1,
                    }}
                  />
                  {isActive && (
                    <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-signature text-[0.55rem] italic tracking-[0.2em] text-bronze-glow">
                      {s.label}
                    </span>
                  )}
                  {/* index reserved but unused visually */}
                  <span className="sr-only">{i + 1}</span>
                </a>
              );
            })}
          </div>
          {/* Sweep indicator */}
          <div
            className="pointer-events-none absolute -bottom-1 left-4 h-[3px] w-2 rounded-full bg-bronze-glow shadow-[0_0_10px_rgba(232,192,140,0.6)] transition-[left] duration-300"
            style={{
              left: `calc(16px + ${((activeIndex + 0.5) / Math.max(1, sections.length)) * 100}% - 16px)`,
            }}
          />
        </div>
      </nav>
    </>
  );
}
