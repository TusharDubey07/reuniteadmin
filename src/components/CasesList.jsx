import { FaFilter, FaSortAmountDown, FaSearch, FaPhone, FaCalendarAlt, FaEye } from "react-icons/fa"

export default function CasesList({ cases, showOnlyMissing, onToggleShowMissing, onCaseClick }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Missing Persons</h3>
          <p className="text-sm text-gray-500">
            {cases.length} {cases.length === 1 ? "person" : "people"} found
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onToggleShowMissing}
          >
            <FaFilter className="mr-2 h-4 w-4" />
            {showOnlyMissing ? "Show All" : "Show Only Missing"}
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <FaSortAmountDown className="mr-2 h-4 w-4" />
            Sort
          </button>
        </div>
      </div>

      {/* List of missing persons */}
      <ul className="divide-y divide-gray-200">
        {cases.length > 0 ? (
          cases.map((caseData) => (
            <li
              key={caseData.id}
              className="hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => onCaseClick(caseData)}
            >
              <div className="px-6 py-4 flex items-center">
                <img
                  src={caseData.photo || "/placeholder.svg"}
                  alt={caseData.name}
                  className="h-16 w-16 rounded-full object-cover mr-4 border-2 border-gray-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{caseData.name}</p>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        caseData.status === "missing" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {caseData.status === "missing" ? "Missing" : "Found"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FaPhone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p className="truncate">{caseData.contactPhone}</p>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    <p>Last seen: {caseData.lastSeen}</p>
                  </div>
                </div>
                <button className="ml-4 flex-shrink-0 bg-white rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">View details</span>
                  <FaEye className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="px-6 py-12 text-center">
            <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
            <p className="mt-1 text-sm text-gray-500">
              We couldn't find any missing persons matching your search criteria.
            </p>
          </li>
        )}
      </ul>
    </div>
  )
} 