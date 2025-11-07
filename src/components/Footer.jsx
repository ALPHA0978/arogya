import { Heart, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-8 h-8 text-teal-400" />
              <span className="text-2xl font-bold">Arogya</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering rural and semi-urban communities with AI-powered healthcare solutions. 
              Making quality healthcare accessible to everyone, everywhere.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold">in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/diagnosis" className="text-gray-300 hover:text-teal-400 transition-colors">AI Diagnosis</a></li>
              <li><a href="/chat" className="text-gray-300 hover:text-teal-400 transition-colors">Medical Chatbot</a></li>
              <li><a href="/civic" className="text-gray-300 hover:text-teal-400 transition-colors">Civic Issues</a></li>
              <li><a href="/awareness" className="text-gray-300 hover:text-teal-400 transition-colors">Health Awareness</a></li>
              <li><a href="/dashboard" className="text-gray-300 hover:text-teal-400 transition-colors">Dashboard</a></li>
            </ul>
          </div>

          {/* Medical Helpline */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Medical Helpline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span className="text-sm">108 - Emergency Medical</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Arogya Health Diagnostic System. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Terms of Service</a>
            <a href="/disclaimer" className="text-gray-400 hover:text-teal-400 text-sm transition-colors">Medical Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer