import './App.css'
import { useState, useEffect } from 'react'
import LoginPage from './pages/Login'
import RegisterPage from './pages/Register'
import Dashboard from './pages/Dashboard'
import SearchPage from './pages/Search'
import Layout from './components/Layout'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ListingPage from './pages/Listing'
import ForumPage from './pages/Forum'
import AdminDashboard from './pages/AdminDash'
import AdminUsers from './pages/AdminUsers'
import AdminLogs from './pages/AdminLogs'
import Admin from './components/Admin'
// import Admin from './components/Admin'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userRole, setUserRole] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication state from localStorage
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true'
    const storedAdmin = localStorage.getItem('isAdmin') === 'true'
    const storedRole = localStorage.getItem('userRole')
    const accessToken = localStorage.getItem('access_token')
    
    // Only set authenticated if we have both the flag and the token
    if (storedAuth && accessToken) {
      setIsAuthenticated(true)
      setIsAdmin(storedAdmin)
      setUserRole(storedRole || '')
    } else {
      // If either is missing, clear all auth data
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('isAdmin')
      localStorage.removeItem('userRole')
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
    setIsLoading(false)
  }, [])

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true)
    setIsAdmin(role === 'admin')
    setUserRole(role)
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isAdmin', role === 'admin')
    localStorage.setItem('userRole', role)
  }

  const handleAdminLogin = () => {
    setIsAuthenticated(true)
    setIsAdmin(true)
    setUserRole('admin')
    localStorage.setItem('isAuthenticated', 'true')
    localStorage.setItem('isAdmin', 'true')
    localStorage.setItem('userRole', 'admin')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    setUserRole("")
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('userRole')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div> // Or a loading spinner
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  const AdminRoute = ({ children }) => {
    if (isLoading) {
      return <div>Loading...</div> // Or a loading spinner
    }
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  // Don't render anything while checking authentication
  if (isLoading) {
    return <div>Loading...</div> // Or a loading spinner
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} onAdminLogin={handleAdminLogin} />} />
        <Route path="/register" element={<RegisterPage onRegisterSuccess={handleLoginSuccess} />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin onLogout={handleLogout}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard onLogout={handleLogout} />} />
                  <Route path="users" element={<AdminUsers onLogout={handleLogout} />} />
                  <Route path="logs" element={<AdminLogs onLogout={handleLogout} />} />
                  <Route path="settings" element={<div>Settings</div>} />
                </Routes>
              </Admin>
            </AdminRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/forum" element={<ForumPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
