import { Link } from "react-router-dom"

import { Logo } from "@/components/brand/logo"
import { useI18n } from "@/i18n"
import { paths } from "@/lib/routes"

export function SiteFooter() {
  const { t } = useI18n()

  return (
    <footer className="border-t-2 border-dashed border-edge-4 bg-[#F2EADA] mt-auto">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-20 py-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Logo variant="footer" />
          <span className="font-hand text-sm text-sand">{t.footer.tagline}</span>
        </div>

        {/* The secondary pages live here.
            The header carries the three things somebody arrives wanting — the gallery,
            how to do it, and the questions. Everything else is a footer link, which is
            where people look for it and which a crawler follows just the same. */}
        <nav className="flex flex-wrap gap-6 text-sm font-bold text-cocoa">
          <Link to={paths.guide} className="hover:text-coral-deep transition-colors inline-flex items-center min-h-11 px-1">
            {t.footer.guide}
          </Link>
          <Link to={paths.about} className="hover:text-coral-deep transition-colors inline-flex items-center min-h-11 px-1">
            {t.footer.about}
          </Link>
          <Link to={paths.faq} className="hover:text-coral-deep transition-colors inline-flex items-center min-h-11 px-1">
            {t.footer.faq}
          </Link>
          <a
            href="https://github.com/Felar59"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-coral-deep transition-colors inline-flex items-center min-h-11 px-1"
          >
            {t.footer.contact}
          </a>
        </nav>

        <a
          href="https://github.com/Felar59"
          target="_blank"
          rel="noreferrer noopener"
          className="font-hand text-sm text-sand hover:text-coral-deep transition-colors inline-flex items-center min-h-11"
        >
          {t.footer.madeBy} @Felar
        </a>
      </div>
    </footer>
  )
}
