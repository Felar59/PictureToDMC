import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"
import type { Lang } from "@/i18n/dictionary"

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
]

/** Two-segment pill. Small, quiet — it should never compete with the CTA. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n()

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-linen border-[1.5px] border-edge-3 p-[3px]",
        className,
      )}
      role="group"
      aria-label={t.lang.label}
    >
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLang(o.code)}
          aria-pressed={lang === o.code}
          className={cn(
            "font-display text-[13px] font-medium px-3 py-1.5 rounded-full cursor-pointer transition-colors min-w-[38px]",
            lang === o.code
              ? "bg-ink text-blanc"
              : "text-cocoa hover:text-coral-deep",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
