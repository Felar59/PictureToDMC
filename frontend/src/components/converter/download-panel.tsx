import { useState } from "react"

import { DownloadGlyph } from "@/components/brand/icons"
import { Button } from "@/components/ui/button"
import { PanelTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { Pattern } from "@/engine/convert"
import { canvasToBlob, renderChart } from "@/engine/render"
import { useI18n } from "@/i18n"

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span>
        <span className="block text-[15px] font-bold text-bark">{label}</span>
        <span className="block text-[13px] text-stone">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  )
}

export function DownloadPanel({
  pattern,
  onError,
}: {
  pattern: Pattern
  onError: (key: string) => void
}) {
  const { t } = useI18n()
  const [grid, setGrid] = useState(true)
  const [legend, setLegend] = useState(true)
  // Lives here rather than in the settings: it changes the chart you
  // download, not the pattern itself.
  const [outline, setOutline] = useState(false)
  const [backcolor, setBackcolor] = useState("#EBE2D7")
  const [busy, setBusy] = useState(false)

  const download = async () => {
    setBusy(true)
    try {
      // Drawn here and now. No upload, no server-side state to get confused
      // about whose pattern this is.
      const canvas = renderChart(pattern, {
        cellSize: 14,
        grid,
        legend,
        outline,
        background: backcolor,
      })
      const blob = await canvasToBlob(canvas)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "BroderieDMC.png"
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch {
      onError("download")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-blanc rounded-[18px] shadow-soft p-5 flex flex-col gap-4">
      <PanelTitle>{t.converter.download.heading}</PanelTitle>

      <ToggleRow
        label={t.converter.download.grid}
        hint={t.converter.download.gridHint}
        checked={grid}
        onChange={setGrid}
      />
      <ToggleRow
        label={t.converter.download.legend}
        hint={t.converter.download.legendHint}
        checked={legend}
        onChange={setLegend}
      />
      <ToggleRow
        label={t.converter.colors.outline}
        hint={t.converter.colors.outlineHint}
        checked={outline}
        onChange={setOutline}
      />

      <label className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-bold text-bark">{t.converter.download.background}</span>
        <span className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-stone">{backcolor.toUpperCase()}</span>
          <input
            type="color"
            value={backcolor}
            onChange={(e) => setBackcolor(e.target.value)}
            className="w-12 h-9 rounded-[10px] border-[1.5px] border-edge-3 cursor-pointer bg-transparent p-0"
          />
        </span>
      </label>

      <Button size="block" onClick={download} disabled={busy}>
        <DownloadGlyph />
        {busy ? t.converter.download.working : t.converter.download.button}
      </Button>

      <p className="font-hand text-sm text-sand text-center m-0">{t.converter.download.note}</p>
    </div>
  )
}
