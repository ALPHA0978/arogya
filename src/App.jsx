import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import ProfileSetup from './pages/ProfileSetup'
import Diagnosis from './pages/Diagnosis'
import ChatAssistant from './pages/ChatAssistant'
import Dashboard from './pages/Dashboard'
import UserDashboard from './pages/UserDashboard'
import CivicIssues from './pages/CivicIssues'
import Awareness from './pages/Awareness'
import VitalsMonitor from './pages/VitalsMonitor'
import HealthPredictor from './pages/HealthPredictor'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import MedicalDisclaimer from './pages/MedicalDisclaimer'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile-setup" element={
                <ProtectedRoute>
                  <ProfileSetup />
                </ProtectedRoute>
              } />
              <Route path="/diagnosis" element={
                <ProtectedRoute requireProfile={true}>
                  <Diagnosis />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute requireProfile={true}>
                  <ChatAssistant />
                </ProtectedRoute>
              } />
              <Route path="/user-dashboard" element={
                <ProtectedRoute requireProfile={true}>
                  <UserDashboard />
                </ProtectedRoute>
              } />

              <Route path="/civic" element={
                <ProtectedRoute requireProfile={true}>
                  <CivicIssues />
                </ProtectedRoute>
              } />
              <Route path="/awareness" element={<Awareness />} />
              <Route path="/vitals" element={
                <ProtectedRoute requireProfile={true}>
                  <VitalsMonitor />
                </ProtectedRoute>
              } />
              <Route path="/predictor" element={
                <ProtectedRoute requireProfile={true}>
                  <HealthPredictor />
                </ProtectedRoute>
              } />
              <Route path="/emergency" element={<div className="p-8 text-center"><h1 className="text-2xl">Emergency Care - Coming Soon</h1></div>} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/disclaimer" element={<MedicalDisclaimer />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App