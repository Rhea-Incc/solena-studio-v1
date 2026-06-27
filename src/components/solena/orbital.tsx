import { useEffect, useRef, useState } from "react";
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
 * Dense concentric ring stack — "almost solid" telescope/micrometer texture.
 */
export function OrbitRings({
  half = false,
  anchor = "right",
}: {
  half?: boolean;
  anchor?: "right" | "bottom" | "none";
}) {
  const rings = Array.from({ length: 28 }, (_, i) => i);
  const cx = half && anchor === "right" ? 100 : 50;
  const cy = half && anchor === "bottom" ? 100 : 50;
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
          <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={49} fill="url(#orbWash)" />
      <circle cx={cx} cy={cy} r={26} fill="url(#orbCore)" />
      {rings.map((i) => {
        const r = 50 - i * 1.75;
        if (r <= 4) return null;
        const heavy = i % 4 === 0;
        const op = 0.05 + (1 - i / rings.length) * 0.18;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="rgba(232,224,210,1)"
            strokeOpacity={heavy ? op + 0.06 : op}
            strokeWidth={heavy ? 0.18 : 0.08}
          />
        );
      })}
    </svg>
  );
}

/**
 * Radial micrometer arc — sits to the left of the orbit, semi-circle
 * opening toward Solena. Drag the indicator along the arc to scroll
 * through sectors; ticks render as a dense screw-gauge band.
 */
