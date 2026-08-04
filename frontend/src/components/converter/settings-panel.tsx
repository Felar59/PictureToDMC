import { FieldLabel, PanelTitle, Readout, SubPanel } from "@/components/ui/card"
import { RotateGlyph } from "@/components/brand/icons"
import { Pill } from "@/components/ui/pill"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useI18n } from "@/i18n"

/**
 * The converter's settings.
 *
 * Two decisions are always in view — how wide, how many threads — because they
 * are what you buy fabric and floss against. The three retouches sit behind one
 * disclosure, named by what is inside rather than "Advanced": for someone
 * unsure of themselves, every visible control is a question they feel obliged
 * to answer, so the cost of a busy panel is measured in decisions, not pixels.
 *
 * Vividness is three named steps, not a 0-100 slider. A third slider identical
 * to the two above it forces you to work out which is which, and "60" demands a
 * theory about the units. "Natural / Vivid / Very vivid" demands none.
 */

const VIVIDNESS_STEPS = [0, 55, 100] as const

export type Settings = {
  stitchWidth: number
  colorCount: number
  vividness: number
  /** Quarter turns clockwise: 0, 90, 180, 270. */
  rotation: number
  removeBackground: boolean
}

export function SettingsPanel({
  settings,
  onChange,
  onCommit,
  /** Grid size and stitch totals — the answer to "what am I getting". */
  summary,
}: {
  settings: Settings
  /** Live, for the readouts. Does not rebuild the grid on its own. */
  onChange: (patch: Partial<Settings>) => void
  /**
   * Rebuild now.
   *
   * Split from onChange because a slider fires continuously while dragged, and
   * reconverting on every pixel of travel would queue dozens of runs to show one
   * answer. The number under your thumb follows the drag; the grid follows the
   * release. Anything that is a single click — a vividness step, a quarter turn,
   * the background switch — commits at once, because there is no drag to wait for.
   */
  onCommit: () => void
  summary: React.ReactNode
}) {
  const { t } = useI18n()
  const step = VIVIDNESS_STEPS.indexOf(settings.vividness as (typeof VIVIDNESS_STEPS)[number])
  const commit = (patch: Partial<Settings>) => {
    onChange(patch)
    onCommit()
  }

  return (
    <SubPanel>
      <PanelTitle className="mb-4">{t.converter.settings.heading}</PanelTitle>

      <div className="flex justify-between items-baseline mb-2">
        <FieldLabel>{t.converter.size.stitchesWide}</FieldLabel>
        <Readout>{settings.stitchWidth}</Readout>
      </div>
      <Slider
        value={[settings.stitchWidth]}
        onValueChange={([v]) => onChange({ stitchWidth: v })}
        onValueCommit={onCommit}
        min={20}
        max={200}
        step={2}
        aria-label={t.converter.size.stitchesWide}
      />
      <div className="flex justify-between text-xs text-sand mt-1.5 mb-5">
        <span>20</span>
        <span>200</span>
      </div>

      <div className="flex justify-between items-baseline mb-2">
        <FieldLabel>{t.converter.colors.threadColors}</FieldLabel>
        <Readout>{settings.colorCount}</Readout>
      </div>
      <Slider
        value={[settings.colorCount]}
        onValueChange={([v]) => onChange({ colorCount: v })}
        onValueCommit={onCommit}
        min={2}
        max={20}
        step={1}
        aria-label={t.converter.colors.threadColors}
      />
      <div className="flex justify-between text-xs text-sand mt-1.5 mb-4">
        <span>2</span>
        <span>20</span>
      </div>

      {summary}

      {/* <details> on purpose: keyboard support, screen-reader semantics and the
          open/closed state all come for free, and the disclosure triangle is
          one of the few affordances everybody already knows. */}
      <details className="group mt-4 border-t-2 border-dashed border-edge pt-3">
        <summary className="flex items-center gap-2 cursor-pointer list-none text-[13px] font-extrabold tracking-[.05em] uppercase text-cocoa hover:text-coral-deep">
          <span
            aria-hidden="true"
            className="text-coral-deep transition-transform group-open:rotate-90"
          >
            ▸
          </span>
          {t.converter.retouch.heading}
        </summary>

        <div className="pt-4 flex flex-col gap-4">
          <div>
            <FieldLabel className="block mb-2">{t.converter.retouch.vividness}</FieldLabel>
            <div className="flex gap-1.5">
              {t.converter.retouch.vividnessSteps.map((label, i) => (
                <Pill
                  key={label}
                  selected={step === i}
                  onClick={() => commit({ vividness: VIVIDNESS_STEPS[i] })}
                  className="flex-1 px-2 text-[13px]"
                >
                  {label}
                </Pill>
              ))}
            </div>
          </div>

          {/* One button that turns the picture a quarter at a time, rather than two
              mirror toggles. Turning is what people actually want from a photograph
              held the wrong way up; mirroring is what you want when you have traced
              something, which is not this. The current angle is shown, because four
              presses returning you to where you started should be visible. */}
          <div>
            <FieldLabel className="block mb-2">{t.converter.retouch.rotation}</FieldLabel>
            <div className="flex items-center gap-2.5">
              <Pill
                selected={settings.rotation !== 0}
                onClick={() => commit({ rotation: (settings.rotation + 90) % 360 })}
                className="px-3 text-[13px]"
              >
                <RotateGlyph />
                {t.converter.retouch.rotate90}
              </Pill>
              <span className="font-mono text-[12.5px] text-stone">
                {t.converter.retouch.rotationValue(settings.rotation)}
              </span>
            </div>
          </div>

          <label className="flex items-start justify-between gap-3 cursor-pointer">
            <span>
              <span className="block text-sm font-bold text-bark">
                {t.converter.retouch.removeBg}
              </span>
              {/* Says when it works, rather than promising magic: this finds a
                  plain background, and a cat on a patterned rug will not come
                  out cleanly. */}
              <span className="block text-[12.5px] text-stone leading-snug">
                {t.converter.retouch.removeBgHint}
              </span>
            </span>
            <Switch
              checked={settings.removeBackground}
              onCheckedChange={(v) => commit({ removeBackground: v })}
            />
          </label>
        </div>
      </details>
    </SubPanel>
  )
}
