import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { demoUsers, findUserByEmail } from "@/data/users"
import type { User } from "@/types"

const STORAGE_KEY = "medicare-connect-session"

type AuthContextValue = {
  user: User | null
  login: (email: string) => User | null
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { id: string }
    return demoUsers.find((u) => u.id === parsed.id) ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser())

  const login = useCallback((email: string) => {
    const found = findUserByEmail(email)
    if (found) {
      setUser(found)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ id: found.id }))
    }
    return found ?? null
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
