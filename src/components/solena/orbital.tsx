import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";

export type Sector = {
  name: string;
  slug: string;
  tagline: string;
};

/**
 * Eleven sectors orbiting Solena. Note: the "Hospitality" business is
 * displayed as "Hotels" in the orbit while its route slug remains
 * `hospitality` to preserve existing links and sitemap entries.
 */
export const SECTORS: Sector[] = [
  { name: "Real Estate", slug: "real-estate", tagline: "Buildings as gravity wells." },
  { name: "Technology", slug: "technology", tagline: "Tools built as artifacts." },
  { name: "Hotels", slug: "hospitality", tagline: "Service designed as ritual." },
  { name: "Luxury", slug: "luxury", tagline: "Goods that outlive their owner's interest." },
  { name: "Media", slug: "media", tagline: "Channels that operate as institutions." },
  { name: "Ventures", slug: "ventures", tagline: "Capital at the intersection of culture and compound." },
  { name: "Culture", slug: "culture", tagline: "The slow construction of taste." },
  { name: "Capital", slug: "capital", tagline: "Patient money. Built for the century." },
  { name: "Automotive", slug: "automotive", tagline: "Vehicles as heirloom-grade objects." },
  { name: "Airlines", slug: "airlines", tagline: "Air travel restored to ritual." },
  { name: "Tourism", slug: "tourism", tagline: "Journeys engineered to be remembered." },
];

export const ECO_NODES = SECTORS.map((s) => s.name);

/**
 * Three concentric orbits — mirrors the reference composition where a few
 * large mini-planets share broad, softly-etched rings. Sectors are
 * distributed across the rings so multiple bodies occupy the same lane at
 * different angles, and each ring rotates as a single field.
 */
const ORBIT_RINGS = [
  { radius: 24, duration: 210 }, // inner
  { radius: 35, duration: 260 }, // middle
  { radius: 46, duration: 320 }, // outer
] as const;

// Deterministic ring assignment for each sector index. Distribution roughly
// 3 / 4 / 4 keeps every ring visually populated without crowding.
const RING_ASSIGNMENT = [2, 1, 2, 0, 1, 2, 0, 1, 2, 1, 0] as const;

function orbitFor(i: number) {
  const ring = RING_ASSIGNMENT[i % RING_ASSIGNMENT.length];
  const total = RING_ASSIGNMENT.filter((r) => r === ring).length;
  const positionInRing = RING_ASSIGNMENT.slice(0, i).filter(
    (r) => r === ring,
  ).length;
  const start = (positionInRing / total) * 360 - 90;
  return { ...ORBIT_RINGS[ring], ring, start };
}

const SECTOR_ORBITS = SECTORS.map((_, i) => orbitFor(i));

/**
 * Orbit field — a handful of soft concentric rings etched into the dark
 * background rather than drawn on top of it. Faint inner ladder lines add
 * depth without visual noise; energy pulses trace the three primary
 * lanes at a shared angular velocity, evenly phase-offset.
 */
export function OrbitRings() {
  const cx = 50;
  const cy = 50;
  const primary = ORBIT_RINGS.map((o) => o.radius);
  const faint = [14, 20, 32, 44, 55];

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <radialGradient id="orbWash" cx={`${cx}%`} cy={`${cy}%`} r="70%">
          <stop offset="0%" stopColor="rgba(212,168,116,0.09)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="orbCore" cx={`${cx}%`} cy={`${cy}%`} r="30%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="orbPulse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(212,168,116,0)" />
          <stop offset="50%" stopColor="rgba(232,192,140,0.7)" />
          <stop offset="100%" stopColor="rgba(212,168,116,0)" />
        </linearGradient>
      </defs>

      {/* Ambient wash & core glow — dissolves rings into the surrounding dark */}
      <circle cx={cx} cy={cy} r={52} fill="url(#orbWash)" />
      <circle cx={cx} cy={cy} r={16} fill="url(#orbCore)" />

      {/* Faint inner ladder — depth, not decoration */}
      {faint.map((r, i) => (
        <circle
          key={`f-${r}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(232,224,210,1)"
          strokeOpacity={0.04 + i * 0.012}
          strokeWidth={0.08}
        />
      ))}

      {/* Primary orbits — soft, evenly weighted */}
      {primary.map((r) => (
        <circle
          key={`p-${r}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(232,224,210,1)"
          strokeOpacity={0.14}
          strokeWidth={0.18}
        />
      ))}

      {/* Continuous energy pulses on each primary ring */}
      {primary.map((r, i) => {
        const circumference = 2 * Math.PI * r;
        const dur = 22;
        const delay = -(dur * i) / primary.length;
        return (
          <circle
            key={`pulse-${r}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="url(#orbPulse)"
            strokeOpacity={0.55}
            strokeWidth={0.45}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.12} ${circumference}`}
            style={{
              transformOrigin: `${cx}% ${cy}%`,
              animation: `eco-pulse-orbit ${dur}s linear infinite`,
              animationDelay: `${delay}s`,
              mixBlendMode: "screen",
            }}
          />
        );
      })}
    </svg>
  );
}

/**
 * Full orbital ecosystem block. Two-column composition on desktop:
 * left rail (~30vw) holds the active sector title, vertically centered
 * with the orbit's horizontal axis; the orbit itself is pushed to the
 * right. On mobile the two stack and the title sits above the orbit.
 */
