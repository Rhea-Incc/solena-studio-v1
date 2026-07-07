import { createFileRoute, Link } from "@tanstack/react-router";

import heroHaloLandscape from "@/assets/hero-halo-landscape.png.asset.json";
import heroHaloPortrait from "@/assets/hero-halo-portrait.png.asset.json";
import gravityLandscape from "@/assets/gravity-landscape.png.asset.json";
import gravityPortrait from "@/assets/gravity-portrait.png.asset.json";
import vieLandscape from "@/assets/vie-halo-landscape.png.asset.json";
import viePortrait from "@/assets/vie-halo-portrait.png.asset.json";
import gravityPortrait2 from "@/assets/gravity-portrait-2.png.asset.json";
import heroVideoLandscape from "@/assets/hero-video-landscape.mp4.asset.json";
import heroVideoPortrait from "@/assets/hero-video-portrait.mp4.asset.json";
import seedVideo from "@/assets/seed-01-2.mp4.asset.json";
import gravityVideo from "@/assets/g-01-1.mp4.asset.json";
import solenaWordmark from "@/assets/solena-wordmark-002.png.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";
import { OrbitalEcosystem } from "@/components/solena/orbital";

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

const STRATA: Stratum[] = [
  {
    id: "hero",
    img: heroHaloLandscape.url,
    imgPortrait: heroHaloPortrait.url,
    scale: 1.4,
    blend: "screen",
    baseOpacity: 0.42,
    depth: 0.15,
    origin: "50% 45%",
  },
  {
    id: "manifesto",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 1.7,
    blend: "soft-light",
    baseOpacity: 0.22,
    depth: 0.25,
    origin: "12% 50%",
  },
  {
    id: "fragments",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait.url,
    scale: 1.3,
    blend: "overlay",
    baseOpacity: 0.18,
    depth: 0.35,
    origin: "75% 30%",
  },
  {
    id: "ecosystem",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait2.url,
    scale: 1.6,
    blend: "screen",
    baseOpacity: 0.32,
    depth: 0.2,
    origin: "50% 50%",
  },
  {
    id: "standard",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 2.0,
    blend: "soft-light",
    baseOpacity: 0.1,
    depth: 0.18,
    origin: "50% 50%",
  },
  {
    id: "transformations",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait.url,
    scale: 1.5,
    blend: "overlay",
    baseOpacity: 0.28,
    depth: 0.4,
    origin: "30% 60%",
  },
  {
    id: "future",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 1.8,
    blend: "screen",
    baseOpacity: 0.5,
    depth: 0.22,
    origin: "50% 65%",
  },
  {
    id: "invitation",
    img: heroHaloLandscape.url,
    imgPortrait: heroHaloPortrait.url,
    scale: 2.2,
    blend: "soft-light",
    baseOpacity: 0.08,
    depth: 0.12,
    origin: "50% 50%",
  },
];

