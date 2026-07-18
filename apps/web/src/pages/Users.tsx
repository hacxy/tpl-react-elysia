import { useEffect, useReducer, useRef } from 'react'
import { useAuthStore } from '../store/auth'
import { getUsers } from '../services/auth'

interface User {
  id: number
  username: string
  createdAt: string
}

interface State {
  users: User[]
  page: number
  total: number
  loading: boolean
  error: string
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: { users: User[]; total: number } }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_PAGE'; payload: number }

const initialState: State = {
  users: [],
  page: 1,
  total: 0,
  loading: true,
  error: '',
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: '' }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, users: action.payload.users, total: action.payload.total }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    default:
      return state
  }
}

export default function Users() {
  const token = useAuthStore((state) => state.token)
  const [state, dispatch] = useReducer(reducer, initialState)
  const pageSize = 10
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!token) return

    const controller = new AbortController()

    dispatch({ type: 'FETCH_START' })
    getUsers(token, state.page, pageSize)
      .then((data) => {
        if (isMountedRef.current && !controller.signal.aborted) {
          dispatch({ type: 'FETCH_SUCCESS', payload: { users: data.list, total: data.total } })
        }
      })
      .catch((err) => {
        if (isMountedRef.current && !controller.signal.aborted) {
          dispatch({
            type: 'FETCH_ERROR',
            payload: err instanceof Error ? err.message : '加载失败',
          })
        }
      })

    return () => {
      controller.abort()
    }
  }, [token, state.page])

  if (state.loading) {
    return <div>加载中...</div>
  }

  if (state.error) {
    return <div role="alert">{state.error}</div>
  }

  return (
    <div>
      <h1>用户列表</h1>
      {state.users.length === 0 ? (
        <p>暂无用户</p>
      ) : (
        <>
          <ul>
            {state.users.map((user) => (
              <li key={user.id}>
                {user.username} - {new Date(user.createdAt).toLocaleDateString()}
              </li>
            ))}
          </ul>
          <div>
            <span>第 {state.page} 页</span>
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: Math.max(1, state.page - 1) })}
              disabled={state.page === 1}
            >
              上一页
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_PAGE', payload: state.page + 1 })}
              disabled={state.page * pageSize >= state.total}
            >
              下一页
            </button>
          </div>
        </>
      )}
    </div>
  )
}
