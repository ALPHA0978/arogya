import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Menu, X, Heart, User, LogOut } from 'lucide-react'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, userProfile, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white shadow-lg border-b border-teal-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Arogya" className="w-8 h-8" />
            <span className="text-2xl font-bold text-gray-900">Arogya</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {user && userProfile?.profileComplete ? (
              <>
                <Link to="/diagnosis" className="text-gray-700 hover:text-teal-600 transition-colors">Diagnosis</Link>
                <Link to="/vitals" className="text-gray-700 hover:text-teal-600 transition-colors">Vitals</Link>
                <Link to="/predictor" className="text-gray-700 hover:text-teal-600 transition-colors">Report Analyzer</Link>
                <Link to="/chat" className="text-gray-700 hover:text-teal-600 transition-colors">AI Assistant</Link>
                <Link to="/civic" className="text-gray-700 hover:text-teal-600 transition-colors">Civic Issues</Link>
                <Link to="/user-dashboard" className="text-gray-700 hover:text-teal-600 transition-colors">My Dashboard</Link>
              </>
            ) : (
              <Link to="/awareness" className="text-gray-700 hover:text-teal-600 transition-colors">Awareness</Link>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-2">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <User className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-sm text-gray-700">{userProfile?.fullName || user?.displayName || user?.email}</span>
                <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              {user && userProfile?.profileComplete ? (
                <>
                  <Link to="/diagnosis" className="text-gray-700 hover:text-teal-600">Diagnosis</Link>
                  <Link to="/vitals" className="text-gray-700 hover:text-teal-600">Vitals</Link>
                  <Link to="/predictor" className="text-gray-700 hover:text-teal-600">Report Analyzer</Link>
                  <Link to="/chat" className="text-gray-700 hover:text-teal-600">AI Assistant</Link>
                  <Link to="/civic" className="text-gray-700 hover:text-teal-600">Civic Issues</Link>
                  <Link to="/user-dashboard" className="text-gray-700 hover:text-teal-600">My Dashboard</Link>
                  <button onClick={handleLogout} className="text-left text-red-600">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/awareness" className="text-gray-700 hover:text-teal-600">Awareness</Link>
                  {!user && <Link to="/login" className="text-teal-600">Login</Link>}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header