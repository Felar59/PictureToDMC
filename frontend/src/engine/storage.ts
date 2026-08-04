/**
 * Keep the work-in-progress in the browser, so closing the tab doesn't lose it.
 *
 * Only the photo and the settings are stored — not the pattern. Conversion is
 * ~20 ms now, so recomputing on load is cheaper than serialising a grid, and it
 * means a stored session can never disagree with the engine that reads it.
 *
 * IndexedDB rather than localStorage: a phone photo is several megabytes and
 * localStorage caps out around 5 MB of *string*, which a base64 blob blows
 * through immediately.
 */

const DB_NAME = "picture-to-dmc"
const DB_VERSION = 1
const STORE = "session"
const KEY = "current"

export type StoredSession = {
  photo: Blob
  photoName: string
  stitchWidth: number
  colorCount: number
  vividness: number
  /** Quarter turns clockwise. Optional because sessions saved before the mirror
   *  controls became a rotation do not carry it. */
  rotation?: number
  /** No longer offered in the UI, and kept only so an older stored session still
   *  parses. Nothing writes them. */
  flipH?: boolean
  flipV?: boolean
  removeBackground: boolean
  useCustomPalette: boolean
  customThreadNums: string[]
  /** Thread substitutions the user made, cluster index -> DMC reference. */
  substitutions: Record<number, string>
  savedAt: number
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/** Private browsing and disabled storage both throw; neither is worth an error
 *  the user has to read, so every call degrades to "no persistence". */
async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest,
): Promise<T | null> {
  try {
    const db = await open()
    return await new Promise<T | null>((resolve, reject) => {
      const tx = db.transaction(STORE, mode)
      const req = fn(tx.objectStore(STORE))
      req.onsuccess = () => resolve(req.result as T)
      req.onerror = () => reject(req.error)
      tx.oncomplete = () => db.close()
    })
  } catch {
    return null
  }
}

export function saveSession(session: Omit<StoredSession, "savedAt">): Promise<unknown> {
  return withStore("readwrite", (store) =>
    store.put({ ...session, savedAt: Date.now() } satisfies StoredSession, KEY),
  )
}

export function loadSession(): Promise<StoredSession | null> {
  return withStore<StoredSession>("readonly", (store) => store.get(KEY))
}

export function clearSession(): Promise<unknown> {
  return withStore("readwrite", (store) => store.delete(KEY))
}
