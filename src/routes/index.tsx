import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import logoAsset from "@/assets/solena-logo.png.asset.json";
import wordmarkAsset from "@/assets/solena-wordmark.png.asset.json";
import heroHaloLandscape from "@/assets/hero-halo-landscape.png.asset.json";
import heroHaloPortrait from "@/assets/hero-halo-portrait.png.asset.json";
import gravityLandscape from "@/assets/gravity-landscape.png.asset.json";
import gravityPortrait from "@/assets/gravity-portrait.png.asset.json";
import vieLandscape from "@/assets/vie-halo-landscape.png.asset.json";
import viePortrait from "@/assets/vie-halo-portrait.png.asset.json";
import heroVideoLandscape from "@/assets/hero-video-landscape.mp4.asset.json";
import heroVideoPortrait from "@/assets/hero-video-portrait.mp4.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SOLENA — We build gravity for culture, capital, and legacy." },
      {
        name: "description",
        content:
          "Solena is a civilizational luxury growth studio. We engineer brands into institutions across culture, space, media and ventures.",
      },
      { property: "og:title", content: "SOLENA — We build gravity." },
      {
        property: "og:description",
        content:
          "Most organizations compete for attention. Solena builds gravity.",
      },
      { property: "og:image", content: heroHaloLandscape.url },
      { name: "twitter:image", content: heroHaloLandscape.url },
    ],
  }),
  component: SolenaSite,
});

/* -----------------------------------------------------------------------
 * Environment Canvas
 *
 * Images are not inserted into sections — they ARE the page. This is a
 * single fixed substrate that lives beneath all content. Each "stratum"
 * is a single image at a different depth, scale and position. Sections
 * register themselves as scroll-zones that fade specific strata in/out
 * and shift them through parallax, producing a continuous terrain
 * rather than discrete blocks of media.
 * -------------------------------------------------------------------- */
const STRATA = [
  {
    id: "hero",
    img: heroHaloLandscape.url,
    imgPortrait: heroHaloPortrait.url,
    scale: 1.4,
    blend: "screen" as const,
    baseOpacity: 0.42,
    depth: 0.15, // deep relic layer
    origin: "50% 45%",
  },
  {
    id: "manifesto",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 1.7,
    blend: "soft-light" as const,
    baseOpacity: 0.22,
    depth: 0.25,
    origin: "12% 50%",
  },
  {
    id: "fragments",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait.url,
    scale: 1.3,
    blend: "overlay" as const,
    baseOpacity: 0.18,
    depth: 0.35,
    origin: "75% 30%",
  },
  {
    id: "ecosystem",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait.url,
    scale: 1.6,
    blend: "screen" as const,
    baseOpacity: 0.32,
    depth: 0.2,
    origin: "50% 50%",
  },
  {
    id: "standard",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 2.0,
    blend: "soft-light" as const,
    baseOpacity: 0.1,
    depth: 0.18,
    origin: "50% 50%",
  },
  {
    id: "transformations",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait.url,
    scale: 1.5,
    blend: "overlay" as const,
    baseOpacity: 0.28,
    depth: 0.4,
    origin: "30% 60%",
  },
  {
    id: "future",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 1.8,
    blend: "screen" as const,
    baseOpacity: 0.5,
    depth: 0.22,
    origin: "50% 65%",
  },
  {
    id: "invitation",
    img: heroHaloLandscape.url,
    imgPortrait: heroHaloPortrait.url,
    scale: 2.2,
    blend: "soft-light" as const,
    baseOpacity: 0.08,
    depth: 0.12,
    origin: "50% 50%",
  },
];

function EnvironmentCanvas() {
  return (
    <div className="env-canvas pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base — living darkness */}
      <div className="env-base absolute inset-0" />

      {/* Image strata */}
      {STRATA.map((s) => (
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
                filter: "blur(0px)",
              }}
              data-depth={s.depth}
            />
          </picture>
        </div>
      ))}

      {/* Hero atmospheric video — bleeds into base, never framed */}
      <video
        className="env-video pointer-events-none absolute inset-0 h-full w-full object-cover hidden md:block"
        autoPlay
        muted
        loop
        playsInline
        poster={heroHaloLandscape.url}
        style={{ mixBlendMode: "screen", opacity: 0 }}
        data-video="hero"
      >
        <source src={heroVideoLandscape.url} type="video/mp4" />
      </video>
      <video
        className="env-video pointer-events-none absolute inset-0 h-full w-full object-cover md:hidden"
        autoPlay
        muted
        loop
        playsInline
        poster={heroHaloPortrait.url}
        style={{ mixBlendMode: "screen", opacity: 0 }}
        data-video="hero"
      >
        <source src={heroVideoPortrait.url} type="video/mp4" />
      </video>

      {/* Darkness veils — layered selective revelation */}
      <div className="env-veil-deep absolute inset-0" />
      <div className="env-veil-mid absolute inset-0" />
      <div className="env-veil-foreground absolute inset-0" />

      {/* Atmospheric glass + grain */}
      <div className="env-glass absolute inset-0" />
      <div className="grain absolute inset-0" />
    </div>
  );
}

