import { Link } from 'react-router-dom'
import { Heart, Bot, AlertTriangle, BookOpen, BarChart3, Shield, Activity, TrendingUp } from 'lucide-react'

const Home = () => {
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
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      title: 'Medical Chatbot',
      description: 'Chat with our AI assistant for health guidance and first-aid',
      link: '/chat'
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
      title: 'Civic Issues',
      description: 'Report environmental and sanitation issues in your area',
      link: '/civic'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: 'Health Awareness',
      description: 'Learn about disease prevention and healthy practices',
      link: '/awareness'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: 'Health Dashboard',
      description: 'Track community health trends and outbreak alerts',
      link: '/dashboard'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Health Predictor',
      description: 'AI-powered health outcome predictions and risk assessment',
      link: '/predictor'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: 'Emergency Care',
      description: 'Quick access to emergency contacts and procedures',
      link: '/emergency'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Health Diagnostic System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Empowering rural and semi-urban communities with intelligent healthcare solutions. 
            Get instant diagnosis, health guidance, and connect with medical professionals.
          </p>
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
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Healthcare Solutions
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

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Making Healthcare Accessible</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl font-bold text-teal-600 mb-2">10K+</div>
              <div className="text-gray-600">Diagnoses Completed</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">AI Assistance</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home