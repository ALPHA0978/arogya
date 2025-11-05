import { useState } from 'react'
import { Upload, Camera, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { diagnosisAPI } from '../services/api'
import { db } from '../services/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

const Diagnosis = () => {
  const [symptoms, setSymptoms] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const { user } = useAuth()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="w-5 h-5" />
      case 'medium': return <Clock className="w-5 h-5" />
      case 'low': return <CheckCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    setLoading(true)
    try {
      const diagnosis = await diagnosisAPI.analyzeSymptoms(symptoms)
      setResult(diagnosis)

      // Save to Firestore (or localStorage in demo mode)
      if (user) {
        try {
          await addDoc(collection(db, 'diagnosis_reports'), {
            userId: user.uid,
            symptoms,
            result: diagnosis,
            timestamp: new Date(),
            location: 'Unknown' // Add geolocation later
          })
        } catch (error) {
          // Fallback to localStorage in demo mode
          console.warn('Firestore unavailable, saving to localStorage')
          const reports = JSON.parse(localStorage.getItem('diagnosis_reports') || '[]')
          reports.push({
            id: Date.now().toString(),
            userId: user.uid,
            symptoms,
            result: diagnosis,
            timestamp: new Date().toISOString(),
            location: 'Unknown'
          })
          localStorage.setItem('diagnosis_reports', JSON.stringify(reports))
        }
      }
    } catch (error) {
      console.error('Diagnosis error:', error)
      setResult({
        diseases: ['Error analyzing symptoms'],
        urgency: 'medium',
        advice: 'Please try again or consult a healthcare professional'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Health Diagnosis</h1>
          <p className="text-xl text-gray-600">
            Describe your symptoms or upload an image for AI-powered health analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Symptom Analysis</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe Your Symptoms
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    rows="6"
                    placeholder="Describe your symptoms in detail... (e.g., fever, headache, cough, skin rash, etc.)"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload image</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  </label>
                  {image && (
                    <p className="mt-2 text-sm text-teal-600">Image selected: {image.name}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Symptoms'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Diagnosis Results</h2>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your symptoms...</p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-6">
                {/* Urgency Level */}
                <div className={`p-4 rounded-lg border ${getUrgencyColor(result.urgency)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getUrgencyIcon(result.urgency)}
                    <span className="font-semibold capitalize">
                      {result.urgency} Priority
                    </span>
                  </div>
                </div>

                {/* Possible Diseases */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Possible Conditions</h3>
                  <div className="space-y-2">
                    {result.diseases?.map((disease, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-800">{disease}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advice */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Actions</h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800">{result.advice}</p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">
                    <strong>Disclaimer:</strong> This AI diagnosis is for informational purposes only. 
                    Please consult with a qualified healthcare professional for proper medical advice.
                  </p>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-8 text-gray-500">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter your symptoms to get AI-powered diagnosis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Diagnosis