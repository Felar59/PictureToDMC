import { Link } from "react-router-dom"

import { PhotoSlot } from "@/components/brand/photo-slot"
import { ThreadArrow } from "@/components/brand/icons"
import { PixelGrid } from "@/components/brand/pixel-grid"
import { Button } from "@/components/ui/button"
import { StatusPill } from "@/components/ui/pill"
import { useI18n } from "@/i18n"
import { BERRY_COLS, berry, demoThreads } from "@/lib/pixel-art"

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
  const { t } = useI18n()

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
                <Link to="/convert">{t.home.ctaUpload}</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/gallery">{t.home.ctaSample}</Link>
              </Button>
            </div>

            <p className="font-hand text-[15px] text-sand mt-[22px] mb-0">{t.home.heroNote}</p>
          </div>

          {/* The transformation itself, rather than a description of it.
              Container query, not a viewport breakpoint: this panel sits in a
              grid column whose width doesn't track the viewport, so it has to
              decide its own layout. Side by side when the photo, the arrow and
              the pattern genuinely fit; stacked with the arrow turned to point
              down when they don't. */}
          <div className="@container bg-blanc rounded-[24px] shadow-panel p-7 flex flex-col gap-[18px]">
            {/* 160 + 42 + 16x9 grid + gaps ~= 406px, so the row fits from a
                26rem container up. The design's own 196px slot needed 473px,
                which never fitted this column at any viewport. */}
            <div className="flex flex-col @min-[26rem]:flex-row items-center justify-center gap-4">
              <div className="text-center">
                <Link to="/convert" aria-label={t.home.ctaUpload}>
                  <PhotoSlot
                    caption={t.home.demoPhotoPlaceholder}
                    className="size-[160px] transition-colors hover:border-coral"
                  />
                </Link>
                <div className="text-[12.5px] font-bold text-sand mt-2">{t.home.demoPhoto}</div>
              </div>

              <ThreadArrow className="rotate-90 @min-[26rem]:rotate-0" />

              <div className="text-center">
                <div className="bg-aida rounded-[16px] p-2.5 shadow-[inset_0_0_0_1.5px_var(--color-edge-4)]">
                  <PixelGrid pixels={berry} cols={BERRY_COLS} size={9} radius={2} />
                </div>
                <div className="text-[12.5px] font-bold text-sand mt-2">{t.home.demoPattern}</div>
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
                  title={`DMC ${th.code} · ${th.name}`}
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
        </section>
      </SectionShell>

      {/* ---------------- closing CTA ---------------- */}
      <SectionShell className="pb-[72px]">
        <div className="aida [--aida-size:14px] [--aida-ink:.06] bg-[#F7F1E5] border-[2.5px] border-dashed border-coral-dash rounded-[24px] px-6 py-12 sm:p-13 text-center">
          <div className="font-hand text-[17px] text-quill mb-2">{t.home.ctaKicker}</div>
          <h2 className="text-[28px] sm:text-[34px] mt-0 mb-6">{t.home.ctaTitle}</h2>
          <Button asChild size="lg">
            <Link to="/convert">{t.home.ctaButton}</Link>
          </Button>
        </div>
      </SectionShell>
    </>
  )
}
