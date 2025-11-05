import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Diagnosis from './pages/Diagnosis'
import ChatAssistant from './pages/ChatAssistant'
import Dashboard from './pages/Dashboard'
import CivicIssues from './pages/CivicIssues'
import Awareness from './pages/Awareness'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/diagnosis" element={<Diagnosis />} />
              <Route path="/chat" element={<ChatAssistant />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/civic" element={<CivicIssues />} />
              <Route path="/awareness" element={<Awareness />} />
              <Route path="/emergency" element={<div className="p-8 text-center"><h1 className="text-2xl">Emergency Care - Coming Soon</h1></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App