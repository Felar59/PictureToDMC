import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

import * as api from "@/lib/community"
import { AuthContext, type AuthValue } from "./auth-context"

/**
 * Who is signed in.
 *
 * One /api/auth/me on mount and that is it — the session lives in an httpOnly
 * cookie, so there is no token for this code to hold, refresh or leak.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<api.Me | null | undefined>(undefined)
  const [googleEnabled, setGoogleEnabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .fetchMe()
      .then((res) => {
        if (cancelled) return
        setUser(res.user)
        setGoogleEnabled(res.googleEnabled)
      })
      // A failure here means signed out, not broken: the gallery still reads.
      .catch(() => {
        if (!cancelled) setUser(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const signOut = useCallback(async () => {
    await api.signOut().catch(() => undefined)
    setUser(null)
  }, [])

  const updateProfile = useCallback(async (edit: api.ProfileEdit) => {
    const { user: fresh } = await api.updateMe(edit)
    setUser(fresh)
  }, [])

  const value = useMemo<AuthValue>(
    () => ({ user, googleEnabled, signIn: api.signInWithGoogle, signOut, updateProfile }),
    [user, googleEnabled, signOut, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
