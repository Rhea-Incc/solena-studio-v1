import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollTracker } from "@/components/solena/tracker";


export type Stratum = {
  id: string;
  img: string;
  imgPortrait: string;
  scale: number;
  blend:
    | "screen"
    | "soft-light"
    | "overlay"
    | "multiply"
    | "lighten"
    | "normal";
  baseOpacity: number;
  depth: number;
  origin: string;
};

export type EnvVideo = {
  id: string;
  src: string;
  srcPortrait?: string;
  zone: string;
  blend?: "screen" | "soft-light" | "overlay" | "normal";
  peakOpacity?: number;
};

export function EnvironmentCanvas({
  strata,
  videos = [],
}: {
  strata: Stratum[];
  videos?: EnvVideo[];
}) {
  return (
    <div className="env-canvas pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="env-base absolute inset-0" />

      {strata.map((s) => (
        <div
          key={s.id}
          data-stratum={s.id}
          className="env-stratum absolute inset-0"
          style={{ opacity: 0 }}
        >
          <picture>
            <source media="(orientation: portrait)" srcSet={s.imgPortrait} />
            <img
              src={s.img}
              alt=""
              aria-hidden
              className="absolute inset-0 h-[140%] w-[140%] -translate-x-[14%] -translate-y-[14%] object-cover"
              style={{
                transform: `scale(${s.scale})`,
                transformOrigin: s.origin,
                mixBlendMode: s.blend,
              }}
              data-depth={s.depth}
            />
          </picture>
        </div>
      ))}

      {videos.map((v) => (
        <video
          key={v.id}
          className="env-video pointer-events-none absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          // @ts-expect-error - non-standard iOS attribute for inline muted autoplay
          webkit-playsinline="true"
          disablePictureInPicture
          ref={(el) => {
            if (!el) return;
            el.muted = true;
            const tryPlay = () => el.play().catch(() => void 0);
            tryPlay();
            // Retry once metadata is available (Safari / low-end mobile)
            el.addEventListener("loadeddata", tryPlay, { once: true });
          }}
          style={{
            mixBlendMode: v.blend ?? "screen",
            opacity: 0,
          }}
          data-env-video={v.id}
          data-zone-video={v.zone}
          data-peak={v.peakOpacity ?? 0.22}
        >
          <source src={v.src} type="video/mp4" />
          {v.srcPortrait ? (
            <source src={v.srcPortrait} type="video/mp4" />
          ) : null}
        </video>
      ))}


      <div className="env-veil-deep absolute inset-0" />
      <div className="env-veil-mid absolute inset-0" />
      <div className="env-veil-foreground absolute inset-0" />
      <div className="env-glass absolute inset-0" />
      <div className="grain absolute inset-0" />
    </div>
  );
}

/**
 * Wires GSAP-driven scroll bindings for the strata + videos in the page.
 * Use once per page that renders EnvironmentCanvas + scroll zones.
 */
export function SolenaPage({
  strata,
  children,
  className = "",
}: {
  strata: Stratum[];
  children: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".excavate").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => el.classList.add("is-in"),
        });
      });

      gsap.utils.toArray<HTMLElement>(".thesis-line").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.6,
            delay: i * 0.14,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          },
        );
      });

      const strataEls = gsap.utils.toArray<HTMLElement>(".env-stratum");
      strataEls.forEach((stratum) => {
        const id = stratum.dataset.stratum!;
        const zones = gsap.utils.toArray<HTMLElement>(
          `[data-zone="${id}"]`,
        );
        if (!zones.length) return;
        const target = strata.find((s) => s.id === id);
        if (!target) return;

        zones.forEach((zone) => {
          gsap.fromTo(
            stratum,
            { opacity: 0 },
            {
              opacity: target.baseOpacity,
              ease: "sine.inOut",
              scrollTrigger: {
                trigger: zone,
                start: "top 95%",
                end: "top 35%",
                scrub: true,
              },
            },
          );
          gsap.to(stratum, {
            opacity: 0,
            ease: "sine.inOut",
            scrollTrigger: {
              trigger: zone,
              start: "bottom 70%",
              end: "bottom -20%",
              scrub: true,
            },
          });

          const img = stratum.querySelector("img");
          if (img) {
            gsap.fromTo(
              img,
              { yPercent: 8 },
              {
                yPercent: -8 * (1 - target.depth),
                ease: "none",
                scrollTrigger: {
                  trigger: zone,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }
        });
      });

      // Environment videos bound to zones
      gsap.utils
        .toArray<HTMLElement>("[data-env-video]")
        .forEach((v) => {
          const zoneId = v.getAttribute("data-zone-video");
          const peak = parseFloat(v.getAttribute("data-peak") || "0.22");
          const trig = document.querySelector(`[data-zone="${zoneId}"]`);
          if (!trig) return;
          gsap.fromTo(
            v,
            { opacity: 0 },
            {
              opacity: peak,
              scrollTrigger: {
                trigger: trig,
                start: "top bottom",
                end: "top 50%",
                scrub: true,
              },
            },
          );
          gsap.to(v, {
            opacity: 0,
            scrollTrigger: {
              trigger: trig,
              start: "bottom 80%",
              end: "bottom top",
              scrub: true,
            },
          });
        });

      gsap.to(".env-veil-mid", {
        opacity: 0.18,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [strata]);

  return (
    <div
      ref={rootRef}
      className={`relative overflow-x-clip text-ivory ${className}`}
    >
      {children}
      <ScrollTracker />
    </div>
  );
}
