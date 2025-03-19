
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
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lng: 77.209 }) // Default to Delhi
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [personName, setPersonName] = useState("")
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Get user's location on component mount
  useEffect(() => {
    getCurrentLocation()

    // Cleanup function to stop camera stream when component unmounts
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [])

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoadingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLoadingLocation(false)
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const handleOrgClick = (org) => {
    setSelectedOrg(org)
  }

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOpen(true)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      alert("Could not access the camera. Please make sure you've granted camera permissions.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks()
      tracks.forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setIsCameraOpen(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the video frame to the canvas
      const context = canvas.getContext("2d")
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to data URL
      const imageDataURL = canvas.toDataURL("image/jpeg")
      setCapturedImage(imageDataURL)

      // Stop the camera
      stopCamera()
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    startCamera()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!personName.trim()) {
      alert("Please enter the name of the person you've sighted.")
      return
    }

    if (!capturedImage) {
      alert("Please take a photo of the person you've sighted.")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Submitting sighting report:", {
        personName,
        location: userLocation,
        image: capturedImage,
        timestamp: new Date().toISOString(),
      })

      setIsSubmitting(false)
      setIsSubmitSuccess(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitSuccess(false)
        setPersonName("")
        setCapturedImage(null)
      }, 3000)
    }, 1500)
  }

  // Custom marker icons
  const createIcon = (type) => {
    return L.divIcon({
      className: "custom-icon",
      html: `<div class="marker-icon ${type === "ngo" ? "bg-blue-500" : "bg-red-500"}">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                ${
                  type === "ngo"
                    ? '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />'
                    : '<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />'
                }
              </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header for Mobile */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/dashboard" className="mr-3">
              <FaArrowLeft className="h-5 w-5 text-gray-500" />
            </a>
            <h1 className="text-xl font-bold text-blue-600">Report Sighting</h1>
          </div>
          <div className="flex items-center">
            <div className="relative rounded-full h-8 w-8 bg-blue-100 flex items-center justify-center text-blue-600">
              <FaUser className="h-4 w-4" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-400 border-2 border-white"></span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {isSubmitSuccess ? (
          <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaCheck className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your sighting report has been submitted successfully. Thank you for helping reunite families!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Person Name Input */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <label htmlFor="personName" className="block text-sm font-medium text-gray-700 mb-1">
                Who did you see?
              </label>
              <input
                type="text"
                id="personName"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3"
                placeholder="Enter the name of the missing person"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                required
              />
            </div>

            {/* Location Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Your Current Location</label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isLoadingLocation}
                >
                  {isLoadingLocation ? (
                    <svg
                      className="animate-spin h-4 w-4 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-500" />
                  )}
                  <span className="ml-1">Update</span>
                </button>
              </div>
              <div className="text-sm text-gray-500 mb-2">
                We'll use this to find nearby help and record where the person was sighted.
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label htmlFor="latitude" className="block text-xs font-medium text-gray-500">
                    Latitude
                  </label>
                  <input
                    id="latitude"
                    type="text"
                    value={userLocation.lat.toFixed(6)}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-2 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-xs font-medium text-gray-500">
                    Longitude
                  </label>
                  <input
                    id="longitude"
                    type="text"
                    value={userLocation.lng.toFixed(6)}
                    readOnly
                    className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Photo Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Take a Photo</label>

              {!isCameraOpen && !capturedImage ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaCamera className="mr-2 h-5 w-5 text-gray-400" />
                  Open Camera
                </button>
              ) : isCameraOpen ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="p-3 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50"
                    >
                      <FaTimes className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="p-3 bg-white rounded-full shadow-md text-blue-500 hover:bg-blue-50"
                    >
                      <FaCamera className="h-6 w-6" />
                    </button>
                  </div>
                  <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
              ) : capturedImage ? (
                <div className="relative">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Captured"
                    className="w-full rounded-lg"
                    style={{ maxHeight: "300px", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={retakePhoto}
                    className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-md text-gray-500 hover:bg-gray-50"
                  >
                    <FaUndo className="h-5 w-5" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Help</label>
              <div className="text-sm text-gray-500 mb-4">
                Click on a marker to see contact information for nearby NGOs and police stations.
              </div>

              <div className="h-[300px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[userLocation.lat, userLocation.lng]}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                  whenCreated={(map) => {
                    setTimeout(() => {
                      map.invalidateSize()
                    }, 0)
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* User location marker */}
                  <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.divIcon({
                      className: "custom-icon",
                      html: `<div class="marker-icon bg-green-500">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                             </div>`,
                      iconSize: [40, 40],
                      iconAnchor: [20, 40],
                    })}
                  >
                    <Popup>
                      <div className="text-center">
                        <p className="font-medium">Your Location</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Organization markers */}
                  {NEARBY_ORGANIZATIONS.map((org) => (
                    <Marker
                      key={org.id}
                      position={[org.location.lat, org.location.lng]}
                      icon={createIcon(org.type)}
                      eventHandlers={{
                        click: () => handleOrgClick(org),
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-medium">{org.name}</p>
                          <p className="text-xs text-gray-500">{org.type === "ngo" ? "NGO" : "Police Station"}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Selected Organization Info */}
              {selectedOrg && (
                <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 p-2 rounded-full ${selectedOrg.type === "ngo" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"}`}
                    >
                      {selectedOrg.type === "ngo" ? (
                        <FaBuilding className="h-5 w-5" />
                      ) : (
                        <FaShieldAlt className="h-5 w-5" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{selectedOrg.name}</h4>
                      <p className="mt-1 text-xs text-gray-500">{selectedOrg.address}</p>
                      <div className="mt-2 flex items-center">
                        <FaMapMarkerAlt className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{selectedOrg.distance} away</span>
                      </div>
                      <div className="mt-3 flex space-x-3">
                        <a
                          href={`tel:${selectedOrg.phone}`}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaPhone className="mr-1 h-3 w-3" />
                          Call
                        </a>
                        <a
                          href={`mailto:${selectedOrg.email}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Email
                        </a>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="flex-shrink-0 ml-1 text-gray-400 hover:text-gray-500"
                      onClick={() => setSelectedOrg(null)}
                    >
                      <FaTimes className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !personName || !capturedImage}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Sighting Report"
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

