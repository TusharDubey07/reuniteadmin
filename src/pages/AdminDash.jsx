import AdminSidebar from "../components/AdminSidebar"
import {
  FaUsers,
  FaBuilding,
  FaUserShield,
  FaMapMarkerAlt,
  FaUserCog,
  FaCheckCircle,
  FaClipboardList,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaTimes,
} from "react-icons/fa"
import { useState, useEffect } from "react"

export default function AdminDashboard({ onLogout }) {
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [pendingOrganizations, setPendingOrganizations] = useState([])
  const [expandedCard, setExpandedCard] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [userAnalytics, setUserAnalytics] = useState({
    total_users: 0,
    roles: {
      citizen: 0,
      ngo: 0,
      law_enforcement: 0,
      admin: 0
    }
  })
  const [caseAnalytics, setCaseAnalytics] = useState({
    total_cases: 0,
    cases_by_region: []
  })

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

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        throw new Error('No access token found')
      }

      // Fetch user analytics
      const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/users/analytics/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      // Fetch case analytics
      const caseResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/missing-persons/missing-persons/analytics/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!userResponse.ok || !caseResponse.ok) {
        throw new Error('Failed to fetch analytics')
      }

      const userData = await userResponse.json()
      const caseData = await caseResponse.json()

      setUserAnalytics(userData)
      setCaseAnalytics(caseData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to load analytics data')
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

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
      
      // Get organizations from results array if paginated, otherwise use data directly
      const organizations = data.results || data
      
      // Filter only unapproved organizations
      setPendingOrganizations(organizations.filter(org => !org.is_approved))
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
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        throw new Error('No access token found')
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/approve-organization/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          user_id: userId
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.detail || 'Failed to approve organization')
      }

      // Remove the approved organization from the list
      setPendingOrganizations(prev => prev.filter(org => org.id !== userId))

      // Show success message
      setError("") // Clear any existing errors
    } catch (error) {
      console.error('Error approving organization:', error)
      setError(error.message || 'Failed to approve organization')
    }
  }

  // Toggle card expansion
  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  // Function to handle document preview
  const handleDocumentPreview = (doc) => {
    window.open(doc.file_url, '_blank')
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
                            <div className="text-lg font-medium text-gray-900">{userAnalytics.total_users}</div>
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
                            <div className="text-lg font-medium text-gray-900">{userAnalytics.roles.ngo}</div>
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
                            <div className="text-lg font-medium text-gray-900">{userAnalytics.roles.law_enforcement}</div>
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

                {/* Total Cases card */}
                <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-green-500">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <FaMapMarkerAlt className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Cases</dt>
                          <dd>
                            <div className="text-lg font-medium text-green-600">
                              {caseAnalytics.total_cases}
                            </div>
                          </dd>
                        </dl>
                      </div>
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

              {/* Recent Activity - Cases by Region */}
              <h2 className="mt-8 text-lg leading-6 font-medium text-gray-900 mb-4">Cases by Region</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {caseAnalytics.cases_by_region.map((region, index) => (
                    <li key={index}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-1">
                              <FaMapMarkerAlt className="h-4 w-4 text-blue-600" />
                            </div>
                            <p className="ml-3 text-sm font-medium text-gray-900">{region.last_seen_location}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {region.count} cases
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
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
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-sm text-gray-900">{org.email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Address</p>
                            <p className="text-sm text-gray-900">{org.address || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">City</p>
                            <p className="text-sm text-gray-900">{org.city || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">State</p>
                            <p className="text-sm text-gray-900">{org.state || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Pincode</p>
                            <p className="text-sm text-gray-900">{org.pincode || '-'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Organization Coordinates</p>
                            <p className="text-sm text-gray-900">
                              {org.organization_latitude && org.organization_longitude 
                                ? `${org.organization_latitude}, ${org.organization_longitude}`
                                : '-'}
                            </p>
                          </div>
                        </div>

                        {/* Verification Documents Section */}
                        <div className="mt-6">
                          <h4 className="text-lg font-medium text-gray-900 mb-4">Verification Documents</h4>
                          {org.verification_documents && org.verification_documents.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {org.verification_documents.map((doc, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-white">
                                  <p className="text-sm font-medium text-gray-500 mb-2">
                                    {doc.document_type || 'Document'}
                                  </p>
                                  {doc.document && (
                                    <div className="flex flex-col space-y-2">
                                      <a 
                                        href={doc.document}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group"
                                      >
                                        {doc.document.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/) ? (
                                          <div className="relative">
                                            <img
                                              src={doc.document}
                                              alt="Document preview"
                                              className="w-full h-40 object-cover rounded-md group-hover:opacity-75 transition-opacity"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                              <span className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-md">
                                                Click to view
                                              </span>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                          </div>
                                        )}
                                      </a>
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                          {doc.document_type || `Document ${index + 1}`}
                                        </span>
                                        <a
                                          href={doc.document}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                          Open
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">No verification documents available</p>
                          )}
                        </div>

                        {/* Profile Picture Section */}
                        {org.profile_picture && (
                          <div className="mt-6">
                            <h4 className="text-lg font-medium text-gray-900 mb-4">Profile Picture</h4>
                            <div className="w-32 h-32 rounded-full overflow-hidden">
                              <img
                                src={org.profile_picture}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}
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

