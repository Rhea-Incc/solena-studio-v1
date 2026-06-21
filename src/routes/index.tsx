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

      // Parallax depth layers for hero
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || "0.2");
        gsap.to(el, {
          yPercent: -speed * 60,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("[data-parallax-scope]") || el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // Hero halo slow scale + fade as you leave
      gsap.to(".hero-halo", {
        scale: 1.18,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: ".section-hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // Wordmark dust dissolve
      gsap.to(".hero-wordmark", {
        letterSpacing: "0.6em",
        opacity: 0,
        ease: "power2.in",
        scrollTrigger: {
          trigger: ".section-hero",
          start: "20% top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Section line reveals — thesis (per-line)
      gsap.utils
        .toArray<HTMLElement>(".thesis-line")
        .forEach((el, i) => {
          gsap.fromTo(
            el,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.4,
              delay: i * 0.12,
              ease: "expo.out",
              scrollTrigger: {
                trigger: el,
                start: "top 80%",
                once: true,
              },
            },
          );
        });

      // Ecosystem center scale on pin
      ScrollTrigger.create({
        trigger: ".section-ecosystem",
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(".ecosystem-stage", {
            scale: 1 + p * 0.25,
            rotation: p * 30,
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative bg-obsidian text-ivory">
      <NavBar />

      {/* ---------- HERO ---------- */}
      <section
        className="section-hero relative overflow-hidden"
        data-parallax-scope
        style={{ minHeight: "120vh" }}
      >
        <div className="absolute inset-0">
          <picture>
            <source media="(orientation: portrait)" srcSet={heroHaloPortrait.url} />
            <img
              src={heroHaloLandscape.url}
              alt=""
              className="hero-halo absolute inset-0 h-full w-full object-cover opacity-90 drift"
              data-parallax="0.15"
            />
          </picture>
          <video
            className="hero-halo pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-60 hidden md:block"
            autoPlay
            muted
            loop
            playsInline
            poster={heroHaloLandscape.url}
          >
            <source src={heroVideoLandscape.url} type="video/mp4" />
          </video>
          <video
            className="hero-halo pointer-events-none absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-60 md:hidden"
            autoPlay
            muted
            loop
            playsInline
            poster={heroHaloPortrait.url}
          >
            <source src={heroVideoPortrait.url} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/10 to-obsidian" />
          <div className="grain absolute inset-0" />
        </div>

        <div className="relative z-10 flex min-h-[120vh] flex-col items-center justify-center px-6 text-center">
          <p className="eyebrow mb-8 opacity-80">Civilizational Luxury · Est. Quiet</p>

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
            <span aria-hidden className="text-bronze">↓</span>
          </a>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.5em] text-stone/50">
          Scroll · Excavate
        </div>
      </section>

      {/* ---------- THESIS ---------- */}
      <section
        id="thesis"
        className="section-thesis relative overflow-hidden px-6 py-[18rem] md:px-12"
      >
        <div className="absolute left-1/2 top-1/2 -z-0 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 opacity-30 breathe">
          <img
            src={vieLandscape.url}
            alt=""
            className="h-full w-full object-contain mix-blend-screen"
          />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <p className="eyebrow mb-20">I — The Solena Thesis</p>

          <div className="space-y-10 font-display text-4xl font-light leading-[1.15] tracking-tight text-ivory sm:text-5xl md:text-6xl lg:text-7xl">
            <p className="overflow-hidden">
              <span className="thesis-line block">Most organizations compete for attention.</span>
            </p>
            <p className="overflow-hidden">
              <span className="thesis-line block text-bronze-glow">Solena builds gravity.</span>
            </p>
            <p className="overflow-hidden">
              <span className="thesis-line block text-stone">Gravity does not advertise.</span>
            </p>
            <p className="overflow-hidden">
              <span className="thesis-line font-signature block italic">It attracts.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---------- WHAT WE BUILD ---------- */}
      <section className="relative px-6 py-40 md:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-24 flex items-end justify-between">
            <p className="eyebrow">II — What We Build</p>
            <p className="hidden max-w-sm text-sm leading-relaxed text-stone/80 md:block">
              Four disciplines, one orbit. Each a vector for engineered gravity.
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
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-bronze/20 blur-3xl transition-opacity duration-700 group-hover:opacity-100 opacity-40" />
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
      <section className="section-ecosystem relative h-[160vh] overflow-hidden">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          <picture className="absolute inset-0">
            <source media="(orientation: portrait)" srcSet={gravityPortrait.url} />
            <img
              src={gravityLandscape.url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-screen"
            />
          </picture>
          <div className="absolute inset-0 bg-obsidian/60" />
          <div className="grain absolute inset-0" />

          <div className="ecosystem-stage relative aspect-square w-[min(90vw,42rem)]">
            <div className="orbit-ring orbit-slow" />
            <div className="orbit-ring orbit-mid scale-75" />
            <div className="orbit-ring orbit-fast scale-50" />

            {/* center */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="font-display text-3xl tracking-[0.3em] text-ivory">
                SOLENA
              </div>
              <div className="eyebrow mt-2">Core</div>
            </div>

            {/* orbiting nodes */}
            {[
              "Real Estate",
              "Hospitality",
              "Luxury",
              "Media",
              "Capital",
              "Culture",
            ].map((node, i, arr) => {
              const angle = (i / arr.length) * Math.PI * 2;
              const r = 46; // percentage
              const x = 50 + Math.cos(angle) * r;
              const y = 50 + Math.sin(angle) * r;
              return (
                <div
                  key={node}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  <div className="glass flex h-24 w-24 items-center justify-center rounded-full px-2 text-center text-[0.7rem] uppercase tracking-[0.18em] text-ivory/90 backdrop-blur-xl">
                    {node}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="eyebrow absolute bottom-12 left-1/2 -translate-x-1/2">
            III — The Ecosystem
          </p>
        </div>
      </section>

      {/* ---------- STANDARD ---------- */}
      <section className="relative bg-obsidian px-6 py-[18rem] md:px-12">
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

      {/* ---------- TRANSFORMATIONS ---------- */}
      <section className="relative px-6 py-40 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-20">V — Transformations</p>

          <div className="space-y-32">
            {[
              {
                from: "Brand",
                to: "Monument",
                body: "Identity engineered with the weight of architecture. A logo becomes a landmark.",
                img: vieLandscape.url,
              },
              {
                from: "Space",
                to: "Destination",
                body: "Hospitality designed not for visit, but for return. Place as gravitational object.",
                img: gravityLandscape.url,
              },
              {
                from: "Concept",
                to: "Signal",
                body: "Ideas refined until they cease to argue. Until the market simply turns toward them.",
                img: heroHaloLandscape.url,
              },
            ].map((t, i) => (
              <article
                key={t.from}
                className={`grid items-center gap-12 md:grid-cols-2 ${
                  i % 2 ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={t.img}
                    alt=""
                    className="h-full w-full object-cover opacity-90 mix-blend-screen"
                  />
                  <div className="grain absolute inset-0" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
                </div>
                <div>
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
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- JOURNAL ---------- */}
      <section className="relative px-6 py-40 md:px-12">
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
                className="group relative block bg-obsidian p-10 transition-colors duration-500 hover:bg-ivory/[0.02]"
              >
                <p className="font-signature text-xs italic text-bronze-glow">
                  {j.no}
                </p>
                <h3 className="mt-8 font-display text-2xl font-light leading-snug text-ivory md:text-3xl">
                  {j.title}
                </h3>
                <p className="mt-10 text-xs uppercase tracking-[0.3em] text-stone/60">
                  {j.meta} ·{" "}
                  <span className="bronze-line">Read</span>
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FUTURE ---------- */}
      <section className="relative h-[130vh] overflow-hidden">
        <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
          <picture>
            <source media="(orientation: portrait)" srcSet={viePortrait.url} />
            <img
              src={vieLandscape.url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-screen"
              data-parallax="0.3"
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian" />
          <div className="grain absolute inset-0" />

          <div className="relative z-10 px-6 text-center">
            <p className="eyebrow mb-12">VII — The Future</p>
            <h2 className="excavate font-display text-5xl font-extralight leading-[0.95] tracking-tight text-ivory sm:text-7xl md:text-[8rem]">
              <span>An institution<br />before<br />a company.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* ---------- INVITATION ---------- */}
      <section className="relative px-6 py-40 md:px-12">
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
            <span aria-hidden className="text-bronze">→</span>
          </a>
        </div>
      </section>

      <Footer />
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
          <a href="#thesis" className="bronze-line">Thesis</a>
          <a href="#" className="bronze-line">Ecosystem</a>
          <a href="#" className="bronze-line">Journal</a>
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
          <a href="#" className="bronze-line">Studio</a>
          <a href="#" className="bronze-line">Ventures</a>
          <a href="#" className="bronze-line">Journal</a>
          <a href="#" className="bronze-line">Contact</a>
        </div>
        <p className="font-signature text-xs italic text-stone/50">
          © {new Date().getFullYear()} Solena. Engineered, not advertised.
        </p>
      </div>
    </footer>
  );
}
