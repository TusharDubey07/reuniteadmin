import { useState, useEffect, useRef } from "react"
import {
  FaBell,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaImage,
  FaArrowLeft,
  FaTimes,
  FaExclamationCircle,
  FaUsers,
} from "react-icons/fa"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import L from "leaflet"
import "../styles/forum.css"
import { db } from "../firebase"
import { doc, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore"

// Mock data for forum messages
const INITIAL_MESSAGES = [
  {
    id: 1,
    user: {
      id: 101,
      name: "Raj Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "NGO Member",
    },
    content:
      "We're organizing a search party this Saturday for Aisha Patel. Anyone who can volunteer, please contact me.",
    timestamp: "2023-06-15T09:30:00Z",
    type: "text",
  },
  {
    id: 2,
    user: {
      id: 102,
      name: "Neha Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Parent",
    },
    content: "I think I saw someone matching Rahul's description near this location yesterday.",
    timestamp: "2023-06-15T10:15:00Z",
    type: "location",
    location: { lat: 28.6362, lng: 77.241 },
  },
  {
    id: 3,
    user: {
      id: 103,
      name: "Officer Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Police Officer",
    },
    content: "Here's the latest poster for Mohammed Khan. Please share widely.",
    timestamp: "2023-06-15T11:45:00Z",
    type: "image",
    imageUrl: "/placeholder.svg?height=300&width=400",
  },
  {
    id: 4,
    user: {
      id: 104,
      name: "Fatima Khan",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Parent",
    },
    content: "Thank you everyone for your support. We're still looking for Mohammed and appreciate any information.",
    timestamp: "2023-06-15T13:20:00Z",
    type: "text",
  },
  {
    id: 5,
    user: {
      id: 105,
      name: "Vikram Singh",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Volunteer",
    },
    content: "I'm at this location now and don't see anyone matching the description. Will keep looking.",
    timestamp: "2023-06-15T14:05:00Z",
    type: "location",
    location: { lat: 28.6129, lng: 77.2295 },
  },
]

// Get the current user from localStorage
const getCurrentUser = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  const userRole = localStorage.getItem('userRole')
  
  if (!isAuthenticated || !userRole) {
    console.error('User not authenticated')
    return null
  }

  // Get user data from your backend API using the access token
  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) {
    console.error('No access token found')
    return null
  }

  // For now, return a basic user object based on the role
  return {
    name: userRole === 'ngo' ? 'NGO Member' : 'Law Enforcement Officer',
    role: userRole === 'ngo' ? 'NGO Member' : 'Law Enforcement',
    organization: userRole === 'ngo' ? 'NGO Organization' : 'Law Enforcement Agency',
    avatar: "/placeholder.svg?height=40&width=40"
  }
}

