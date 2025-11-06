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
  try {
    // Start 11Labs conversation automatically
    const response = await fetch('https://api.elevenlabs.io/v1/convai/conversations', {
      method: 'POST',
      headers: {
        'xi-api-key': 'sk_f2dccce94d7dfebfecefc1f2baea064f53bd1bff149735e7',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_id: 'agent_9601k9dcjp8dfasrkewfn5kdcwh3',
        require_auth: false,
        override_agent_settings: {
          variables: {
            emergency_id: emergencyId,
            patient_location: emergencyData.location ? `${emergencyData.location.latitude}, ${emergencyData.location.longitude}` : 'Location pending',
            blood_pressure: emergencyData.vitals.bloodPressure || 'Not provided',
            heart_rate: emergencyData.vitals.heartRate || 'Not provided', 
            temperature: emergencyData.vitals.temperature || 'Not provided',
            oxygen_saturation: emergencyData.vitals.oxygenSaturation || 'Not provided',
            critical_alerts: emergencyData.analysis.alerts?.map(alert => alert.type).join(', ') || 'Multiple critical readings',
            timestamp: new Date().toISOString()
          }
        }
      })
    })
    
    const result = await response.json()
    console.log('🚨 Emergency Call Auto-Started:', result)
    
    return {
      success: response.ok,
      callInitiated: true,
      conversationId: result.conversation_id,
      callUrl: `https://elevenlabs.io/convai/${result.conversation_id}`,
      emergencyId: emergencyId
    }
  } catch (error) {
    console.error('Emergency call failed:', error)
    return { success: false, error: error.message }
  }
}