function SolenaSite() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "hero",
            src: heroVideoLandscape.url,
            srcPortrait: heroVideoPortrait.url,
            zone: "hero",
            peakOpacity: 0.24,
          },
          {
            id: "ecosystem-flow",
            src: gravityVideo.url,
            zone: "ecosystem",
            peakOpacity: 0.2,
            blend: "screen",
          },
          {
            id: "future",
            src: seedVideo.url,
            zone: "future",
            peakOpacity: 0.28,
            blend: "screen",
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        {/* HERO */}
        <section
          data-zone="hero"
          data-section="hero"
          className="relative flex flex-col items-center justify-center px-6 text-center"
          style={{ minHeight: "120vh" }}
        >
          <p className="eyebrow mb-8 opacity-80">
            Civilizational Luxury · Est. Quiet
          </p>
          <h1 className="hero-wordmark relative w-full max-w-[min(92vw,1100px)] leading-none">
            <span className="sr-only">SOLENA</span>
            <img
              src={solenaWordmark.url}
              alt="SOLENA"
              className="mx-auto block h-auto w-full select-none"
              draggable={false}
            />
          </h1>
          <p className="excavate mt-10 max-w-2xl font-display text-xl font-light italic text-stone sm:text-2xl md:text-3xl">
            <span>We build gravity for culture, capital, and legacy.</span>
          </p>
          <p className="font-signature mt-6 text-base text-stone/80 sm:text-lg">
            Luxury is not created. It is engineered.
          </p>
          <Link
            to="/thesis"
            className="bronze-line mt-16 inline-flex items-center gap-3 border-b border-stone/30 pb-2 text-sm uppercase tracking-[0.4em] text-ivory/90 transition-colors hover:text-bronze-glow"
          >
            <span>Enter the Ecosystem</span>
            <span aria-hidden className="text-bronze">↓</span>
          </Link>
        </section>

        {/* THESIS PREVIEW */}
        <section
          data-zone="manifesto"
          data-section="thesis"
          className="relative px-6 py-[14rem] md:px-12"
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

        {/* DISCIPLINES */}
        <section
          data-zone="fragments"
          data-section="disciplines"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 flex items-end justify-between">
              <p className="eyebrow">II — What We Build</p>
              <p className="hidden max-w-sm text-sm leading-relaxed text-stone/80 md:block">
                Four disciplines, one orbit. Each a vector for engineered
                gravity.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "Culture", body: "Narrative architecture, ritual, and reference. We design the language a generation borrows from." },
                { title: "Space", body: "Hospitality, residence and retail as destination. Architecture that becomes pilgrimage." },
                { title: "Media", body: "Publications, films, signal. Owned channels engineered to outlast their subject." },
                { title: "Ventures", body: "Capital deployed where culture compounds. Equity in the institutions of the next century." },
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

        {/* ECOSYSTEM */}
        <OrbitalEcosystem />

        {/* STANDARD */}
        <section
          data-zone="standard"
          data-section="standard"
          className="relative px-6 py-[14rem] md:px-12"
        >
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow mb-24">IV — The Standard</p>
            <p className="excavate font-display text-5xl font-extralight leading-tight tracking-tight text-ivory sm:text-6xl md:text-7xl">
              <span>We do not chase<br />the market.</span>
            </p>
            <p className="excavate mt-16 font-signature text-3xl italic text-bronze-glow sm:text-4xl">
              <span>We outlast it.</span>
            </p>
          </div>
        </section>

        {/* TRANSFORMATIONS */}
        <section
          data-zone="transformations"
          data-section="transformations"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-20">V — Transformations</p>
            <div className="space-y-40">
              {[
                { from: "Brand", to: "Monument", body: "Identity engineered with the weight of architecture. A logo becomes a landmark.", align: "md:ml-0 md:mr-auto" },
                { from: "Space", to: "Destination", body: "Hospitality designed not for visit, but for return. Place as gravitational object.", align: "md:ml-auto md:mr-0" },
                { from: "Concept", to: "Signal", body: "Ideas refined until they cease to argue. Until the market simply turns toward them.", align: "md:ml-0 md:mr-auto" },
              ].map((t) => (
                <article key={t.from} className={`max-w-xl ${t.align}`}>
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

        {/* FUTURE */}
        <section data-zone="future" data-section="future" className="relative h-[130vh]">
          <div className="sticky top-0 flex h-screen w-full items-center justify-center">
            <div className="relative z-10 px-6 text-center">
              <p className="eyebrow mb-12">VII — The Future</p>
              <h2 className="excavate font-display text-5xl font-extralight leading-[0.95] tracking-tight text-ivory sm:text-7xl md:text-[8rem]">
                <span>An institution<br />before<br />a company.</span>
              </h2>
            </div>
          </div>
        </section>

        {/* INVITATION */}
        <section
          data-zone="invitation"
          data-section="invitation"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <p className="eyebrow mb-16">VIII — Invitation</p>
            <p className="font-display text-3xl font-light leading-snug text-ivory sm:text-4xl md:text-5xl">
              We work with the rare few <br />
              <span className="font-signature italic text-bronze-glow">
                building for the century.
              </span>
            </p>
            <Link
              to="/contact"
              className="bronze-line mt-20 inline-flex items-center gap-4 border-b border-stone/30 pb-2 text-sm uppercase tracking-[0.45em] text-ivory transition-colors duration-700 hover:text-bronze-glow"
            >
              <span>Begin a Conversation</span>
              <span aria-hidden className="text-bronze">→</span>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </SolenaPage>
  );
}
