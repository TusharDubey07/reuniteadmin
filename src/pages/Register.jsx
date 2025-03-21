"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFileUpload,
  FaUserShield,
  FaHandHoldingHeart,
  FaPhone,
} from "react-icons/fa"
import "../styles/auth.css"

export default function RegisterPage({ onRegisterSuccess }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("ngo")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    organization_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    role: "NGO",
    organization_latitude: "",
    organization_longitude: "",
    organization_location: "",
    verification_documents: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [documentName, setDocumentName] = useState("")
  const [locationLoading, setLocationLoading] = useState(false)
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [otpError, setOtpError] = useState("")
  const [error, setError] = useState("")

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setFormData(prev => ({
      ...prev,
      role: tab === "ngo" ? "NGO" : "LAW_ENFORCEMENT"
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        verification_documents: file,
      })
      setDocumentName(file.name)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          
          // Use Geocoding API to get location name
          fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=327aa831fc674c23b8be0ba578725876`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results[0]) {
                const address = data.results[0].formatted
                setFormData({
                  ...formData,
                  organization_latitude: latitude.toFixed(6),
                  organization_longitude: longitude.toFixed(6),
                  organization_location: address,
                })
              } else {
                throw new Error('No results found')
              }
            })
            .catch(error => {
              console.error('Error fetching location name:', error)
              // Fallback to coordinates if geocoding fails
              setFormData({
                ...formData,
                organization_latitude: latitude.toFixed(6),
                organization_longitude: longitude.toFixed(6),
                organization_location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              })
            })
            .finally(() => {
              setLocationLoading(false)
            })
        },
        (error) => {
          console.error("Error getting location:", error)
          setLocationLoading(false)
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple digits
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.organization_name || !formData.email || !formData.password || 
          !formData.phone_number || !formData.organization_latitude || 
          !formData.organization_longitude || !formData.organization_location || 
          !formData.first_name || !formData.last_name || !formData.verification_documents) {
        throw new Error('Please fill in all required fields')
      }

      const formDataToSend = new FormData()
      
      // Add all required fields exactly as the API expects
      formDataToSend.append('organization_name', formData.organization_name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('phone_number', formData.phone_number.startsWith('+') ? formData.phone_number : `+${formData.phone_number}`)
      formDataToSend.append('role', formData.role)
      formDataToSend.append('organization_latitude', formData.organization_latitude)
      formDataToSend.append('organization_longitude', formData.organization_longitude)
      formDataToSend.append('organization_location', formData.organization_location)
      formDataToSend.append('first_name', formData.first_name)
      formDataToSend.append('last_name', formData.last_name)
      
      if (formData.verification_documents) {
        formDataToSend.append('verification_documents', formData.verification_documents)
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/users/register_organization/`, {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error messages from the server
        if (data.detail) {
          throw new Error(data.detail)
        } else if (typeof data === 'object') {
          // Handle validation errors
          const errors = Object.entries(data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('; ')
          throw new Error(`Validation errors: ${errors}`)
        }
        throw new Error('Registration failed')
      }

      console.log('Registration successful:', data)
      setShowOTPVerification(true)
    } catch (error) {
      console.error('Registration error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOTPSubmit = async () => {
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/accounts/users/verify_otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_or_phone: formData.email,
          otp: otpValue
        })
      })

      if (!response.ok) {
        throw new Error('OTP verification failed')
      }

      const data = await response.json()
      console.log('OTP verification successful:', data)
      
      // Show approval modal for both NGO and law enforcement
      setShowOTPVerification(false)
      setShowApprovalModal(true)
    } catch (error) {
      console.error('OTP verification error:', error)
      setOtpError("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprovalModalClose = () => {
    setShowApprovalModal(false)
    navigate("/login")
  }

  return (
    <div className="auth-background">
      <div className="auth-container">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
              <h2 className="text-3xl font-bold text-center">Join Reunite</h2>
              <p className="text-blue-100 text-center mt-2">Create your account to help reconnect families</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 ${activeTab === "ngo" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => handleTabChange("ngo")}
              >
                <FaHandHoldingHeart />
                <span>NGO Registration</span>
              </button>
              <button
                className={`flex-1 py-4 px-6 text-center font-medium flex items-center justify-center gap-2 ${activeTab === "law" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"}`}
                onClick={() => handleTabChange("law")}
              >
                <FaUserShield />
                <span>Law Enforcement</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm font-medium text-gray-700 block">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm font-medium text-gray-700 block">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="organization_name" className="text-sm font-medium text-gray-700 block">
                  {activeTab === "ngo" ? "NGO Name" : "Department Name"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    id="organization_name"
                    name="organization_name"
                    type="text"
                    value={formData.organization_name}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder={activeTab === "ngo" ? "Sample NGO" : "Police Department"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone_number" className="text-sm font-medium text-gray-700 block">
                  Contact Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaPhone />
                  </div>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10}"
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="organization_location" className="text-sm font-medium text-gray-700 block">
                  Office Location
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaMapMarkerAlt />
                    </div>
                    <input
                      id="organization_location"
                      name="organization_location"
                      type="text"
                      value={formData.organization_location}
                      onChange={handleInputChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder={activeTab === "ngo" ? "NGO Office Address" : "Station/Department Address"}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="px-4 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {locationLoading ? (
                      <svg
                        className="animate-spin h-5 w-5"
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
                      <FaMapMarkerAlt />
                    )}
                  </button>
                </div>

                {formData.organization_latitude && formData.organization_longitude && (
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <label htmlFor="organization_latitude" className="text-xs font-medium text-gray-500 block">
                        Latitude
                      </label>
                      <input
                        id="organization_latitude"
                        name="organization_latitude"
                        type="text"
                        value={formData.organization_latitude}
                        onChange={handleInputChange}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="organization_longitude" className="text-xs font-medium text-gray-500 block">
                        Longitude
                      </label>
                      <input
                        id="organization_longitude"
                        name="organization_longitude"
                        type="text"
                        value={formData.organization_longitude}
                        onChange={handleInputChange}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="verification_documents" className="text-sm font-medium text-gray-700 block">
                  {activeTab === "ngo" ? "Registration Certificate" : "Official ID Card"}
                </label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                  <div className="text-center">
                    <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">Click to upload</span> or drag and
                      drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, PNG, JPG up to 10MB</p>
                  </div>
                  <input
                    id="verification_documents"
                    name="verification_documents"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                {documentName && (
                  <p className="text-sm text-gray-600 flex items-center mt-2">
                    <FaFileUpload className="mr-2 text-green-500" />
                    {documentName}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition hover:scale-105 disabled:opacity-70"
                >
                  {isLoading ? (
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
                      Processing...
                    </>
                  ) : (
                    activeTab === "ngo" ? "Submit for Approval" : "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Your Email</h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a verification code to {formData.email}
            </p>
            <div className="flex justify-center space-x-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleOTPKeyDown(index, e)}
                  className="w-12 h-12 text-center border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  maxLength="1"
                />
              ))}
            </div>
            {otpError && <p className="text-red-500 text-sm mb-4">{otpError}</p>}
            <button
              onClick={handleOTPSubmit}
              disabled={isLoading || otp.join("").length !== 6}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Submitted</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your {activeTab === "ngo" ? "NGO" : "Law Enforcement"} registration has been submitted for approval. Our team will review your application and get back to you soon.
            </p>
            <button
              onClick={handleApprovalModalClose}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

