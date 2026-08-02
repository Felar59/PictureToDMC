import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

import { Logo } from "@/components/brand/logo"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"
import { LanguageSwitch } from "./language-switch"

type NavItem = { to: string; label: string }

function NavLink({ item, active, onClick }: { item: NavItem; active: boolean; onClick?: () => void }) {
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={cn(
        "text-[15.5px] font-bold transition-colors",
        active
          ? "text-coral-deep [text-decoration:underline_wavy_var(--color-golden)_2px] [text-underline-offset:6px]"
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

  const items: NavItem[] = [
    { to: "/#how-it-works", label: t.nav.howItWorks },
    { to: "/gallery", label: t.nav.gallery },
    { to: "/#faq", label: t.nav.faq },
  ]

  const isActive = (to: string) =>
    to.startsWith("/#") ? pathname === "/" && hash === to.slice(1) : pathname === to

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
          <LanguageSwitch className="hidden sm:inline-flex" />
          <Button asChild size="sm" className="hidden sm:inline-flex text-[15px] px-[22px] py-[11px]">
            <Link to="/convert">{t.nav.start}</Link>
          </Button>

          <button
            type="button"
            className="lg:hidden flex flex-col gap-1 p-2 cursor-pointer"
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
            <LanguageSwitch />
            <Button asChild size="sm">
              <Link to="/convert">{t.nav.start}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
