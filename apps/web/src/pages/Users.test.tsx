import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuthStore } from '../store/auth'
import Users from './Users'

vi.mock('../services/auth', () => ({
  getUsers: vi.fn(),
}))

import { getUsers } from '../services/auth'
const mockGetUsers = vi.mocked(getUsers)

const mockUsers = [
  { id: 1, username: 'user1', createdAt: '2025-01-01T00:00:00Z' },
  { id: 2, username: 'user2', createdAt: '2025-01-02T00:00:00Z' },
]

describe('Users Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.getState().login('test-token')
  })

  it('should render users list', async () => {
    mockGetUsers.mockResolvedValueOnce({
      list: mockUsers,
      total: 2,
      page: 1,
      pageSize: 10,
    })

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/user1/)).toBeInTheDocument()
      expect(screen.getByText(/user2/)).toBeInTheDocument()
    })
  })

  it('should show loading state', () => {
    mockGetUsers.mockReturnValueOnce(new Promise(() => {}))

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>,
    )

    expect(screen.getByText(/加载中/i)).toBeInTheDocument()
  })

  it('should show error message on failure', async () => {
    mockGetUsers.mockRejectedValueOnce(new Error('未授权'))

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/未授权/i)).toBeInTheDocument()
    })
  })

  it('should show empty message when no users', async () => {
    mockGetUsers.mockResolvedValueOnce({
      list: [],
      total: 0,
      page: 1,
      pageSize: 10,
    })

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/暂无用户/i)).toBeInTheDocument()
    })
  })

  it('should show pagination', async () => {
    mockGetUsers.mockResolvedValueOnce({
      list: mockUsers,
      total: 20,
      page: 1,
      pageSize: 10,
    })

    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/第 1 页/i)).toBeInTheDocument()
    })
  })

  it('should load next page', async () => {
    mockGetUsers.mockResolvedValueOnce({
      list: mockUsers,
      total: 20,
      page: 1,
      pageSize: 10,
    })

    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Users />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/user1/)).toBeInTheDocument()
    })

    mockGetUsers.mockResolvedValueOnce({
      list: [
        { id: 3, username: 'user3', createdAt: '2025-01-03T00:00:00Z' },
        { id: 4, username: 'user4', createdAt: '2025-01-04T00:00:00Z' },
      ],
      total: 20,
      page: 2,
      pageSize: 10,
    })

    await user.click(screen.getByRole('button', { name: /下一页/i }))

    await waitFor(() => {
      expect(mockGetUsers).toHaveBeenCalledWith('test-token', 2, 10)
    })
  })
})
