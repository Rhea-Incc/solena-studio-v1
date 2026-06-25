import { createFileRoute, Link } from "@tanstack/react-router";

import vieLandscape from "@/assets/vie-halo-landscape.png.asset.json";
import viePortrait from "@/assets/vie-halo-portrait.png.asset.json";
import viePortrait2 from "@/assets/vie-portrait-2.png.asset.json";
import resonancePortrait from "@/assets/resonance-portrait.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import vieVideo from "@/assets/vie-video.mp4.asset.json";
import resonanceVideo from "@/assets/resonance-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";

export const Route = createFileRoute("/thesis")({
  head: () => ({
    meta: [
      { title: "Thesis — SOLENA" },
      {
        name: "description",
        content:
          "The Solena thesis: most organizations compete for attention. We build gravity.",
      },
      { property: "og:title", content: "The Thesis — SOLENA" },
      {
        property: "og:description",
        content: "Gravity does not advertise. It attracts.",
      },
      { property: "og:image", content: viePortrait.url },
    ],
  }),
  component: ThesisPage,
});

const STRATA: Stratum[] = [
  {
    id: "t-prelude",
    img: resonancePortrait.url,
    imgPortrait: resonancePortrait.url,
    scale: 1.5,
    blend: "screen",
    baseOpacity: 0.55,
    depth: 0.18,
    origin: "50% 40%",
  },
  {
    id: "t-gravity",
    img: vieLandscape.url,
    imgPortrait: viePortrait.url,
    scale: 1.7,
    blend: "soft-light",
    baseOpacity: 0.32,
    depth: 0.28,
    origin: "30% 50%",
  },
  {
    id: "t-attract",
    img: viePortrait2.url,
    imgPortrait: viePortrait2.url,
    scale: 1.6,
    blend: "screen",
    baseOpacity: 0.38,
    depth: 0.22,
    origin: "60% 55%",
  },
  {
    id: "t-coda",
    img: seedPortrait.url,
    imgPortrait: seedPortrait.url,
    scale: 1.9,
    blend: "soft-light",
    baseOpacity: 0.18,
    depth: 0.14,
    origin: "50% 50%",
  },
];

function ThesisPage() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "t-vie",
            src: vieVideo.url,
            zone: "t-gravity",
            peakOpacity: 0.28,
            blend: "screen",
          },
          {
            id: "t-res",
            src: resonanceVideo.url,
            zone: "t-prelude",
            peakOpacity: 0.22,
            blend: "screen",
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="t-prelude"
          className="relative flex min-h-[90vh] items-end px-6 pb-24 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="eyebrow mb-8">Manifesto</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              The
              <br />
              <span className="font-signature italic text-bronze-glow">
                Thesis.
              </span>
            </h1>
          </div>
        </section>

        <section
          data-zone="t-gravity"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto max-w-4xl space-y-16 font-display text-3xl font-light leading-[1.25] text-ivory sm:text-4xl md:text-5xl">
            <p className="excavate overflow-hidden">
              <span className="thesis-line block">
                The market trains organizations to be loud.
              </span>
            </p>
            <p className="excavate overflow-hidden">
              <span className="thesis-line block text-stone/80">
                Loudness is a tax on relevance.
              </span>
            </p>
            <p className="excavate overflow-hidden">
              <span className="thesis-line block text-bronze-glow">
                We engineer the opposite condition.
              </span>
            </p>
          </div>
        </section>

        <section
          data-zone="t-attract"
          className="relative px-6 py-40 md:px-12"
        >
          <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-2 md:gap-24">
            {[
              {
                k: "Gravity",
                v: "A property that does not request attention. It is requested.",
              },
              {
                k: "Stillness",
                v: "The absence of marketing pressure. Confidence visible from a distance.",
              },
              {
                k: "Permanence",
                v: "Outputs designed to outlast the cycle that produced them.",
              },
              {
                k: "Reference",
                v: "When competitors stop copying products and start copying language.",
              },
            ].map((t) => (
              <div key={t.k} className="max-w-md">
                <p className="font-signature text-sm italic text-bronze-glow">
                  — {t.k}
                </p>
                <p className="mt-4 font-display text-2xl font-light leading-snug text-ivory md:text-3xl">
                  {t.v}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          data-zone="t-coda"
          className="relative px-6 py-40 text-center md:px-12"
        >
          <div className="mx-auto max-w-3xl">
            <p className="excavate font-display text-4xl font-extralight italic text-ivory sm:text-5xl md:text-6xl">
              <span>
                Built once.
                <br />
                Borrowed forever.
              </span>
            </p>
            <Link
              to="/ecosystem"
              className="bronze-line mt-20 inline-flex items-center gap-3 border-b border-stone/30 pb-2 text-xs uppercase tracking-[0.45em] text-ivory hover:text-bronze-glow"
            >
              <span>Into the Ecosystem</span>
              <span aria-hidden className="text-bronze">→</span>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </SolenaPage>
  );
}
