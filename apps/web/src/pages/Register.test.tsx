import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Register from './Register'

vi.mock('../services/auth', () => ({
  signUp: vi.fn(),
}))

import { signUp } from '../services/auth'
const mockSignUp = vi.mocked(signUp)

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render register form', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText(/用户名/i)).toBeInTheDocument()
    expect(screen.getByLabelText('密码')).toBeInTheDocument()
    expect(screen.getByLabelText(/确认密码/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /注册/i })).toBeInTheDocument()
  })

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/用户名/i), 'testuser')
    await user.type(screen.getByLabelText('密码'), 'password123')
    await user.type(screen.getByLabelText(/确认密码/i), 'password456')
    await user.click(screen.getByRole('button', { name: /注册/i }))

    expect(screen.getByText(/密码不一致/i)).toBeInTheDocument()
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('should call signUp on form submit', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValueOnce({ success: true })

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/用户名/i), 'newuser')
    await user.type(screen.getByLabelText('密码'), 'password123')
    await user.type(screen.getByLabelText(/确认密码/i), 'password123')
    await user.click(screen.getByRole('button', { name: /注册/i }))

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('newuser', 'password123')
    })
  })

  it('should show success message after registration', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValueOnce({ success: true })

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/用户名/i), 'newuser')
    await user.type(screen.getByLabelText('密码'), 'password123')
    await user.type(screen.getByLabelText(/确认密码/i), 'password123')
    await user.click(screen.getByRole('button', { name: /注册/i }))

    await waitFor(() => {
      expect(screen.getByText(/注册成功/i)).toBeInTheDocument()
    })
  })

  it('should show error message on failed registration', async () => {
    const user = userEvent.setup()
    mockSignUp.mockRejectedValueOnce(new Error('用户已存在'))

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/用户名/i), 'existing')
    await user.type(screen.getByLabelText('密码'), 'password123')
    await user.type(screen.getByLabelText(/确认密码/i), 'password123')
    await user.click(screen.getByRole('button', { name: /注册/i }))

    await waitFor(() => {
      expect(screen.getByText(/用户已存在/i)).toBeInTheDocument()
    })
  })

  it('should have link to login page', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /登录/i })).toBeInTheDocument()
  })
})
