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

// Mock data for demonstration
const MOCK_CASES = [
  {
    id: 1,
    name: "Aisha Patel",
    age: 8,
    gender: "Female",
    lastSeen: "2023-05-15",
    location: { lat: 28.6139, lng: 77.209 }, // Delhi
    photo: "/placeholder.svg?height=150&width=150",
    status: "missing",
    description: "Last seen wearing a blue school uniform. Has a small birthmark on her right cheek.",
    contactName: "Raj Patel",
    contactRelation: "Father",
    contactPhone: "+91 98765 43210",
    caseDate: "2023-05-15",
    caseLocation: "Near Delhi Public School, Mathura Road",
    aadhaarLast4: "4321",
  },
  {
    id: 2,
    name: "Mohammed Khan",
    age: 12,
    gender: "Male",
    lastSeen: "2023-06-02",
    location: { lat: 28.6271, lng: 77.2219 }, // Delhi area
    photo: "/placeholder.svg?height=150&width=150",
    status: "missing",
    description: "Last seen at a cricket match in the local park. Wearing a green t-shirt and jeans.",
    contactName: "Fatima Khan",
    contactRelation: "Mother",
    contactPhone: "+91 87654 32109",
    caseDate: "2023-06-02",
    caseLocation: "Lodhi Gardens, Delhi",
    aadhaarLast4: "7890",
  },
  {
    id: 3,
    name: "Priya Singh",
    age: 6,
    gender: "Female",
    lastSeen: "2023-04-28",
    location: { lat: 28.6129, lng: 77.2295 }, // Delhi area
    photo: "/placeholder.svg?height=150&width=150",
    status: "found",
    description: "Found safe at a relative's house. Was wearing a pink dress with white flowers.",
    contactName: "Vikram Singh",
    contactRelation: "Uncle",
    contactPhone: "+91 76543 21098",
    caseDate: "2023-04-28",
    caseLocation: "India Gate, Delhi",
    resolvedDate: "2023-05-01",
    aadhaarLast4: "5678",
  },
  {
    id: 4,
    name: "Rahul Sharma",
    age: 10,
    gender: "Male",
    lastSeen: "2023-05-20",
    location: { lat: 28.6362, lng: 77.241 }, // Delhi area
    photo: "/placeholder.svg?height=150&width=150",
    status: "missing",
    description: "Last seen at a school picnic. Has a scar on his left arm. Wearing a yellow t-shirt and blue shorts.",
    contactName: "Neha Sharma",
    contactRelation: "Mother",
    contactPhone: "+91 65432 10987",
    caseDate: "2023-05-20",
    caseLocation: "Red Fort, Delhi",
    aadhaarLast4: "2345",
  },
  {
    id: 5,
    name: "Ananya Gupta",
    age: 7,
    gender: "Female",
    lastSeen: "2023-06-10",
    location: { lat: 28.6508, lng: 77.2359 }, // Delhi area
    photo: "/placeholder.svg?height=150&width=150",
    status: "found",
    description: "Found at a local market. Was wearing a blue school uniform.",
    contactName: "Ravi Gupta",
    contactRelation: "Father",
    contactPhone: "+91 54321 09876",
    caseDate: "2023-06-10",
    caseLocation: "Connaught Place, Delhi",
    resolvedDate: "2023-06-11",
    aadhaarLast4: "9012",
  },
  {
    id: 6,
    name: "Vikram Malhotra",
    age: 9,
    gender: "Male",
    lastSeen: "2023-06-15",
    location: { lat: 28.6308, lng: 77.2159 }, // Delhi area
    photo: "/placeholder.svg?height=150&width=150",
    status: "missing",
    description: "Last seen at a birthday party. Wearing a red t-shirt and blue jeans.",
    contactName: "Sanjay Malhotra",
    contactRelation: "Father",
    contactPhone: "+91 43210 98765",
    caseDate: "2023-06-15",
    caseLocation: "Saket, Delhi",
    aadhaarLast4: "3456",
  },
  {
    id: 7,
    name: "Kavita Reddy",
    age: 11,
    gender: "Female",
    lastSeen: "2023-06-05",
    location: { lat: 28.6408, lng: 77.2259 }, // Delhi area
    photo: "/placeholder.svg?height=150&width=150",
    status: "missing",
    description: "Last seen at a shopping mall. Wearing a blue dress with white polka dots.",
    contactName: "Ramesh Reddy",
    contactRelation: "Father",
    contactPhone: "+91 32109 87654",
    caseDate: "2023-06-05",
    caseLocation: "Select Citywalk Mall, Delhi",
    aadhaarLast4: "6789",
  },
]

export default function SearchPage() {
  const [cases, setCases] = useState(MOCK_CASES)
  const [filteredCases, setFilteredCases] = useState([])
  const [selectedCase, setSelectedCase] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nameSearch, setNameSearch] = useState("")
  const [aadhaarSearch, setAadhaarSearch] = useState("")
  const [activeSearch, setActiveSearch] = useState("name") // 'name' or 'aadhaar'
  const [showOnlyMissing, setShowOnlyMissing] = useState(true)

  // Initialize filtered cases
  useEffect(() => {
    const filtered = cases.filter((c) => (showOnlyMissing ? c.status === "missing" : true))
    setFilteredCases(filtered)
  }, [cases, showOnlyMissing])

  // Handle search by name
  const handleNameSearch = (e) => {
    const value = e.target.value
    setNameSearch(value)

    if (value.trim() === "") {
      const filtered = cases.filter((c) => (showOnlyMissing ? c.status === "missing" : true))
      setFilteredCases(filtered)
    } else {
      const filtered = cases.filter(
        (c) => (showOnlyMissing ? c.status === "missing" : true) && c.name.toLowerCase().includes(value.toLowerCase()),
      )
      setFilteredCases(filtered)
    }
  }

  // Handle search by Aadhaar
  const handleAadhaarSearch = (e) => {
    const value = e.target.value
    setAadhaarSearch(value)

    if (value.trim() === "") {
      const filtered = cases.filter((c) => (showOnlyMissing ? c.status === "missing" : true))
      setFilteredCases(filtered)
    } else {
      const filtered = cases.filter(
        (c) => (showOnlyMissing ? c.status === "missing" : true) && c.aadhaarLast4.includes(value),
      )
      setFilteredCases(filtered)
    }
  }

  // Handle case click
  const handleCaseClick = (caseData) => {
    setSelectedCase(caseData)
    setIsModalOpen(true)
  }

  // Handle case solved
  const handleCaseSolved = () => {
    // Update the case status
    const updatedCases = cases.map((c) =>
      c.id === selectedCase.id ? { ...c, status: "found", resolvedDate: new Date().toISOString().split("T")[0] } : c,
    )

    setCases(updatedCases)
    setIsModalOpen(false)

    // Update filtered cases
    const filtered = updatedCases.filter((c) => (showOnlyMissing ? c.status === "missing" : true))
    setFilteredCases(filtered)
  }

  // Toggle between showing only missing or all cases
  const toggleShowMissing = () => {
    setShowOnlyMissing(!showOnlyMissing)
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
                placeholder="Enter last 4 digits of Aadhaar..."
                value={aadhaarSearch}
                onChange={handleAadhaarSearch}
                disabled={activeSearch !== "aadhaar"}
                maxLength={4}
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

