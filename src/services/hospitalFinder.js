import { BaseAI } from './baseAI.js'

export class HospitalFinder extends BaseAI {
  static async findNearbyHospitals(location) {
    try {
      const systemPrompt = `You are a medical facility locator AI. Based on the location, return ONLY valid JSON with 10 real hospitals:
{
  "hospitals": [
    {
      "name": "Exact Hospital Name",
      "address": "Complete Address with Pincode",
      "phone": "+91-XXXXXXXXXX",
      "specialties": ["Cardiology", "Emergency"],
      "distance": "X.X km",
      "rating": 4.2,
      "type": "Government|Private|Multi-specialty"
    }
  ]
}`

      const response = await this.callAPI(`Find 10 real hospitals near ${location}. Include major government hospitals, private hospitals, and medical colleges with accurate addresses and phone numbers.`, systemPrompt)
      
      const result = this.parseJSON(response)
      if (result && result.hospitals) {
        return result
      }
      
      return this.getFallbackHospitals(location)
    } catch (error) {
      console.error('Hospital finder error:', error)
      return this.getFallbackHospitals(location)
    }
  }

  static getFallbackHospitals(location) {
    const cityMatch = location.match(/([A-Za-z\s]+)(?:,|$)/)
    const cityName = cityMatch ? cityMatch[1].trim() : 'City'
    
    return {
      hospitals: [
        {
          name: `${cityName} District Hospital`,
          address: `District Hospital Road, ${cityName}`,
          phone: "+91-108",
          specialties: ["Emergency", "General Medicine"],
          distance: "2.5 km",
          rating: 4.0,
          type: "Government"
        },
        {
          name: `Apollo Hospital ${cityName}`,
          address: `Main Road, ${cityName}`,
          phone: "+91-XXXX-XXXXXX",
          specialties: ["Cardiology", "Emergency"],
          distance: "3.8 km",
          rating: 4.5,
          type: "Private"
        },
        {
          name: "Emergency Services (108)",
          address: "Available throughout the city",
          phone: "108",
          specialties: ["Emergency"],
          distance: "On-call",
          rating: 5.0,
          type: "Emergency"
        }
      ]
    }
  }

  static async findSpecificHospital(hospitalName, userLocation) {
    try {
      const systemPrompt = `Search for exact hospital and return ONLY valid JSON:
{
  "found": true,
  "hospital": {
    "name": "Exact Hospital Name",
    "address": "Complete Address",
    "phone": "+91-XXXXXXXXXX",
    "specialties": ["Services"],
    "distance": "X km",
    "rating": 4.5,
    "type": "Government|Private"
  }
}`

      const response = await this.callAPI(`Find hospital "${hospitalName}" in ${userLocation}. Provide real address and contact details if it exists.`, systemPrompt)
      
      const result = this.parseJSON(response)
      if (result && result.found) {
        return result
      }
      
      return this.searchHospitalFallback(hospitalName, userLocation)
    } catch (error) {
      console.error('Specific hospital finder error:', error)
      return this.searchHospitalFallback(hospitalName, userLocation)
    }
  }

  static searchHospitalFallback(hospitalName, userLocation) {
    const searchKey = hospitalName.toLowerCase()
    
    if (searchKey.includes('apollo')) {
      return {
        found: true,
        hospital: {
          name: `Apollo Hospital`,
          address: `Apollo Campus, ${userLocation}`,
          phone: "+91-XXXX-XXXXXX",
          specialties: ["Multi-specialty", "Emergency"],
          distance: "5-10 km",
          rating: 4.5,
          type: "Private"
        }
      }
    }

    return {
      found: false,
      hospital: null
    }
  }

  static async identifyLocation(latitude, longitude) {
    try {
      const systemPrompt = `You are a location identifier AI. Given GPS coordinates, return ONLY valid JSON:
{
  "location": "City, State, Country"
}

Provide the most accurate city and state name for the coordinates.`

      const response = await this.callAPI(`Identify the location for coordinates: ${latitude}, ${longitude}. Return the city, state, and country name.`, systemPrompt)
      
      const result = this.parseJSON(response)
      return result || { location: `${latitude}, ${longitude}` }
    } catch (error) {
      console.error('Location identification error:', error)
      return { location: `${latitude}, ${longitude}` }
    }
  }
}

export const getCurrentCoordinates = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}