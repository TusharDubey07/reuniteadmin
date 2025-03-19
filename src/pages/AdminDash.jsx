import AdminSidebar from "../components/AdminSidebar"
import {
  FaUsers,
  FaBuilding,
  FaUserShield,
  FaServer,
  FaUserCog,
  FaCheckCircle,
  FaClipboardList,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa"
import { useState, useEffect } from "react"

export default function AdminDashboard({ onLogout }) {
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [pendingOrganizations, setPendingOrganizations] = useState([])
  const [expandedCard, setExpandedCard] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock data
  const stats = {
    totalUsers: 100,
    ngos: 10,
    policeAccounts: 15,
    systemHealth: "Good", // or "Critical"
  }

  // Get current date and time
  const now = new Date()
  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Fetch pending organizations
  const fetchPendingOrganizations = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/organizations/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch organizations')
      }

      const data = await response.json()
      // Filter only unapproved organizations
      setPendingOrganizations(data.filter(org => !org.is_approved))
    } catch (error) {
      console.error('Error fetching organizations:', error)
      setError('Failed to load pending organizations')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle organization approval
  const handleApprove = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/approve-organization/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          user_id: userId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to approve organization')
      }

      // Remove the approved organization from the list
      setPendingOrganizations(prev => prev.filter(org => org.id !== userId))
    } catch (error) {
      console.error('Error approving organization:', error)
      setError('Failed to approve organization')
    }
  }

  // Toggle card expansion
  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* <AdminSidebar onLogout={onLogout} /> */}

      {/* Main content */}
      <div className="flex-1 overflow-auto focus:outline-none">
        <main className="flex-1 relative pb-8 z-0">
          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    Admin Dashboard
                  </h1>
                  <p className="mt-1 text-sm text-gray-500">
                    {formattedDate} • {formattedTime}
                  </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <span className="shadow-sm rounded-md">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
                    >
                      Export Report
                    </button>
                  </span>
                  <span className="ml-3 shadow-sm rounded-md">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-700 active:bg-blue-700 transition duration-150 ease-in-out"
                    >
                      System Refresh
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Stats cards */}
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Users card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                        <FaUsers className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">{stats.totalUsers}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                        View all
                      </a>
                    </div>
                  </div>
                </div>

                {/* NGOs card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <FaBuilding className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">NGOs</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">{stats.ngos}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                        View all
                      </a>
                    </div>
                  </div>
                </div>

                {/* Police Accounts card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <FaUserShield className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Police Accounts</dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">{stats.policeAccounts}</div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                        View all
                      </a>
                    </div>
                  </div>
                </div>

                {/* System Health card */}
                <div
                  className={`bg-white overflow-hidden shadow rounded-lg ${
                    stats.systemHealth === "Good" ? "border-green-500" : "border-red-500"
                  } border-l-4`}
                >
                  <div className="p-5">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 ${
                          stats.systemHealth === "Good" ? "bg-green-100" : "bg-red-100"
                        } rounded-md p-3`}
                      >
                        <FaServer
                          className={`h-6 w-6 ${stats.systemHealth === "Good" ? "text-green-600" : "text-red-600"}`}
                        />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">System Health</dt>
                          <dd>
                            <div
                              className={`text-lg font-medium ${
                                stats.systemHealth === "Good" ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {stats.systemHealth}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3">
                    <div className="text-sm">
                      <a
                        href="#"
                        className={`font-medium ${
                          stats.systemHealth === "Good"
                            ? "text-green-600 hover:text-green-500"
                            : "text-red-600 hover:text-red-500"
                        }`}
                      >
                        View details
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <h2 className="mt-8 text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Manage Users */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-5 py-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
                        <FaUserCog className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Manage Users</h3>
                        <p className="mt-1 text-sm text-gray-500">View, edit, and manage user accounts</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <a
                        href="/admin/users"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Go to User Management
                      </a>
                    </div>
                  </div>
                </div>

                {/* Approve NGOs/Police */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-5 py-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
                        <FaCheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">Approve Organizations</h3>
                        <p className="mt-1 text-sm text-gray-500">Review and approve NGOs and Police accounts</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => {
                          setShowApprovalModal(true)
                          fetchPendingOrganizations()
                        }}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Review Pending Approvals
                      </button>
                    </div>
                  </div>
                </div>

                {/* View Logs */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-5 py-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
                        <FaClipboardList className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">View Logs</h3>
                        <p className="mt-1 text-sm text-gray-500">Monitor system activity and user actions</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <a
                        href="/admin/logs"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        Go to System Logs
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <h2 className="mt-8 text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                            <FaUsers className="h-4 w-4 text-blue-600" />
                          </div>
                          <p className="ml-3 text-sm font-medium text-gray-900">New user registered</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            2 minutes ago
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="text-sm text-gray-500">Hope Foundation (NGO) created an account</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-yellow-100 rounded-full p-1">
                            <FaExclamationTriangle className="h-4 w-4 text-yellow-600" />
                          </div>
                          <p className="ml-3 text-sm font-medium text-gray-900">System alert</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            1 hour ago
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="text-sm text-gray-500">Database backup completed successfully</p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-full p-1">
                            <FaCheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <p className="ml-3 text-sm font-medium text-gray-900">Account approved</p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            3 hours ago
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="text-sm text-gray-500">Delhi Police Station account was approved</p>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
              <button
                onClick={() => setShowApprovalModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : pendingOrganizations.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No pending approvals</p>
            ) : (
              <div className="space-y-4">
                {pendingOrganizations.map((org) => (
                  <div
                    key={org.id}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm"
                  >
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleCard(org.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{org.organization}</h3>
                          <p className="text-sm text-gray-500">{org.email}</p>
                          <p className="text-sm text-gray-500">{org.phone_number}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleApprove(org.id)
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Approve
                          </button>
                          {expandedCard === org.id ? (
                            <FaChevronUp className="text-gray-400" />
                          ) : (
                            <FaChevronDown className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expandedCard === org.id && (
                      <div className="border-t bg-gray-50 p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">First Name</p>
                            <p className="text-sm text-gray-900">{org.first_name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Last Name</p>
                            <p className="text-sm text-gray-900">{org.last_name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Phone Number</p>
                            <p className="text-sm text-gray-900">{org.phone_number}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Organization</p>
                            <p className="text-sm text-gray-900">{org.organization}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Location</p>
                            <p className="text-sm text-gray-900">{org.organization_location}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Role</p>
                            <p className="text-sm text-gray-900">{org.role}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