export default function ForumPage() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isLocationSharing, setIsLocationSharing] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [isImageSharing, setIsImageSharing] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [currentUser, setCurrentUser] = useState(getCurrentUser())
  const [error, setError] = useState(null)

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // Add authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
    const accessToken = localStorage.getItem('access_token')
    
    if (!isAuthenticated || !accessToken) {
      // Redirect to login if not authenticated
      window.location.href = '/login'
      return
    }

    // Update current user state
    setCurrentUser(getCurrentUser())
  }, [])

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Listen to messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, "chatrooms", import.meta.env.VITE_PUBLIC_FORUM_ROOM_ID, "messages")
    const q = query(messagesRef, orderBy("timestamp", "desc"))
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messages = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setMessages(messages.reverse()) // Reverse to show oldest first
      },
      (error) => {
        console.error('Error listening to messages:', error)
        setError('Failed to load messages. Please refresh the page.')
      }
    )

    return () => unsubscribe()
  }, [])

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !userLocation && !selectedImage) || isSending || !currentUser) {
      return
    }

    setIsSending(true)

    try {
      const messagesRef = collection(db, "chatrooms", import.meta.env.VITE_PUBLIC_FORUM_ROOM_ID, "messages")
      
      let messageData = {
        sender: currentUser.name,
        senderRole: currentUser.role,
        organization: currentUser.organization,
        timestamp: serverTimestamp()
      }

      if (newMessage.trim()) {
        messageData.text = newMessage.trim()
      }

      if (userLocation) {
        messageData.location = userLocation
      }

      if (selectedImage) {
        messageData.imageUrl = selectedImage
      }

      // Add the message to the messages subcollection
      await addDoc(messagesRef, messageData)

      // Clear form
      setNewMessage("")
      setUserLocation(null)
      setSelectedImage(null)
      setIsLocationSharing(false)
      setIsImageSharing(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const shareLocation = () => {
    if (navigator.geolocation) {
      setIsLocationSharing(true)

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocationSharing(false)
          alert("Could not get your location. Please check your permissions.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const cancelLocationSharing = () => {
    setUserLocation(null)
    setIsLocationSharing(false)
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onload = (event) => {
        setSelectedImage(event.target.result)
        setIsImageSharing(true)
      }

      reader.readAsDataURL(file)
    }
  }

  const cancelImageSharing = () => {
    setSelectedImage(null)
    setIsImageSharing(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Format timestamp to readable format
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return ""
    
    // Check if timestamp is a Firestore Timestamp
    if (timestamp.toDate) {
      const date = timestamp.toDate()
      return (
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " " +
        date.toLocaleDateString([], { month: "short", day: "numeric" })
      )
    }
    
    // If it's a regular Date object or string
    const date = new Date(timestamp)
    if (isNaN(date.getTime())) return "" // Return empty if invalid date
    
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " " +
      date.toLocaleDateString([], { month: "short", day: "numeric" })
    )
  }

  // Custom marker icon
  const createUserIcon = () => {
    return L.divIcon({
      className: "custom-icon",
      html: `<div class="marker-icon bg-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })
  }

  const openInGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaUsers className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Public Forum</h1>
            </div>
            <div className="text-sm text-gray-500">
              {messages.length} messages • {messages.filter(m => m.location).length} locations shared
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Forum Description */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg my-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Welcome to the Reunite Community Forum</h3>
              <p className="mt-1 text-sm text-blue-700">
                Share information, coordinate search efforts, and support each other. Please be respectful and follow our community guidelines.
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-24">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === currentUser?.name ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${message.sender === currentUser?.name ? "order-2" : "order-1"}`}>
                  <div className="flex items-center mb-1">
                    {message.sender !== currentUser?.name && (
                      <img
                        src={message.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={message.sender}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-900">{message.sender}</span>
                    <span className="text-xs text-gray-500 ml-2">{formatTimestamp(message.timestamp)}</span>
                  </div>

                  <div
                    className={`rounded-lg shadow-sm ${
                      message.sender === currentUser?.name
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="p-3">
                      {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}

                      {message.location && (
                        <div>
                          <div 
                            className="h-[150px] w-full rounded-md overflow-hidden mb-1 relative cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openInGoogleMaps(message.location.lat, message.location.lng)}
                          >
                            <MapContainer
                              center={[message.location.lat, message.location.lng]}
                              zoom={14}
                              style={{ height: "100%", width: "100%" }}
                              zoomControl={false}
                              attributionControl={false}
                            >
                              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                              <Marker position={[message.location.lat, message.location.lng]} icon={createUserIcon()} />
                            </MapContainer>
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-10 transition-all">
                              <div className="bg-white p-2 rounded-full shadow-lg opacity-0 hover:opacity-100 transform translate-y-1 hover:translate-y-0 transition-all">
                                <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                          </div>
                          <div 
                            className="flex items-center text-xs mt-2 cursor-pointer hover:text-blue-500 transition-colors"
                            onClick={() => openInGoogleMaps(message.location.lat, message.location.lng)}
                          >
                            <FaMapMarkerAlt
                              className={message.sender === currentUser?.name ? "text-blue-200" : "text-gray-400"}
                            />
                            <span className="ml-1">
                              Open in Google Maps
                            </span>
                          </div>
                        </div>
                      )}

                      {message.imageUrl && (
                        <div>
                          <img
                            src={message.imageUrl}
                            alt="Shared image"
                            className="rounded-md max-h-[300px] w-auto"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mt-1">
                    <span className={`text-xs italic ${
                      message.sender === currentUser?.name ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {message.senderRole}
                      {message.organization && ` • ${message.organization}`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Fixed at bottom with higher z-index */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="max-w-7xl mx-auto">
          {/* Location sharing preview */}
          {userLocation && (
            <div className="mb-3 bg-blue-50 rounded-lg p-3 relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={cancelLocationSharing}
              >
                <FaTimes className="h-4 w-4" />
              </button>
              <div className="flex items-center mb-2">
                <FaMapMarkerAlt className="text-blue-500 mr-2" />
                <span className="text-sm font-medium text-blue-700">Location to share</span>
              </div>
              <div 
                className="h-[100px] rounded-md overflow-hidden mb-2 cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openInGoogleMaps(userLocation.lat, userLocation.lng)}
              >
                <MapContainer
                  center={[userLocation.lat, userLocation.lng]}
                  zoom={14}
                  style={{ height: "100%", width: "100%" }}
                  zoomControl={false}
                  attributionControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()} />
                </MapContainer>
              </div>
              <div 
                className="text-xs text-blue-600 cursor-pointer hover:text-blue-700 transition-colors flex items-center"
                onClick={() => openInGoogleMaps(userLocation.lat, userLocation.lng)}
              >
                <FaMapMarkerAlt className="mr-1" />
                <span>Open in Google Maps</span>
              </div>
            </div>
          )}

          {/* Image sharing preview */}
          {selectedImage && (
            <div className="mb-3 bg-blue-50 rounded-lg p-3 relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={cancelImageSharing}>
                <FaTimes className="h-4 w-4" />
                </button>
                <div className="flex items-center mb-2">
                  <FaImage className="text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-blue-700">Image to share</span>
                </div>
                <div className="flex justify-center">
                  <img src={selectedImage || "/placeholder.svg"} alt="Selected" className="max-h-[150px] rounded-md" />
                </div>
              </div>
            )}

          <div className="flex items-center bg-white">
            <div className="flex-1 relative">
              <textarea
                className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white"
                placeholder="Type a message..."
                rows={1}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{ maxHeight: "100px", minHeight: "40px" }}
              />
            </div>

            <div className="flex ml-2 space-x-2">
              <button
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={shareLocation}
                disabled={isLocationSharing || userLocation || isImageSharing}
              >
                {isLocationSharing ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500"
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
                  <FaMapMarkerAlt className="h-5 w-5" />
                )}
              </button>

              <button
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleImageClick}
                disabled={isImageSharing || selectedImage || isLocationSharing}
              >
                <FaImage className="h-5 w-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </button>

              <button
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={(!newMessage.trim() && !userLocation && !selectedImage) || isSending}
              >
                {isSending ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  <FaPaperPlane className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