function SolenaSite() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Excavation line reveals
      gsap.utils.toArray<HTMLElement>(".excavate").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => el.classList.add("is-in"),
        });
      });

      // Thesis per-line reveals (slow, lingering)
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

      /* ----- Environment scroll binding -----
       * Each stratum fades in across its zone(s) and parallaxes at its own
       * depth speed. Images reveal slightly before text and linger after.
       */
      const strata = gsap.utils.toArray<HTMLElement>(".env-stratum");
      strata.forEach((stratum) => {
        const id = stratum.dataset.stratum!;
        const zones = gsap.utils.toArray<HTMLElement>(
          `[data-zone="${id}"]`,
        );
        if (!zones.length) return;

        const target = STRATA.find((s) => s.id === id)!;

        zones.forEach((zone) => {
          // Opacity bloom: reveal early, linger late
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

          // Parallax drift — image moves slower than content
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

      // Hero atmospheric video — only alive in hero zone
      const heroVids = gsap.utils.toArray<HTMLElement>('[data-video="hero"]');
      heroVids.forEach((v) => {
        gsap.fromTo(
          v,
          { opacity: 0 },
          {
            opacity: 0.22,
            scrollTrigger: {
              trigger: '[data-zone="hero"]',
              start: "top bottom",
              end: "top 50%",
              scrub: true,
            },
          },
        );
        gsap.to(v, {
          opacity: 0,
          scrollTrigger: {
            trigger: '[data-zone="hero"]',
            start: "bottom 80%",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Darkness veils breathe with scroll
      gsap.to(".env-veil-mid", {
        opacity: 0.18,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Ecosystem orbit pulse on pin + active node cycling
      const ecoNodes = gsap.utils.toArray<HTMLElement>("[data-eco-node]");
      const activeLabel = document.querySelector<HTMLElement>(
        "[data-eco-active]",
      );
      ScrollTrigger.create({
        trigger: ".section-ecosystem",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(".ecosystem-stage", {
            scale: 1 + p * 0.12,
            rotation: p * 14,
          });
          if (ecoNodes.length) {
            const idx = Math.min(
              ecoNodes.length - 1,
              Math.floor(p * ecoNodes.length),
            );
            ecoNodes.forEach((n, i) => {
              n.classList.toggle("is-active", i === idx);
            });
            if (activeLabel) {
              activeLabel.textContent =
                ecoNodes[idx].getAttribute("data-eco-node") || "";
            }
          }
        },
      });

      // Section tracker — highlight active section in right rail
      const trackerSections =
        gsap.utils.toArray<HTMLElement>("[data-section]");
      trackerSections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) {
              const id = sec.getAttribute("data-section");
              document
                .querySelectorAll<HTMLElement>("[data-tracker-item]")
                .forEach((el) => {
                  el.classList.toggle(
                    "is-active",
                    el.getAttribute("data-tracker-item") === id,
                  );
                });
            }
          },
        });
      });

      // Wordmark dust dissolve
      gsap.to(".hero-wordmark", {
        letterSpacing: "0.6em",
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: {
          trigger: '[data-zone="hero"]',
          start: "20% top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative overflow-x-clip text-ivory">
      <EnvironmentCanvas />
      <NavBar />
      <ScrollTracker />

      {/* All content sits above the environment. No section frames an image. */}
      <main className="relative z-10">
        {/* ---------- HERO ---------- */}
        <section
          data-zone="hero"
          data-section="hero"
          className="relative flex flex-col items-center justify-center px-6 text-center"
          style={{ minHeight: "120vh" }}
        >
          <p className="eyebrow mb-8 opacity-80">
            Civilizational Luxury · Est. Quiet
          </p>

          <h1 className="hero-wordmark font-display text-[16vw] leading-[0.9] tracking-[-0.04em] sm:text-[12vw] md:text-[10vw] lg:text-[9rem]">
            SOLENA
          </h1>

          <p className="excavate mt-10 max-w-2xl font-display text-xl font-light italic text-stone sm:text-2xl md:text-3xl">
            <span>We build gravity for culture, capital, and legacy.</span>
          </p>

          <p className="font-signature mt-6 text-base text-stone/80 sm:text-lg">
            Luxury is not created. It is engineered.
          </p>

          <a
            href="#thesis"
            className="bronze-line mt-16 inline-flex items-center gap-3 border-b border-stone/30 pb-2 text-sm uppercase tracking-[0.4em] text-ivory/90 transition-colors hover:text-bronze-glow"
          >
            <span>Enter the Ecosystem</span>
            <span aria-hidden className="text-bronze">
              ↓
            </span>
          </a>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.5em] text-stone/50">
            Scroll · Excavate
          </div>
        </section>

        {/* ---------- THESIS / MANIFESTO ---------- */}
        <section
          id="thesis"
          data-zone="manifesto"
          data-section="thesis"
          className="relative px-6 py-[18rem] md:px-12"
        >
          <div className="relative mx-auto max-w-5xl">
            <p className="eyebrow mb-20">I — The Solena Thesis</p>

            <div className="space-y-10 font-display text-4xl font-light leading-[1.15] tracking-tight text-ivory sm:text-5xl md:text-6xl lg:text-7xl">
              <p className="overflow-hidden">
                <span className="thesis-line block">
                  Most organizations compete for attention.
                </span>
              </p>
              <p className="overflow-hidden">
                <span className="thesis-line block text-bronze-glow">
                  Solena builds gravity.
                </span>
              </p>
              <p className="overflow-hidden">
                <span className="thesis-line block text-stone">
                  Gravity does not advertise.
                </span>
              </p>
              <p className="overflow-hidden">
                <span className="thesis-line font-signature block italic">
                  It attracts.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ---------- WHAT WE BUILD ---------- */}
        <section
          data-zone="fragments"
          data-section="disciplines"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-24 flex items-end justify-between">
              <p className="eyebrow">II — What We Build</p>
              <p className="hidden max-w-sm text-sm leading-relaxed text-stone/80 md:block">
                Four disciplines, one orbit. Each a vector for engineered
                gravity.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Culture",
                  body: "Narrative architecture, ritual, and reference. We design the language a generation borrows from.",
                },
                {
                  title: "Space",
                  body: "Hospitality, residence and retail as destination. Architecture that becomes pilgrimage.",
                },
                {
                  title: "Media",
                  body: "Publications, films, signal. Owned channels engineered to outlast their subject.",
                },
                {
                  title: "Ventures",
                  body: "Capital deployed where culture compounds. Equity in the institutions of the next century.",
                },
              ].map((c, i) => (
                <article
                  key={c.title}
                  className="glass group relative flex h-[26rem] flex-col justify-between overflow-hidden p-8 transition-transform duration-700 ease-out hover:-translate-y-1"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bronze/20 opacity-40 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />
                  <span className="font-signature text-xs italic text-stone/60">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-4xl font-light text-ivory">
                      {c.title}
                    </h3>
                    <p className="mt-6 max-w-xs text-sm leading-relaxed text-stone/80">
                      {c.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- ECOSYSTEM ---------- */}
        <Ecosystem />

        {/* ---------- STANDARD ---------- */}
        <section
          data-zone="standard"
          data-section="standard"
          className="relative px-6 py-[18rem] md:px-12"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow mb-24">IV — The Standard</p>
            <p className="excavate font-display text-5xl font-extralight leading-tight tracking-tight text-ivory sm:text-6xl md:text-7xl">
              <span>
                We do not chase
                <br />
                the market.
              </span>
            </p>
            <p className="excavate mt-16 font-signature text-3xl italic text-bronze-glow sm:text-4xl">
              <span>We outlast it.</span>
            </p>
          </div>
        </section>

        {/* ---------- TRANSFORMATIONS ---------- *
         * No framed thumbnails. The environment provides the imagery; the
         * text floats above it as editorial overlays.
         */}
        <section
          data-zone="transformations"
          data-section="transformations"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-20">V — Transformations</p>

            <div className="space-y-48">
              {[
                {
                  from: "Brand",
                  to: "Monument",
                  body: "Identity engineered with the weight of architecture. A logo becomes a landmark.",
                  align: "md:ml-0 md:mr-auto",
                },
                {
                  from: "Space",
                  to: "Destination",
                  body: "Hospitality designed not for visit, but for return. Place as gravitational object.",
                  align: "md:ml-auto md:mr-0",
                },
                {
                  from: "Concept",
                  to: "Signal",
                  body: "Ideas refined until they cease to argue. Until the market simply turns toward them.",
                  align: "md:ml-0 md:mr-auto",
                },
              ].map((t) => (
                <article
                  key={t.from}
                  className={`max-w-xl ${t.align}`}
                >
                  <div className="font-display text-6xl font-extralight leading-none md:text-7xl">
                    <span className="text-stone/60">{t.from}</span>
                    <br />
                    <span className="font-signature italic text-bronze-glow">
                      → {t.to}
                    </span>
                  </div>
                  <p className="mt-8 max-w-md text-sm leading-relaxed text-stone/80">
                    {t.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- JOURNAL ---------- */}
        <section data-section="journal" className="relative px-6 py-40 md:px-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 flex items-end justify-between">
              <p className="eyebrow">VI — The Journal</p>
              <span className="text-xs uppercase tracking-[0.3em] text-stone/60">
                Selected Dispatches
              </span>
            </div>

            <div className="grid gap-[1px] bg-ivory/5 md:grid-cols-3">
              {[
                {
                  no: "Field Note 01",
                  title: "On the Architecture of Patience",
                  meta: "Essay · 12 min",
                },
                {
                  no: "Field Note 02",
                  title: "Why Markets Misprice Silence",
                  meta: "Thesis · 8 min",
                },
                {
                  no: "Field Note 03",
                  title: "Engineering the Heirloom Brand",
                  meta: "Case · 18 min",
                },
              ].map((j) => (
                <a
                  key={j.no}
                  href="#"
                  className="group relative block bg-obsidian/60 p-10 backdrop-blur-md transition-colors duration-500 hover:bg-ivory/[0.02]"
                >
                  <p className="font-signature text-xs italic text-bronze-glow">
                    {j.no}
                  </p>
                  <h3 className="mt-8 font-display text-2xl font-light leading-snug text-ivory md:text-3xl">
                    {j.title}
                  </h3>
                  <p className="mt-10 text-xs uppercase tracking-[0.3em] text-stone/60">
                    {j.meta} · <span className="bronze-line">Read</span>
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- FUTURE ---------- */}
        <section data-zone="future" className="relative h-[130vh]">
          <div className="sticky top-0 flex h-screen w-full items-center justify-center">
            <div className="relative z-10 px-6 text-center">
              <p className="eyebrow mb-12">VII — The Future</p>
              <h2 className="excavate font-display text-5xl font-extralight leading-[0.95] tracking-tight text-ivory sm:text-7xl md:text-[8rem]">
                <span>
                  An institution
                  <br />
                  before
                  <br />
                  a company.
                </span>
              </h2>
            </div>
          </div>
        </section>

        {/* ---------- INVITATION ---------- */}
        <section
          data-zone="invitation"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="eyebrow mb-16">VIII — Invitation</p>

            <p className="font-display text-3xl font-light leading-snug text-ivory sm:text-4xl md:text-5xl">
              We work with the rare few <br />
              <span className="font-signature italic text-bronze-glow">
                building for the century.
              </span>
            </p>

            <p className="mt-10 max-w-md text-sm leading-relaxed text-stone/70">
              Solena partners with founders, families and institutions whose
              ambitions extend beyond their lifetime.
            </p>

            <a
              href="mailto:studio@solena.co"
              className="bronze-line mt-20 inline-flex items-center gap-4 border-b border-stone/30 pb-2 text-sm uppercase tracking-[0.45em] text-ivory transition-colors duration-700 hover:text-bronze-glow"
            >
              <span>Begin a Conversation</span>
              <span aria-hidden className="text-bronze">
                →
              </span>
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

function NavBar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-6 py-6 md:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="#" className="flex items-center gap-3">
          <img src={logoAsset.url} alt="Solena" className="h-8 w-8" />
          <span className="hidden font-display text-sm tracking-[0.45em] text-ivory sm:inline">
            SOLENA
          </span>
        </a>
        <nav className="hidden gap-10 text-xs uppercase tracking-[0.35em] text-stone/80 md:flex">
          <a href="#thesis" className="bronze-line">
            Thesis
          </a>
          <a href="#" className="bronze-line">
            Ecosystem
          </a>
          <a href="#" className="bronze-line">
            Journal
          </a>
          <a href="mailto:studio@solena.co" className="bronze-line text-ivory">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-ivory/5 px-6 py-16 md:px-12">
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
          <a href="#" className="bronze-line">
            Studio
          </a>
          <a href="#" className="bronze-line">
            Ventures
          </a>
          <a href="#" className="bronze-line">
            Journal
          </a>
          <a href="#" className="bronze-line">
            Contact
          </a>
        </div>
        <p className="font-signature text-xs italic text-stone/50">
          © {new Date().getFullYear()} Solena. Engineered, not advertised.
        </p>
      </div>
    </footer>
  );
}
