import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from './auth'

describe('auth store', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    localStorage.clear()
  })

  it('should have initial state', () => {
    const state = useAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })

  it('should set token on login', () => {
    const { login } = useAuthStore.getState()
    login('test-token')
    expect(useAuthStore.getState().token).toBe('test-token')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })

  it('should persist token to localStorage', () => {
    const { login } = useAuthStore.getState()
    login('test-token')
    expect(localStorage.getItem('auth-token')).toBe('test-token')
  })

  it('should set user', () => {
    const { setUser } = useAuthStore.getState()
    setUser({ id: 1, username: 'testuser' })
    expect(useAuthStore.getState().user).toEqual({ id: 1, username: 'testuser' })
  })

  it('should clear state on logout', () => {
    const { login, setUser, logout } = useAuthStore.getState()
    login('test-token')
    setUser({ id: 1, username: 'testuser' })
    logout()
    expect(useAuthStore.getState().token).toBeNull()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
    expect(localStorage.getItem('auth-token')).toBeNull()
  })

  it('should restore token from localStorage', () => {
    localStorage.setItem('auth-token', 'stored-token')
    useAuthStore.getState().restoreToken()
    expect(useAuthStore.getState().token).toBe('stored-token')
    expect(useAuthStore.getState().isAuthenticated).toBe(true)
  })
})