export function OrbitalEcosystem({ id = "ecosystem" }: { id?: string }) {
  const initial =
    typeof window !== "undefined"
      ? Math.max(
          0,
          SECTORS.findIndex(
            (s) => s.slug === window.location.hash.replace(/^#/, ""),
          ),
        )
      : -1;
  const [index, setIndex] = useState(initial >= 0 ? initial : 0);
  const sector = SECTORS[index];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = `#${SECTORS[index].slug}`;
    if (window.location.hash !== next) {
      history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}${next}`,
      );
    }
  }, [index]);

  useEffect(() => {
    const onHash = () => {
      const slug = window.location.hash.replace(/^#/, "");
      const i = SECTORS.findIndex((s) => s.slug === slug);
      if (i >= 0 && i !== index) setIndex(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [index]);

  return (
    <section
      data-zone={id}
      data-section={id}
      data-section-label="Ecosystem"
      className="section-ecosystem relative overflow-hidden px-4 py-24 sm:px-6 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow mb-6">III — The Ecosystem</p>
        <p className="font-display text-2xl font-light leading-[1.2] text-ivory sm:text-3xl md:text-4xl">
          Solena sits at the center of converging sectors — brand, built
          environment, culture, capital, and narrative architecture moving as
          a single field.
        </p>
      </div>

      {/* Composition: left title rail + right orbit stage */}
      <div className="relative mx-auto mt-14 flex w-full max-w-[110rem] flex-col items-stretch gap-10 md:mt-20 md:flex-row md:items-center md:gap-4">
        {/* LEFT — active sector caption, ~30vw, centered against orbit axis */}
        <aside
          className="order-2 flex w-full flex-col items-center px-4 text-center md:order-1 md:w-[30vw] md:max-w-[26rem] md:items-start md:px-8 md:text-left"
          data-eco-caption
        >
          <p className="text-[0.55rem] uppercase tracking-[0.42em] text-stone/60">
            Active sector · {String(index + 1).padStart(2, "0")} /{" "}
            {String(SECTORS.length).padStart(2, "0")}
          </p>
          <h3
            data-eco-active
            className="mt-4 font-display text-4xl font-extralight leading-[0.98] tracking-tight text-ivory sm:text-5xl md:text-6xl lg:text-[5.25rem]"
          >
            <span className="font-signature italic text-bronze-glow">
              {sector.name}.
            </span>
          </h3>
          <p className="mt-6 max-w-md font-display text-base font-light leading-snug text-ivory/85 md:text-lg">
            {sector.tagline}
          </p>
          <Link
            to="/sectors/$sector"
            params={{ sector: sector.slug }}
            className="bronze-line mt-8 inline-flex items-center gap-3 border-b border-stone/30 pb-2 text-[0.65rem] uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
          >
            <span>Open {sector.name}</span>
            <span aria-hidden className="text-bronze">
              →
            </span>
          </Link>
        </aside>

        {/* RIGHT — orbit, pushed toward the right of the viewport */}
        <div className="order-1 relative mx-auto w-full max-w-[min(94vw,44rem)] md:order-2 md:mx-0 md:ml-auto md:mr-0 md:flex-1 md:max-w-[min(60vw,50rem)]">
          <div className="relative aspect-square [container-type:inline-size]">
            <div className="ecosystem-rings pointer-events-none absolute inset-0 z-10">
              <div className="ecosystem-drift absolute inset-0">
                <OrbitRings />
              </div>
              <OrbitRings />
            </div>

            <div className="ecosystem-stage absolute inset-0 z-40">
              {SECTORS.map((node, i) => {
                const isActive = i === index;
                const orbit = SECTOR_ORBITS[i];
                const start = orbit.start;
                return (
                  <div
                    key={node.slug}
                    className={`eco-orbit-lane energy-${(i % 3) + 1}`}
                    style={{
                      "--orbit-start": `${start}deg`,
                      "--orbit-radius": `${orbit.radius}%`,
                      "--orbit-duration": `${orbit.duration}s`,
                      "--node-pulse-delay": `-${i * 0.72}s`,
                      "--node-pulse-duration": `${5.8 + (i % 4) * 0.55}s`,
                    } as CSSProperties}
                  >
                    <div className="eco-orbit-slot">
                      <div className="eco-orbit-counter">
                        <Link
                          to="/sectors/$sector"
                          params={{ sector: node.slug }}
                          onPointerEnter={() => setIndex(i)}
                          onFocus={() => setIndex(i)}
                          className={`eco-node ${isActive ? "is-active" : ""}`}
                          aria-label={`Open ${node.name}`}
                        >
                          <div className="eco-node-disc relative flex items-center justify-center rounded-full text-center font-light leading-[1.05] tracking-[0.02em] text-ivory/95">
                            <div className="eco-node-glass absolute inset-0 rounded-full" />
                            <div className="eco-node-ring absolute inset-0 rounded-full" />
                            <div className="eco-node-sheen absolute inset-0 rounded-full" />
                            {isActive && <span className="eco-ping" aria-hidden />}
                            <span className="eco-node-label relative block px-1">
                              {node.name}
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SOLENA core */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
              <div className="eco-core-glass absolute inset-0 rounded-full" />
              <div
                className="absolute inset-0 rounded-full border border-ivory/12"
                style={{
                  boxShadow:
                    "0 0 80px rgba(184,134,73,0.28), inset 0 0 50px rgba(0,0,0,0.65)",
                }}
              />
              <span className="relative font-signature text-sm tracking-[0.22em] text-ivory sm:text-lg lg:text-xl">
                SOLENA
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
