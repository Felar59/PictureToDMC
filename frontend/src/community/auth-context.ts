import { createContext, useContext } from "react"

import type { Me } from "@/lib/community"

export type AuthValue = {
  /** null once loaded and nobody is signed in; undefined while loading. */
  user: Me | null | undefined
  googleEnabled: boolean
  signIn: (next?: string) => void
  signOut: () => Promise<void>
  rename: (displayName: string) => Promise<void>
}

export const AuthContext = createContext<AuthValue | null>(null)

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
