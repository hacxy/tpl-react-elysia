import { createStore } from './createStore'

interface User {
  id: number
  username: string
}

interface AuthStore {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  setUser: (user: User) => void
  restoreToken: () => void
}

export const useAuthStore = createStore<AuthStore>('AuthStore', (set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  login: (token) => {
    localStorage.setItem('auth-token', token)
    set({ token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('auth-token')
    set({ token: null, user: null, isAuthenticated: false })
  },
  setUser: (user) => set({ user }),
  restoreToken: () => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      set({ token, isAuthenticated: true })
    }
  },
}))
