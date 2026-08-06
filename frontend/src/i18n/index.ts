import { createContext, useContext } from "react"
import type { Copy, Lang } from "./copy"

export type I18nValue = {
  lang: Lang
  /** The active dictionary. Access it as an object: `t.home.ctaUpload`. */
  t: Copy
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>")
  return ctx
}

export type { Lang, Copy }
