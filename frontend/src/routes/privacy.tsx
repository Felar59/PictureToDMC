import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { useHead } from "@/lib/head"
import { paths } from "@/lib/routes"
import { privacyGraph } from "@/lib/schema"

/**
 * What the site knows about you.
 *
 * Required before ads can go anywhere near this site, and required anyway: there
 * are Google sign-ins, e-mail addresses and a session cookie, and the audience is
 * in France. There was already a `footer.privacy` string in both dictionaries
 * pointing at a page nobody had written.
 *
 * Written from the code rather than from a template — `db.py` for what is stored,
 * `auth.py` for the cookie and its 180 days, `google.py` for the scopes actually
 * requested. A privacy page that describes a different system from the one running
 * is worse than none, because it is a promise made in public.
 *
 * It also happens to be the best sales page on the site, which is why it reads like
 * prose and not like terms: the central claim is one no paying competitor can make,
 * and anybody can check it by cutting their connection and converting a photo
 * anyway.
 */
export default function Privacy() {
  const { t } = useI18n()

  useHead({
    title: `${t.privacyPage.title} — Picture to DMC`,
    description: t.privacyPage.lead,
    jsonLd: privacyGraph(t),
  })

  return (
    <div className="mx-auto max-w-[780px] px-5 sm:px-8 lg:px-11 py-12 lg:py-16">
      <div className="text-center">
        <div className="font-hand text-base text-quill">{t.privacyPage.kicker}</div>
        <h1 className="text-[34px] sm:text-[42px] leading-[1.1] mt-2 mb-5">
          {t.privacyPage.title}
        </h1>
        <p className="text-[18px] leading-[1.65] text-clay m-0 mx-auto max-w-[620px]">
          {t.privacyPage.lead}
        </p>
        {/* The date is part of the promise: a policy with no date cannot be told
            apart from one nobody has looked at since it was written. */}
        <p className="font-hand text-[14px] text-sand mt-4 mb-0">{t.privacyPage.updated}</p>
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {t.privacyPage.blocks.map((block) => (
          <section key={block.heading}>
            <h2 className="text-[22px] m-0 mb-3">{block.heading}</h2>
            <p className="text-[16.5px] leading-[1.7] text-clay m-0">{block.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 border-2 border-dashed border-edge-4 rounded-card-lg px-6 py-8">
        <h2 className="text-[22px] m-0 mb-3">{t.privacyPage.contactHeading}</h2>
        <p className="text-[16.5px] leading-[1.7] text-clay m-0">{t.privacyPage.contactBody}</p>
        {/* Visible on purpose, and only until the two values are filled in. A
            placeholder that looks like finished copy is how "[ADRESSE À COMPLÉTER]"
            ends up live for a year — saying so out loud makes it impossible to miss
            and honest to whoever reads it in the meantime. */}
        <p className="font-hand text-[13.5px] text-sand mt-3 mb-0">{t.privacyPage.contactNote}</p>
      </div>

      <div className="mt-10 text-center">
        <Button asChild variant="secondary">
          <Link to={paths.faq}>{t.nav.faq}</Link>
        </Button>
      </div>
    </div>
  )
}
