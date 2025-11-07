import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Heart, Bot, AlertTriangle, BookOpen, BarChart3, Shield, Activity, TrendingUp } from 'lucide-react'
import DarkVeil from '../components/DarkVeil'
import { GlowingStarsBackgroundCard, GlowingStarsTitle, GlowingStarsDescription } from '../components/GlowingStarsCard'

const Home = () => {
  const { user, userProfile } = useAuth()
  const features = [
    {
      icon: <Heart className="w-8 h-8 text-blue-600" />,
      title: 'AI Diagnosis',
      description: 'Advanced symptom analysis with comprehensive medical insights'
    },
    {
      icon: <Activity className="w-8 h-8 text-red-600" />,
      title: 'Vitals Monitor',
      description: 'Real-time vital signs monitoring with AI-powered analysis'
    },
    {
      icon: <Bot className="w-8 h-8 text-blue-600" />,
      title: 'Medical Chatbot',
      description: 'Chat with our AI assistant for health guidance and first-aid'
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-orange-600" />,
      title: 'Civic Issues',
      description: 'Report environmental and sanitation issues in your area'
    },
    {
      icon: <BookOpen className="w-8 h-8 text-green-600" />,
      title: 'Health Awareness',
      description: 'Learn about disease prevention and healthy practices'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: 'Health Dashboard',
      description: 'Track community health trends and outbreak alerts'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Health Predictor',
      description: 'AI-powered health outcome predictions and risk assessment'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: 'Emergency Care',
      description: 'Quick access to emergency contacts and procedures'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative py-20 px-4 min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 w-full h-full">
          <DarkVeil 
            hueShift={180}
            noiseIntensity={0.02}
            scanlineIntensity={0.1}
            speed={0.3}
            scanlineFrequency={0.01}
            warpAmount={0.2}
            resolutionScale={1}
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h1 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
              AI-Powered Health Diagnostic System
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
              Empowering rural and semi-urban communities with intelligent healthcare solutions. 
              Get instant diagnosis, health guidance, and connect with medical professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={user && userProfile?.profileComplete ? "/diagnosis" : "/login"}
                className="bg-teal-600/90 backdrop-blur text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700/90 transition-all border border-teal-500/30 shadow-lg hover:shadow-xl"
              >
                Start Diagnosis
              </Link>
              <Link 
                to={user && userProfile?.profileComplete ? "/chat" : "/login"}
                className="bg-white/10 backdrop-blur text-white px-8 py-3 rounded-lg font-semibold border border-white/30 hover:bg-white/20 transition-all shadow-lg hover:shadow-xl"
              >
                Chat with AI
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Comprehensive Healthcare Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlowingStarsBackgroundCard key={index} className="h-auto">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <GlowingStarsTitle className="text-center mb-2">{feature.title}</GlowingStarsTitle>
                <GlowingStarsDescription className="text-center">{feature.description}</GlowingStarsDescription>
              </GlowingStarsBackgroundCard>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Making Healthcare Accessible</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="text-4xl font-bold text-teal-400 mb-2">50+</div>
              <div className="text-gray-300">Early Users</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-gray-300">Accuracy Rate</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-gray-300">AI Assistance</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home