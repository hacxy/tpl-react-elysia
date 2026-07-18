import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../store/auth'
import Login from './Login'

vi.mock('../services/auth', () => ({
  signIn: vi.fn(),
}))

import { signIn } from '../services/auth'
const mockSignIn = vi.mocked(signIn)

describe('Login Page', () => {
  beforeEach(() => {
    useAuthStore.getState().logout()
    vi.clearAllMocks()
  })

  it('should render login form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/密码/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /登录/i })).toBeInTheDocument()
  })

  it('should show validation error for empty fields', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /登录/i }))

    expect(mockSignIn).not.toHaveBeenCalled()
  })

  it('should call signIn on form submit', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValueOnce({ token: 'test-token' })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/用户名/i), 'testuser')
    await user.type(screen.getByLabelText(/密码/i), 'password123')
    await user.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('testuser', 'password123')
    })
  })

  it('should store token on successful login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockResolvedValueOnce({ token: 'test-token' })

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/用户名/i), 'testuser')
    await user.type(screen.getByLabelText(/密码/i), 'password123')
    await user.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('test-token')
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })
  })

  it('should show error message on failed login', async () => {
    const user = userEvent.setup()
    mockSignIn.mockRejectedValueOnce(new Error('用户名或密码错误'))

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/用户名/i), 'testuser')
    await user.type(screen.getByLabelText(/密码/i), 'wrongpassword')
    await user.click(screen.getByRole('button', { name: /登录/i }))

    await waitFor(() => {
      expect(screen.getByText(/用户名或密码错误/i)).toBeInTheDocument()
    })
  })

  it('should have link to register page', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /注册/i })).toBeInTheDocument()
  })
})
