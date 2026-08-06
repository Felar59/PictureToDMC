import { useEffect, useMemo, useState, type ReactNode } from "react"

import type { Copy, Lang } from "./copy"
import { fr } from "./fr"
import { I18nContext, type I18nValue } from "."

const STORAGE_KEY = "ptd.lang"

// Safari in private mode throws on localStorage access, and a language
// preference is never worth breaking the page over.
function readStored(): Lang | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === "fr" || v === "en" ? v : null
  } catch {
    return null
  }
}

function store(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    /* the preference just won't persist */
  }
}

function detect(): Lang {
  return readStored() ?? (navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en")
}

/**
 * The English copy, fetched rather than bundled.
 *
 * The two dictionaries together were 52 kB of the first bundle every visitor
 * downloads, and half of that was a language they would never read. French stays
 * static — it is the default, the URLs are French and so is the audience — and
 * this is the other one.
 *
 * Started here at module scope rather than inside an effect: at this point the app
 * bundle is still evaluating, so the request goes out before React has mounted
 * anything and travels alongside the route chunk and the fonts. By the time there
 * is a frame to paint it has usually already arrived.
 */
let englishPromise: Promise<{ en: Copy }> | null = null

function loadEnglish(): Promise<{ en: Copy }> {
  englishPromise ??= import("./en")
  return englishPromise
}

if (typeof navigator !== "undefined" && detect() === "en") void loadEnglish()

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detect)
  const [english, setEnglish] = useState<Copy | null>(null)

  useEffect(() => {
    store(lang)
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    if (lang !== "en" || english) return
    let cancelled = false
    void loadEnglish().then((m) => {
      if (!cancelled) setEnglish(m.en)
    })
    return () => {
      cancelled = true
    }
  }, [lang, english])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      // French while English is still in flight, rather than nothing at all.
      //
      // Two reasons to show the other language for a moment instead of an empty
      // page. A crawler is the visitor most likely to take this path — its
      // Accept-Language is usually English — and French is what the URL, the
      // static HTML and the canonical all say this page is, so answering in French
      // straight away is the truthful thing as well as the quick one. And someone
      // who switches language already has the whole page in front of them; a beat
      // of blank would read as the site having broken.
      t: lang === "en" ? (english ?? fr) : fr,
      setLang,
      toggleLang: () => setLang((l) => (l === "fr" ? "en" : "fr")),
    }),
    [lang, english],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
