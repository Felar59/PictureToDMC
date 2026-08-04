import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/community/user-menu"
import { paths } from "@/lib/routes"
import { LanguageSwitch } from "./language-switch"

type NavItem = { to: string; label: string }

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "text-[15.5px] font-bold transition-colors",
        // A short rounded bar under the label, not a wavy underline. Wavy is what
        // every browser and word processor uses for a misspelling, so the active
        // link looked like a typo the site had failed to notice.
        active
          ? "text-coral-deep relative after:absolute after:-bottom-[7px] after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-coral"
          : "text-cocoa hover:text-coral-deep",
      )}
    >
      {item.label}
    </Link>
  )
}

export function SiteHeader() {
  const { t } = useI18n()
  const { pathname, hash } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Never leave the mobile sheet open across a navigation.
  useEffect(() => setMenuOpen(false), [pathname, hash])

  // Gallery first: it is the only one that goes somewhere, and finished pieces are
  // a better argument for the product than an explanation of it.
  const items: NavItem[] = [
    { to: paths.gallery, label: t.nav.gallery },
    { to: "/#how-it-works", label: t.nav.howItWorks },
    { to: paths.guide, label: t.nav.guide },
    { to: paths.faq, label: t.nav.faq },
    { to: paths.about, label: t.nav.about },
  ]

  const isActive = (to: string) =>
    to.startsWith("/#") ? pathname === "/" && hash === to.slice(1) : pathname === to

  /**
   * Where the page itself owns a coral action, this one steps back.
   *
   * The header is `sticky top-0`, so its button is not merely somewhere on the
   * page — it is permanently on screen. Coral is the one colour allowed to ask
   * for a click and there is never meant to be a second, so on the converter and
   * on a published piece the page's own primary action was competing with a
   * navigation link the whole time. On the converter it is worse than competing:
   * "Start a pattern" points at the page you are already on.
   */
  const onConverter = pathname === paths.convert
  const ctaVariant = pathname.startsWith("/piece/") ? "secondary" : "primary"

  return (
    <header className="bg-blanc border-b-2 border-dashed border-edge-2 sticky top-0 z-40">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-11 py-4 flex items-center justify-between gap-4">
        <Link to="/" aria-label="Picture to DMC" className="shrink-0">
          <Logo variant="nav" />
        </Link>

        <nav className="hidden lg:flex gap-8" aria-label={t.nav.menu}>
          {items.map((item) => (
            <NavLink key={item.to} item={item} active={isActive(item.to)} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitch className="hidden lg:inline-flex" />
          <UserMenu className="hidden sm:block" />
          {!onConverter && (
            <Button
              asChild
              size="sm"
              variant={ctaVariant}
              className="hidden sm:inline-flex text-[15px] px-[22px] py-[11px]"
            >
              <Link to={paths.convert}>{t.nav.start}</Link>
            </Button>
          )}

          <button
            type="button"
            className="lg:hidden flex flex-col items-center justify-center gap-1 size-11 -mr-2 cursor-pointer"
            aria-label={t.nav.menu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="block w-[22px] h-[3px] rounded-sm bg-cocoa" />
            <span className="block w-[22px] h-[3px] rounded-sm bg-cocoa" />
            <span className="block w-[22px] h-[3px] rounded-sm bg-cocoa" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t-2 border-dashed border-edge-2 bg-blanc px-5 sm:px-8 py-5 flex flex-col gap-5 animate-stitch-in">
          <nav className="flex flex-col gap-4" aria-label={t.nav.menu}>
            {items.map((item) => (
              <NavLink key={item.to} item={item} active={isActive(item.to)} />
            ))}
          </nav>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <UserMenu />
            <LanguageSwitch />
            {!onConverter && (
              <Button asChild size="sm" variant={ctaVariant}>
                <Link to={paths.convert}>{t.nav.start}</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