function RadialGearDial({
  steps,
  index,
  onChange,
  className = "",
}: {
  steps: number;
  index: number;
  onChange: (next: number) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // Arc spans 220° on the LEFT side, opening toward the right (the orbit).
  // We map index 0..steps-1 onto angles topAngle..bottomAngle measured
  // clockwise from 12 o'clock. Left side = 180°..360° in standard math.
  // We use angle in *degrees from north*, going counter-clockwise (CCW
  // toward the left). So index 0 -> -110°, index last -> +110°.
  const arcDeg = 220;
  const half = arcDeg / 2;
  const angleForIndex = (i: number) =>
    -half + (i / (steps - 1)) * arcDeg;

  const indexForPointer = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return index;
    const rect = el.getBoundingClientRect();
    // Center of the arc is anchored at the RIGHT edge of the dial,
    // vertically centered.
    const cx = rect.right;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    // angle from north (12 o'clock), positive = right (CW), negative = left
    // We want negative on the left side. atan2(dx, -dy) gives that.
    let a = (Math.atan2(dx, -dy) * 180) / Math.PI; // -180..180
    // We expect a to be on the left half: roughly -180..-arcDeg/2 ∪ arcDeg/2..180
    // Normalize to the CCW-left convention used by angleForIndex: -180..+180
    // Mirror: on the left, dx<0, so a < 0. Map a from [-180,-half] U [half,180]
    // into a continuous [-half..+half] by flipping sign appropriately.
    if (a > 0) a = a - 180;
    else a = a + 180;
    // Now a is roughly in [-180, 180] again but mirrored around the left
    // axis. Clamp:
    a = Math.max(-half, Math.min(half, a));
    const t = (a + half) / arcDeg;
    return Math.round(t * (steps - 1));
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 4) return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? 1 : -1;
      onChange((index + dir + steps) % steps);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [index, steps, onChange]);

  // Render 80 ticks across the arc as a dense band
  const tickCount = 81;
  const ticks = Array.from({ length: tickCount }, (_, i) => {
    const t = i / (tickCount - 1);
    const ang = -half + t * arcDeg;
    const major = i % 5 === 0;
    const sectorTick = Math.round(t * (steps - 1)) !== Math.round(((i - 1) / (tickCount - 1)) * (steps - 1));
    return { ang, major, sectorTick };
  });

  const currentAng = angleForIndex(index);

  const polarToXY = (rPct: number, angDeg: number) => {
    const rad = (angDeg * Math.PI) / 180;
    // center at right-middle: (100, 50) in viewBox 0..100 x 0..100
    return {
      x: 100 + Math.sin(rad) * rPct,
      y: 50 - Math.cos(rad) * rPct,
    };
  };

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Adjust orbit sector"
      aria-valuemin={0}
      aria-valuemax={steps - 1}
      aria-valuenow={index}
      tabIndex={0}
      className={`relative h-full w-full select-none touch-none ${className}`}
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        const next = indexForPointer(e.clientX, e.clientY);
        if (next !== index) onChange(next);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        const next = indexForPointer(e.clientX, e.clientY);
        if (next !== index) onChange(next);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp" || e.key === "ArrowLeft")
          onChange((index - 1 + steps) % steps);
        if (e.key === "ArrowDown" || e.key === "ArrowRight")
          onChange((index + 1) % steps);
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full overflow-visible"
        aria-hidden
      >
        {/* outer + inner arc rails */}
        {[78, 84, 90].map((r, i) => {
          const a0 = polarToXY(r, -half);
          const a1 = polarToXY(r, half);
          // large-arc-flag=1 because arcDeg > 180
          return (
            <path
              key={r}
              d={`M ${a0.x} ${a0.y} A ${r} ${r} 0 1 0 ${a1.x} ${a1.y}`}
              fill="none"
              stroke="rgba(232,224,210,1)"
              strokeOpacity={0.08 + i * 0.04}
              strokeWidth={i === 2 ? 0.25 : 0.12}
            />
          );
        })}

        {/* Ticks */}
        {ticks.map((t, i) => {
          const inner = t.sectorTick ? 76 : t.major ? 80 : 82;
          const outer = t.sectorTick ? 90 : t.major ? 88 : 86;
          const p0 = polarToXY(inner, t.ang);
          const p1 = polarToXY(outer, t.ang);
          return (
            <line
              key={i}
              x1={p0.x}
              y1={p0.y}
              x2={p1.x}
              y2={p1.y}
              stroke="rgba(232,224,210,1)"
              strokeOpacity={t.sectorTick ? 0.85 : t.major ? 0.45 : 0.2}
              strokeWidth={t.sectorTick ? 0.35 : t.major ? 0.18 : 0.1}
              strokeLinecap="round"
            />
          );
        })}

        {/* Current-position needle */}
        {(() => {
          const a = currentAng;
          const p0 = polarToXY(70, a);
          const p1 = polarToXY(94, a);
          return (
            <>
              <line
                x1={p0.x}
                y1={p0.y}
                x2={p1.x}
                y2={p1.y}
                stroke="rgb(212,168,116)"
                strokeWidth={0.7}
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0 0 1.6px rgba(212,168,116,0.9))",
                  transition: "all 600ms cubic-bezier(0.16,1,0.3,1)",
                }}
              />
              <circle
                cx={polarToXY(82, a).x}
                cy={polarToXY(82, a).y}
                r={1.8}
                fill="rgb(232,224,210)"
                style={{
                  filter: "drop-shadow(0 0 3px rgba(212,168,116,0.85))",
                  transition: "all 600ms cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            </>
          );
        })()}
      </svg>
    </div>
  );
}

/**
 * Full orbital ecosystem block. Mobile: orbit on top (full width), copy
 * below, gear dial radial on the left. Desktop: split with orbit + radial
 * gear on the right column. Sector selection is mirrored to the URL hash
 * (e.g. #culture) so the page can be deep-linked at a given telescope
 * position.
 */
