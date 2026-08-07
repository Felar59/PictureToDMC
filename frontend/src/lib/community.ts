/**
 * Client for the community API.
 *
 * Same origin, so no base URL and no CORS. Every call sends the session cookie,
 * which is httpOnly — JavaScript can neither read it nor forge it.
 */

export type PublicUser = {
  id: number
  displayName: string
  /** Which built-in mark they picked, or null for the one drawn from their id. */
  icon?: string | null
  bio?: string | null
  /** Wears the flower, and may delete anyone's piece or comment. Public because
   *  the badge is the point — see `public_user` in the backend. */
  isAdmin: boolean
}

export type Me = PublicUser & {
  email: string | null
  /** False until they have confirmed a name of their own. */
  setUp: boolean
}

/**
 * What a post is, which is a different question from what it shows.
 *
 * "pattern" is a chart made here, with an optional photo of it stitched. "photo"
 * is the finished piece on its own. Every reader branches on this rather than on
 * whether the pattern fields happen to be null: "there is no chart" and "the chart
 * has not arrived yet" would otherwise look identical.
 */
export type PostKind = "pattern" | "photo"

export type PostCard = {
  id: number
  title: string
  category: string
  kind: PostKind
  /** Null on a photo post. */
  width: number | null
  height: number | null
  threadCount: number
  palette: string[]
  likeCount: number
  liked: boolean
  createdAt: number
  hasPhoto: boolean
  hasThumb: boolean
  author: PublicUser
}

/** `cells` and `threadCodes` are null together, on a photo post. */
export type PostDetail = PostCard & { cells: string | null; threadCodes: string[] | null }

export class ApiError extends Error {
  readonly status: number
  /** Set when the server sent a structured reason rather than a sentence. */
  readonly code?: string
  /** The rest of that object — whatever the code implies. `daily-limit` carries
   *  the limit and how many minutes are left. */
  readonly data?: Record<string, unknown>
  constructor(status: number, message: string, detail?: Record<string, unknown>) {
    super(message)
    this.name = "ApiError"
    this.status = status
    if (typeof detail?.code === "string") {
      this.code = detail.code
      this.data = detail
    }
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
    // FastAPI puts the reason in `detail`; fall back to the status. A string is a
    // sentence the server wrote; an object carries a code and its particulars, so
    // the client can write the sentence itself — which is what a refusal the
    // member reads has to be, since only the client knows their language.
    const detail = await res
      .json()
      .then((body) => body?.detail ?? null)
      .catch(() => null)
    if (detail && typeof detail === "object") {
      throw new ApiError(res.status, String(detail.code ?? `HTTP ${res.status}`), detail)
    }
    throw new ApiError(res.status, typeof detail === "string" ? detail : `HTTP ${res.status}`)
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

export type ProfileEdit = { displayName?: string; bio?: string; icon?: string | null }

/** Any field left out is left alone, so this serves both the one-time name step
 *  and a later edit of the bio. */
export function updateMe(edit: ProfileEdit) {
  return call<{ user: Me }>("/api/auth/me", {
    method: "PATCH",
    body: JSON.stringify(edit),
  })
}

/* -------------------------------------------------------------- gallery */

export function fetchPosts(
  options: {
    category?: string
    sort?: "new" | "top"
    /** Which way `sort` runs. Omitted means the useful end first: newest, or
     *  best-loved. */
    direction?: "desc" | "asc"
    page?: number
    kind?: PostKind | "all"
  } = {},
) {
  const params = new URLSearchParams({
    category: options.category ?? "all",
    sort: options.sort ?? "new",
    direction: options.direction ?? "desc",
    page: String(options.page ?? 0),
    kind: options.kind ?? "all",
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
  /** A data URL. Optional here: the chart is the post, this is the extra. */
  photo?: string
}

export function publishPost(post: NewPost) {
  return call<{ id: number }>("/api/posts", { method: "POST", body: JSON.stringify(post) })
}

/** A photo on its own, with no chart behind it. `photo` is a data URL. */
export function publishPhoto(post: { title: string; category: string; photo: string }) {
  return call<{ id: number }>("/api/posts", {
    method: "POST",
    body: JSON.stringify({ ...post, kind: "photo" }),
  })
}

/** Flag a piece. Reporting the same one twice replaces the reason. */
export function reportPost(id: number, reason: string) {
  return call<{ ok: true }>(`/api/posts/${id}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  })
}

export type ReportEntry = {
  postId: number
  reason: string
  createdAt: number
  title: string
  kind: PostKind
  authorId: number
  authorName: string
  reporterName: string
}

/** Admins only — anyone else gets a 404 from the server. */
export function fetchReports() {
  return call<{ reports: ReportEntry[] }>("/api/reports")
}

export function dismissReports(postId: number) {
  return call<{ cleared: number }>(`/api/reports/${postId}`, { method: "DELETE" })
}

export function toggleLike(id: number) {
  return call<{ liked: boolean; likeCount: number }>(`/api/posts/${id}/like`, { method: "POST" })
}

export function deletePost(id: number) {
  return call<{ ok: true }>(`/api/posts/${id}`, { method: "DELETE" })
}

/**
 * The stored images, cached for a year and told apart by the post's own timestamp.
 *
 * The id alone is not enough. SQLite used to hand a deleted post's id to the next
 * one, and these are served `immutable`, so a browser that had seen the old post
 * went on showing its thumbnail under the new post's id — the gallery and the
 * piece page disagreed, because the piece page redraws from the grid in the JSON.
 * Ids are no longer recycled, but a cache poisoned before that fix would keep
 * lying for a year; `v` makes it a different URL, so it recovers on its own.
 */
export const thumbUrl = (post: { id: number; createdAt: number }) =>
  `/api/posts/${post.id}/thumb?v=${post.createdAt}`
export const photoUrl = (post: { id: number; createdAt: number }) =>
  `/api/posts/${post.id}/photo?v=${post.createdAt}`

export type Comment = {
  id: number
  body: string
  createdAt: number
  author: PublicUser
}

export function fetchComments(postId: number) {
  return call<{ comments: Comment[] }>(`/api/posts/${postId}/comments`)
}

/** Returns the stored comment, so the thread can grow without a refetch. */
export function addComment(postId: number, body: string) {
  return call<Comment>(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  })
}

export function deleteComment(id: number) {
  return call<{ ok: true }>(`/api/comments/${id}`, { method: "DELETE" })
}
