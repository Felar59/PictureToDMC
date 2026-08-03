import { createContext, useContext } from "react"

/**
 * A handle on the account panel, which lives once near the root.
 *
 * Split from the provider because a module that exports a component must not also
 * export anything else, or fast refresh stops working on it.
 */
export const AccountPanelContext = createContext<{ open: () => void } | null>(null)

export function useAccountPanel() {
  const value = useContext(AccountPanelContext)
  // Deliberately forgiving: a menu rendered outside the provider still works, it
  // just has nothing to open.
  return value ?? { open: () => {} }
}