export function OrbitalEcosystem({ id = "ecosystem" }: { id?: string }) {
  // Initial index from URL hash, if any.
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

  // Sync index -> URL hash, replace (don't push history).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const next = `#${SECTORS[index].slug}`;
    if (window.location.hash !== next) {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
    }
  }, [index]);

  // Respond to back/forward changing the hash.
  useEffect(() => {
    const onHash = () => {
      const slug = window.location.hash.replace(/^#/, "");
      const i = SECTORS.findIndex((s) => s.slug === slug);
      if (i >= 0 && i !== index) setIndex(i);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [index]);

  const stepDeg = 360 / SECTORS.length;
  const rotation = -index * stepDeg;

  const coords = SECTORS.map((_, i) => {
    const a = (i / SECTORS.length) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(a) * 42, y: 50 + Math.sin(a) * 42 };
  });

  return (
    <section
      data-zone={id}
      data-section={id}
      data-section-label="Ecosystem"
      className="section-ecosystem relative px-4 py-28 sm:px-6 md:px-10 md:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        {/* COPY */}
        <div className="order-2 lg:order-1">
          <p className="eyebrow mb-8">III — The Ecosystem</p>
          <p className="font-display text-2xl font-light leading-[1.2] text-ivory sm:text-3xl lg:text-4xl">
            Solena sits at the center of converging sectors — brand, built
            environment, culture, capital, and narrative architecture moving as
            a single field.
          </p>
          <p className="mt-8 text-[0.65rem] uppercase tracking-[0.35em] text-stone/70 lg:text-xs">
            Active sector ·{" "}
            <span
              data-eco-active
              className="font-signature text-sm italic tracking-normal text-bronze-glow"
            >
              {sector.name}
            </span>
          </p>
          <p className="mt-3 max-w-md font-display text-lg font-light leading-snug text-ivory/85">
            {sector.tagline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
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
              {String(SECTORS.length).padStart(2, "0")} · Drag · Scroll · ←/→
            </p>
          </div>
        </div>

        {/* ORBIT + RADIAL GEAR */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[min(96vw,42rem)]">
            <div className="relative aspect-square">
              {/* Radial gear dial — anchored to LEFT of orbit, arcing around it */}
              <div className="pointer-events-auto absolute -left-[12%] top-1/2 z-20 h-[118%] w-[60%] -translate-y-1/2">
                <RadialGearDial
                  steps={SECTORS.length}
                  index={index}
                  onChange={setIndex}
                />
              </div>

              {/* Orbit stage */}
              <div
                className="ecosystem-stage absolute inset-0"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: "transform 900ms cubic-bezier(0.16,1,0.3,1)",
                  transformOrigin: "center center",
                }}
              >
                <OrbitRings />
                {SECTORS.map((node, i) => {
                  const { x, y } = coords[i];
                  const isActive = i === index;
                  return (
                    <Link
                      key={node.slug}
                      to="/sectors/$sector"
                      params={{ sector: node.slug }}
                      onPointerEnter={() => setIndex(i)}
                      onFocus={() => setIndex(i)}
                      className={`eco-node absolute -translate-x-1/2 -translate-y-1/2 ${isActive ? "is-active" : ""}`}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      aria-label={`Open ${node.name}`}
                    >
                      <div
                        className="eco-node-disc relative flex h-[clamp(3rem,9vw,5.25rem)] w-[clamp(3rem,9vw,5.25rem)] items-center justify-center rounded-full text-center text-[clamp(0.55rem,1.5vw,0.78rem)] font-light leading-tight tracking-[0.04em] text-ivory/85"
                        style={{ transform: `rotate(${-rotation}deg)` }}
                      >
                        <div className="absolute inset-0 rounded-full bg-ivory/[0.035] backdrop-blur-xl" />
                        <div className="absolute inset-0 rounded-full border border-ivory/12" />
                        <span className="relative px-1">{node.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* SOLENA core */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-[28%] w-[28%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full">
                <div className="absolute inset-0 rounded-full bg-obsidian/75 backdrop-blur-2xl" />
                <div
                  className="absolute inset-0 rounded-full border border-ivory/10"
                  style={{
                    boxShadow:
                      "0 0 60px rgba(184,134,73,0.20), inset 0 0 40px rgba(0,0,0,0.6)",
                  }}
                />
                <span className="relative font-signature text-base tracking-[0.22em] text-ivory sm:text-xl lg:text-2xl">
                  SOLENA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
