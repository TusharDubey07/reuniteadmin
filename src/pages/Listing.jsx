import { useState, useEffect, useRef } from "react"
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaCamera,
  FaUndo,
  FaBuilding,
  FaShieldAlt,
  FaTimes,
  FaCheck,
  FaArrowLeft,
  FaSearch,
  FaSpinner
} from "react-icons/fa"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import "../styles/listing.css"

// Mock data for nearby NGOs and police stations
const NEARBY_ORGANIZATIONS = [
  {
    id: 1,
    name: "Child Welfare NGO",
    type: "ngo",
    location: { lat: 28.6189, lng: 77.21 },
    address: "123 Main Street, Delhi",
    phone: "+91 98765 43210",
    email: "contact@childwelfare.org",
    distance: "0.8 km",
  },
  {
    id: 2,
    name: "Delhi Police Station",
    type: "police",
    location: { lat: 28.6159, lng: 77.209 },
    address: "456 Central Avenue, Delhi",
    phone: "+91 87654 32109",
    email: "delhipolice@gov.in",
    distance: "1.2 km",
  },
  {
    id: 3,
    name: "Hope Foundation",
    type: "ngo",
    location: { lat: 28.6219, lng: 77.215 },
    address: "789 Hope Street, Delhi",
    phone: "+91 76543 21098",
    email: "info@hopefoundation.org",
    distance: "1.5 km",
  },
  {
    id: 4,
    name: "Central Police Station",
    type: "police",
    location: { lat: 28.6109, lng: 77.205 },
    address: "101 Government Road, Delhi",
    phone: "+91 65432 10987",
    email: "centralpolice@gov.in",
    distance: "2.0 km",
  },
]

