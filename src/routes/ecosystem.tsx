import { createFileRoute, Link } from "@tanstack/react-router";

import gravityLandscape from "@/assets/gravity-landscape.png.asset.json";
import gravityPortrait from "@/assets/gravity-portrait.png.asset.json";
import gravityPortrait2 from "@/assets/gravity-portrait-2.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import vieLandscape from "@/assets/vie-halo-landscape.png.asset.json";
import viePortrait from "@/assets/vie-halo-portrait.png.asset.json";
import seedVideo from "@/assets/seed-video.mp4.asset.json";
import vieVideo from "@/assets/vie-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";
import { OrbitalEcosystem } from "@/components/solena/orbital";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "Ecosystem — SOLENA" },
      {
        name: "description",
        content:
          "Eight converging sectors moving as a single field around Solena.",
      },
      { property: "og:title", content: "The Ecosystem — SOLENA" },
      {
        property: "og:description",
        content:
          "Brand, built environment, culture, capital — orbiting as one.",
      },
      { property: "og:image", content: gravityPortrait2.url },
    ],
  }),
  component: EcosystemPage,
});

const STRATA: Stratum[] = [
  {
    id: "e-prelude",
    img: seedPortrait.url,
    imgPortrait: seedPortrait.url,
    scale: 1.5,
    blend: "screen",
    baseOpacity: 0.5,
    depth: 0.18,
    origin: "50% 45%",
  },
  {
    id: "ecosystem",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait2.url,
    scale: 1.55,
    blend: "screen",
    baseOpacity: 0.32,
    depth: 0.22,
    origin: "50% 50%",
  },
  {
    id: "e-sectors",
    img: gravityLandscape.url,
    imgPortrait: gravityPortrait.url,
    scale: 1.7,
    blend: "overlay",
    baseOpacity: 0.22,
    depth: 0.28,
    origin: "70% 40%",
  },
  {
    id: "e-coda",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 1.8,
    blend: "soft-light",
    baseOpacity: 0.18,
    depth: 0.16,
    origin: "50% 50%",
  },
];

function EcosystemPage() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "e-seed",
            src: seedVideo.url,
            zone: "e-prelude",
            peakOpacity: 0.26,
          },
          {
            id: "e-vie",
            src: vieVideo.url,
            zone: "e-coda",
            peakOpacity: 0.22,
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="e-prelude"
          className="relative flex min-h-[85vh] items-end px-6 pb-20 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="eyebrow mb-8">A single field</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              The
              <br />
              <span className="font-signature italic text-bronze-glow">
                Ecosystem.
              </span>
            </h1>
          </div>
        </section>

        <OrbitalEcosystem />

        <section
          data-zone="e-sectors"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow mb-12">Sector Notes</p>
            <div className="grid gap-12 md:grid-cols-2">
              {[
                ["Real Estate", "Buildings as gravity wells. Hotels, residences, and quarters that bend the map."],
                ["Technology", "Tools built as artifacts. Software with the patina of restraint."],
                ["Hospitality", "Service designed as ritual. Stays that become reference points."],
                ["Luxury", "Goods engineered to outlive their owner's interest in goods."],
                ["Media", "Owned channels operating as institutions, not feeds."],
                ["Ventures", "Capital placed at the intersection of culture and compound."],
                ["Culture", "The slow construction of taste. The architecture of memory."],
                ["Capital", "Patient money. Built for the century, not the quarter."],
              ].map(([k, v]) => (
                <div key={k} className="border-l border-ivory/10 pl-6">
                  <p className="font-signature text-sm italic text-bronze-glow">
                    {k}
                  </p>
                  <p className="mt-3 font-display text-xl font-light leading-snug text-ivory">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          data-zone="e-coda"
          className="relative px-6 py-40 text-center md:px-12"
        >
          <p className="excavate font-display text-3xl font-extralight italic text-ivory sm:text-4xl md:text-5xl">
            <span>
              One orbit.
              <br />
              Many sectors.
              <br />
              One gravity.
            </span>
          </p>
          <Link
            to="/contact"
            className="bronze-line mt-16 inline-flex items-center gap-3 border-b border-stone/30 pb-2 text-xs uppercase tracking-[0.45em] text-ivory hover:text-bronze-glow"
          >
            <span>Step Into the Orbit</span>
            <span aria-hidden className="text-bronze">→</span>
          </Link>
        </section>

        <Footer />
      </main>
    </SolenaPage>
  );
}
