import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { useHead } from "@/lib/head"
import { paths } from "@/lib/routes"
import { faqGraph } from "@/lib/schema"

/**
 * The FAQ, on its own address.
 *
 * It lived as an anchor on the home page, which meant nobody searching for one of
 * its answers could land on it: an anchor is not a page, it cannot have its own
 * title, and it cannot be the result Google shows. Four questions have become
 * fourteen, grouped, because the shape of the page is what makes a long list
 * readable — and because the questions people actually ask fall into three
 * obvious piles.
 *
 * `<details>` per question rather than a bespoke accordion: keyboard support,
 * screen-reader semantics and the open state come free, and it is one of the very
 * few widgets everyone already knows how to work. All of them stay closed, so the
 * page opens as a scannable list of questions.
 */
export default function Faq() {
  const { t } = useI18n()

  useHead({
    title: `${t.faqPage.title} · ${t.nav.faq} — ${t.site.short}`,
    description: t.faqPage.lead,
    /**
     * This used to say a FAQPage is drawn with its questions expanded in a
     * result. That stopped being true on 7 May 2026, when Google removed FAQ rich
     * results for everyone — so the claim is gone rather than left to mislead the
     * next person who reads it.
     *
     * The markup stays. It is still valid schema.org, Bing and the answer-engine
     * crawlers still read it, and a page of questions and answers marked up as
     * questions and answers is the cheapest way to be quotable. Nobody should
     * expect a richer blue link from it.
     */
    jsonLd: faqGraph(t),
  })

  return (
    <div className="mx-auto max-w-[780px] px-5 sm:px-8 lg:px-11 py-12 lg:py-16">
      <div className="text-center">
        <div className="font-hand text-base text-quill">{t.faqPage.kicker}</div>
        <h1 className="text-[34px] sm:text-[42px] leading-[1.1] mt-2 mb-5">{t.faqPage.title}</h1>
        <p className="text-[18px] leading-[1.65] text-clay m-0 mx-auto max-w-[600px]">
          {t.faqPage.lead}
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-10">
        {t.faqPage.groups.map((group) => (
          <section key={group.heading}>
            <h2 className="text-[22px] m-0 mb-4">{group.heading}</h2>
            <div className="flex flex-col gap-2.5">
              {group.items.map((item) => (
                <details
                  key={item.q}
                  className="group bg-blanc rounded-card shadow-card-sm px-5 sm:px-6"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none py-4 min-h-[56px]">
                    <span className="font-display font-medium text-[17px] text-ink">{item.q}</span>
                    {/* A drawn mark rather than a literal character: a glyph typed
                        into the markup renders in whatever font the system picks,
                        which on Windows is not the one this page is set in. */}
                    <span
                      aria-hidden="true"
                      className="relative shrink-0 mt-1.5 size-3.5 transition-transform group-open:rotate-45"
                    >
                      <span className="absolute inset-x-0 top-1/2 h-[2.5px] -translate-y-1/2 rounded-full bg-coral-deep" />
                      <span className="absolute inset-y-0 left-1/2 w-[2.5px] -translate-x-1/2 rounded-full bg-coral-deep transition-opacity group-open:opacity-100" />
                    </span>
                  </summary>
                  <p className="text-[16px] leading-[1.7] text-clay m-0 pb-5 pr-8">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 text-center border-2 border-dashed border-edge-4 rounded-card-lg px-6 py-9">
        <h2 className="text-[24px] m-0 mb-2">{t.guide.ctaTitle}</h2>
        <p className="text-[16.5px] text-clay m-0 mb-6">{t.guide.ctaBody}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to={paths.convert}>{t.guide.ctaButton}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to={paths.guide}>{t.guide.title}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
