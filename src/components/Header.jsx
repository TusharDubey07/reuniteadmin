import { FaUser, FaBell, FaSignOutAlt } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"

export default function Header({ onLogout }) {
  const navigate = useNavigate()

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

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/dashboard" className="text-2xl font-bold text-blue-600">Reunite</Link>
            </div>
            <nav className="ml-6 flex space-x-8">
              <Link
                to="/dashboard"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/search"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Search
              </Link>
              <Link
                to="/forum"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Public Forum
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="relative rounded-full h-10 w-10 bg-blue-100 flex items-center justify-center text-blue-600">
                <FaUser />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-white"></span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">John Doe</p>
              <p className="text-xs font-medium text-gray-500">NGO Admin</p>
            </div>
            <button className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <FaBell className="h-6 w-6" />
            </button>
            <button 
              onClick={handleSignOut}
              className="ml-4 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Sign out</span>
              <FaSignOutAlt className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
} 