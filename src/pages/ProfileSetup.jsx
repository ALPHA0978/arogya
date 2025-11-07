import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, Calendar, Phone, MapPin, Heart, Search, Plus, X, Hospital, Loader, CheckCircle } from 'lucide-react'
import { HospitalFinder } from '../services/hospitalFinder.js'

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    gender: '',
    phone: '',
    location: '',
    medicalHistory: '',
    allergies: '',
    medications: '',
    bloodGroup: '',
    emergencyContacts: [{ name: '', phone: '', relation: '' }],
    selectedHospitals: [],
    insuranceInfo: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hospitalLoading, setHospitalLoading] = useState(false)
  const [nearbyHospitals, setNearbyHospitals] = useState([])
  const [customHospitalName, setCustomHospitalName] = useState('')
  const [customHospitalLoading, setCustomHospitalLoading] = useState(false)
  const [gettingLocation, setGettingLocation] = useState(false)
  const [userCoordinates, setUserCoordinates] = useState(null)
  const { user, userProfile, updateUserProfile } = useAuth()
  const navigate = useNavigate()

  // Pre-fill form with existing profile data
  useEffect(() => {
    if (userProfile && userProfile.profileComplete) {
      setFormData({
        fullName: userProfile.fullName || '',
        age: userProfile.age || '',
        gender: userProfile.gender || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
        medicalHistory: userProfile.medicalHistory || '',
        allergies: userProfile.allergies || '',
        medications: userProfile.medications || '',
        bloodGroup: userProfile.bloodGroup || '',
        emergencyContacts: userProfile.emergencyContacts || [{ name: '', phone: '', relation: '' }],
        selectedHospitals: userProfile.selectedHospitals || [],
        insuranceInfo: userProfile.insuranceInfo || ''
      })
    }
  }, [userProfile])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const addEmergencyContact = () => {
    setFormData({
      ...formData,
      emergencyContacts: [...formData.emergencyContacts, { name: '', phone: '', relation: '' }]
    })
  }

  const removeEmergencyContact = (index) => {
    const contacts = formData.emergencyContacts.filter((_, i) => i !== index)
    setFormData({ ...formData, emergencyContacts: contacts })
  }

  const updateEmergencyContact = (index, field, value) => {
    const contacts = [...formData.emergencyContacts]
    contacts[index][field] = value
    setFormData({ ...formData, emergencyContacts: contacts })
  }

  const getCurrentLocation = () => {
    setGettingLocation(true)
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser')
      setGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserCoordinates({ latitude, longitude })
        
        // Use AI to identify location from coordinates
        try {
          const locationName = await identifyLocationFromCoordinates(latitude, longitude)
          setFormData(prev => ({ ...prev, location: locationName }))
        } catch (error) {
          console.log('AI location identification failed, using coordinates')
          setFormData(prev => ({ ...prev, location: `${latitude}, ${longitude}` }))
        }
        
        setGettingLocation(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to get your location. Please enter manually.')
        setGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  const identifyLocationFromCoordinates = async (lat, lng) => {
    try {
      const result = await HospitalFinder.identifyLocation(lat, lng)
      return result.location || `${lat}, ${lng}`
    } catch (error) {
      return `${lat}, ${lng}`
    }
  }

  const findNearbyHospitals = async () => {
    if (!formData.location && !userCoordinates) {
      alert('Please enter your location or allow location access')
      return
    }
    
    setHospitalLoading(true)
    try {
      let locationQuery = formData.location
      if (userCoordinates) {
        locationQuery = `${userCoordinates.latitude}, ${userCoordinates.longitude} (${formData.location})`
      }
      
      const result = await HospitalFinder.findNearbyHospitals(locationQuery)
      setNearbyHospitals(result.hospitals || [])
    } catch (error) {
      console.error('Hospital search error:', error)
    } finally {
      setHospitalLoading(false)
    }
  }

  const selectHospital = (hospital) => {
    const isSelected = formData.selectedHospitals.some(h => h.name === hospital.name)
    if (isSelected) {
      // Remove hospital if already selected
      setFormData({ 
        ...formData, 
        selectedHospitals: formData.selectedHospitals.filter(h => h.name !== hospital.name)
      })
    } else {
      // Add hospital to selection
      setFormData({ 
        ...formData, 
        selectedHospitals: [...formData.selectedHospitals, hospital]
      })
    }
  }

  const findCustomHospital = async () => {
    if (!customHospitalName || !formData.location) {
      alert('Please enter hospital name and your location')
      return
    }
    
    setCustomHospitalLoading(true)
    try {
      const result = await HospitalFinder.findSpecificHospital(customHospitalName, formData.location)
      if (result.found) {
        setFormData({ 
          ...formData, 
          selectedHospitals: [...formData.selectedHospitals, result.hospital]
        })
        setCustomHospitalName('')
      } else {
        alert('Hospital not found. Please check the name and try again.')
      }
    } catch (error) {
      console.error('Custom hospital search error:', error)
    } finally {
      setCustomHospitalLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    
    // Validate required fields
    if (!formData.fullName || !formData.age || !formData.phone || !formData.location) {
      alert('Please fill in all required fields')
      return
    }
    
    setLoading(true)
    
    try {
      const profileData = {
        ...formData,
        profileComplete: true,
        setupCompleted: new Date().toISOString()
      }
      await updateUserProfile(profileData)
      navigate('/user-dashboard')
    } catch (error) {
      console.error('Profile setup error:', error)
      alert('Error saving profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Arogya" className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white">
            {userProfile?.profileComplete ? 'Edit Your Health Profile' : 'Complete Your Health Profile'}
          </h2>
          <p className="text-gray-300 mt-2">
            {userProfile?.profileComplete ? 'Update your information as needed' : 'Help us provide personalized healthcare recommendations'}
          </p>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && <div className={`w-12 h-1 ${
                    currentStep > step ? 'bg-teal-600' : 'bg-gray-200'
                  }`} />}
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-400 space-x-8">
            <div className="text-center w-20">
              <span>Basic Info</span>
            </div>
            <div className="text-center w-20">
              <span>Medical Details</span>
            </div>
            <div className="text-center w-20">
              <span>Emergency & Hospital</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
          <div>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                        placeholder="Enter your age"
                        min="1"
                        max="120"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                        placeholder="City, State (e.g., Mumbai, Maharashtra)"
                        required
                      />
                    </div>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={gettingLocation}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                    >
                      {gettingLocation ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      {gettingLocation ? 'Getting...' : 'GPS'}
                    </button>
                  </div>
                  {userCoordinates && (
                    <p className="text-xs text-green-400 mt-1">
                      📍 GPS Location: {userCoordinates.latitude.toFixed(4)}, {userCoordinates.longitude.toFixed(4)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Insurance Information (Optional)</label>
                  <input
                    type="text"
                    name="insuranceInfo"
                    value={formData.insuranceInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                    placeholder="Insurance provider and policy number"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Medical Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white mb-4">Medical Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Medical History</label>
                  <textarea
                    name="medicalHistory"
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                    placeholder="Chronic conditions, past surgeries, family history..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Allergies</label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                    placeholder="Drug allergies, food allergies, environmental allergies..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Medications</label>
                  <textarea
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    rows="2"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                    placeholder="Current medications with dosage..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Emergency Contacts & Hospital */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Emergency Contacts</h3>
                  
                  {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border border-gray-600 rounded-lg">
                      <input
                        type="text"
                        placeholder="Contact Name"
                        value={contact.name}
                        onChange={(e) => updateEmergencyContact(index, 'name', e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={contact.phone}
                        onChange={(e) => updateEmergencyContact(index, 'phone', e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                      />
                      <select
                        value={contact.relation}
                        onChange={(e) => updateEmergencyContact(index, 'relation', e.target.value)}
                        className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">Relation</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="child">Child</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                      {formData.emergencyContacts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEmergencyContact(index)}
                          className="px-3 py-2 bg-red-900/30 text-red-400 rounded hover:bg-red-900/50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addEmergencyContact}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-900/30 text-teal-400 rounded-lg hover:bg-teal-900/50"
                  >
                    <Plus className="w-4 h-4" /> Add Another Contact
                  </button>
                </div>

                {/* Hospital Selection */}
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Select Hospitals (Optional)</h3>
                  
                  {/* AI Hospital Finder */}
                  <div className="mb-6">
                    <button
                      type="button"
                      onClick={findNearbyHospitals}
                      disabled={hospitalLoading || !formData.location}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {hospitalLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                      check Nearby Hospitals
                    </button>
                    {!formData.location && (
                      <p className="text-sm text-gray-400 mt-2">Please enter your location first to find hospitals</p>
                    )}
                  </div>

                  {/* Nearby Hospitals List */}
                  {nearbyHospitals.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-white mb-3">Recommended Hospitals Near You (Click to select multiple):</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                        {nearbyHospitals.map((hospital, index) => {
                          const isSelected = formData.selectedHospitals.some(h => h.name === hospital.name)
                          return (
                            <div
                              key={index}
                              onClick={() => selectHospital(hospital)}
                              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                isSelected
                                  ? 'border-teal-500 bg-teal-900/30'
                                  : 'border-gray-600 hover:border-teal-400'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-white">{hospital.name}</h5>
                                  <p className="text-sm text-gray-300">{hospital.address}</p>
                                  <p className="text-sm text-gray-300">{hospital.phone}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded">{hospital.type}</span>
                                    <span className="text-xs text-gray-400">{hospital.distance}</span>
                                  </div>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-5 h-5 text-teal-600" />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Manual Hospital Selection */}
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-white mb-3">Or Search for a Specific Hospital:</h4>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={customHospitalName}
                        onChange={(e) => setCustomHospitalName(e.target.value)}
                        placeholder="Enter hospital name"
                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        onClick={findCustomHospital}
                        disabled={customHospitalLoading || !customHospitalName}
                        className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        {customHospitalLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Hospital className="w-4 h-4" />}
                        Find
                      </button>
                    </div>
                  </div>

                  {/* Selected Hospitals Display */}
                  {formData.selectedHospitals.length > 0 && (
                    <div className="mt-6 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                      <h4 className="font-medium text-green-300 mb-3">Selected Hospitals ({formData.selectedHospitals.length}):</h4>
                      <div className="space-y-3">
                        {formData.selectedHospitals.map((hospital, index) => (
                          <div key={index} className="bg-gray-700 p-3 rounded border border-gray-600 flex justify-between items-start">
                            <div className="text-green-300">
                              <p className="font-medium">{hospital.name}</p>
                              <p className="text-sm">{hospital.address}</p>
                              <p className="text-sm">{hospital.phone}</p>
                            </div>
                            <button
                              onClick={() => selectHospital(hospital)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Remove hospital"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700"
                >
                  Previous
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !formData.fullName || !formData.age || !formData.phone || !formData.location}
                  className="ml-auto px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup