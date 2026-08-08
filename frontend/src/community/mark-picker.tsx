import { StitchAvatar } from "@/components/brand/stitch-avatar"
import { MARK_GROUPS, MARK_PREFIX, type MarkGroup } from "@/components/brand/marks"
import { useI18n } from "@/i18n"
import { cn } from "@/lib/utils"

/**
 * Choosing a mark.
 *
 * Grouped by subject and picked by eye, with no label on any individual mark.
 * That is not laziness: at 56 squares a flower is plainly a flower but the
 * difference between a peony and an aster is gone, and a caption naming the wrong
 * one is worse than no caption. The groups are labelled because the groups are
 * true.
 *
 * The account's own drawn mark comes first and is always there. It is what
 * everybody starts with, it is the only one that is *theirs* rather than chosen
 * from a shelf, and leaving it out would make picking a picture feel compulsory.
 *
 * Radios, not buttons. This is one choice among many with exactly one answer,
 * which is what a radio group is, and it means arrow keys move between marks and
 * a screen reader says "3 sur 18" instead of reading eighteen unlabelled images.
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
          // Visually gone, still focusable and still announced — the ring below
          // is drawn from :focus-visible on the input via peer state.
          className="peer sr-only"
        />
        <StitchAvatar
          seed={seed}
          size={52}
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
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[13px] font-bold text-cocoa mb-2">{t.account.marks.mine}</div>
        <div className="flex flex-wrap gap-1.5">
          <Option icon={null} seed={userId} label={t.account.marks.mine} />
        </div>
      </div>

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
                // Numbered rather than named, for the reason in the note above.
                label={t.account.marks.option(t.account.marks.groups[group], i + 1)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
