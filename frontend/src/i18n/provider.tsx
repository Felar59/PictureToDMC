import { useEffect, useMemo, useState, type ReactNode } from "react"

import { dictionaries, type Lang } from "./dictionary"
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

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detect)

  useEffect(() => {
    store(lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      t: dictionaries[lang],
      setLang,
      toggleLang: () => setLang((l) => (l === "fr" ? "en" : "fr")),
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
