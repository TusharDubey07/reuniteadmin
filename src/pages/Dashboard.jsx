import { useState, useEffect } from "react"
import { FaExclamationCircle, FaCheckCircle, FaHandshake, FaEnvelope } from "react-icons/fa"
import CasesMap from "../components/CasesMap"
import CaseDetailModal from "../components/CaseDetailModal"
import "../styles/dashboard.css"

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
  },
]

// Mock data for police stations
const MOCK_POLICE_STATIONS = [
  {
    id: 1,
    name: "Central Police Station",
    location: { lat: 28.6139, lng: 77.209 },
    address: "Connaught Place, New Delhi",
    contact: "+91 98765 43210",
    distance: "2.5 km",
  },
  {
    id: 2,
    name: "North District Station",
    location: { lat: 28.6271, lng: 77.2219 },
    address: "Civil Lines, New Delhi",
    contact: "+91 87654 32109",
    distance: "3.8 km",
  },
  {
    id: 3,
    name: "South Police Station",
    location: { lat: 28.6129, lng: 77.2295 },
    address: "Defence Colony, New Delhi",
    contact: "+91 76543 21098",
    distance: "4.2 km",
  },
  {
    id: 4,
    name: "East District HQ",
    location: { lat: 28.6362, lng: 77.241 },
    address: "Preet Vihar, New Delhi",
    contact: "+91 65432 10987",
    distance: "5.1 km",
  },
  {
    id: 5,
    name: "West Police Station",
    location: { lat: 28.6508, lng: 77.2359 },
    address: "Rajouri Garden, New Delhi",
    contact: "+91 54321 09876",
    distance: "6.3 km",
  },
]

// Mock data for collaboration requests
const MOCK_COLLABORATION_REQUESTS = [
  {
    id: 1,
    ngoName: "Child Rescue Foundation",
    ngoLocation: "Connaught Place, New Delhi",
    requestDate: "2024-03-15",
    status: "pending",
  },
  {
    id: 2,
    ngoName: "Missing Children Support",
    ngoLocation: "Karol Bagh, New Delhi",
    requestDate: "2024-03-14",
    status: "pending",
  },
  {
    id: 3,
    ngoName: "Family Reunite India",
    ngoLocation: "Lajpat Nagar, New Delhi",
    requestDate: "2024-03-13",
    status: "accepted",
  },
]

export default function Dashboard({ userRole = "ngo" }) {
  const [selectedCase, setSelectedCase] = useState(null)
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.209 })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hoveredMarker, setHoveredMarker] = useState(null)
  const [showPoliceStations, setShowPoliceStations] = useState(false)
  const [showCollaborationSent, setShowCollaborationSent] = useState(false)
  const [showInvitations, setShowInvitations] = useState(false)
  const [selectedStation, setSelectedStation] = useState(null)

  const activeCases = MOCK_CASES.filter((c) => c.status === "missing").length
  const solvedCases = MOCK_CASES.filter((c) => c.status === "found").length

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const handleMarkerClick = (caseData) => {
    setSelectedCase(caseData)
    setIsModalOpen(true)
  }

  const handleMarkerHover = (caseData) => {
    setHoveredMarker(caseData)
  }

  const handleMarkerLeave = () => {
    setHoveredMarker(null)
  }

  const handleCollaborationRequest = (station) => {
    setSelectedStation(station)
    // Simulate API call
    setTimeout(() => {
      setShowCollaborationSent(true)
      setTimeout(() => {
        setShowCollaborationSent(false)
      }, 3000)
    }, 1000)
  }

  const handleInvitationResponse = (requestId, accept) => {
    // Simulate API call
    setTimeout(() => {
      setShowInvitations(false)
      // Show success message
      alert(accept ? "Collaboration request accepted!" : "Collaboration request rejected.")
    }, 1000)
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Active Cases Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                <FaExclamationCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Cases</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{activeCases}</div>
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

        {/* Solved Cases Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Solved Cases</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{solvedCases}</div>
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

        {/* Collaboration Card (for NGO) */}
        {userRole === "ngo" && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <FaHandshake className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Add Collaboration</dt>
                    <dd>
                      <button
                        onClick={() => setShowPoliceStations(true)}
                        className="text-lg font-medium text-blue-600 hover:text-blue-500"
                      >
                        Find Nearby Stations
                      </button>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Invitations Card (for Law Enforcement) */}
        {userRole === "law" && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <FaEnvelope className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">View Invitations</dt>
                    <dd>
                      <button
                        onClick={() => setShowInvitations(true)}
                        className="text-lg font-medium text-purple-600 hover:text-purple-500"
                      >
                        Check Requests
                      </button>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="mt-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Cases Near Me</h3>
            <p className="mt-1 text-sm text-gray-500">
              Showing cases within your vicinity. Click on a marker for more details.
            </p>
          </div>
          <CasesMap
            cases={MOCK_CASES}
            userLocation={userLocation}
            onMarkerClick={handleMarkerClick}
            onMarkerHover={handleMarkerHover}
            onMarkerLeave={handleMarkerLeave}
            hoveredMarker={hoveredMarker}
          />
        </div>
      </div>

      {/* Case Detail Modal */}
      <CaseDetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedCase={selectedCase} />

      {/* Police Stations Modal */}
      {showPoliceStations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Nearby Police Stations</h3>
              <button
                onClick={() => setShowPoliceStations(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {MOCK_POLICE_STATIONS.map((station) => (
                <div key={station.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{station.name}</h4>
                      <p className="text-sm text-gray-500">{station.address}</p>
                      <p className="text-sm text-gray-500">Distance: {station.distance}</p>
                      <p className="text-sm text-gray-500">Contact: {station.contact}</p>
                    </div>
                    <button
                      onClick={() => handleCollaborationRequest(station)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Collaboration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Sent Modal */}
      {showCollaborationSent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <FaCheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Collaboration Request Sent!</h3>
              <p className="text-sm text-gray-600">
                Your collaboration request has been sent to {selectedStation?.name}. They will review and respond to your request.
              </p>
              <button
                onClick={() => setShowCollaborationSent(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invitations Modal */}
      {showInvitations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Collaboration Requests</h3>
              <button
                onClick={() => setShowInvitations(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {MOCK_COLLABORATION_REQUESTS.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{request.ngoName}</h4>
                      <p className="text-sm text-gray-500">{request.ngoLocation}</p>
                      <p className="text-sm text-gray-500">Requested on: {request.requestDate}</p>
                      {request.status === "accepted" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Accepted
                        </span>
                      )}
                    </div>
                    {request.status === "pending" && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleInvitationResponse(request.id, true)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleInvitationResponse(request.id, false)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

