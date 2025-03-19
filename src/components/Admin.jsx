import AdminSidebar from './AdminSidebar'

export default function Admin({ children, onLogout }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onLogout={onLogout} />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
} 