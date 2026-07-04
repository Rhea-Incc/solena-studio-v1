import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";

export type Sector = {
  name: string;
  slug: string;
  tagline: string;
};

export const SECTORS: Sector[] = [
  { name: "Real Estate", slug: "real-estate", tagline: "Buildings as gravity wells." },
  { name: "Technology", slug: "technology", tagline: "Tools built as artifacts." },
  { name: "Hospitality", slug: "hospitality", tagline: "Service designed as ritual." },
  { name: "Luxury", slug: "luxury", tagline: "Goods that outlive their owner's interest." },
  { name: "Media", slug: "media", tagline: "Channels that operate as institutions." },
  { name: "Ventures", slug: "ventures", tagline: "Capital at the intersection of culture and compound." },
  { name: "Culture", slug: "culture", tagline: "The slow construction of taste." },
  { name: "Capital", slug: "capital", tagline: "Patient money. Built for the century." },
];

export const ECO_NODES = SECTORS.map((s) => s.name);

/**
 * Glassmorphic orbit rings — three primary lanes matching sector radii,
 * plus a dense faint ladder. Outer lanes read strongest; inner lanes
 * fade to a whisper.
 */
export function OrbitRings({
  half = false,
  anchor = "right",
}: {
  half?: boolean;
  anchor?: "right" | "bottom" | "none";
}) {
  const cx = half && anchor === "right" ? 100 : 50;
  const cy = half && anchor === "bottom" ? 100 : 50;

  // Sector orbits (radii match React lane values below).
  const primary = [44, 40, 36];

  // Fine ladder for texture — fainter toward the core.
  const ladder = Array.from({ length: 22 }, (_, i) => i);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <radialGradient id="orbWash" cx={`${cx}%`} cy={`${cy}%`} r="65%">
          <stop offset="0%" stopColor="rgba(212,168,116,0.10)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.025)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="orbCore" cx={`${cx}%`} cy={`${cy}%`} r="35%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="orbPulse" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(212,168,116,0)" />
          <stop offset="50%" stopColor="rgba(232,192,140,0.85)" />
          <stop offset="100%" stopColor="rgba(212,168,116,0)" />
        </linearGradient>
      </defs>

      <circle cx={cx} cy={cy} r={49} fill="url(#orbWash)" />
      <circle cx={cx} cy={cy} r={22} fill="url(#orbCore)" />

      {/* Fine ladder — fades sharply on inner rings */}
      {ladder.map((i) => {
        const r = 47 - i * 1.9;
        if (r <= 6) return null;
        const t = 1 - i / ladder.length; // 1 outer → 0 inner
        const heavy = i % 4 === 0;
        // Inner rings drop off fast (t^2), outer stay legible
        const op = 0.03 + Math.pow(t, 2) * 0.14;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(232,224,210,1)"
            strokeOpacity={heavy ? op + 0.03 : op}
            strokeWidth={heavy ? 0.16 : 0.07}
          />
        );
      })}

      {/* Primary sector lanes — glass-highlight strokes */}
      {primary.map((r, i) => {
        const t = 1 - i / (primary.length - 1); // 1 outer → 0 inner
        return (
          <circle
            key={`p-${r}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(232,224,210,1)"
            strokeOpacity={0.14 + t * 0.18}
            strokeWidth={0.22}
          />
        );
      })}

      {/* Energy pulses — matched angular velocity, evenly spaced phases,
          uniform opacity across all three rings for continuous, smooth motion. */}
      {primary.map((r, i) => {
        const circumference = 2 * Math.PI * r;
        // Same period for all rings → identical angular velocity, no drift.
        const dur = 14;
        // Evenly-spaced phase offset (0, 1/3, 2/3 of the cycle).
        const delay = -(dur * i) / primary.length;
        return (
          <circle
            key={`pulse-${r}`}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="url(#orbPulse)"
            strokeOpacity={0.7}
            strokeWidth={0.5}
            strokeLinecap="round"
            strokeDasharray={`${circumference * 0.14} ${circumference}`}
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
 * Full orbital ecosystem block. Sectors orbit continuously on three energy
 * rings; heavy glassmorphism on the orbit and each sector node. Selection
 * is mirrored to the URL hash (e.g. #culture) for deep linking.
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
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
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

  const ringFor = (i: number) => i % 3;

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

      {/* ORBIT STAGE */}
      <div className="relative mx-auto mt-16 w-full max-w-[min(94vw,44rem)] sm:mt-20">
        <div className="relative aspect-square">
          <div className="ecosystem-stage absolute inset-0">
            {/* ambient slow drift layer */}
            <div className="ecosystem-drift pointer-events-none absolute inset-0">
              <OrbitRings />
            </div>
            <OrbitRings />

            {SECTORS.map((node, i) => {
              const isActive = i === index;
              const ring = ringFor(i);
              const start = (i / SECTORS.length) * 360 - 90;
              const radius = [44, 40, 36][ring];
              const duration = [96, 122, 148][ring];
              return (
                <div
                  key={node.slug}
                  className={`eco-orbit-lane energy-${ring + 1}`}
                  style={{
                    "--orbit-start": `${start}deg`,
                    "--orbit-radius": `${radius}%`,
                    "--orbit-duration": `${duration}s`,
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
                        <div className="eco-node-disc relative flex h-[clamp(3rem,9vw,5.25rem)] w-[clamp(3rem,9vw,5.25rem)] items-center justify-center rounded-full text-center text-[clamp(0.55rem,1.35vw,0.78rem)] font-light leading-tight tracking-[0.04em] text-ivory/90">
                          <div className="eco-node-glass absolute inset-0 rounded-full" />
                          <div className="eco-node-ring absolute inset-0 rounded-full" />
                          <div className="eco-node-sheen absolute inset-0 rounded-full" />
                          {isActive && <span className="eco-ping" aria-hidden />}
                          <span className="relative px-1">{node.name}</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SOLENA core */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
            <div className="eco-core-glass absolute inset-0 rounded-full" />
            <div
              className="absolute inset-0 rounded-full border border-ivory/12"
              style={{
                boxShadow:
                  "0 0 80px rgba(184,134,73,0.28), inset 0 0 50px rgba(0,0,0,0.65)",
              }}
            />
            <span className="relative font-signature text-base tracking-[0.22em] text-ivory sm:text-xl lg:text-2xl">
              SOLENA
            </span>
          </div>
        </div>
      </div>

      {/* Active sector caption */}
      <div className="mx-auto mt-14 max-w-xl text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.4em] text-stone/70">
          Active sector ·{" "}
          <span
            data-eco-active
            className="font-signature text-sm italic tracking-normal text-bronze-glow"
          >
            {sector.name}
          </span>
        </p>
        <p className="mt-3 font-display text-lg font-light leading-snug text-ivory/85">
          {sector.tagline}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Link
            to="/sectors/$sector"
            params={{ sector: sector.slug }}
            className="bronze-line inline-flex items-center gap-3 border-b border-stone/30 pb-2 text-xs uppercase tracking-[0.4em] text-ivory hover:text-bronze-glow"
          >
            <span>Open {sector.name}</span>
            <span aria-hidden className="text-bronze">→</span>
          </Link>
          <p className="text-[0.55rem] uppercase tracking-[0.4em] text-stone/55">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(SECTORS.length).padStart(2, "0")}
          </p>
        </div>
      </div>
    </section>
  );
}
