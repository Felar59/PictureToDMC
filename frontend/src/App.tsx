import { Suspense, lazy, useEffect } from "react"
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"

import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { I18nProvider } from "@/i18n/provider"
import Home from "@/routes/home"

// Split per route. /convert drags in the whole engine — k-means, the Lab
// conversions and the 589-thread chart — which the landing page never touches;
// bundled together, every first visit downloaded it anyway. Home stays eager
// because it is what most people land on.
const Convert = lazy(() => import("@/routes/convert"))
const Gallery = lazy(() => import("@/routes/gallery"))
const NotFound = lazy(() => import("@/routes/not-found"))

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
      <BrowserRouter>
        <ScrollManager />
        <div className="min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">
            {/* Linen rather than a spinner: the chunk arrives in a few hundred
                milliseconds on any real connection, and a flash of spinner
                reads worse than a beat of nothing. */}
            <Suspense fallback={<div className="min-h-[60vh]" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/convert" element={<Convert />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <SiteFooter />
        </div>
      </BrowserRouter>
    </I18nProvider>
  )
}
