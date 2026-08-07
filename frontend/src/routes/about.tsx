import { Link } from "react-router-dom"

import { StitchMark } from "@/components/brand/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { paths } from "@/lib/routes"
import { useHead } from "@/lib/head"
import { ORG_ID, breadcrumb, graph } from "@/lib/schema"
import { SITE_NAME } from "@/lib/site"

/**
 * Who is behind the site.
 *
 * The copy is a placeholder and is meant to be replaced — but it is written as
 * something a person might actually say, not as lorem ipsum, because a page can
 * only be judged as a page. Four claims in the order a stranger asks them: where
 * it came from, whether the colours are real, what it costs, and where the
 * photograph goes.
 *
 * Numbered eyebrows would be wrong here — this is not a sequence, and the numbers
 * would imply an order the reader has to follow. The blocks are a stack of
 * separate statements, each with its own stitch mark, so any one of them can be
 * read on its own.
 */
export default function About() {
  const { t } = useI18n()

  useHead({
    title: t.head.about.title,
    description: t.aboutPage.lead,
    // AboutPage, pointing at the same organisation node the home page defines
    // rather than describing it again in slightly different words here.
    jsonLd: graph(
      {
        "@type": "AboutPage",
        name: t.aboutPage.title,
        description: t.aboutPage.lead,
        mainEntity: { "@id": ORG_ID },
      },
      breadcrumb([
        { name: SITE_NAME, path: paths.home },
        { name: t.nav.about, path: paths.about },
      ]),
    ),
  })

  return (
    <div className="mx-auto max-w-[820px] px-5 sm:px-8 lg:px-11 py-12 lg:py-16">
      <div className="text-center">
        <div className="font-hand text-base text-quill">{t.aboutPage.kicker}</div>
        <h1 className="text-[34px] sm:text-[42px] leading-[1.1] mt-2 mb-5">
          {t.aboutPage.title}
        </h1>
        <p className="text-[18px] leading-[1.65] text-clay m-0 mx-auto max-w-[620px]">
          {t.aboutPage.lead}
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-5">
        {t.aboutPage.blocks.map((block) => (
          <section
            key={block.heading}
            className="bg-blanc rounded-card shadow-card-sm p-6 sm:p-7 flex gap-5 items-start"
          >
            {/* One mark per statement rather than a number — these are not steps. */}
            <StitchMark size={26} className="mt-1 hidden sm:block" />
            <div>
              <h2 className="text-[20px] m-0 mb-2">{block.heading}</h2>
              <p className="text-[16.5px] leading-[1.7] text-clay m-0">{block.body}</p>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 text-center border-2 border-dashed border-edge-4 rounded-card-lg px-6 py-9">
        <h2 className="text-[24px] m-0 mb-2">{t.aboutPage.ctaTitle}</h2>
        <p className="text-[16.5px] text-clay m-0 mb-6">{t.aboutPage.ctaBody}</p>
        <Button asChild size="lg">
          <Link to={paths.convert}>{t.aboutPage.ctaButton}</Link>
        </Button>
      </div>
    </div>
  )
}
