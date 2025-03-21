import { useState, useEffect } from 'react'
import {
  FaChevronDown,
  FaChevronUp,
  FaCheck,
  FaClock,
  FaMapMarkerAlt,
  FaUser,
  FaSpinner,
  FaTimes,
  FaImage
} from 'react-icons/fa'

export default function SightingsList() {
  const [sightings, setSightings] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedCards, setExpandedCards] = useState([])
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const [selectedSightingId, setSelectedSightingId] = useState(null)
  const [verificationNotes, setVerificationNotes] = useState('')
  const [verifyLoading, setVerifyLoading] = useState(false)

  useEffect(() => {
    fetchSightings()
  }, [])

  const fetchSightings = async () => {
    try {
      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        throw new Error('No access token found')
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sightings/sightings/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sightings')
      }

      const data = await response.json()
      setSightings(data.results || data)
      setStatistics(data.statistics)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching sightings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (!selectedSightingId) return

    setVerifyLoading(true)
    try {
      const accessToken = localStorage.getItem('access_token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sightings/sightings/${selectedSightingId}/verify/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          verification_status: 'VERIFIED',
          verification_notes: verificationNotes || 'Verified by admin'
        })
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to verify sighting');
      }

      // Update the sighting status in the local state
      setSightings(prevSightings =>
        prevSightings.map(sighting =>
          sighting.id === selectedSightingId
            ? { ...sighting, verification_status: 'VERIFIED' }
            : sighting
        )
      )

      setShowVerifyModal(false)
      setVerificationNotes('')
    } catch (err) {
      setError(err.message)
      console.error('Error verifying sighting:', err)
    } finally {
      setVerifyLoading(false)
    }
  }

  const toggleExpand = (id) => {
    setExpandedCards(prev =>
      prev.includes(id)
        ? prev.filter(cardId => cardId !== id)
        : [...prev, id]
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sightings List</h1>
      
      <div className="grid gap-6">
        {sightings.map((sighting) => (
          <div
            key={sighting.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2">
                    Case #{sighting.missing_person?.case_number || 'N/A'}
                  </h2>
                  <div className="text-gray-600">
                    <p>Name: {sighting.missing_person?.name || 'N/A'}</p>
                    <p>Age: {sighting.missing_person?.age || 'N/A'}</p>
                    <p>Gender: {sighting.missing_person?.gender || 'N/A'}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(sighting.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedCards.includes(sighting.id) ? (
                    <FaChevronUp size={20} />
                  ) : (
                    <FaChevronDown size={20} />
                  )}
                </button>
              </div>

              {expandedCards.includes(sighting.id) && (
                <div className="mt-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Location Details</h3>
                      <p>Location: {sighting.location}</p>
                      <p>Type: {sighting.location_type}</p>
                      <p>Crowd Density: {sighting.crowd_density}</p>
                      <p>
                        Coordinates: {sighting.latitude}, {sighting.longitude}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Reporter Information</h3>
                      <p>Name: {sighting.reporter_name}</p>
                      <p>Contact: {sighting.reporter_contact}</p>
                      <p>Timestamp: {formatDate(sighting.timestamp)}</p>
                    </div>
                  </div>
                  
                  {sighting.photo && (
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Photo</h3>
                      <img
                        src={sighting.photo}
                        alt="Sighting"
                        className="max-w-sm rounded-lg shadow-md"
                      />
                    </div>
                  )}

                  {/* Show verify button only if not verified */}
                  {(sighting.status !== 'VERIFIED' && sighting.verification_status !== 'VERIFIED') && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          setSelectedSightingId(sighting.id)
                          setShowVerifyModal(true)
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Verify Sighting
                      </button>
                    </div>
                  )}

                  {/* Show verified status if verified */}
                  {(sighting.status === 'VERIFIED' || sighting.verification_status === 'VERIFIED') && (
                    <div className="mt-4 flex items-center text-green-500">
                      <FaCheck className="mr-2" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Verify Sighting</h3>
            <textarea
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="Add verification notes..."
              className="w-full h-32 p-2 border rounded-md mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setShowVerifyModal(false)
                  setVerificationNotes('')
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                disabled={verifyLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
              >
                {verifyLoading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </span>
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 