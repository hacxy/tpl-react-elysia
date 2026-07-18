import { createBrowserRouter } from 'react-router'
import AuthGuard from '../components/AuthGuard'
import RootLayout from '../layouts/RootLayout'
import About from '../pages/About'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Register from '../pages/Register'
import Users from '../pages/Users'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <RootLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'users', element: <Users /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

export default router
