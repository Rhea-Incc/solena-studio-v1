import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import gravityLandscape from "@/assets/gravity-landscape.png.asset.json";
import gravityPortrait from "@/assets/gravity-portrait.png.asset.json";
import gravityPortrait2 from "@/assets/gravity-portrait-2.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import resonancePortrait from "@/assets/resonance-portrait.png.asset.json";
import viePortrait from "@/assets/vie-halo-portrait.png.asset.json";
import viePortrait2 from "@/assets/vie-portrait-2.png.asset.json";
import vieLandscape from "@/assets/vie-halo-landscape.png.asset.json";
import seedVideo from "@/assets/seed-video.mp4.asset.json";
import vieVideo from "@/assets/vie-video.mp4.asset.json";
import resonanceVideo from "@/assets/resonance-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";
import { SECTORS } from "@/components/solena/orbital";

type SectorDetail = {
  slug: string;
  name: string;
  numeral: string;
  tagline: string;
  thesis: string;
  practices: { k: string; v: string }[];
  signals: string[];
  hero: { url: string };
  texture: { url: string };
  video?: { url: string };
};

const DETAILS: Record<string, SectorDetail> = {
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate",
    numeral: "Sector 01",
    tagline: "Buildings as gravity wells.",
    thesis:
      "We treat the built environment as the slowest, heaviest medium a brand can act in — and therefore the one most worth engineering.",
    practices: [
      { k: "Hotels", v: "Stays designed to be referenced for a generation." },
      { k: "Residences", v: "Homes that confer membership, not just shelter." },
      { k: "Quarters", v: "Districts that bend a city's map around them." },
    ],
    signals: ["Master planning", "Architectural narrative", "Operator selection"],
    hero: gravityLandscape,
    texture: gravityPortrait,
    video: vieVideo,
  },
  technology: {
    slug: "technology",
    name: "Technology",
    numeral: "Sector 02",
    tagline: "Tools built as artifacts.",
    thesis:
      "Software is rarely treated as a luxury object. We design it that way — restrained, considered, and shaped by the patina of restraint.",
    practices: [
      { k: "Interfaces", v: "Surfaces that feel inherited rather than shipped." },
      { k: "Platforms", v: "Infrastructure that disappears behind ritual." },
      { k: "Atelier R&D", v: "Long-horizon prototypes for owner-operators." },
    ],
    signals: ["Product naming", "Interaction grammar", "Owned AI surfaces"],
    hero: gravityLandscape,
    texture: resonancePortrait,
    video: resonanceVideo,
  },
  hospitality: {
    slug: "hospitality",
    name: "Hospitality",
    numeral: "Sector 03",
    tagline: "Service designed as ritual.",
    thesis:
      "Hospitality is the most underused luxury vector. We engineer the choreography between guest, staff, and place into a transferable memory.",
    practices: [
      { k: "Service Design", v: "Sequences that read as devotion, not protocol." },
      { k: "F&B", v: "Menus that codify a region's restraint." },
      { k: "Programming", v: "Calendars built like exhibitions." },
    ],
    signals: ["Concept development", "Operator training", "Owned media of place"],
    hero: vieLandscape,
    texture: viePortrait2,
    video: vieVideo,
  },
  luxury: {
    slug: "luxury",
    name: "Luxury",
    numeral: "Sector 04",
    tagline: "Goods that outlive their owner's interest in goods.",
    thesis:
      "We work upstream of the luxury market — on the few categories where heirloom logic still holds. Objects engineered for inheritance.",
    practices: [
      { k: "Maisons", v: "House-building for founders, not flips." },
      { k: "Editions", v: "Limited series with archival grammar." },
      { k: "Repair", v: "Service infrastructure as proof of intent." },
    ],
    signals: ["Brand cosmology", "Material strategy", "Distribution discipline"],
    hero: vieLandscape,
    texture: viePortrait,
    video: resonanceVideo,
  },
  media: {
    slug: "media",
    name: "Media",
    numeral: "Sector 05",
    tagline: "Channels that operate as institutions.",
    thesis:
      "Owned media is the slowest, surest path to gravity. We design publications, films, and signal architectures meant to outlast their subject.",
    practices: [
      { k: "Publications", v: "Print and digital with editorial spine." },
      { k: "Film", v: "Short and long-form work that compounds." },
      { k: "Signal", v: "Cadenced dispatches the market begins to wait for." },
    ],
    signals: ["Editorial strategy", "Production direction", "Distribution rituals"],
    hero: gravityLandscape,
    texture: gravityPortrait2,
    video: seedVideo,
  },
  ventures: {
    slug: "ventures",
    name: "Ventures",
    numeral: "Sector 06",
    tagline: "Capital at the intersection of culture and compound.",
    thesis:
      "We place patient equity where taste compounds — the rare companies treating culture, craft, and capital as a single discipline.",
    practices: [
      { k: "Seed", v: "Founders building category artifacts, not category bets." },
      { k: "Studio", v: "Co-founded ventures emerging from Solena clients." },
      { k: "Holdings", v: "Long-duration positions in heirloom-grade operators." },
    ],
    signals: ["Diligence rituals", "Operator coaching", "Cap-table architecture"],
    hero: gravityLandscape,
    texture: gravityPortrait,
    video: seedVideo,
  },
  culture: {
    slug: "culture",
    name: "Culture",
    numeral: "Sector 07",
    tagline: "The slow construction of taste.",
    thesis:
      "Culture is not promotion. It is the slow accumulation of references a generation borrows from. We design those references on purpose.",
    practices: [
      { k: "Narrative", v: "Foundational stories rendered as institutions." },
      { k: "Ritual", v: "Recurring acts that calcify into reference." },
      { k: "Patronage", v: "Investments in art, craft, and discourse." },
    ],
    signals: ["Editorial direction", "Cultural programming", "Archival design"],
    hero: vieLandscape,
    texture: resonancePortrait,
    video: resonanceVideo,
  },
  capital: {
    slug: "capital",
    name: "Capital",
    numeral: "Sector 08",
    tagline: "Patient money. Built for the century.",
    thesis:
      "We advise families, funds, and founders on capital structures that match the timeline of the work — quiet, slow, and durable.",
    practices: [
      { k: "Family Office", v: "Frameworks for generational deployment." },
      { k: "Fund Design", v: "LP pools tuned to heirloom-grade horizons." },
      { k: "Governance", v: "Boards that protect the work from the market." },
    ],
    signals: ["Allocation theory", "Liquidity calendar", "Succession architecture"],
    hero: vieLandscape,
    texture: seedPortrait,
    video: vieVideo,
  },
};

