"use client"

import { useState, useEffect } from "react"
import {
  FaSearch,
  FaUser,
  FaBell,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaCalendarAlt,
  FaUserCircle,
  FaCheckCircle,
  FaTimes,
  FaIdCard,
  FaFilter,
  FaSortAmountDown,
  FaEye,
} from "react-icons/fa"
import CasesList from "../components/CasesList"
import CaseDetailModal from "../components/CaseDetailModal"

export default function SearchPage() {
  const [cases, setCases] = useState([])
  const [filteredCases, setFilteredCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nameSearch, setNameSearch] = useState("")
  const [aadhaarSearch, setAadhaarSearch] = useState("")
  const [activeSearch, setActiveSearch] = useState("name") // 'name' or 'aadhaar'
  const [showOnlyMissing, setShowOnlyMissing] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch cases from API
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
          throw new Error('No access token found')
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/missing-persons/missing-persons/list_all/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Unauthorized: Please log in again')
          }
          throw new Error('Failed to fetch cases')
        }
        
        const data = await response.json()
        setCases(data.results)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching cases:', err)
        if (err.message === 'Unauthorized: Please log in again') {
          window.location.href = '/login'
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCases()
  }, [])

  // Initialize filtered cases
  useEffect(() => {
    const filtered = cases.filter((c) => (showOnlyMissing ? c.status === "MISSING" : true))
    setFilteredCases(filtered)
  }, [cases, showOnlyMissing])

  // Handle search by name
  const handleNameSearch = (e) => {
    const value = e.target.value
    setNameSearch(value)

    if (value.trim() === "") {
      const filtered = cases.filter((c) => (showOnlyMissing ? c.status === "MISSING" : true))
      setFilteredCases(filtered)
    } else {
      const filtered = cases.filter(
        (c) => (showOnlyMissing ? c.status === "MISSING" : true) && c.name.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredCases(filtered)
    }
  }

  // Handle search by Aadhaar
  const handleAadhaarSearch = (e) => {
    const value = e.target.value
    setAadhaarSearch(value)

    if (value.trim() === "") {
      const filtered = cases.filter((c) => (showOnlyMissing ? c.status === "MISSING" : true))
      setFilteredCases(filtered)
    } else {
      const filtered = cases.filter(
        (c) => (showOnlyMissing ? c.status === "MISSING" : true) && c.aadhaar_number?.includes(value),
      )
      setFilteredCases(filtered)
    }
  }

  // Handle case click
  const handleCaseClick = (caseData) => {
    setSelectedCase(caseData)
    setIsModalOpen(true)
  }

  // Toggle between showing only missing or all cases
  const toggleShowMissing = () => {
    setShowOnlyMissing(!showOnlyMissing)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading cases...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error loading cases: {error}</div>
  }

  return (
    <>
        {/* Search Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Missing Persons</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search by Name */}
            <div
              className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${activeSearch === "name" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => setActiveSearch("name")}
            >
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <FaUser className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Search by Name</h3>
                  <p className="text-sm text-gray-500">Find missing persons by their name</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 bg-gray-50"
                  placeholder="Enter name..."
                  value={nameSearch}
                  onChange={handleNameSearch}
                  disabled={activeSearch !== "name"}
                />
              </div>
            </div>

            {/* Search by Aadhaar */}
            <div
              className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${activeSearch === "aadhaar" ? "border-blue-500" : "border-transparent"}`}
              onClick={() => setActiveSearch("aadhaar")}
            >
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <FaIdCard className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Search by Aadhaar</h3>
                  <p className="text-sm text-gray-500">Find missing persons by Aadhaar number</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 bg-gray-50"
                placeholder="Enter Aadhaar number..."
                  value={aadhaarSearch}
                  onChange={handleAadhaarSearch}
                  disabled={activeSearch !== "aadhaar"}
                />
            </div>
            </div>
          </div>
        </div>

        {/* List Section */}
      <CasesList
        cases={filteredCases}
        showOnlyMissing={showOnlyMissing}
        onToggleShowMissing={toggleShowMissing}
        onCaseClick={handleCaseClick}
      />

      {/* Case Detail Modal */}
      <CaseDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedCase={selectedCase} />
    </>
  )
}

