import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  FaTachometerAlt,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserShield,
} from "react-icons/fa"

export default function AdminSidebar({ onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleSignOut = () => {
    // Remove tokens from localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('isAdmin')
    localStorage.removeItem('userRole')
    
    // Call the onLogout prop if provided
    if (onLogout) {
      onLogout()
    }
    
    // Navigate to login page
    navigate('/login', { replace: true })
  }

  const navItems = [
    { path: "/admin/dashboard", icon: FaTachometerAlt, label: "Dashboard" },
    { path: "/admin/users", icon: FaUsers, label: "User Management" },
    { path: "/admin/logs", icon: FaClipboardList, label: "System Logs" },
    { path: "/admin/settings", icon: FaCog, label: "Settings" },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-20">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          <span className="sr-only">Open sidebar</span>
          {isMobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`lg:hidden fixed inset-0 z-10 transition-opacity ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-gray-800 overflow-y-auto">
          <div className="flex items-center justify-center h-16 bg-gray-900">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FaUserShield className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-white text-xl font-bold">Admin Panel</span>
              </div>
            </div>
          </div>
          <nav className="mt-5 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  isActive(item.path) ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon
                  className={`mr-4 h-6 w-6 ${
                    isActive(item.path) ? "text-blue-500" : "text-gray-400 group-hover:text-gray-300"
                  }`}
                />
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-700">
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <FaSignOutAlt className="mr-4 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                Sign Out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-gray-800">
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900">
              <FaUserShield className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-white text-xl font-bold">Admin Panel</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.path)
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-6 w-6 ${
                        isActive(item.path) ? "text-blue-500" : "text-gray-400 group-hover:text-gray-300"
                      }`}
                    />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="px-2 py-4 border-t border-gray-700">
                <button
                  onClick={handleSignOut}
                  className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <FaSignOutAlt className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

