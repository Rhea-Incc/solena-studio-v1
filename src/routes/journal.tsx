import { createFileRoute } from "@tanstack/react-router";

import resonancePortrait from "@/assets/resonance-portrait.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import viePortrait2 from "@/assets/vie-portrait-2.png.asset.json";
import gravityPortrait2 from "@/assets/gravity-portrait-2.png.asset.json";
import resonanceVideo from "@/assets/resonance-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — SOLENA" },
      {
        name: "description",
        content:
          "Field notes, essays, and dispatches from the Solena studio.",
      },
      { property: "og:title", content: "The Journal — SOLENA" },
      {
        property: "og:description",
        content: "Dispatches on patience, silence, and the heirloom brand.",
      },
      { property: "og:image", content: resonancePortrait.url },
    ],
  }),
  component: JournalPage,
});

const ENTRIES = [
  {
    no: "Field Note 01",
    title: "On the Architecture of Patience",
    excerpt:
      "Time is the only material a brand cannot purchase. It can only earn it, slowly.",
    meta: "Essay · 12 min",
    zone: "j-01",
    art: resonancePortrait,
  },
  {
    no: "Field Note 02",
    title: "Why Markets Misprice Silence",
    excerpt:
      "Restraint reads as risk to analysts and as authority to customers. We side with the latter.",
    meta: "Thesis · 8 min",
    zone: "j-02",
    art: seedPortrait,
  },
  {
    no: "Field Note 03",
    title: "Engineering the Heirloom Brand",
    excerpt:
      "Heirlooms are not the oldest objects. They are the ones designed to be transferred.",
    meta: "Case · 18 min",
    zone: "j-03",
    art: viePortrait2,
  },
  {
    no: "Field Note 04",
    title: "Gravity, Measured",
    excerpt:
      "How we know an institution has formed: when other institutions begin orbiting it.",
    meta: "Note · 5 min",
    zone: "j-04",
    art: gravityPortrait2,
  },
];

const STRATA: Stratum[] = ENTRIES.map((e, i) => ({
  id: e.zone,
  img: e.art.url,
  imgPortrait: e.art.url,
  scale: 1.5 + (i % 2) * 0.2,
  blend: (i % 2 === 0 ? "screen" : "soft-light") as Stratum["blend"],
  baseOpacity: 0.34,
  depth: 0.2 + (i % 3) * 0.06,
  origin: i % 2 === 0 ? "30% 50%" : "70% 50%",
}));

function JournalPage() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "j-res",
            src: resonanceVideo.url,
            zone: "j-01",
            peakOpacity: 0.22,
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section className="relative flex min-h-[70vh] items-end px-6 pb-16 pt-40 md:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <p className="eyebrow mb-8">Selected Dispatches</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              The
              <br />
              <span className="font-signature italic text-bronze-glow">
                Journal.
              </span>
            </h1>
          </div>
        </section>

        <div className="px-6 pb-40 md:px-12">
          <div className="mx-auto max-w-6xl">
            {ENTRIES.map((e, i) => (
              <article
                key={e.no}
                data-zone={e.zone}
                className={`relative border-t border-ivory/10 py-28 md:py-36 ${
                  i % 2 === 0 ? "md:pl-0 md:pr-[30%]" : "md:pl-[30%] md:pr-0"
                }`}
              >
                <p className="font-signature text-xs italic text-bronze-glow">
                  {e.no}
                </p>
                <h2 className="excavate mt-6 font-display text-3xl font-light leading-tight text-ivory sm:text-4xl md:text-5xl">
                  <span>{e.title}</span>
                </h2>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">
                  {e.excerpt}
                </p>
                <p className="mt-10 text-[0.65rem] uppercase tracking-[0.4em] text-stone/55">
                  {e.meta} · <span className="bronze-line">Read</span>
                </p>
              </article>
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </SolenaPage>
  );
}
