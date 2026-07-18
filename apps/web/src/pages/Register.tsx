import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { signUp } from '../services/auth'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) return

    if (password !== confirmPassword) {
      setError('密码不一致')
      return
    }

    setError('')
    setLoading(true)

    try {
      await signUp(username, password)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div>
        <h1>注册</h1>
        <p>注册成功</p>
        <Link to="/login">去登录</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>注册</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">用户名</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">密码</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div role="alert">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? '注册中...' : '注册'}
        </button>
      </form>
      <p>
        已有账号？ <Link to="/login">登录</Link>
      </p>
    </div>
  )
}
