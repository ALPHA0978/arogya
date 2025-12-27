import { useState } from 'react'
import { Upload, Camera, FileText, AlertCircle, CheckCircle, Clock, User, Calendar } from 'lucide-react'
import { diagnosisAPI } from '../services/api'
import { db } from '../services/firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

const Diagnosis = () => {
  const [symptoms, setSymptoms] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    duration: '',
    medicalHistory: '',
    medications: '',
    vitals: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      oxygenSaturation: ''
    }
  })
  const [showAdvanced, setShowAdvanced] = useState(false)
  const { user, userProfile } = useAuth()

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-400 bg-gray-700 border-gray-600'
      case 'medium': return 'text-orange-400 bg-gray-700 border-gray-600'
      case 'low': return 'text-green-400 bg-gray-700 border-gray-600'
      default: return 'text-gray-400 bg-gray-700 border-gray-600'
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
      // Compile comprehensive symptom data
      const comprehensiveData = {
        ...patientData,
        symptoms,
        location: userProfile?.location || 'Unknown location',
        compiledSymptoms: `
          Main symptoms: ${symptoms}
          Pain: ${patientData.painDescription || 'None'} in ${patientData.painLocation || 'Not specified'}
          Additional symptoms: ${[patientData.hasFever && 'Fever/Chills', patientData.hasFatigue && 'Fatigue'].filter(Boolean).join(', ') || 'None'}
          Duration: ${patientData.duration}
          Severity: ${patientData.severity || 'Not specified'}
          Medical History: ${patientData.medicalHistory || 'None'}
          Allergies: ${patientData.allergies || 'None'}
          Family History: ${patientData.familyHistory || 'None'}
        `.trim()
      }
      
      const diagnosis = await diagnosisAPI.analyzeSymptoms(symptoms, comprehensiveData)
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
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">AI Health Diagnosis</h1>
          <p className="text-xl text-gray-300">
            Describe your symptoms or upload an image for AI-powered health analysis
          </p>
        </div>

        {/* Single Column Layout */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Form */}
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Symptom Analysis</h2>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Patient Info */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                    <input
                      type="number"
                      placeholder="age"
                      value={patientData.age}
                      onChange={(e) => setPatientData(prev => ({...prev, age: e.target.value}))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                    <select
                      value={patientData.gender}
                      onChange={(e) => setPatientData(prev => ({...prev, gender: e.target.value}))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Describe Your Symptoms */}
              <div className="border-b border-gray-600 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Describe Your Symptoms</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">How are you feeling?</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                      <textarea
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none placeholder-gray-400"
                        rows="4"
                        placeholder="Eg. I have Headache, Having truble to breath"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Pain description</label>
                      <input 
                        type="text"
                        placeholder="Eg, sharp; minor"
                        value={patientData.painDescription || ''}
                        onChange={(e) => setPatientData(prev => ({...prev, painDescription: e.target.value}))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Location and type of pain</label>
                      <input
                        type="text"
                        placeholder="Eg. head, black"
                        value={patientData.painLocation || ''}
                        onChange={(e) => setPatientData(prev => ({...prev, painLocation: e.target.value}))}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Symptoms */}
              <div className="border-b border-gray-600 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Additional Symptoms</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={patientData.hasFever || false}
                      onChange={(e) => setPatientData(prev => ({...prev, hasFever: e.target.checked}))}
                      className="w-5 h-5 text-teal-400 bg-gray-700 border-gray-500 rounded focus:ring-teal-500"
                    />
                    <span className="text-gray-300 font-medium">Fever/Chills</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 p-4 border border-gray-600 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={patientData.hasFatigue || false}
                      onChange={(e) => setPatientData(prev => ({...prev, hasFatigue: e.target.checked}))}
                      className="w-5 h-5 text-teal-400 bg-gray-700 border-gray-500 rounded focus:ring-teal-500"
                    />
                    <span className="text-gray-300 font-medium">Fatigue</span>
                  </label>
                </div>
              </div>

              {/* Duration and Severity */}
              <div className="border-b border-gray-600 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Symptom Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                    <select
                      value={patientData.duration || ''}
                      onChange={(e) => setPatientData(prev => ({...prev, duration: e.target.value}))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select duration</option>
                      <option value="Less than 1 day">Less than 1 day</option>
                      <option value="1-3 days">1-3 days</option>
                      <option value="4-7 days">4-7 days</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="More than 2 weeks">More than 2 weeks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Severity</label>
                    <select
                      value={patientData.severity || ''}
                      onChange={(e) => setPatientData(prev => ({...prev, severity: e.target.value}))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select severity</option>
                      <option value="Mild">Mild (1-3)</option>
                      <option value="Moderate">Moderate (4-6)</option>
                      <option value="Severe">Severe (7-8)</option>
                      <option value="Very Severe">Very Severe (9-10)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="border-b border-gray-600 pb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Medical History (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Past diseases/surgeries</label>
                    <input
                      type="text"
                      placeholder="no"
                      value={patientData.medicalHistory}
                      onChange={(e) => setPatientData(prev => ({...prev, medicalHistory: e.target.value}))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Known allergies</label>
                    <input
                      type="text"
                      placeholder="no"
                      value={patientData.allergies || ''}
                      onChange={(e) => setPatientData(prev => ({...prev, allergies: e.target.value}))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Family medical history</label>
                    <input
                      type="text"
                      placeholder="no"
                      value={patientData.familyHistory || ''}
                      onChange={(e) => setPatientData(prev => ({...prev, familyHistory: e.target.value}))}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Upload Image (Optional)</h3>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-teal-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-300 font-medium mb-1">Click to upload image</p>
                    <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                  </label>
                  {image && (
                    <p className="mt-3 text-sm text-teal-600 font-medium">Image selected: {image.name}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !symptoms.trim()}
                className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Symptoms'}
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6 lg:p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Diagnosis Results</h2>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                <p className="text-gray-300">Analyzing your symptoms...</p>
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

                {/* Primary Diagnosis */}
                {result.primaryDiagnosis && (
                  <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Primary Diagnosis</h3>
                    <p className="text-gray-200 font-medium">{result.primaryDiagnosis}</p>
                    {result.confidence && (
                      <p className="text-sm text-blue-400 mt-1">Confidence: {result.confidence}%</p>
                    )}
                  </div>
                )}

                {/* Possible Diseases */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Possible Conditions</h3>
                  <div className="space-y-2">
                    {result.diseases?.map((disease, index) => (
                      <div key={index} className="p-3 bg-gray-700 rounded-lg">
                        <span className="text-gray-200">{disease}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investigations */}
                {result.investigations && result.investigations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recommended Tests</h3>
                    <div className="space-y-2">
                      {result.investigations.map((test, index) => (
                        <div key={index} className="p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-200 font-medium">{test.test}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              test.priority === 'high' ? 'bg-red-100 text-red-800' :
                              test.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {test.priority} priority
                            </span>
                          </div>
                          {test.reason && (
                            <p className="text-sm text-gray-400 mt-1">{test.reason}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Treatment Plan */}
                {result.treatment && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Treatment Plan</h3>
                    <div className="space-y-3">
                      {result.treatment.immediate && (
                        <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <h4 className="font-medium text-red-400 mb-2">Immediate Actions</h4>
                          <ul className="list-disc ml-5 text-gray-200">
                            {result.treatment.immediate.map((action, index) => (
                              <li key={index}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {result.treatment.medications && (
                        <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
                          <h4 className="font-medium text-green-400 mb-2">Medications</h4>
                          <div className="space-y-1">
                            {result.treatment.medications.map((med, index) => (
                              <div key={index} className="text-gray-200">
                                <span className="font-medium">{med.name}</span>
                                {med.dosage && <span className="ml-2 text-sm">- {med.dosage}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Advice */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Recommended Actions</h3>
                  <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <p className="text-gray-200">{result.advice}</p>
                  </div>
                </div>

                {/* Holistic Recommendations */}
                {result.holisticRecommendations && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Holistic Wellness Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.holisticRecommendations.yoga && result.holisticRecommendations.yoga.length > 0 && (
                        <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                          <h4 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                             Yoga & Poses
                          </h4>
                          <ul className="text-sm text-gray-200 space-y-1">
                            {result.holisticRecommendations.yoga.map((pose, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-400">•</span>
                                {pose}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.holisticRecommendations.meditation && result.holisticRecommendations.meditation.length > 0 && (
                        <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                          <h4 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                             Meditation
                          </h4>
                          <ul className="text-sm text-gray-200 space-y-1">
                            {result.holisticRecommendations.meditation.map((technique, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-purple-400">•</span>
                                {technique}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.holisticRecommendations.diet && result.holisticRecommendations.diet.length > 0 && (
                        <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                          <h4 className="font-medium text-orange-400 mb-2 flex items-center gap-2">
                             Diet & Nutrition
                          </h4>
                          <ul className="text-sm text-gray-200 space-y-1">
                            {result.holisticRecommendations.diet.map((dietary, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-orange-400">•</span>
                                {dietary}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.holisticRecommendations.exercise && result.holisticRecommendations.exercise.length > 0 && (
                        <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                          <h4 className="font-medium text-blue-400 mb-2 flex items-center gap-2">
                             Exercise
                          </h4>
                          <ul className="text-sm text-gray-200 space-y-1">
                            {result.holisticRecommendations.exercise.map((exercise, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-400">•</span>
                                {exercise}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.holisticRecommendations.homeRemedies && result.holisticRecommendations.homeRemedies.length > 0 && (
                        <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                          <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                             Home Remedies
                          </h4>
                          <ul className="text-sm text-gray-200 space-y-1">
                            {result.holisticRecommendations.homeRemedies.map((remedy, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-yellow-400">•</span>
                                {remedy}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Recommended Doctors */}
                {result.recommendedDoctors && result.recommendedDoctors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Recommended Doctors Near You</h3>
                    <div className="space-y-4">
                      {result.recommendedDoctors.map((doctor, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium text-white text-base">{doctor.name}</h4>
                              <p className="text-sm text-purple-400 font-medium">{doctor.specialty}</p>
                              <p className="text-sm text-gray-300">{doctor.hospital}</p>
                              <p className="text-sm text-gray-300 break-words">{doctor.address}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">{doctor.experience}</span>
                                <span className="text-xs text-gray-400">{doctor.distance}</span>
                                {doctor.rating && (
                                  <span className="text-xs text-gray-300">⭐ {doctor.rating}/5</span>
                                )}
                              </div>
                            </div>
                            <div className="sm:text-right">
                              <a 
                                href={`tel:${doctor.phone}`}
                                className="inline-block bg-purple-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                              >
                                 Call Now
                              </a>
                              <p className="text-xs text-gray-400 mt-1">{doctor.phone}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <p className="text-sm text-yellow-400">
                    <strong>Disclaimer:</strong> This AI diagnosis is for informational purposes only. 
                    Please consult with a qualified healthcare professional for proper medical advice.
                  </p>
                  <p className="text-sm text-yellow-400 mt-2">
                    <strong>Help us improve:</strong> After consulting your doctor, please rate our diagnosis 
                    accuracy so our AI system can learn and improve its predictions.
                  </p>
                </div>
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-8 text-gray-400">
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