import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { FaMapMarkerAlt, FaPhone, FaCalendarAlt } from "react-icons/fa"

export default function CasesMap({ cases, userLocation, onMarkerClick, onMarkerHover, onMarkerLeave, hoveredMarker }) {
  // Custom marker icon
  const customIcon = (status) => {
    return L.divIcon({
      className: "custom-icon",
      html: `<div class="marker-icon ${status === "found" ? "bg-green-500" : "bg-red-500"} cursor-pointer hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
             </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    })
  }

  return (
    <div className="relative">
      <div className="h-[500px] z-0">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={13}
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
              html: `<div class="marker-icon bg-blue-500">
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

          {/* Case markers */}
          {cases.map((caseData) => (
            <Marker
              key={caseData.id}
              position={[caseData.location.lat, caseData.location.lng]}
              icon={customIcon(caseData.status)}
              eventHandlers={{
                click: () => onMarkerClick(caseData),
                mouseover: () => onMarkerHover(caseData),
                mouseout: onMarkerLeave,
              }}
            >
              <Popup>
                <div className="text-center p-2">
                  <h4 className="font-medium text-base">{caseData.name}</h4>
                  <p className="text-sm text-gray-600">Age: {caseData.age}</p>
                  <p className={`text-sm ${caseData.status === "missing" ? "text-red-600" : "text-green-600"} font-medium`}>
                    {caseData.status === "missing" ? "Missing" : "Found"}
                  </p>
                  <button
                    onClick={() => onMarkerClick(caseData)}
                    className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Hover Card */}
      {hoveredMarker && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
          <div className="flex items-start space-x-4">
            <img
              src={hoveredMarker.photo || "/placeholder.svg"}
              alt={hoveredMarker.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <h4 className="text-sm font-medium text-gray-900">{hoveredMarker.name}</h4>
              <p className="text-xs text-gray-500">
                Age: {hoveredMarker.age}, {hoveredMarker.gender}
              </p>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <FaPhone className="mr-1" />
                <span>{hoveredMarker.contactPhone}</span>
              </div>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <FaCalendarAlt className="mr-1" />
                <span>{hoveredMarker.lastSeen}</span>
              </div>
              <button
                onClick={() => onMarkerClick(hoveredMarker)}
                className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors w-full"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 