import { Suspense, lazy, useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { useAuth } from "@/community/auth-context"
import { AuthProvider } from "@/community/auth-provider"
import { I18nProvider } from "@/i18n/provider"
import { legacyRedirects, paths } from "@/lib/routes"
import Home from "@/routes/home"

// Split per route. /convert drags in the whole engine — k-means, the Lab
// conversions and the 589-thread chart — which the landing page never touches;
// bundled together, every first visit downloaded it anyway. Home stays eager
// because it is what most people land on.
const About = lazy(() => import("@/routes/about"))
const Faq = lazy(() => import("@/routes/faq"))
const Guide = lazy(() => import("@/routes/guide"))
const Account = lazy(() => import("@/routes/account"))
// Not linked from anywhere: the bench for tuning the fabric shader.
const Atelier = lazy(() => import("@/routes/atelier"))
const Convert = lazy(() => import("@/routes/convert"))
const Gallery = lazy(() => import("@/routes/gallery"))
const NotFound = lazy(() => import("@/routes/not-found"))
const Piece = lazy(() => import("@/routes/piece"))
const Profile = lazy(() => import("@/routes/profile"))

/**
 * A brand-new account is sent to /compte once.
 *
 * It carries whatever name Google reported, which plenty of people do not want on
 * a craft gallery, so the choice is offered the first time and never again — the
 * server records it, so this cannot loop. A redirect rather than a dialog, because
 * the account page is a page now: it can be linked to, reloaded and gone back
 * from, none of which a modal manages.
 */
function AccountSetup() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.setUp) return
    if (pathname === "/compte") return
    void navigate("/compte?bienvenue", { replace: true })
  }, [user, pathname, navigate])

  return null
}

/** Top of the page on navigation, the anchor when there's a hash. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // The target section may not be mounted on the very first paint.
    const raf = requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" })
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
      <BrowserRouter>
        <ScrollManager />
        <AccountSetup />
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">
            {/* Linen rather than a spinner: the chunk arrives in a few hundred
                milliseconds on any real connection, and a flash of spinner
                reads worse than a beat of nothing. */}
            <Suspense fallback={<div className="min-h-[60vh]" />}>
              <Routes>
                {/* French, intent-specific paths. The URL is the first thing both a
                    reader and a crawler are told about a page, and "/convert" told
                    neither of them anything — see lib/routes.ts. */}
                <Route path={paths.home} element={<Home />} />
                <Route path={paths.convert} element={<Convert />} />
                <Route path={paths.gallery} element={<Gallery />} />
                <Route path={paths.about} element={<About />} />
                <Route path={paths.faq} element={<Faq />} />
                <Route path={paths.guide} element={<Guide />} />
                <Route path={paths.atelier} element={<Atelier />} />
                <Route path={paths.account} element={<Account />} />
                <Route path="/piece/:id" element={<Piece />} />
                <Route path="/brodeur/:id" element={<Profile />} />

                {/* The English paths that shipped first. They are in browser
                    histories, and a redirect costs three lines where a 404 costs
                    somebody their bookmark. `replace` so the back button does not
                    bounce between the two. */}
                {legacyRedirects.map(([from, to]) => (
                  <Route key={from} path={from} element={<Navigate to={to} replace />} />
                ))}

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <SiteFooter />
        </div>
      </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  )
}