export const Route = createFileRoute("/sectors/$sector")({
  beforeLoad: ({ params }) => {
    if (!DETAILS[params.sector]) throw notFound();
  },
  head: ({ params }) => {
    const d = DETAILS[params.sector];
    if (!d) return { meta: [{ title: "Sector — SOLENA" }] };
    return {
      meta: [
        { title: `${d.name} — SOLENA Sectors` },
        { name: "description", content: d.thesis.slice(0, 155) },
        { property: "og:title", content: `${d.name} — SOLENA` },
        { property: "og:description", content: d.tagline },
        { property: "og:image", content: d.hero.url },
        { name: "twitter:image", content: d.hero.url },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-obsidian text-ivory">
      <div className="text-center">
        <p className="eyebrow mb-4">Not Found</p>
        <p className="font-display text-3xl">This sector is not in orbit.</p>
        <Link to="/ecosystem" className="bronze-line mt-8 inline-block text-sm uppercase tracking-[0.4em]">
          Return to the Ecosystem
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex min-h-screen items-center justify-center bg-obsidian text-ivory">
      <div className="text-center">
        <p className="eyebrow mb-4">Disturbance</p>
        <p className="font-display text-2xl">{error.message}</p>
        <button onClick={reset} className="bronze-line mt-8 text-sm uppercase tracking-[0.4em]">
          Retry
        </button>
      </div>
    </div>
  ),
  component: SectorPage,
});

function SectorPage() {
  const { sector } = Route.useParams();
  const d = DETAILS[sector]!;

  const STRATA: Stratum[] = [
    {
      id: "s-hero",
      img: d.hero.url,
      imgPortrait: d.texture.url,
      scale: 1.5,
      blend: "screen",
      baseOpacity: 0.5,
      depth: 0.18,
      origin: "50% 40%",
    },
    {
      id: "s-thesis",
      img: d.hero.url,
      imgPortrait: d.texture.url,
      scale: 1.7,
      blend: "soft-light",
      baseOpacity: 0.28,
      depth: 0.25,
      origin: "30% 50%",
    },
    {
      id: "s-practices",
      img: d.texture.url,
      imgPortrait: d.texture.url,
      scale: 1.6,
      blend: "overlay",
      baseOpacity: 0.22,
      depth: 0.3,
      origin: "70% 50%",
    },
    {
      id: "s-coda",
      img: d.hero.url,
      imgPortrait: d.texture.url,
      scale: 1.9,
      blend: "soft-light",
      baseOpacity: 0.18,
      depth: 0.14,
      origin: "50% 60%",
    },
  ];

  // Find current sector position in orbit
  const orbitIndex = SECTORS.findIndex((s) => s.slug === d.slug);
  const next = SECTORS[(orbitIndex + 1) % SECTORS.length];
  const prev = SECTORS[(orbitIndex - 1 + SECTORS.length) % SECTORS.length];

  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={
          d.video
            ? [{ id: "s-video", src: d.video.url, zone: "s-hero", peakOpacity: 0.28 }]
            : []
        }
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="s-hero"
          data-section="s-hero"
          data-section-label="Overview"
          className="relative flex min-h-[90vh] items-end px-6 pb-20 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <p className="eyebrow mb-6">{d.numeral}</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              {d.name.split(" ")[0]}
              {d.name.includes(" ") && (
                <>
                  <br />
                  <span className="font-signature italic text-bronze-glow">
                    {d.name.split(" ").slice(1).join(" ")}.
                  </span>
                </>
              )}
              {!d.name.includes(" ") && (
                <span className="font-signature italic text-bronze-glow">.</span>
              )}
            </h1>
            <p className="mt-10 max-w-2xl font-display text-2xl font-light leading-snug text-ivory/90 md:text-3xl">
              {d.tagline}
            </p>
          </div>
        </section>

        <section
          data-zone="s-thesis"
          data-section="s-thesis"
          data-section-label="Thesis"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr]">
            <p className="eyebrow">Thesis</p>
            <p className="excavate max-w-3xl font-display text-2xl font-light leading-snug text-ivory sm:text-3xl md:text-4xl">
              <span>{d.thesis}</span>
            </p>
          </div>
        </section>

        <section
          data-zone="s-practices"
          data-section="s-practices"
          data-section-label="Practices"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-12">Practices</p>
            <div className="grid gap-10 md:grid-cols-3">
              {d.practices.map((p, i) => (
                <article key={p.k} className="border-l border-ivory/10 pl-6">
                  <p className="font-signature text-xs italic text-bronze-glow">
                    0{i + 1}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-light text-ivory">
                    {p.k}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-stone/80">
                    {p.v}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-20">
              <p className="eyebrow mb-6">Signal Lines</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-3 font-signature text-base italic text-ivory/85">
                {d.signals.map((s) => (
                  <li key={s} className="before:mr-3 before:text-bronze before:content-['·']">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          data-zone="s-coda"
          data-section="s-coda"
          data-section-label="Next"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-stretch justify-between gap-10 border-t border-ivory/10 pt-16 md:flex-row md:items-end">
            <Link
              to="/sectors/$sector"
              params={{ sector: prev.slug }}
              className="bronze-line group flex-1"
            >
              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-stone/55">
                ← Prev Sector
              </p>
              <p className="mt-3 font-display text-2xl font-light text-ivory group-hover:text-bronze-glow">
                {prev.name}
              </p>
            </Link>
            <Link
              to="/ecosystem"
              hash={d.slug}
              className="bronze-line text-center text-xs uppercase tracking-[0.45em] text-stone/70 hover:text-bronze-glow"
            >
              Return to the Orbit
            </Link>
            <Link
              to="/sectors/$sector"
              params={{ sector: next.slug }}
              className="bronze-line group flex-1 text-right"
            >
              <p className="text-[0.55rem] uppercase tracking-[0.4em] text-stone/55">
                Next Sector →
              </p>
              <p className="mt-3 font-display text-2xl font-light text-ivory group-hover:text-bronze-glow">
                {next.name}
              </p>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </SolenaPage>
  );
}
