import type { Pattern } from "@/engine/convert"
import { useI18n } from "@/i18n"

import { ChartPanel } from "./chart-panel"

/**
 * The converter's chart panel.
 *
 * Everything lives in ChartPanel, which the published-piece page shows too;
 * the only difference here is the heading — on the converter this panel is the
 * last step of the flow, so it is named after the download rather than after
 * the chart.
 */
export function DownloadPanel({
  pattern,
  onError,
}: {
  pattern: Pattern
  onError: (key: string) => void
}) {
  const { t } = useI18n()
  return (
    <ChartPanel pattern={pattern} onError={onError} heading={t.converter.download.heading} />
  )
}
