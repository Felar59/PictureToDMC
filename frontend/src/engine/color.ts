/**
 * sRGB <-> CIELAB.
 *
 * Everything in the engine matches in Lab, not RGB. Euclidean distance in RGB
 * is not perceptual: it treats a pair of dark greens as far apart as a pair of
 * mid greys, which is why the old backend could answer a mossy shadow with a
 * bright green thread. In Lab, distance roughly tracks what the eye reports.
 */

export type Rgb = readonly [number, number, number]
export type Lab = readonly [number, number, number]

// sRGB gamma is a curve and a branch; both are hot enough to be worth a table.
const LINEAR = new Float64Array(256)
for (let i = 0; i < 256; i++) {
  const c = i / 255
  LINEAR[i] = c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

const XN = 0.95047
const ZN = 1.08883
const EPS = 0.008856
const KAPPA = 7.787

function f(t: number): number {
  return t > EPS ? Math.cbrt(t) : KAPPA * t + 16 / 116
}

export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const rl = LINEAR[r < 0 ? 0 : r > 255 ? 255 : r | 0]
  const gl = LINEAR[g < 0 ? 0 : g > 255 ? 255 : g | 0]
  const bl = LINEAR[b < 0 ? 0 : b > 255 ? 255 : b | 0]

  const fx = f((rl * 0.4124 + gl * 0.3576 + bl * 0.1805) / XN)
  const fy = f(rl * 0.2126 + gl * 0.7152 + bl * 0.0722)
  const fz = f((rl * 0.0193 + gl * 0.1192 + bl * 0.9505) / ZN)

  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]
}

/** Squared Lab distance. Squared because nothing here needs the actual metric,
 *  only the ordering, and sqrt in the inner loop is pure cost. */
export function labDist2(a: Lab, b: Lab): number {
  const dl = a[0] - b[0]
  const da = a[1] - b[1]
  const db = a[2] - b[2]
  return dl * dl + da * da + db * db
}

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHex(r: number, g: number, b: number): string {
  const h = (v: number) => (v < 16 ? "0" : "") + v.toString(16).toUpperCase()
  return `#${h(r)}${h(g)}${h(b)}`
}
