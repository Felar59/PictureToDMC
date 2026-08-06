import { Link } from "react-router-dom"

import strawberryChart from "@/assets/demo/strawberry-chart.avif"
import strawberryPhoto from "@/assets/demo/strawberry.avif"
import { PhotoSlot } from "@/components/brand/photo-slot"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/ui/pill"
import { useI18n } from "@/i18n"
import { demoThreads } from "@/lib/pixel-art"
import { paths } from "@/lib/routes"
import { useHead } from "@/lib/head"

/** Per-step badge colors, in the design's order: coral, golden, nile, sky. */
const STEP_TONES = [
  "text-coral bg-coral-wash border-coral-edge",
  "text-golden-deep bg-golden-wash border-golden-edge",
  "text-nile-deep bg-nile-wash border-nile-edge",
  "text-sky-deep bg-sky-wash border-sky-edge",
]

function SectionShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-20 ${className ?? ""}`}>{children}</div>
  )
}

export default function Home() {
  const { t, lang } = useI18n()

  useHead({
    title: t.head.home.title,
    description: t.head.home.description,
    canonicalPath: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Picture to DMC",
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      description: t.head.home.description,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      featureList: [
        "Photo to cross-stitch chart",
        "Real DMC thread matching",
        "Printable chart with a thread list",
        "Runs entirely in the browser",
      ],
    },
  })

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <SectionShell className="pt-12 pb-14 lg:pt-[72px] lg:pb-16">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <StatusPill className="mb-[22px]">{t.home.badge}</StatusPill>

            <h1 className="text-[38px] sm:text-[46px] lg:text-[54px] leading-[1.08] m-0 mb-5 tracking-[-.5px]">
              {t.home.heroTitleBefore}
              <span className="text-coral-deep underline-stitch">{t.home.heroTitleAccent}</span>
              {t.home.heroTitleAfter}
            </h1>

            <p className="text-[18px] leading-[1.65] text-clay m-0 mb-[30px] max-w-[480px]">
              {t.home.heroLead}
            </p>

            <div className="flex gap-3.5 items-center flex-wrap">
              <Button asChild size="lg">
                <Link to={paths.convert}>{t.home.ctaUpload}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to={paths.gallery}>{t.home.ctaSample}</Link>
              </Button>
            </div>

            <p className="font-hand text-[15px] text-sand mt-[22px] mb-0">{t.home.heroNote}</p>
          </div>

          {/* The transformation itself, rather than a description of it.
              A container query rather than a viewport breakpoint, because this panel
              sits in a grid column whose width does not track the viewport — the
              inset photograph is sized in cqw for the same reason. */}
          <div className="@container bg-blanc rounded-[24px] shadow-panel p-7 flex flex-col gap-[18px]">
            {/* A real photograph and the chart the converter actually returned for
                it — same fruit, 9 threads, 74 x 75 — rather than a hand-drawn berry
                claiming six threads it had never matched. The promise on this panel
                is the product's only substantive claim, so it is made with the
                product's own output.

                The chart takes the full width and the photograph sits in its
                corner, because the legend is half of what is being promised: a
                chart you cannot buy thread from is not a chart. Measured at display
                size, that legend is an illegible smear at 160px and only reads as a
                thread list from about 220 — which it cannot have while sharing the
                row. The corner it occupies is empty grid, so nothing of the motif is
                hidden. */}
            <div>
              <div className="relative">
                <img
                  src={strawberryChart}
                  alt={t.home.demoPatternAlt}
                  width={780}
                  height={936}
                  className="block w-full h-auto rounded-[14px] shadow-[inset_0_0_0_1.5px_var(--color-edge-4)]"
                />

                {/* The "before", and the way in: it is the only clickable thing on
                    the panel, so the photograph is what invites the upload.
                    Unlabelled and unpointed-at. An arrow between the two was either
                    lost against the grid or reaching across the motif, and the word
                    "avant" was explaining something the pairing already says — a
                    photograph sitting on a chart of itself needs no caption. Size
                    carries it instead. */}
                <div className="absolute left-2 top-2">
                  {/* Clicking it opens the converter with this very photograph
                      already loaded and set to the settings that produced the chart
                      behind it — vivid, 9 threads, 74 wide. The panel is a promise,
                      and this is the shortest possible way to let someone check it
                      without having to find a photograph of their own first. */}
                  <Link to={`${paths.convert}?exemple=fraise`} aria-label={t.home.demoTry}>
                    {/* A share of the chart's width, not a fixed size: at 86px it
                        was a fifth of the panel on desktop and a third of it at
                        375px, where it started covering a leaf. */}
                    <PhotoSlot
                      radius={14}
                      className="w-[27cqw] aspect-square p-2 bg-blanc shadow-card transition-colors hover:border-coral"
                    >
                      <img
                        src={strawberryPhoto}
                        alt={t.home.demoPhotoAlt}
                        width={360}
                        height={360}
                        className="block size-full object-contain"
                      />
                    </PhotoSlot>
                  </Link>
                </div>
              </div>

              <div className="text-[12.5px] font-bold text-sand mt-2 text-center">
                {t.home.demoPattern}
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              {demoThreads.map((th) => (
                <div
                  key={th.code}
                  className="w-[22px] h-[28px] rounded-md bobbin-sm"
                  style={{
                    background: th.hex,
                    boxShadow:
                      th.hex === "#F3ECDC"
                        ? "inset 0 0 0 1px var(--color-edge-4)"
                        : undefined,
                  }}
                  title={`DMC ${th.code} · ${lang === "fr" ? th.nameFr : th.name}`}
                />
              ))}
              <span className="font-hand text-sm text-sand ml-1.5">
                {t.home.demoMatched(demoThreads.length)}
              </span>
            </div>
          </div>
        </div>
      </SectionShell>

      {/* ---------------- how it works ---------------- */}
      <SectionShell className="pt-6 pb-16">
        <section id="how-it-works" className="scroll-mt-28">
          <div className="text-center mb-9">
            <div className="font-hand text-base text-quill">{t.home.stepsKicker}</div>
            <h2 className="text-[28px] sm:text-[32px] mt-1.5 mb-0">{t.home.stepsTitle}</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {t.home.steps.map((step, i) => (
              <div
                key={step.title}
                className="bg-blanc rounded-[20px] p-6 flex flex-col gap-2.5 shadow-card-sm"
              >
                <span
                  className={`font-display font-semibold text-2xl border-2 border-dashed rounded-full size-[46px] flex items-center justify-center ${STEP_TONES[i]}`}
                >
                  {i + 1}
                </span>
                <div className="font-display font-medium text-[18px]">{step.title}</div>
                <p className="text-[14.5px] leading-[1.5] text-cocoa m-0">{step.body}</p>
              </div>
            ))}
          </div>

          {/* The summary above is four sentences; the guide is the whole thing. */}
          <p className="text-center mt-8 mb-0">
            <Link
              to={paths.guide}
              className="inline-flex items-center min-h-11 text-[15px] font-bold text-coral-deep hover:text-coral-deeper transition-colors"
            >
              {t.home.stepsMore} →
            </Link>
          </p>
        </section>
      </SectionShell>

      {/* ---------------- features ---------------- */}
      <SectionShell className="pb-[72px]">
        <div className="bg-blanc rounded-[24px] shadow-card p-8 sm:p-11 lg:px-12 grid md:grid-cols-3 gap-9">
          {/* swap any thread */}
          <div>
            <div className="flex gap-[5px] mb-3.5">
              <div className="w-[22px] h-[30px] rounded-md bg-sky bobbin-sm" />
              <div className="w-[22px] h-[30px] rounded-md bg-lavender bobbin-sm" />
            </div>
            <h3 className="font-medium text-[19px] mb-1.5">{t.home.features[0].title}</h3>
            <p className="text-[14.5px] leading-[1.55] text-cocoa m-0">{t.home.features[0].body}</p>
          </div>

          {/* use your own threads */}
          <div>
            <div className="flex gap-[5px] mb-3.5 items-end">
              <div className="w-[18px] h-[24px] rounded bg-coral bobbin-sm" />
              <div className="w-[18px] h-[30px] rounded bg-golden bobbin-sm" />
              <div className="w-[18px] h-[27px] rounded bg-nile bobbin-sm" />
            </div>
            <h3 className="font-medium text-[19px] mb-1.5">{t.home.features[1].title}</h3>
            <p className="text-[14.5px] leading-[1.55] text-cocoa m-0">{t.home.features[1].body}</p>
          </div>

          {/* see every color */}
          <div>
            <div
              className="grid mb-3.5"
              style={{ gridTemplateColumns: "repeat(3, 9px)", gap: "2.5px" }}
              aria-hidden="true"
            >
              {["#E0574B", "#E3B04B", "#E0574B", "#E3B04B", "#6FAE7C", "#E3B04B", "#E0574B", "#E3B04B", "#E0574B"].map(
                (c, i) => (
                  <div key={i} className="size-[9px] rounded-sm" style={{ background: c }} />
                ),
              )}
            </div>
            <h3 className="font-medium text-[19px] mb-1.5">{t.home.features[2].title}</h3>
            <p className="text-[14.5px] leading-[1.55] text-cocoa m-0">{t.home.features[2].body}</p>
          </div>
        </div>
      </SectionShell>

      {/* ---------------- faq ---------------- */}
      <SectionShell className="pb-[72px]">
        <section id="faq" className="scroll-mt-28">
          <div className="text-center mb-9">
            <div className="font-hand text-base text-quill">{t.home.faqKicker}</div>
            <h2 className="text-[28px] sm:text-[32px] mt-1.5 mb-0">{t.home.faqTitle}</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {t.home.faq.map((item) => (
              <div
                key={item.q}
                className="bg-linen border-2 border-dashed border-edge-5 rounded-[16px] p-6"
              >
                <h3 className="font-medium text-[18px] mb-2">{item.q}</h3>
                <p className="text-[14.5px] leading-[1.6] text-clay m-0">{item.a}</p>
              </div>
            ))}
          </div>

          <p className="text-center mt-8 mb-0">
            <Link
              to={paths.faq}
              className="inline-flex items-center min-h-11 text-[15px] font-bold text-coral-deep hover:text-coral-deeper transition-colors"
            >
              {t.home.faqMore} →
            </Link>
          </p>
        </section>
      </SectionShell>

      {/* ---------------- closing CTA ---------------- */}
      <SectionShell className="pb-[72px]">
        <div className="aida [--aida-size:14px] [--aida-ink:.06] bg-[#F7F1E5] border-[2.5px] border-dashed border-coral-dash rounded-[24px] px-6 py-12 sm:p-13 text-center">
          <div className="font-hand text-[17px] text-quill mb-2">{t.home.ctaKicker}</div>
          <h2 className="text-[28px] sm:text-[34px] mt-0 mb-6">{t.home.ctaTitle}</h2>
          <Button asChild size="lg">
            <Link to={paths.convert}>{t.home.ctaButton}</Link>
          </Button>
        </div>
      </SectionShell>
    </>
  )
}
