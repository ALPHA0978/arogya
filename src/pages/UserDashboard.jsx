import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Heart, Bot, AlertTriangle, BookOpen, BarChart3, Shield, Activity, TrendingUp, User, MapPin, Phone } from 'lucide-react'

const UserDashboard = () => {
  const { user, userProfile } = useAuth()

  const features = [
    {
      icon: <Heart className="w-8 h-8 text-teal-600" />,
      title: 'AI Diagnosis',
      description: 'Advanced symptom analysis with comprehensive medical insights',
      link: '/diagnosis'
    },
    {
      icon: <Activity className="w-8 h-8 text-red-600" />,
      title: 'Vitals Monitor',
      description: 'Real-time vital signs monitoring with AI-powered analysis',
      link: '/vitals'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Health Predictor',
      description: 'AI-powered health outcome predictions and risk assessment',
      link: '/predictor'
    },
    {
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      title: 'AI Assistant',
      description: 'Chat with our AI assistant for health guidance and first-aid',
      link: '/chat'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Report Analyzer',
      description: 'AI-powered medical report analysis and insights',
      link: '/predictor'
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
      title: 'Civic Issues',
      description: 'Report environmental and sanitation issues in your area',
      link: '/civic'
    },

  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Hero Section with Profile */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-teal-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {userProfile?.fullName || user?.displayName || 'User'}!
                </h1>
                <p className="text-gray-600 mb-4">
                  Your personal health companion is ready to assist you
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  {userProfile?.age && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Age: {userProfile.age}
                    </div>
                  )}
                  {userProfile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {userProfile.location}
                    </div>
                  )}
                  {userProfile?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {userProfile.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/diagnosis" 
                className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              >
                Start Diagnosis
              </Link>
              <Link 
                to="/chat" 
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold border-2 border-teal-600 hover:bg-teal-50 transition-colors"
              >
                Chat with AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Health Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link 
                key={index}
                to={feature.link}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Health Tips */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Today's Health Tip</h3>
            <div className="bg-teal-50 border-l-4 border-teal-600 p-6 rounded-r-lg">
              <p className="text-gray-700 text-lg">
                💧 Stay hydrated! Drink at least 8 glasses of water daily to maintain optimal health and support your body's natural functions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default UserDashboard