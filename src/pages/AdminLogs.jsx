
import { useState } from "react"
import AdminSidebar from "../components/AdminSidebar"
import { FaSearch, FaDownload, FaExclamationCircle, FaCheckCircle, FaInfoCircle } from "react-icons/fa"

export default function AdminLogs() {
  // Mock log data
  const initialLogs = [
    {
      id: 1,
      timestamp: "2023-06-15 14:32:45",
      action: "User Login",
      user: "Delhi Police Station",
      details: "Successful login from IP 192.168.1.1",
      level: "info",
    },
    {
      id: 2,
      timestamp: "2023-06-15 13:45:22",
      action: "Account Approved",
      user: "Admin",
      details: "Approved NGO account: Hope Foundation",
      level: "success",
    },
    {
      id: 3,
      timestamp: "2023-06-15 12:30:18",
      action: "Failed Login",
      user: "Unknown",
      details: "Failed login attempt for user: central@police.gov.in",
      level: "warning",
    },
    {
      id: 4,
      timestamp: "2023-06-15 11:15:33",
      action: "Case Reported",
      user: "Child Welfare NGO",
      details: "New missing person case reported: Aisha Patel",
      level: "info",
    },
    {
      id: 5,
      timestamp: "2023-06-15 10:05:12",
      action: "System Error",
      user: "System",
      details: "Database connection timeout after 30s",
      level: "error",
    },
    {
      id: 6,
      timestamp: "2023-06-15 09:45:30",
      action: "User Registration",
      user: "System",
      details: "New organization registered: Rescue Relief",
      level: "info",
    },
    {
      id: 7,
      timestamp: "2023-06-15 08:30:25",
      action: "Account Suspended",
      user: "Admin",
      details: "Suspended account: Central Police",
      level: "warning",
    },
    {
      id: 8,
      timestamp: "2023-06-14 23:15:10",
      action: "Backup Completed",
      user: "System",
      details: "Daily database backup completed successfully",
      level: "success",
    },
    {
      id: 9,
      timestamp: "2023-06-14 22:05:45",
      action: "Config Changed",
      user: "Admin",
      details: "System configuration updated: email notifications enabled",
      level: "info",
    },
    {
      id: 10,
      timestamp: "2023-06-14 20:30:15",
      action: "API Error",
      user: "System",
      details: "External API call failed: geocoding service unavailable",
      level: "error",
    },
    {
      id: 11,
      timestamp: "2023-06-14 19:45:22",
      action: "User Login",
      user: "Hope Foundation",
      details: "Successful login from IP 192.168.1.5",
      level: "info",
    },
    {
      id: 12,
      timestamp: "2023-06-14 18:30:18",
      action: "Case Updated",
      user: "Delhi Police Station",
      details: "Case status updated: Rahul Sharma - Found",
      level: "success",
    },
  ]

  const [logs, setLogs] = useState(initialLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterLevel, setFilterLevel] = useState("All")
  const logsPerPage = 5

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  // Filter logs based on search term and level filter
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = filterLevel === "All" || log.level === filterLevel

    return matchesSearch && matchesLevel
  })

  // Pagination
  const indexOfLastLog = currentPage * logsPerPage
  const indexOfFirstLog = indexOfLastLog - logsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog)
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  // Get log level icon
  const getLevelIcon = (level) => {
    switch (level) {
      case "info":
        return <FaInfoCircle className="h-5 w-5 text-blue-500" />
      case "success":
        return <FaCheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <FaExclamationCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <FaExclamationCircle className="h-5 w-5 text-red-500" />
      default:
        return <FaInfoCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* <AdminSidebar /> */}

      {/* Main content */}
      <div className="flex-1 overflow-auto focus:outline-none">
        <main className="flex-1 relative pb-8 z-0">
          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">System Logs</h1>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaDownload className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                    Export Logs
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Search and filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 md:space-x-4 mb-5">
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <label htmlFor="filter-level" className="text-sm font-medium text-gray-700">
                    Filter by:
                  </label>
                  <select
                    id="filter-level"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                  >
                    <option value="All">All Levels</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
              </div>

              {/* Logs table */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Timestamp
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Action
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        User
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentLogs.length > 0 ? (
                      currentLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getLevelIcon(log.level)}
                              <span className="ml-2 text-sm font-medium text-gray-900">{log.action}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.user}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{log.details}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                          No logs found matching your search criteria
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-md shadow">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstLog + 1}</span> to{" "}
                      <span className="font-medium">
                        {indexOfLastLog > filteredLogs.length ? filteredLogs.length : indexOfLastLog}
                      </span>{" "}
                      of <span className="font-medium">{filteredLogs.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {[...Array(totalPages).keys()].map((number) => (
                        <button
                          key={number + 1}
                          onClick={() => paginate(number + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === number + 1
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {number + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

