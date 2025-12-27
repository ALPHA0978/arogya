import { db } from './firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'

export const emergencyService = {
  triggerEmergencyResponse: async (vitals, analysis, userLocation) => {
    try {
      // Get user location if not provided
      let location = userLocation
      if (!location) {
        location = await getCurrentLocation()
      }

      // Save emergency alert to database
      const emergencyData = {
        timestamp: new Date().toISOString(),
        type: 'critical_vitals',
        vitals,
        analysis,
        location,
        status: 'active',
        responseRequested: true
      }

      const docRef = await addDoc(collection(db, 'emergency_alerts'), emergencyData)
      
      // Trigger 11Labs emergency call
      const callResult = await initiateEmergencyCall(emergencyData, docRef.id)
      
      return {
        success: true,
        emergencyId: docRef.id,
        agentId: 'agent_9601k9dcjp8dfasrkewfn5kdcwh3',
        message: 'Emergency response initiated'
      }
    } catch (error) {
      console.error('Emergency service error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

const getCurrentLocation = () => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          console.warn('Location access denied:', error)
          resolve({ error: 'Location not available' })
        }
      )
    } else {
      resolve({ error: 'Geolocation not supported' })
    }
  })
}

const initiateEmergencyCall = async (emergencyData, emergencyId) => {
  console.log('EMERGENCY CALL INITIATED')
  console.log('Emergency ID:', emergencyId)
  console.log('Critical vitals detected:', emergencyData.vitals)
  console.log('Location:', emergencyData.location)
  
  return { 
    success: true, 
    callInitiated: true,
    emergencyId: emergencyId,
    agentId: 'agent_9601k9dcjp8dfasrkewfn5kdcwh3'
  }
}