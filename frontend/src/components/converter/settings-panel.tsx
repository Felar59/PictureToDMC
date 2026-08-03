import { FieldLabel, PanelTitle, Readout, SubPanel } from "@/components/ui/card"
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
  flipH: boolean
  flipV: boolean
  removeBackground: boolean
}

export function SettingsPanel({
  settings,
  onChange,
  /** Grid size and stitch totals — the answer to "what am I getting". */
  summary,
}: {
  settings: Settings
  onChange: (patch: Partial<Settings>) => void
  summary: React.ReactNode
}) {
  const { t } = useI18n()
  const step = VIVIDNESS_STEPS.indexOf(settings.vividness as (typeof VIVIDNESS_STEPS)[number])

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
                  onClick={() => onChange({ vividness: VIVIDNESS_STEPS[i] })}
                  className="flex-1 px-2 text-[13px]"
                >
                  {label}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel className="block mb-2">{t.converter.retouch.mirror}</FieldLabel>
            <div className="flex gap-1.5">
              <Pill
                selected={settings.flipH}
                onClick={() => onChange({ flipH: !settings.flipH })}
                className="flex-1 px-2 text-[13px]"
              >
                <span aria-hidden="true" className="mr-1">
                  ⇄
                </span>
                {t.converter.retouch.mirrorH}
              </Pill>
              <Pill
                selected={settings.flipV}
                onClick={() => onChange({ flipV: !settings.flipV })}
                className="flex-1 px-2 text-[13px]"
              >
                <span aria-hidden="true" className="mr-1">
                  ⇅
                </span>
                {t.converter.retouch.mirrorV}
              </Pill>
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
              onCheckedChange={(v) => onChange({ removeBackground: v })}
            />
          </label>
        </div>
      </details>
    </SubPanel>
  )
}
