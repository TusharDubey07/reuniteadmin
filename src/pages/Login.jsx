import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaLock, FaEnvelope, FaUserShield, FaHandHoldingHeart, FaUserCog } from "react-icons/fa"
import "../styles/auth.css"

export default function LoginPage({ onLoginSuccess, onAdminLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("ngo")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.detail === "not approved") {
          setError("Your account is pending approval from the admin. Please try again later.")
        } else {
          setError(data.detail || data.message || "Login failed")
        }
        return
      }

      // Store the access token and user data
      localStorage.setItem('access_token', data.tokens.access)
      localStorage.setItem('refresh_token', data.tokens.refresh)
      localStorage.setItem('userRole', data.user.role)
      localStorage.setItem('isAuthenticated', 'true')

      // Handle successful login based on role
      if (data.user.role === "ADMIN") {
        localStorage.setItem('isAdmin', 'true')
        onAdminLogin()
        navigate('/admin/dashboard', { replace: true })
      } else {
        localStorage.setItem('isAdmin', 'false')
        onLoginSuccess(data.user.role.toLowerCase())
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-background">
      <div className="auth-container">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
              <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
              <p className="text-blue-100 text-center mt-2">Sign in to continue to Reunite</p>
            </div>

            {/* Role Selector */}
            <div className="flex border-b">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 ${role === "ngo" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setRole("ngo")}
              >
                <FaHandHoldingHeart />
                <span>NGO</span>
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 ${role === "law" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setRole("law")}
              >
                <FaUserShield />
                <span>Law Enforcement</span>
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 ${role === "admin" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => setRole("admin")}
              >
                <FaUserCog />
                <span>Admin</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Username or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter username or email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:scale-105 disabled:opacity-70"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                  Register now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

