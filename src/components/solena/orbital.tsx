import { useEffect, useRef, useState } from "react";

export const ECO_NODES = [
  "Real Estate",
  "Technology",
  "Hospitality",
  "Luxury",
  "Media",
  "Ventures",
  "Culture",
  "Capital",
];

/**
 * Dense concentric ring stack — "almost solid" telescope/micrometer texture.
 * When half=true, the orbit is anchored to a chosen edge ("right" | "bottom").
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
 * Interactive micrometer gear — drag horizontally (or scroll-wheel) to
 * rotate the orbit and cycle the active sector. Emits rotation in degrees
 * via onChange. Renders the calibrated tick band typical of a screw gauge.
 */
export function GearDial({
  steps,
  index,
  onChange,
  className = "",
}: {
  steps: number;
  index: number;
  onChange: (nextIndex: number) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef<{
    startX: number;
    startIndex: number;
    width: number;
  } | null>(null);

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

  const start = (clientX: number) => {
    const el = ref.current;
    if (!el) return;
    dragging.current = {
      startX: clientX,
      startIndex: index,
      width: el.getBoundingClientRect().width,
    };
  };
  const move = (clientX: number) => {
    const d = dragging.current;
    if (!d) return;
    // ~1 step per 1/steps of the dial width
    const stepPx = d.width / steps;
    const delta = Math.round((clientX - d.startX) / stepPx);
    const next = ((d.startIndex - delta) % steps + steps) % steps;
    if (next !== index) onChange(next);
  };
  const end = () => {
    dragging.current = null;
  };

  // Render tick marks across the dial — calibrated screw-gauge band
  const ticks = Array.from({ length: 80 }, (_, i) => i);
  // rotation in deg for the moving band
  const offset = (index / steps) * 100; // percent shift

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Adjust orbit"
      aria-valuemin={0}
      aria-valuemax={steps - 1}
      aria-valuenow={index}
      tabIndex={0}
      className={`relative h-12 w-full select-none touch-none overflow-hidden rounded-sm border border-ivory/12 bg-obsidian/60 backdrop-blur-xl ${className}`}
      onPointerDown={(e) => {
        (e.target as Element).setPointerCapture?.(e.pointerId);
        start(e.clientX);
      }}
      onPointerMove={(e) => move(e.clientX)}
      onPointerUp={end}
      onPointerCancel={end}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft")
          onChange((index - 1 + steps) % steps);
        if (e.key === "ArrowRight") onChange((index + 1) % steps);
      }}
    >
      {/* Center indicator */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-10 h-full w-px -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(212,168,116,0.95) 30%, rgba(212,168,116,0.95) 70%, transparent 100%)",
          boxShadow: "0 0 12px rgba(212,168,116,0.55)",
        }}
      />
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-obsidian to-transparent" />

      {/* Moving tick band */}
      <div
        className="absolute inset-y-0 left-0 flex items-center"
        style={{
          width: "200%",
          transform: `translateX(${-offset - 50}%)`,
          transition: dragging.current
            ? "none"
            : "transform 600ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {ticks.concat(ticks).map((t, i) => {
          const major = t % 5 === 0;
          const sectorTick = t % 10 === 0;
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-center"
            >
              <span
                className="block w-px bg-ivory"
                style={{
                  height: sectorTick ? "70%" : major ? "45%" : "25%",
                  opacity: sectorTick ? 0.9 : major ? 0.5 : 0.25,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Label strip */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px z-20 flex justify-center">
        <span className="translate-y-full pt-2 font-signature text-[0.65rem] italic tracking-[0.18em] text-bronze-glow">
          {/* label rendered outside */}
        </span>
      </div>
    </div>
  );
}

/**
 * Full orbital ecosystem block. Mobile: orbit on top (full width), copy
 * below, gear dial below that. Desktop: split with orbit on the right.
 * Interactive — rotate the orbit, cycle active sector with the dial.
 */
export function OrbitalEcosystem({ id = "ecosystem" }: { id?: string }) {
  const [index, setIndex] = useState(0);
  const active = ECO_NODES[index];

  // Rotation applied to the orbit + nodes so that node[index] sits at the
  // 12 o'clock position. Step = 360 / nodes.
  const stepDeg = 360 / ECO_NODES.length;
  const rotation = -index * stepDeg;

  const coords = ECO_NODES.map((_, i) => {
    const a = (i / ECO_NODES.length) * Math.PI * 2 - Math.PI / 2;
    return { x: 50 + Math.cos(a) * 42, y: 50 + Math.sin(a) * 42 };
  });

  return (
    <section
      data-zone={id}
      data-section={id}
      className="section-ecosystem relative px-4 py-28 sm:px-6 md:px-10 md:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
        {/* MOBILE/TABLET: orbit FIRST (full vw), then copy, then gear */}
        {/* DESKTOP: copy on left */}
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
              {active}
            </span>
          </p>

          {/* Gear dial — all screens */}
          <div className="mt-10 max-w-md">
            <div className="mb-3 flex items-center justify-between text-[0.55rem] uppercase tracking-[0.4em] text-stone/55">
              <span>Adjust</span>
              <span>{String(index + 1).padStart(2, "0")} / {String(ECO_NODES.length).padStart(2, "0")}</span>
            </div>
            <GearDial
              steps={ECO_NODES.length}
              index={index}
              onChange={setIndex}
            />
            <p className="mt-3 text-[0.55rem] uppercase tracking-[0.35em] text-stone/45">
              Drag · Scroll · ←/→
            </p>
          </div>
        </div>

        {/* ORBIT — full width on mobile, right column on desktop */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto aspect-square w-full max-w-[min(92vw,38rem)]">
            <div
              className="ecosystem-stage absolute inset-0"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition:
                  "transform 900ms cubic-bezier(0.16,1,0.3,1)",
                transformOrigin: "center center",
              }}
            >
              <OrbitRings />
              {ECO_NODES.map((node, i) => {
                const { x, y } = coords[i];
                const isActive = i === index;
                return (
                  <button
                    key={node}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`eco-node absolute -translate-x-1/2 -translate-y-1/2 ${isActive ? "is-active" : ""}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <div
                      className="eco-node-disc relative flex h-[clamp(3rem,9vw,5.25rem)] w-[clamp(3rem,9vw,5.25rem)] items-center justify-center rounded-full text-center text-[clamp(0.55rem,1.5vw,0.78rem)] font-light leading-tight tracking-[0.04em] text-ivory/85"
                      style={{
                        // Counter-rotate so labels stay upright
                        transform: `rotate(${-rotation}deg)`,
                      }}
                    >
                      <div className="absolute inset-0 rounded-full bg-ivory/[0.035] backdrop-blur-xl" />
                      <div className="absolute inset-0 rounded-full border border-ivory/12" />
                      <span className="relative px-1">{node}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* SOLENA core — does NOT rotate */}
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
    </section>
  );
}
