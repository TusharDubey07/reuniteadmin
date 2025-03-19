import {
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUserCircle,
  FaPhone,
} from "react-icons/fa"

export default function CaseDetailModal({ isOpen, onClose, selectedCase }) {
  if (!isOpen || !selectedCase) return null

  return (
    <div className="fixed inset-0 overflow-y-auto z-[9999]">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Case Details
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedCase.status === "missing" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedCase.status === "missing" ? "Missing" : "Found"}
                  </span>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 mx-auto sm:mx-0 mb-4 sm:mb-0">
                    <img
                      src={selectedCase.photo || "/placeholder.svg"}
                      alt={selectedCase.name}
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                  </div>
                  <div className="sm:ml-4 flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{selectedCase.name}</h4>
                    <p className="text-sm text-gray-500">
                      Age: {selectedCase.age}, {selectedCase.gender}
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <div className="flex items-center text-sm">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        <span className="text-gray-700">Last seen: {selectedCase.lastSeen}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        <span className="text-gray-700">{selectedCase.caseLocation}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900">Description</h5>
                      <p className="mt-1 text-sm text-gray-500">{selectedCase.description}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h5 className="text-sm font-medium text-gray-900">Contact Information</h5>
                  <div className="mt-2 grid grid-cols-1 gap-2">
                    <div className="flex items-center text-sm">
                      <FaUserCircle className="mr-2 text-gray-400" />
                      <span className="text-gray-700">
                        {selectedCase.contactName} ({selectedCase.contactRelation})
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <FaPhone className="mr-2 text-gray-400" />
                      <span className="text-gray-700">{selectedCase.contactPhone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Contact
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 