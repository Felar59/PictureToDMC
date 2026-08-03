/**
 * Client for the community API.
 *
 * Same origin, so no base URL and no CORS. Every call sends the session cookie,
 * which is httpOnly — JavaScript can neither read it nor forge it.
 */

export type PublicUser = {
  id: number
  displayName: string
  avatarUrl: string | null
}

export type Me = PublicUser & { email: string | null; isAdmin: boolean }

export type PostCard = {
  id: number
  title: string
  category: string
  width: number
  height: number
  threadCount: number
  palette: string[]
  likeCount: number
  liked: boolean
  createdAt: number
  hasPhoto: boolean
  hasThumb: boolean
  author: PublicUser
}

export type PostDetail = PostCard & { cells: string; threadCodes: string[] }

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(path, {
      ...init,
      headers: init?.body ? { "Content-Type": "application/json", ...init?.headers } : init?.headers,
    })
  } catch {
    throw new ApiError(0, "network")
  }
  if (!res.ok) {
    // FastAPI puts the reason in `detail`; fall back to the status.
    const detail = await res
      .json()
      .then((b) => (typeof b?.detail === "string" ? b.detail : null))
      .catch(() => null)
    throw new ApiError(res.status, detail ?? `HTTP ${res.status}`)
  }
  return (await res.json()) as T
}

/* ---------------------------------------------------------------- auth */

export function fetchMe() {
  return call<{ user: Me | null; googleEnabled: boolean }>("/api/auth/me")
}

/** Full page navigation, not fetch: the OAuth dance has to happen in the
 *  address bar so Google can show its own consent screen. */
export function signInWithGoogle(next: string = window.location.pathname) {
  window.location.href = `/api/auth/google/start?next=${encodeURIComponent(next)}`
}

export function signOut() {
  return call<{ ok: true }>("/api/auth/logout", { method: "POST" })
}

export function renameMe(displayName: string) {
  return call<{ user: Me }>("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify({ displayName }),
  })
}

/* -------------------------------------------------------------- gallery */

export function fetchPosts(options: { category?: string; sort?: "new" | "top"; page?: number } = {}) {
  const params = new URLSearchParams({
    category: options.category ?? "all",
    sort: options.sort ?? "new",
    page: String(options.page ?? 0),
  })
  return call<{ posts: PostCard[]; hasMore: boolean }>(`/api/posts?${params}`)
}

export function fetchPost(id: number) {
  return call<PostDetail>(`/api/posts/${id}`)
}

export type NewPost = {
  title: string
  category: string
  width: number
  height: number
  cells: string
  threadCodes: string[]
  thumbnail?: string
  photo?: string
}

export function publishPost(post: NewPost) {
  return call<{ id: number }>("/api/posts", { method: "POST", body: JSON.stringify(post) })
}

export function toggleLike(id: number) {
  return call<{ liked: boolean; likeCount: number }>(`/api/posts/${id}/like`, { method: "POST" })
}

export function deletePost(id: number) {
  return call<{ ok: true }>(`/api/posts/${id}`, { method: "DELETE" })
}

export const thumbUrl = (id: number) => `/api/posts/${id}/thumb`
export const photoUrl = (id: number) => `/api/posts/${id}/photo`
