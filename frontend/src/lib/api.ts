// Base des appels API. Vide par defaut : le backend FastAPI sert le build,
// donc les requetes partent sur la meme origine (prod Render comme local).
// En `npm run dev`, le proxy de vite.config.ts renvoie ces routes vers le backend local.
// Surchargeable avec VITE_API_URL pour taper un backend distant.
export const API_URL = import.meta.env.VITE_API_URL ?? ""

export type DMCColor = { num: string; name: string; hex: string }

export type ApiFailure = "network" | "server"

/**
 * The backend answers `{"error": "..."}` with HTTP 200 on every failure
 * (PythonDCA/main.py wraps each route in a bare `except`). Callers that only
 * look at res.ok therefore treat crashes as successes and hand `undefined`
 * to React. Every response goes through here so that never happens again.
 */
export class ApiError extends Error {
  readonly kind: ApiFailure
  /** Raw backend message. For logs — never render it to the user. */
  readonly detail?: string

  constructor(kind: ApiFailure, detail?: string) {
    super(detail ?? kind)
    this.name = "ApiError"
    this.kind = kind
    this.detail = detail
  }
}

async function request(path: string, body?: unknown): Promise<Response> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (cause) {
    throw new ApiError("network", String(cause))
  }
  if (!res.ok) throw new ApiError("server", `HTTP ${res.status}`)
  return res
}

export async function postJSON<T>(path: string, body?: unknown): Promise<T> {
  const res = await request(path, body)
  let data: unknown
  try {
    data = await res.json()
  } catch (cause) {
    throw new ApiError("server", String(cause))
  }
  if (data && typeof data === "object" && "error" in data) {
    throw new ApiError("server", String((data as { error: unknown }).error))
  }
  return data as T
}

export async function postBlob(path: string, body?: unknown): Promise<Blob> {
  const res = await request(path, body)
  // /download streams a PNG on success but falls back to a JSON error body.
  if (res.headers.get("content-type")?.includes("application/json")) {
    const data = await res.json().catch(() => null)
    throw new ApiError("server", data?.error ? String(data.error) : "unexpected JSON")
  }
  return res.blob()
}

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

export type UploadResult = { image: string; values: DMCColor[] }

export function uploadImage(input: {
  image: string
  colorCount: number
  imageSize: number
  outline: boolean
  colors: DMCColor[]
}) {
  return postJSON<UploadResult>("/upload", {
    image: input.image,
    colorCount: input.colorCount,
    imageSize: input.imageSize,
    Outline: input.outline,
    colors: input.colors,
  })
}

export function fetchWhiteMasks() {
  return postJSON<{ whitemasks: Record<string, string> }>("/white_mask")
}

export function findAlternatives(colors: DMCColor[], color: DMCColor) {
  return postJSON<{ new_colors: DMCColor[] }>("/new_color", { Colors: colors, Color: color })
}

export function addColor(colorNum: string) {
  return postJSON<{ add_color: DMCColor }>("/add_color", { colorNum })
}

export function replaceColor(select: DMCColor, next: DMCColor) {
  return postJSON<{ image: string }>("/replace", { select, new: next })
}

export function downloadChart(input: { grid: boolean; legend: boolean; backcolor: string }) {
  return postBlob("/download", input)
}

/** The backend's "not found" sentinel for /add_color. */
export const NOT_FOUND_NAME = "Error: Not Found"
