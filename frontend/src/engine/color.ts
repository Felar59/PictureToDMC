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

/**
 * Linear light for each of the 256 sRGB codes.
 *
 * Exported because *averaging* pixels is only correct here. An sRGB number is
 * not an amount of light — it is a perceptually spaced code for one — so the
 * mean of two codes is not the code of the mean light. Averaging them anyway
 * darkens and mutes every boundary it crosses, which on a stitch grid is most
 * cells; measured on a 50-stitch grid it costs up to 18 dE2000 on a single cell.
 */
export const SRGB_TO_LINEAR: Readonly<Float64Array> = LINEAR

/** Linear light in [0,1] back to an 8-bit sRGB code (unrounded). */
export function linearToSrgb(v: number): number {
  const c = v <= 0 ? 0 : v >= 1 ? 1 : v
  return 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)
}

/**
 * CIEDE2000, squared — the ordering is all anything here needs.
 *
 * Lab was meant to be perceptually uniform and is not quite: it overstates
 * differences between saturated colours and understates them between blues, so
 * plain Euclidean distance answers a deep red with a thread that is the right
 * distance away but the wrong hue. CIEDE2000 adds the corrections (a chroma
 * weight, a hue weight, and a rotation term for the blue region) that the CIE
 * published once they had the data.
 *
 * About 40x the cost of labDist2, so it belongs where a *decision* is made —
 * which skein to buy — and not in a loop over every stitch.
 */
export function labDist2000(a: Lab, b: Lab): number {
  const L1 = a[0]
  const a1 = a[1]
  const b1 = a[2]
  const L2 = b[0]
  const a2 = b[1]
  const b2 = b[2]

  const C1 = Math.sqrt(a1 * a1 + b1 * b1)
  const C2 = Math.sqrt(a2 * a2 + b2 * b2)
  const Cbar = (C1 + C2) / 2
  const Cbar7 = Cbar ** 7
  // 25^7, spelled out: it is a constant of the formula, not a magic number.
  const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + 6103515625)))

  const ap1 = a1 * (1 + G)
  const ap2 = a2 * (1 + G)
  const Cp1 = Math.sqrt(ap1 * ap1 + b1 * b1)
  const Cp2 = Math.sqrt(ap2 * ap2 + b2 * b2)

  let hp1 = Math.atan2(b1, ap1)
  if (hp1 < 0) hp1 += TAU
  let hp2 = Math.atan2(b2, ap2)
  if (hp2 < 0) hp2 += TAU

  const dL = L2 - L1
  const dC = Cp2 - Cp1
  // Hue is undefined for a neutral, and the formula says so: a grey contributes
  // no hue difference rather than an arbitrary one.
  const chromatic = Cp1 * Cp2 !== 0
  let dh = 0
  if (chromatic) {
    dh = hp2 - hp1
    if (dh > Math.PI) dh -= TAU
    else if (dh < -Math.PI) dh += TAU
  }
  const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin(dh / 2)

  const Lbar = (L1 + L2) / 2
  const Cpbar = (Cp1 + Cp2) / 2
  let hpbar = hp1 + hp2
  if (chromatic) {
    if (Math.abs(hp1 - hp2) > Math.PI) hpbar += hpbar < TAU ? TAU : -TAU
    hpbar /= 2
  }

  const T =
    1 -
    0.17 * Math.cos(hpbar - Math.PI / 6) +
    0.24 * Math.cos(2 * hpbar) +
    0.32 * Math.cos(3 * hpbar + Math.PI / 30) +
    -0.2 * Math.cos(4 * hpbar - DEG_63)

  const Sl = 1 + (0.015 * (Lbar - 50) ** 2) / Math.sqrt(20 + (Lbar - 50) ** 2)
  const Sc = 1 + 0.045 * Cpbar
  const Sh = 1 + 0.015 * Cpbar * T

  const dTheta = DEG_30 * Math.exp(-(((hpbar * RAD_TO_DEG - 275) / 25) ** 2))
  const Cpbar7 = Cpbar ** 7
  const Rt = -2 * Math.sqrt(Cpbar7 / (Cpbar7 + 6103515625)) * Math.sin(2 * dTheta)

  const x = dL / Sl
  const y = dC / Sc
  const z = dH / Sh
  // The rotation term can be negative, and rounding can carry the sum just past
  // zero for two identical colours.
  const sum = x * x + y * y + z * z + Rt * y * z
  return sum > 0 ? sum : 0
}

const TAU = 2 * Math.PI
const DEG_30 = Math.PI / 6
const DEG_63 = (63 * Math.PI) / 180
const RAD_TO_DEG = 180 / Math.PI

export function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHex(r: number, g: number, b: number): string {
  const h = (v: number) => (v < 16 ? "0" : "") + v.toString(16).toUpperCase()
  return `#${h(r)}${h(g)}${h(b)}`
}
