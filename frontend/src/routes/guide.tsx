import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { useHead } from "@/lib/head"
import { ARTICLE_KEYS, ARTICLES } from "@/lib/articles"
import { paths } from "@/lib/routes"
import { guideGraph } from "@/lib/schema"

/**
 * The guide: how to get from a photograph to something in a hoop.
 *
 * The page that earns links, and the only one on the site that answers the whole
 * question rather than a part of it. "Comment faire une grille de point de croix" is
 * what somebody types before they know a tool like this exists — so this is written
 * for a reader who has never done it, and the converter is the answer at the end
 * rather than the assumption at the start.
 *
 * Numbered steps here, unlike the About page's blocks, because this genuinely is a
 * sequence: choosing a width before choosing a photograph is the wrong order, and the
 * numbers say so.
 */
export default function Guide() {
  const { t } = useI18n()

  useHead({
    title: `${t.guide.title} — Picture to DMC`,
    description: t.guide.lead,
    /**
     * HowTo earns nothing from Google — those rich results were removed in
     * September 2023 and have not come back. It is kept for the same reason as the
     * FAQ graph next door: still valid, still read by everything that is not
     * Google, and it states in one machine-readable place that this page is a
     * procedure with ordered steps rather than an article that happens to have
     * headings.
     */
    jsonLd: guideGraph(t),
  })

  return (
    <div className="mx-auto max-w-[780px] px-5 sm:px-8 lg:px-11 py-12 lg:py-16">
      <div className="text-center">
        <div className="font-hand text-base text-quill">{t.guide.kicker}</div>
        <h1 className="text-[32px] sm:text-[40px] leading-[1.12] mt-2 mb-5">{t.guide.title}</h1>
        <p className="text-[18px] leading-[1.65] text-clay m-0 mx-auto max-w-[620px]">
          {t.guide.lead}
        </p>
      </div>

      <p className="text-[17px] leading-[1.75] text-clay mt-10 mb-0">{t.guide.intro}</p>

      <ol className="list-none p-0 mt-10 mb-0 flex flex-col gap-5">
        {t.guide.steps.map((step, i) => (
          <li
            key={step.heading}
            className="bg-blanc rounded-card shadow-card-sm p-6 sm:p-7 flex gap-5 items-start"
          >
            <span className="font-display font-semibold text-[20px] shrink-0 size-11 rounded-full border-2 border-dashed border-coral-edge bg-coral-wash text-coral-deep flex items-center justify-center">
              {i + 1}
            </span>
            <div className="min-w-0">
              <h2 className="text-[20px] m-0 mb-2">{step.heading}</h2>
              <p className="text-[16.5px] leading-[1.7] text-clay m-0">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* The three pages that each answer one of this guide's steps in full.
          Here rather than in the header: the guide is where somebody already
          reading about the process is, and it is the page most likely to be
          entered from a search — so it is the right place to hand over. */}
      <div className="mt-14 pt-8 border-t-2 border-dashed border-edge-2">
        <h2 className="text-[19px] m-0 mb-4">{t.articles.relatedHeading}</h2>
        <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
          {ARTICLE_KEYS.map((key) => (
            <li key={key}>
              <Link
                to={ARTICLES[key].path}
                className="text-[16.5px] text-coral-deep hover:text-coral-deeper underline-offset-4 hover:underline"
              >
                {t.articles[key].title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 text-center border-2 border-dashed border-edge-4 rounded-card-lg px-6 py-9">
        <h2 className="text-[24px] m-0 mb-2">{t.guide.ctaTitle}</h2>
        <p className="text-[16.5px] text-clay m-0 mb-6">{t.guide.ctaBody}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to={paths.convert}>{t.guide.ctaButton}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to={paths.faq}>{t.nav.faq}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
