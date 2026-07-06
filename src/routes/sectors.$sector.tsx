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
import { SectorGlyph } from "@/components/solena/sector-glyph";

type SectorDetail = {
  slug: string;
  name: string;
  numeral: string;
  tagline: string;
  thesis: string;
  insights: { k: string; v: string }[];
  practices: { k: string; v: string }[];
  process: { phase: string; title: string; body: string }[];
  signals: string[];
  metrics: { label: string; value: string }[];
  hero: { url: string };
  texture: { url: string };
  video?: { url: string };
};

const base = {
  process: (a: string, b: string, c: string, d: string) => [
    { phase: "01", title: "Diagnostic", body: a },
    { phase: "02", title: "Composition", body: b },
    { phase: "03", title: "Instrumentation", body: c },
    { phase: "04", title: "Stewardship", body: d },
  ],
};

const DETAILS: Record<string, SectorDetail> = {
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate",
    numeral: "Sector 01",
    tagline: "Buildings as gravity wells.",
    thesis:
      "We treat the built environment as the slowest, heaviest medium a brand can act in — and therefore the one most worth engineering.",
    insights: [
      { k: "The site is the brief", v: "Topography, sight-lines, and light dictate program before the market does." },
      { k: "Operators are protagonists", v: "The right operator compounds an asset's story; the wrong one erodes decades of intent." },
      { k: "Zoning as narrative", v: "Entitlement work is a first draft of the myth. We shape it deliberately." },
      { k: "Time as material", v: "The best assets are legible in twenty years without renovation." },
    ],
    practices: [
      { k: "Hotels", v: "Stays designed to be referenced for a generation." },
      { k: "Residences", v: "Homes that confer membership, not just shelter." },
      { k: "Quarters", v: "Districts that bend a city's map around them." },
    ],
    process: base.process(
      "Site, jurisdiction, and operator context read as a single system.",
      "Program, architect shortlist, and narrative composed in one document.",
      "Owner-side reviews at massing, materials, service design, and launch.",
      "Post-opening standards, editorial cadence, and ten-year archival plan.",
    ),
    signals: ["Master planning", "Architectural narrative", "Operator selection"],
    metrics: [
      { label: "Horizon", value: "10–30 yrs" },
      { label: "Cadence", value: "Quarterly reviews" },
      { label: "Deliverable", value: "Positioning + brief" },
    ],
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
    insights: [
      { k: "Interfaces age fast", v: "Design the parts that shouldn't." },
      { k: "Naming is architecture", v: "A product's vocabulary decides which markets it can enter." },
      { k: "AI as material", v: "Models are ingredients, not products. Compose them like a chef." },
      { k: "Restraint scales", v: "Fewer surfaces, deeper craft — the opposite of a feature race." },
    ],
    practices: [
      { k: "Interfaces", v: "Surfaces that feel inherited rather than shipped." },
      { k: "Platforms", v: "Infrastructure that disappears behind ritual." },
      { k: "Atelier R&D", v: "Long-horizon prototypes for owner-operators." },
    ],
    process: base.process(
      "Product cosmology, user vocabulary, and market frontier audited together.",
      "Interaction grammar, naming system, and reference builds drafted in parallel.",
      "Owned model wrappers, agent surfaces, and evaluation harnesses shipped.",
      "Quarterly craft reviews and long-horizon roadmap kept in one hand.",
    ),
    signals: ["Product naming", "Interaction grammar", "Owned AI surfaces"],
    metrics: [
      { label: "Horizon", value: "3–7 yrs" },
      { label: "Cadence", value: "Bi-weekly reviews" },
      { label: "Deliverable", value: "Design system + models" },
    ],
    hero: gravityLandscape,
    texture: resonancePortrait,
    video: resonanceVideo,
  },
  hospitality: {
    slug: "hospitality",
    name: "Hotels",
    numeral: "Sector 03",
    tagline: "Service designed as ritual.",
    thesis:
      "Hospitality is the most underused luxury vector. We engineer the choreography between guest, staff, and place into a transferable memory.",
    insights: [
      { k: "The lobby is the thesis", v: "First ninety seconds set the guest's inner monologue for the stay." },
      { k: "Staff carry the myth", v: "Training documents outlive any advertising campaign." },
      { k: "F&B as anchor", v: "The best hotels are remembered for a room and a meal, in that order." },
      { k: "Return is the KPI", v: "Everything else — RevPAR, ADR — is downstream of it." },
    ],
    practices: [
      { k: "Service Design", v: "Sequences that read as devotion, not protocol." },
      { k: "F&B", v: "Menus that codify a region's restraint." },
      { k: "Programming", v: "Calendars built like exhibitions." },
    ],
    process: base.process(
      "Guest journey mapped end-to-end from booking to farewell letter.",
      "Rooms brief, F&B story, and staff scripts composed as one document.",
      "Opening rehearsals, mystery-guest cycles, and operator SOPs installed.",
      "Editorial calendar, member privileges, and repeat-guest rituals maintained.",
    ),
    signals: ["Concept development", "Operator training", "Owned media of place"],
    metrics: [
      { label: "Horizon", value: "5–15 yrs" },
      { label: "Cadence", value: "Monthly reviews" },
      { label: "Deliverable", value: "Concept + SOPs" },
    ],
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
    insights: [
      { k: "Scarcity is a system", v: "Not a marketing tactic — a manufacturing and distribution decision." },
      { k: "Repair is the promise", v: "A house that repairs its work owns the second-hand market by default." },
      { k: "Archive as advertising", v: "The best campaign a maison runs is its own history, curated well." },
      { k: "Distribution discipline", v: "Where a piece is sold defines what it is." },
    ],
    practices: [
      { k: "Maisons", v: "House-building for founders, not flips." },
      { k: "Editions", v: "Limited series with archival grammar." },
      { k: "Repair", v: "Service infrastructure as proof of intent." },
    ],
    process: base.process(
      "Category, materials, and inheritance logic examined at first principles.",
      "Cosmology, edition strategy, and distribution map drafted together.",
      "Ateliers, repair networks, and archive systems built from day one.",
      "Yearly craft reviews and multi-generational succession plans maintained.",
    ),
    signals: ["Brand cosmology", "Material strategy", "Distribution discipline"],
    metrics: [
      { label: "Horizon", value: "20+ yrs" },
      { label: "Cadence", value: "Quarterly reviews" },
      { label: "Deliverable", value: "Cosmology + archive" },
    ],
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
    insights: [
      { k: "Cadence over reach", v: "A reliable dispatch outperforms a viral moment across a decade." },
      { k: "Editorial spine", v: "Every issue answers to a five-year question, not a monthly one." },
      { k: "Distribution rituals", v: "How a piece arrives matters as much as what it says." },
      { k: "Archive is the platform", v: "Every issue compounds the next; nothing is thrown away." },
    ],
    practices: [
      { k: "Publications", v: "Print and digital with editorial spine." },
      { k: "Film", v: "Short and long-form work that compounds." },
      { k: "Signal", v: "Cadenced dispatches the market begins to wait for." },
    ],
    process: base.process(
      "Editorial mandate, reader map, and five-year arc defined together.",
      "Masthead, format language, and issue architecture designed as one.",
      "Production pipelines, distribution rituals, and archive built in parallel.",
      "Editorial reviews, contributor stewardship, and archival integrity kept ongoing.",
    ),
    signals: ["Editorial strategy", "Production direction", "Distribution rituals"],
    metrics: [
      { label: "Horizon", value: "5–20 yrs" },
      { label: "Cadence", value: "Per-issue reviews" },
      { label: "Deliverable", value: "Mandate + masthead" },
    ],
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
    insights: [
      { k: "Diligence as diagnosis", v: "We read a company like a building — the plan reveals the founder." },
      { k: "Founders over decks", v: "Cadence, restraint, and reference set the ceiling; the deck rarely does." },
      { k: "Cap-table architecture", v: "Ownership design decides which futures are still available in year seven." },
      { k: "Exits as continuations", v: "A liquidity event is a chapter, not an ending." },
    ],
    practices: [
      { k: "Seed", v: "Founders building category artifacts, not category bets." },
      { k: "Studio", v: "Co-founded ventures emerging from Solena clients." },
      { k: "Holdings", v: "Long-duration positions in heirloom-grade operators." },
    ],
    process: base.process(
      "Founder cadence, category posture, and reference set examined at length.",
      "Term sheet, cap-table, and governance drafted around the ten-year map.",
      "Operator coaching, board rituals, and reserved-follow discipline installed.",
      "Quarterly cadence, secondary planning, and continuity architecture maintained.",
    ),
    signals: ["Diligence rituals", "Operator coaching", "Cap-table architecture"],
    metrics: [
      { label: "Horizon", value: "7–15 yrs" },
      { label: "Cadence", value: "Quarterly reviews" },
      { label: "Deliverable", value: "Term sheet + coaching" },
    ],
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
    insights: [
      { k: "Reference over reach", v: "Being cited by the right ten people beats being seen by ten million." },
      { k: "Ritual makes memory", v: "Recurring acts calcify into cultural weight; one-offs evaporate." },
      { k: "Patronage compounds", v: "Investing in an artist for a decade returns a canon, not a piece." },
      { k: "Archive is the endgame", v: "The library you leave behind is the brand's true balance sheet." },
    ],
    practices: [
      { k: "Narrative", v: "Foundational stories rendered as institutions." },
      { k: "Ritual", v: "Recurring acts that calcify into reference." },
      { k: "Patronage", v: "Investments in art, craft, and discourse." },
    ],
    process: base.process(
      "Cultural map, reference set, and patron history read as a single field.",
      "Ritual calendar, commission strategy, and archival grammar drafted together.",
      "Programs, patronage, and publications launched on a multi-year rhythm.",
      "Curatorial reviews and archive stewardship maintained across generations.",
    ),
    signals: ["Editorial direction", "Cultural programming", "Archival design"],
    metrics: [
      { label: "Horizon", value: "15+ yrs" },
      { label: "Cadence", value: "Seasonal reviews" },
      { label: "Deliverable", value: "Program + archive" },
    ],
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
    insights: [
      { k: "Structure sets outcomes", v: "The wrapper decides what the money is allowed to become." },
      { k: "Liquidity as calendar", v: "Not an event — a rhythm designed decades in advance." },
      { k: "Governance is craft", v: "Boards that protect the work from the market outperform on horizon." },
      { k: "Succession is the product", v: "The plan for the next steward is the deliverable, not an afterthought." },
    ],
    practices: [
      { k: "Family Office", v: "Frameworks for generational deployment." },
      { k: "Fund Design", v: "LP pools tuned to heirloom-grade horizons." },
      { k: "Governance", v: "Boards that protect the work from the market." },
    ],
    process: base.process(
      "Balance sheet, liquidity horizon, and stewardship map read together.",
      "Structure, allocation, and governance drafted around the family's arc.",
      "Investment committee, IC memos, and reporting cadence installed.",
      "Yearly reviews and succession rehearsals kept as the primary ritual.",
    ),
    signals: ["Allocation theory", "Liquidity calendar", "Succession architecture"],
    metrics: [
      { label: "Horizon", value: "25+ yrs" },
      { label: "Cadence", value: "Annual reviews" },
      { label: "Deliverable", value: "Structure + governance" },
    ],
    hero: vieLandscape,
    texture: seedPortrait,
    video: vieVideo,
  },
  automotive: {
    slug: "automotive",
    name: "Automotive",
    numeral: "Sector 09",
    tagline: "Vehicles as heirloom-grade objects.",
    thesis:
      "The automobile is regressing into an appliance. We work with the few makers still treating it as an object of inheritance — restrained, mechanical, unmistakably authored.",
    insights: [
      { k: "Silhouette outlasts spec", v: "A profile that reads in twenty years is worth more than any drivetrain generation." },
      { k: "Service is the brand", v: "The dealership and the workshop deliver the promise; both must feel authored." },
      { k: "Software as patina", v: "In-car software should age with grace, not obsolete the car within a decade." },
      { k: "Coachbuilding returns", v: "Limited authored series unlock a margin the mass segment cannot reach." },
    ],
    practices: [
      { k: "Marques", v: "House-building for makers with a mechanical thesis." },
      { k: "Coachbuild", v: "Bespoke and limited series with archival grammar." },
      { k: "Retail", v: "Dealerships composed as ateliers, not showrooms." },
    ],
    process: base.process(
      "Marque history, silhouette, and mechanical thesis examined together.",
      "Range architecture, coachbuild strategy, and retail concept drafted as one.",
      "Design reviews, retail rollout, and software patina system installed.",
      "Owners' program, service network, and archival intelligence maintained.",
    ),
    signals: ["Marque cosmology", "Coachbuild programs", "Retail design"],
    metrics: [
      { label: "Horizon", value: "10–25 yrs" },
      { label: "Cadence", value: "Model-cycle reviews" },
      { label: "Deliverable", value: "Marque + retail" },
    ],
    hero: gravityLandscape,
    texture: resonancePortrait,
    video: resonanceVideo,
  },
  airlines: {
    slug: "airlines",
    name: "Airlines",
    numeral: "Sector 10",
    tagline: "Air travel restored to ritual.",
    thesis:
      "Commercial aviation traded ceremony for throughput. We work with carriers reintroducing a discipline of restraint — from the livery to the last mile — so a flight becomes a moment worth remembering.",
    insights: [
      { k: "Livery is the first sentence", v: "A carrier's tailfin is the shortest brief the market will ever read." },
      { k: "Cabin is choreography", v: "Seat, tray, and turndown are a three-act play; script them accordingly." },
      { k: "Loyalty is not a program", v: "It is the sum of a thousand quiet allowances, mostly at the counter." },
      { k: "Terminals as thresholds", v: "The pre-flight sequence sets the guest's inner monologue for the whole trip." },
    ],
    practices: [
      { k: "Cabin", v: "Onboard sequences composed like hospitality." },
      { k: "Ground", v: "Terminals and lounges designed as thresholds." },
      { k: "Loyalty", v: "Membership designed as a house, not a coupon book." },
    ],
    process: base.process(
      "Route network, fleet posture, and guest journey audited end-to-end.",
      "Cabin, ground, and loyalty story composed as a single document.",
      "Crew training, lounge design, and service SOPs installed together.",
      "Editorial calendar, member privileges, and archive maintained ongoing.",
    ),
    signals: ["Cabin design", "Lounge programming", "Loyalty architecture"],
    metrics: [
      { label: "Horizon", value: "10–20 yrs" },
      { label: "Cadence", value: "Fleet-cycle reviews" },
      { label: "Deliverable", value: "Concept + SOPs" },
    ],
    hero: vieLandscape,
    texture: viePortrait2,
    video: vieVideo,
  },
  tourism: {
    slug: "tourism",
    name: "Tourism",
    numeral: "Sector 11",
    tagline: "Journeys engineered to be remembered.",
    thesis:
      "Destination marketing has collapsed into content. We work with regions, hoteliers, and operators building the opposite — journeys with plot, restraint, and a beginning worth arriving for.",
    insights: [
      { k: "The itinerary is the product", v: "Not the destination — the sequence between them." },
      { k: "Local cadence beats spectacle", v: "A place's true rhythm is its most unrepeatable asset." },
      { k: "Guides are authors", v: "The best trips are hosted by a single narrating intelligence." },
      { k: "Restraint is the luxury", v: "Fewer, quieter days, in the right order, outperform saturated calendars." },
    ],
    practices: [
      { k: "Destinations", v: "Regional positioning composed as a house style." },
      { k: "Journeys", v: "Multi-day itineraries authored end-to-end." },
      { k: "Operators", v: "Coaching for the DMCs and hosts carrying the promise." },
    ],
    process: base.process(
      "Region, seasonality, and operator landscape read together.",
      "Itinerary architecture, host briefs, and lodging pairings drafted as one.",
      "Pilot journeys, guide training, and post-trip archive installed.",
      "Editorial dispatches, alumni program, and seasonal reviews maintained.",
    ),
    signals: ["Destination positioning", "Itinerary design", "Operator coaching"],
    metrics: [
      { label: "Horizon", value: "5–15 yrs" },
      { label: "Cadence", value: "Seasonal reviews" },
      { label: "Deliverable", value: "Itinerary + host training" },
    ],
    hero: gravityLandscape,
    texture: gravityPortrait2,
    video: seedVideo,
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
      id: "s-insights",
      img: d.texture.url,
      imgPortrait: d.texture.url,
      scale: 1.55,
      blend: "overlay",
      baseOpacity: 0.22,
      depth: 0.28,
      origin: "40% 40%",
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
      id: "s-process",
      img: d.hero.url,
      imgPortrait: d.texture.url,
      scale: 1.7,
      blend: "soft-light",
      baseOpacity: 0.2,
      depth: 0.24,
      origin: "50% 55%",
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

  const orbitIndex = SECTORS.findIndex((s) => s.slug === d.slug);
  const next = SECTORS[(orbitIndex + 1) % SECTORS.length];
  const prev = SECTORS[(orbitIndex - 1 + SECTORS.length) % SECTORS.length];

  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={
          d.video
            ? [{ id: "s-video", src: d.video.url, zone: "s-coda", peakOpacity: 0.24 }]
            : []
        }
      />
      <NavBar />

      <main className="relative z-10">
        {/* HERO */}
        <section
          data-zone="s-hero"
          data-section="s-hero"
          data-section-label="Overview"
          data-section-level="1"
          className="relative flex min-h-[92vh] items-end px-6 pb-24 pt-40 md:px-12"
        >
          <div className="mx-auto grid w-full max-w-6xl items-end gap-12 md:grid-cols-[1.4fr_1fr]">
            <div>
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
            <div className="relative aspect-square w-full max-w-sm justify-self-end sector-glyph-float">
              <SectorGlyph slug={d.slug} className="h-full w-full" />
            </div>
          </div>
        </section>

        {/* THESIS */}
        <section
          data-zone="s-thesis"
          data-section="s-thesis"
          data-section-label="Thesis"
          data-section-level="1"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr]">
            <p className="eyebrow">Thesis</p>
            <p className="excavate max-w-3xl font-display text-2xl font-light leading-snug text-ivory sm:text-3xl md:text-4xl">
              <span>{d.thesis}</span>
            </p>
          </div>
        </section>

        {/* INSIGHTS */}
        <section
          data-zone="s-insights"
          data-section="s-insights"
          data-section-label="Insights"
          data-section-level="1"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-16">Insights</p>
            <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
              {d.insights.map((it, i) => (
                <article
                  key={it.k}
                  data-section={`s-insight-${i}`}
                  data-section-label={it.k}
                  data-section-level="2"
                  className="group relative"
                >
                  <p className="font-signature text-xs italic text-bronze-glow">
                    · 0{i + 1}
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-light text-ivory md:text-3xl">
                    {it.k}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-stone/85">
                    {it.v}
                  </p>
                  <div className="mt-6 h-px w-16 bg-ivory/10 transition-all duration-700 group-hover:w-32 group-hover:bg-bronze-glow/70" />
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRACTICES */}
        <section
          data-zone="s-practices"
          data-section="s-practices"
          data-section-label="Practices"
          data-section-level="1"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-14">Practices</p>
            <div className="grid gap-10 md:grid-cols-3">
              {d.practices.map((p, i) => (
                <article
                  key={p.k}
                  data-section={`s-practice-${i}`}
                  data-section-label={p.k}
                  data-section-level="2"
                  className="border-l border-ivory/10 pl-6"
                >
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
                  <li
                    key={s}
                    className="before:mr-3 before:text-bronze before:content-['·']"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section
          data-zone="s-process"
          data-section="s-process"
          data-section-label="Process"
          data-section-level="1"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <p className="eyebrow">Process brief</p>
              <p className="max-w-md text-sm text-stone/70">
                Four phases, held together by one editor. Each engagement runs on
                this rhythm — adapted to horizon, not to headcount.
              </p>
            </div>
            <ol className="grid gap-10 md:grid-cols-4">
              {d.process.map((p, i) => (
                <li
                  key={p.phase}
                  data-section={`s-process-${i}`}
                  data-section-label={p.title}
                  data-section-level="2"
                  className="relative border-t border-ivory/10 pt-6"
                >
                  <span className="absolute -top-px left-0 h-px w-10 bg-bronze-glow/80" />
                  <p className="font-signature text-xs italic text-bronze-glow">
                    Phase {p.phase}
                  </p>
                  <h4 className="mt-3 font-display text-xl font-light text-ivory">
                    {p.title}
                  </h4>
                  <p className="mt-4 text-sm leading-relaxed text-stone/80">
                    {p.body}
                  </p>
                </li>
              ))}
            </ol>

            <dl className="mt-20 grid gap-8 border-t border-ivory/10 pt-10 sm:grid-cols-3">
              {d.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="text-[0.55rem] uppercase tracking-[0.4em] text-stone/55">
                    {m.label}
                  </dt>
                  <dd className="mt-2 font-display text-2xl font-light text-ivory">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CODA */}
        <section
          data-zone="s-coda"
          data-section="s-coda"
          data-section-label="Next"
          data-section-level="1"
          className="relative px-6 py-40 md:px-12"
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
