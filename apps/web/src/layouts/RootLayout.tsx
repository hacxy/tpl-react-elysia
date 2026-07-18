import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuthStore } from '../store/auth'
import './RootLayout.css'

function RootLayout() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <nav id="nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/users">Users</NavLink>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user && <span>{user.username}</span>}
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <Outlet />
    </>
  )
}

export default RootLayout
