const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:1118'

interface SignUpResponse {
  success: boolean
}

interface SignInResponse {
  token: string
}

interface UserListResponse {
  list: Array<{ id: number; username: string; createdAt: string }>
  total: number
  page: number
  pageSize: number
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || '请求失败')
  }
  return data
}

export async function signUp(username: string, password: string): Promise<SignUpResponse> {
  const response = await fetch(`${API_BASE}/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<SignUpResponse>(response)
}

export async function signIn(username: string, password: string): Promise<SignInResponse> {
  const response = await fetch(`${API_BASE}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  return handleResponse<SignInResponse>(response)
}

export async function getUsers(
  token: string,
  page: number = 1,
  pageSize: number = 10,
): Promise<UserListResponse> {
  const response = await fetch(`${API_BASE}/auth/users?page=${page}&pageSize=${pageSize}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handleResponse<UserListResponse>(response)
}
