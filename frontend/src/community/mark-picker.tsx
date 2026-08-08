import { useEffect, useRef, useState } from "react"

import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { Chevron } from "@/components/brand/icons"
import { MARK_GROUPS, MARK_PREFIX, type MarkGroup } from "@/components/brand/marks"
import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"

/**
 * Choosing a mark, from behind a closed door.
 *
 * Eighteen marks laid out flat pushed the save button off the screen on a laptop
 * and made the account page mostly avatars. So the page shows the one you have,
 * and the rest arrive when you ask for them.
 *
 * Not a `<select>`, despite being a dropdown: the whole content of each option is
 * a picture, and a native select can only hold text. This is the other kind of
 * dropdown — a disclosure holding a radio group — which keeps the one-of-many
 * semantics a select would have given, keeps arrow keys moving between marks, and
 * can actually show them.
 *
 * No mark is named individually. At 56 squares a flower is plainly a flower but
 * the difference between a dahlia and a peony is gone, and a caption naming the
 * wrong one is worse than no caption. The groups are named because the groups are
 * true.
 *
 * The drawn mark — the woven motif seeded from the account — is not among the
 * choices. Every member now has a picture, given at signup or backfilled at boot,
 * so offering the drawn one would be offering a second kind of thing that nobody
 * has. `StitchAvatar` still knows how to draw it: it is the fallback when a mark
 * is withdrawn or a row somehow has none, which is a rendering concern rather
 * than a choice.
 */
export function MarkPicker({
  userId,
  value,
  onChange,
  disabled,
}: {
  /** For the drawn mark, which is seeded from the account rather than chosen. */
  userId: number
  /** The stored `icon`, or null for the drawn mark. */
  value: string | null
  onChange: (icon: string | null) => void
  disabled?: boolean
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  // Escape closes it and puts focus back, which is the one thing a disclosure
  // has to do that a `<details>` does not do on its own.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const Option = ({
    icon,
    seed,
    label,
  }: {
    icon: string | null
    seed: string | number
    label: string
  }) => {
    const selected = value === icon
    return (
      <label
        className={cn(
          "relative cursor-pointer rounded-card p-1.5 transition-colors",
          selected ? "bg-coral-wash" : "hover:bg-linen",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          type="radio"
          name="member-mark"
          checked={selected}
          disabled={disabled}
          onChange={() => onChange(icon)}
          className="peer sr-only"
        />
        <StitchAvatar
          seed={seed}
          size={48}
          className={cn(
            "transition-shadow",
            selected
              ? "shadow-[0_0_0_2.5px_var(--color-coral)]"
              : "shadow-[0_0_0_1.5px_var(--color-edge-3)]",
            "peer-focus-visible:shadow-[0_0_0_3px_var(--color-coral)]",
          )}
        />
        <span className="sr-only">{label}</span>
      </label>
    )
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={disabled}
        aria-expanded={open}
        aria-controls="mark-panel"
        className={cn(
          "w-full flex items-center gap-3 bg-blanc border-2 border-edge-3 rounded-card px-3 py-2.5",
          "hover:border-coral transition-colors text-left min-h-14",
          disabled && "opacity-60 cursor-not-allowed",
        )}
      >
        {/* The mark you have now, at the size it appears on a card, so the
            preview is the thing rather than a description of it. */}
        <StitchAvatar seed={value ?? userId} size={40} />
        <span className="flex-1 min-w-0">
          <span className="block text-[14.5px] font-bold text-ink">
            {t.account.marks.heading}
          </span>
          <span className="block text-[13px] text-stone">{t.account.marks.change}</span>
        </span>
        <Chevron
          size={11}
          className={cn("text-cocoa transition-transform mr-1", open ? "-rotate-90" : "rotate-90")}
        />
      </button>

      {open && (
        <div
          id="mark-panel"
          ref={panelRef}
          className="mt-2 bg-blanc border-2 border-edge-3 rounded-card p-4 flex flex-col gap-4 max-h-[340px] overflow-y-auto"
        >
          {(["flowers", "animals"] as MarkGroup[]).map((group) => (
            <div key={group}>
              <div className="text-[13px] font-bold text-cocoa mb-2">
                {t.account.marks.groups[group]}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {MARK_GROUPS[group].map((slug, i) => (
                  <Option
                    key={slug}
                    icon={`${MARK_PREFIX}${slug}`}
                    seed={`${MARK_PREFIX}${slug}`}
                    label={t.account.marks.option(t.account.marks.groups[group], i + 1)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
