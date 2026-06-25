import { createFileRoute } from "@tanstack/react-router";

import resonancePortrait from "@/assets/resonance-portrait.png.asset.json";
import viePortrait2 from "@/assets/vie-portrait-2.png.asset.json";
import seedPortrait from "@/assets/seed-portrait.png.asset.json";
import resonanceVideo from "@/assets/resonance-video.mp4.asset.json";

import {
  EnvironmentCanvas,
  SolenaPage,
  type Stratum,
} from "@/components/solena/environment";
import { NavBar, Footer } from "@/components/solena/chrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SOLENA" },
      {
        name: "description",
        content:
          "Begin a conversation with Solena. We work with the rare few building for the century.",
      },
      { property: "og:title", content: "Contact — SOLENA" },
      {
        property: "og:description",
        content: "Begin a conversation with Solena.",
      },
      { property: "og:image", content: resonancePortrait.url },
    ],
  }),
  component: ContactPage,
});

const STRATA: Stratum[] = [
  {
    id: "c-hero",
    img: resonancePortrait.url,
    imgPortrait: resonancePortrait.url,
    scale: 1.4,
    blend: "screen",
    baseOpacity: 0.55,
    depth: 0.15,
    origin: "50% 35%",
  },
  {
    id: "c-form",
    img: viePortrait2.url,
    imgPortrait: viePortrait2.url,
    scale: 1.7,
    blend: "soft-light",
    baseOpacity: 0.28,
    depth: 0.22,
    origin: "70% 50%",
  },
  {
    id: "c-coda",
    img: seedPortrait.url,
    imgPortrait: seedPortrait.url,
    scale: 1.9,
    blend: "screen",
    baseOpacity: 0.22,
    depth: 0.18,
    origin: "50% 50%",
  },
];

function ContactPage() {
  return (
    <SolenaPage strata={STRATA}>
      <EnvironmentCanvas
        strata={STRATA}
        videos={[
          {
            id: "c-res",
            src: resonanceVideo.url,
            zone: "c-hero",
            peakOpacity: 0.3,
          },
        ]}
      />
      <NavBar />

      <main className="relative z-10">
        <section
          data-zone="c-hero"
          className="relative flex min-h-[80vh] items-end px-6 pb-20 pt-40 md:px-12"
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="eyebrow mb-8">Begin a Conversation</p>
            <h1 className="font-display text-5xl font-extralight leading-[1.02] tracking-tight text-ivory sm:text-7xl md:text-[7.5rem]">
              <span className="font-signature italic text-bronze-glow">
                Contact.
              </span>
            </h1>
            <p className="mt-10 max-w-xl text-base leading-relaxed text-stone/85 md:text-lg">
              Solena partners with founders, families, and institutions whose
              ambitions extend beyond their lifetime. Engagements begin with a
              private correspondence.
            </p>
          </div>
        </section>

        <section
          data-zone="c-form"
          className="relative px-6 py-32 md:px-12"
        >
          <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.1fr_1fr]">
            <form
              className="glass space-y-8 p-8 md:p-12"
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = "mailto:studio@solena.co";
              }}
            >
              {[
                { id: "name", label: "Name", type: "text" },
                { id: "org", label: "Organization", type: "text" },
                { id: "email", label: "Email", type: "email" },
              ].map((f) => (
                <div key={f.id}>
                  <label
                    htmlFor={f.id}
                    className="block text-[0.6rem] uppercase tracking-[0.4em] text-stone/60"
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.id}
                    type={f.type}
                    required
                    className="mt-3 w-full border-b border-ivory/15 bg-transparent pb-3 font-display text-xl font-light text-ivory placeholder:text-stone/40 focus:border-bronze-glow focus:outline-none"
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="msg"
                  className="block text-[0.6rem] uppercase tracking-[0.4em] text-stone/60"
                >
                  Intent
                </label>
                <textarea
                  id="msg"
                  rows={5}
                  required
                  className="mt-3 w-full resize-none border-b border-ivory/15 bg-transparent pb-3 font-display text-lg font-light text-ivory placeholder:text-stone/40 focus:border-bronze-glow focus:outline-none"
                  placeholder="What are you building?"
                />
              </div>
              <button
                type="submit"
                className="bronze-line inline-flex items-center gap-4 border-b border-stone/30 pb-2 text-xs uppercase tracking-[0.45em] text-ivory transition-colors duration-700 hover:text-bronze-glow"
              >
                <span>Send Correspondence</span>
                <span aria-hidden className="text-bronze">→</span>
              </button>
            </form>

            <aside className="space-y-10">
              <div>
                <p className="eyebrow mb-4">Studio</p>
                <p className="font-display text-2xl font-light text-ivory">
                  studio@solena.co
                </p>
              </div>
              <div>
                <p className="eyebrow mb-4">Press</p>
                <p className="font-display text-2xl font-light text-ivory">
                  press@solena.co
                </p>
              </div>
              <div>
                <p className="eyebrow mb-4">Cadence</p>
                <p className="max-w-sm text-sm leading-relaxed text-stone/80">
                  We respond within five business days. Engagements are
                  reviewed quarterly and accepted by invitation.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section
          data-zone="c-coda"
          className="relative px-6 py-40 text-center md:px-12"
        >
          <p className="excavate font-display text-3xl font-extralight italic text-ivory sm:text-4xl md:text-5xl">
            <span>
              For the rare few
              <br />
              building for the century.
            </span>
          </p>
        </section>

        <Footer />
      </main>
    </SolenaPage>
  );
}
