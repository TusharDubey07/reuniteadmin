import { useState } from "react"
import { FaCamera, FaIdCard, FaUpload, FaSpinner, FaTimes, FaMapMarkerAlt, FaPhone, FaUser, FaCalendar, FaFileAlt } from "react-icons/fa"

export default function AdvancedSearch() {
  const [activeSearch, setActiveSearch] = useState("face")
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const [error, setError] = useState(null)
  const [selectedCase, setSelectedCase] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setSearchResults(null)
      setError(null)
    }
  }

  const handleSearch = async () => {
    if (!selectedFile) {
      setError("Please select a photo first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append(activeSearch === 'face' ? 'photo' : 'aadhaar_photo', selectedFile)

      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        throw new Error('No access token found')
      }

      const endpoint = activeSearch === 'face' 
        ? `${import.meta.env.VITE_API_URL}/api/missing-persons/missing-persons/face-search/`
        : 'https://3149-150-107-18-233.ngrok-free.app/api/missing-persons/missing-persons/aadhaar-search/'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to perform search')
      }

      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      setError(err.message)
      console.error('Error performing search:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchMethodChange = (method) => {
    if (method !== activeSearch) {
      setActiveSearch(method)
      setSelectedFile(null)
      setPreviewUrl(null)
      setSearchResults(null)
      setError(null)
    }
  }

  const handleViewDetails = (caseData) => {
    setSelectedCase(caseData)
    setShowModal(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Search</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Face Search Card */}
        <div
          className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${
            activeSearch === "face" ? "border-blue-500" : "border-transparent"
          }`}
          onClick={() => handleSearchMethodChange("face")}
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <FaCamera className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Search by Face</h3>
              <p className="text-sm text-gray-500">Upload a photo to find matching cases</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-center items-center w-full">
              <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {previewUrl && activeSearch === "face" ? (
                    <img src={previewUrl} alt="Preview" className="mb-4 max-h-48 rounded" />
                  ) : (
                    <>
                      <FaUpload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={activeSearch !== "face"}
                />
              </label>
            </div>
            <button
              onClick={handleSearch}
              disabled={!selectedFile || loading || activeSearch !== "face"}
              className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading && activeSearch === "face" ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>

        {/* Aadhaar Photo Search Card */}
        <div
          className={`bg-white rounded-lg shadow-md p-6 border-2 transition-all ${
            activeSearch === "aadhaar" ? "border-purple-500" : "border-transparent"
          }`}
          onClick={() => handleSearchMethodChange("aadhaar")}
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <FaIdCard className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Search by Aadhaar Photo</h3>
              <p className="text-sm text-gray-500">Upload an Aadhaar card photo to find matching cases</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-center items-center w-full">
              <label className="w-full flex flex-col items-center justify-center px-4 py-6 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {previewUrl && activeSearch === "aadhaar" ? (
                    <img src={previewUrl} alt="Preview" className="mb-4 max-h-48 rounded" />
                  ) : (
                    <>
                      <FaUpload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={activeSearch !== "aadhaar"}
                />
              </label>
            </div>
            <button
              onClick={handleSearch}
              disabled={!selectedFile || loading || activeSearch !== "aadhaar"}
              className="mt-4 w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading && activeSearch === "aadhaar" ? (
                <>
                  <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && searchResults.matches && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Search Results</h3>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {searchResults.matches.map((result, index) => (
                <li key={result.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {result.recent_photo && (
                            <img
                              src={result.recent_photo}
                              alt={result.name}
                              className="h-16 w-16 rounded-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-lg font-medium text-blue-600">{result.name}</p>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FaIdCard className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>Case: {result.case_number}</span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FaMapMarkerAlt className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>{result.last_seen_location}</span>
                          </div>
                          <div className="mt-1 flex items-center text-sm text-gray-500">
                            <FaCalendar className="mr-1.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span>Age when missing: {result.age_when_missing}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        result.status === 'FOUND' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                      <button
                        onClick={() => handleViewDetails(result)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                  {searchResults.match_confidences && (
                    <div className="mt-2 text-sm text-gray-500">
                      Match Confidence: {(searchResults.match_confidences[index] * 100).toFixed(2)}%
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Case Detail Modal */}
      {showModal && selectedCase && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCase.name}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Case Number</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCase.case_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <p className={`mt-1 text-sm font-semibold ${
                        selectedCase.status === 'FOUND' ? 'text-green-600' : 'text-red-600'
                      }`}>{selectedCase.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Age When Missing</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCase.age_when_missing}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCase.gender}</p>
                    </div>
                  </div>
                </div>

                {/* Physical Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Physical Description</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Height</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCase.height} cm</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Weight</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCase.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Complexion</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCase.complexion}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Blood Group</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCase.blood_group}</p>
                    </div>
                  </div>
                </div>

                {/* Last Seen Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Last Seen Information</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedCase.last_seen_location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedCase.last_seen_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Details</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedCase.last_seen_details}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Emergency Contact</p>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedCase.emergency_contact_name} ({selectedCase.emergency_contact_relation})
                    </p>
                    <p className="text-sm text-gray-900">{selectedCase.emergency_contact_phone}</p>
                  </div>
                  {selectedCase.secondary_contact_name && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Secondary Contact</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedCase.secondary_contact_name}</p>
                      <p className="text-sm text-gray-900">{selectedCase.secondary_contact_phone}</p>
                    </div>
                  )}
                </div>

                {/* Documents */}
                {selectedCase.documents && selectedCase.documents.length > 0 && (
                  <div className="col-span-2 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Documents</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedCase.documents.map((doc) => (
                        <div key={doc.id} className="border rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-500">{doc.document_type}</p>
                          <p className="text-sm text-gray-500 mb-2">{doc.description}</p>
                          <a
                            href={doc.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            <FaFileAlt className="mr-2" />
                            View Document
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaTimes className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-2">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 