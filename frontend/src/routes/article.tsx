import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { useHead } from "@/lib/head"
import { SITE_SHORT } from "@/lib/site"
import { ARTICLES, type ArticleKey } from "@/lib/articles"
import { paths } from "@/lib/routes"
import { articleGraph } from "@/lib/schema"

/**
 * The content pages, all three of them.
 *
 * One component rather than three files that would differ only in which object they
 * read — and the day a fourth is written it is a row in `lib/articles.ts` and a
 * block of copy, not another near-copy of this.
 *
 * The shape is the same as the guide's on purpose: kicker, heading, lead, an
 * introduction that answers the question in one paragraph for the half of readers
 * who will not scroll, then the sections. What is different is the foot — every one
 * of these links to the other two. That is the whole point of writing more than one:
 * a page with no way out is a page a crawler visits once, and a reader who arrived
 * from a search for "quelle toile" very often has the next question already.
 */
export default function Article({ which }: { which: ArticleKey }) {
  const { t, lang } = useI18n()
  const meta = ARTICLES[which]
  const copy = t.articles[which]

  useHead({
    title: `${copy.title} — ${SITE_SHORT}`,
    description: copy.lead,
    canonicalPath: meta.path,
    jsonLd: articleGraph(t, lang, which),
  })

  return (
    <div className="mx-auto max-w-[780px] px-5 sm:px-8 lg:px-11 py-12 lg:py-16">
      <div className="text-center">
        <div className="font-hand text-base text-quill">{copy.kicker}</div>
        <h1 className="text-[32px] sm:text-[40px] leading-[1.12] mt-2 mb-5">{copy.title}</h1>
        <p className="text-[18px] leading-[1.65] text-clay m-0 mx-auto max-w-[620px]">
          {copy.lead}
        </p>
      </div>

      {/* The answer, before the detail. Somebody who reads one paragraph and leaves
          should still have been told the thing they came for. */}
      <p className="text-[17px] leading-[1.75] text-clay mt-10 mb-0">{copy.intro}</p>

      <div className="mt-10 flex flex-col gap-9">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-[22px] m-0 mb-3">{section.heading}</h2>
            <p className="text-[16.5px] leading-[1.75] text-clay m-0">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-14 pt-8 border-t-2 border-dashed border-edge-2">
        <h2 className="text-[19px] m-0 mb-4">{t.articles.relatedHeading}</h2>
        <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
          {meta.related.map((key) => (
            <li key={key}>
              <Link
                to={key === "guide" ? paths.guide : ARTICLES[key as ArticleKey].path}
                className="text-[16.5px] text-coral-deep hover:text-coral-deeper underline-offset-4 hover:underline"
              >
                {key === "guide" ? t.guide.title : t.articles[key as ArticleKey].title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-10 text-center border-2 border-dashed border-edge-4 rounded-card-lg px-6 py-9">
        <h2 className="text-[24px] m-0 mb-2">{t.articles.ctaTitle}</h2>
        <p className="text-[16.5px] text-clay m-0 mb-6">{t.articles.ctaBody}</p>
        <Button asChild size="lg">
          <Link to={paths.convert}>{t.articles.ctaButton}</Link>
        </Button>
      </div>
    </div>
  )
}