export default function SightingPage() {
  const [formData, setFormData] = useState({
    location: '',
    latitude: '',
    longitude: '',
    location_type: 'OUTDOOR',
    crowd_density: 'MEDIUM',
    observed_behavior: '',
    confidence_level_numeric: 85,
    willing_to_contact: true,
    companions: 'ALONE',
    timestamp: new Date().toISOString().slice(0, 16),
    description: '',
    location_details: '',
    direction_headed: '',
    wearing: '',
    reporter_name: '',
    reporter_contact: ''
  })

  const [showMissingPersons, setShowMissingPersons] = useState(false)
  const [includePhoto, setIncludePhoto] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [missingPersons, setMissingPersons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showMissingPersonsList, setShowMissingPersonsList] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  useEffect(() => {
    if (showMissingPersons) {
      fetchMissingPersons()
    }
  }, [showMissingPersons])

  const fetchMissingPersons = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/missing-persons/missing-persons/list_all/`, {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ4NDA0MzYyLCJpYXQiOjE3NDU4MTIzNjIsImp0aSI6IjdjZjM4OGJhNjMwYTRlMDQ4ZTllN2Q4ZjU2YmU2ZWE5IiwidXNlcl9pZCI6MX0.vUPbzHH8lE9LMTnb2qwayd0wfdDOuHwem-OGQJEveoU',
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch missing persons')
      }
      const data = await response.json()
      setMissingPersons(data.results || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching missing persons:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Format coordinates before sending
      const formattedLatitude = formatCoordinate(formData.latitude)
      const formattedLongitude = formatCoordinate(formData.longitude)

      // Validate coordinates
      if (isNaN(parseFloat(formattedLatitude)) || isNaN(parseFloat(formattedLongitude))) {
        throw new Error('Please enter valid coordinates')
      }

      // Validate reporter information
      if (!formData.reporter_name.trim()) {
        throw new Error('Please enter your name')
      }
      if (!formData.reporter_contact.trim()) {
        throw new Error('Please enter your contact number')
      }

      const formDataToSend = new FormData()

      // Required fields
      formDataToSend.append('location', formData.location)
      formDataToSend.append('latitude', formattedLatitude)
      formDataToSend.append('longitude', formattedLongitude)
      formDataToSend.append('location_type', formData.location_type)
      formDataToSend.append('crowd_density', formData.crowd_density)
      formDataToSend.append('observed_behavior', formData.observed_behavior)
      formDataToSend.append('confidence_level_numeric', formData.confidence_level_numeric)
      formDataToSend.append('willing_to_contact', formData.willing_to_contact)
      formDataToSend.append('companions', formData.companions)
      formDataToSend.append('timestamp', formData.timestamp)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('reporter_name', formData.reporter_name)
      formDataToSend.append('reporter_contact', formData.reporter_contact)

      // Optional fields
      if (formData.location_details) {
        formDataToSend.append('location_details', formData.location_details)
      }
      if (formData.direction_headed) {
        formDataToSend.append('direction_headed', formData.direction_headed)
      }
      if (formData.wearing) {
        formDataToSend.append('wearing', formData.wearing)
      }

      // Add missing person ID if selected
      if (showMissingPersons && selectedPerson) {
        formDataToSend.append('missing_person', selectedPerson.id)
      }

      // Add photo if included
      if (includePhoto && photo) {
        formDataToSend.append('photo', photo)
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/sightings/sightings/`, {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400) {
          let errorMessage = 'Validation error: '
          if (typeof data === 'object') {
            const errors = []
            for (const [key, value] of Object.entries(data)) {
              errors.push(`${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            }
            errorMessage += errors.join('; ')
          } else {
            errorMessage += JSON.stringify(data)
          }
          throw new Error(errorMessage)
        }
        throw new Error(data.detail || 'Failed to submit sighting')
      }

      setSuccess(true)
      // Reset form
      setFormData({
        location: '',
        latitude: '',
        longitude: '',
        location_type: 'OUTDOOR',
        crowd_density: 'MEDIUM',
        observed_behavior: '',
        confidence_level_numeric: 85,
        willing_to_contact: true,
        companions: 'ALONE',
        timestamp: new Date().toISOString().slice(0, 16),
        description: '',
        location_details: '',
        direction_headed: '',
        wearing: '',
        reporter_name: '',
        reporter_contact: ''
      })
      setSelectedPerson(null)
      setPhoto(null)
      setShowMissingPersons(false)
      setIncludePhoto(false)
    } catch (err) {
      console.error('Error submitting sighting:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredPersons = missingPersons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handlePersonSelect = (person) => {
    setSelectedPerson(person)
    setShowMissingPersonsList(false)
  }

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          })
          setIsGettingLocation(false)
        },
        (error) => {
          setError("Failed to get current location: " + error.message)
          setIsGettingLocation(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
      setIsGettingLocation(false)
    }
  }

  const formatCoordinate = (value) => {
    if (!value) return value
    const num = parseFloat(value)
    return isNaN(num) ? value : num.toFixed(6)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Report a Sighting</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-700">Sighting reported successfully!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reporter Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="reporter_name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="reporter_name"
              value={formData.reporter_name}
              onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
              required
            />
          </div>
          <div>
            <label htmlFor="reporter_contact" className="block text-sm font-medium text-gray-700">Your Contact Number</label>
            <input
              type="tel"
              id="reporter_contact"
              value={formData.reporter_contact}
              onChange={(e) => setFormData({ ...formData, reporter_contact: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
              required
            />
          </div>
        </div>

        {/* Missing Person Selection */}
        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="showMissingPersons"
              checked={showMissingPersons}
              onChange={(e) => setShowMissingPersons(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showMissingPersons" className="ml-2 block text-sm text-gray-900">
              Is this person in the missing persons list?
            </label>
          </div>

          {showMissingPersons && (
            <div className="relative">
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowMissingPersonsList(true)
                  }}
                  onClick={() => setShowMissingPersonsList(true)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
                />
                <FaSearch className="absolute right-3 text-gray-400" />
              </div>

              {showMissingPersonsList && filteredPersons.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredPersons.map((person) => (
                    <div
                      key={person.id}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handlePersonSelect(person)}
                    >
                      <div className="font-medium">{person.name}</div>
                      <div className="text-sm text-gray-500">
                        {person.gender} • Emergency Contact: {person.emergency_contact_name} ({person.emergency_contact_phone})
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedPerson && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{selectedPerson.name}</p>
                      <p className="text-sm text-gray-600">Case: {selectedPerson.case_number}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedPerson(null)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
              </div>
              )}
            </div>
          )}
          </div>

        {/* Location Information */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
                required
              />
            </div>
          <div>
            <label htmlFor="location_details" className="block text-sm font-medium text-gray-700">Location Details</label>
            <input
              type="text"
              id="location_details"
              value={formData.location_details}
              onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
            />
          </div>
          <div className="col-span-2">
              <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Coordinates</label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-150"
              >
                {isGettingLocation ? (
                  <>
                    <FaSpinner className="animate-spin -ml-0.5 mr-2 h-4 w-4" />
                    Getting Location...
                  </>
                ) : (
                  <>
                    <FaMapMarkerAlt className="-ml-0.5 mr-2 h-4 w-4" />
                    Get Current Location
                  </>
                )}
                </button>
              </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.000001"
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || (parseFloat(value) >= -90 && parseFloat(value) <= 90)) {
                        setFormData({ ...formData, latitude: value })
                      }
                    }}
                    onBlur={(e) => {
                      const formatted = formatCoordinate(e.target.value)
                      setFormData({ ...formData, latitude: formatted })
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
                    required
                    placeholder="Enter latitude (-90 to 90)"
                    min="-90"
                    max="90"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 mt-1">
                    Lat
                  </span>
                </div>
                </div>
                <div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.000001"
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value === '' || (parseFloat(value) >= -180 && parseFloat(value) <= 180)) {
                        setFormData({ ...formData, longitude: value })
                      }
                    }}
                    onBlur={(e) => {
                      const formatted = formatCoordinate(e.target.value)
                      setFormData({ ...formData, longitude: formatted })
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
                    required
                    placeholder="Enter longitude (-180 to 180)"
                    min="-180"
                    max="180"
                  />
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 mt-1">
                    Long
                  </span>
                </div>
              </div>
                </div>
              </div>
            </div>

        {/* Sighting Details */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="location_type" className="block text-sm font-medium text-gray-700">Location Type</label>
            <select
              id="location_type"
              value={formData.location_type}
              onChange={(e) => setFormData({ ...formData, location_type: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
            >
              <option value="INDOOR">Indoor</option>
              <option value="OUTDOOR">Outdoor</option>
              <option value="PUBLIC">Public Transport</option>
              <option value="UNKNOWN">Unknown</option>
            </select>
          </div>
          <div>
            <label htmlFor="crowd_density" className="block text-sm font-medium text-gray-700">Crowd Density</label>
            <select
              id="crowd_density"
              value={formData.crowd_density}
              onChange={(e) => setFormData({ ...formData, crowd_density: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="UNKNOWN">Unknown</option>
            </select>
          </div>
          <div>
            <label htmlFor="companions" className="block text-sm font-medium text-gray-700">Companions</label>
            <select
              id="companions"
              value={formData.companions}
              onChange={(e) => setFormData({ ...formData, companions: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
            >
              <option value="ALONE">Alone</option>
              <option value="WITH_ADULT">With Adult</option>
              <option value="WITH_CHILDREN">With Children</option>
              <option value="WITH_GROUP">With Group</option>
            </select>
                  </div>
          <div>
            <label htmlFor="direction_headed" className="block text-sm font-medium text-gray-700">Direction Headed</label>
            <input
              type="text"
              id="direction_headed"
              value={formData.direction_headed}
              onChange={(e) => setFormData({ ...formData, direction_headed: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
            />
                </div>
            </div>

        {/* Additional Details */}
        <div>
          <label htmlFor="observed_behavior" className="block text-sm font-medium text-gray-700">Observed Behavior</label>
          <textarea
            id="observed_behavior"
            value={formData.observed_behavior}
            onChange={(e) => setFormData({ ...formData, observed_behavior: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
            required
          />
              </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
            required
          />
                      </div>

        <div>
          <label htmlFor="wearing" className="block text-sm font-medium text-gray-700">What were they wearing?</label>
          <input
            type="text"
            id="wearing"
            value={formData.wearing}
            onChange={(e) => setFormData({ ...formData, wearing: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-2.5 px-4"
          />
                        </div>

        {/* Photo Upload */}
        <div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="includePhoto"
              checked={includePhoto}
              onChange={(e) => setIncludePhoto(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="includePhoto" className="ml-2 block text-sm text-gray-900">
              Do you have a photo of the sighting?
            </label>
              </div>

          {includePhoto && (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
                </div>
              )}
            </div>

            {/* Submit Button */}
        <div>
            <button
              type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </>
              ) : (
              'Report Sighting'
              )}
            </button>
        </div>
          </form>
    </div>
  )
}

