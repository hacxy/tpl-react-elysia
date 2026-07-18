import { afterEach, describe, expect, it, vi } from 'vitest'
import { signIn, signUp, getUsers } from './auth'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('auth service', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('signUp', () => {
    it('should send POST request to /auth/sign-up', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      })

      const result = await signUp('testuser', 'password123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/sign-up'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        }),
      )
      expect(result).toEqual({ success: true })
    })

    it('should throw error on failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: '用户已存在' }),
      })

      await expect(signUp('existing', 'password123')).rejects.toThrow('用户已存在')
    })
  })

  describe('signIn', () => {
    it('should send POST request to /auth/sign-in', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ token: 'test-token' }),
      })

      const result = await signIn('testuser', 'password123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/sign-in'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'testuser', password: 'password123' }),
        }),
      )
      expect(result).toEqual({ token: 'test-token' })
    })

    it('should throw error on invalid credentials', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: '用户名或密码错误' }),
      })

      await expect(signIn('testuser', 'wrong')).rejects.toThrow('用户名或密码错误')
    })
  })

  describe('getUsers', () => {
    it('should send GET request with pagination params', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          list: [{ id: 1, username: 'user1', createdAt: '2025-01-01' }],
          total: 1,
          page: 1,
          pageSize: 10,
        }),
      })

      const result = await getUsers('test-token', 1, 10)

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/users?page=1&pageSize=10'),
        expect.objectContaining({
          headers: { Authorization: 'Bearer test-token' },
        }),
      )
      expect(result.list).toHaveLength(1)
    })

    it('should throw error on unauthorized', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: '未授权' }),
      })

      await expect(getUsers('invalid-token')).rejects.toThrow('未授权')
    })
  })
})
