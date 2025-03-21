import {
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserCircle,
  FaPhone,
  FaIdCard,
  FaFileAlt,
  FaUserShield,
  FaHandshake,
  FaEnvelope,
} from "react-icons/fa"

export default function CaseDetailModal({ isOpen, onClose, selectedCase }) {
  if (!isOpen || !selectedCase) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Case Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Photo and Basic Info */}
            <div>
              <img
                src={selectedCase.recent_photo || "/placeholder.svg"}
                alt={selectedCase.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedCase.name}</p>
                  <p><span className="font-medium">Case Number:</span> {selectedCase.case_number}</p>
                  <p><span className="font-medium">Age When Missing:</span> {selectedCase.age_when_missing}</p>
                  <p><span className="font-medium">Gender:</span> {selectedCase.gender}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Info and Status */}
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <FaPhone className="mr-2" />
                    <span className="font-medium">Emergency Contact:</span> {selectedCase.emergency_contact_phone || '-'}
                  </p>
                  <p className="flex items-center">
                    <FaEnvelope className="mr-2" />
                    <span className="font-medium">Email:</span> {selectedCase.emergency_contact_email || '-'}
                  </p>
                  <p className="flex items-center">
                    <FaPhone className="mr-2" />
                    <span className="font-medium">Secondary Contact:</span> {selectedCase.secondary_contact_phone || '-'}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Location Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="font-medium">Last Seen Location:</span> {selectedCase.last_seen_location || '-'}
                  </p>
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span className="font-medium">Coordinates:</span> {selectedCase.last_known_latitude && selectedCase.last_known_longitude 
                      ? `${selectedCase.last_known_latitude}, ${selectedCase.last_known_longitude}`
                      : '-'}
                  </p>
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span className="font-medium">Last Seen Date:</span> {new Date(selectedCase.last_seen_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Physical Description</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Height:</span> {selectedCase.height || '-'}</p>
                <p><span className="font-medium">Weight:</span> {selectedCase.weight || '-'}</p>
                <p><span className="font-medium">Complexion:</span> {selectedCase.complexion || '-'}</p>
                <p><span className="font-medium">Blood Group:</span> {selectedCase.blood_group || '-'}</p>
                <p><span className="font-medium">Identifying Marks:</span> {selectedCase.identifying_marks || '-'}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Additional Information</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <FaIdCard className="mr-2" />
                  <span className="font-medium">Aadhaar Number:</span> {selectedCase.aadhaar_number || '-'}
                </p>
                <p className="flex items-center">
                  <FaUserShield className="mr-2" />
                  <span className="font-medium">Assigned Officer:</span> {selectedCase.assigned_officer || '-'}
                </p>
                <p className="flex items-center">
                  <FaHandshake className="mr-2" />
                  <span className="font-medium">Assigned NGO:</span> {selectedCase.assigned_ngo || '-'}
                </p>
                <p className="flex items-center">
                  <FaFileAlt className="mr-2" />
                  <span className="font-medium">FIR Number:</span> {selectedCase.fir_number || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {selectedCase.documents && selectedCase.documents.length > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Documents</h3>
              <div className="space-y-2">
                {selectedCase.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaFileAlt className="mr-2 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {doc.document_type.replace(/_/g, ' ')}
                        </p>
                        {doc.description && (
                          <p className="text-sm text-gray-500">{doc.description}</p>
                        )}
                      </div>
                    </div>
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View Document
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 