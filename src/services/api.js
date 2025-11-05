import axios from 'axios'

const API_BASE_URL = 'https://api.openrouter.ai/api/v1'

export const aiApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Arogya Health System'
  },
  timeout: 30000
})

// Fallback responses for when API is unavailable
const getFallbackDiagnosis = (symptoms) => {
  const commonSymptoms = symptoms.toLowerCase()
  
  if (commonSymptoms.includes('fever') || commonSymptoms.includes('temperature')) {
    return {
      diseases: ['Common Cold', 'Viral Infection', 'Flu'],
      urgency: 'medium',
      advice: 'Rest, stay hydrated, monitor temperature. Consult a doctor if fever persists over 3 days or exceeds 102°F.'
    }
  }
  
  if (commonSymptoms.includes('headache') || commonSymptoms.includes('head pain')) {
    return {
      diseases: ['Tension Headache', 'Migraine', 'Dehydration'],
      urgency: 'low',
      advice: 'Rest in a quiet, dark room. Stay hydrated. Consider over-the-counter pain relief if needed.'
    }
  }
  
  if (commonSymptoms.includes('cough') || commonSymptoms.includes('throat')) {
    return {
      diseases: ['Upper Respiratory Infection', 'Common Cold', 'Throat Irritation'],
      urgency: 'low',
      advice: 'Stay hydrated, use throat lozenges, rest your voice. See a doctor if symptoms worsen or persist.'
    }
  }
  
  return {
    diseases: ['Symptoms require professional evaluation'],
    urgency: 'medium',
    advice: 'Please consult with a qualified healthcare professional for proper diagnosis and treatment.'
  }
}

const getFallbackChatResponse = (message) => {
  const msg = message.toLowerCase()
  
  if (msg.includes('fever') || msg.includes('temperature')) {
    return 'For fever: Rest, drink plenty of fluids, and monitor your temperature. Seek medical attention if fever exceeds 102°F (39°C) or persists for more than 3 days.'
  }
  
  if (msg.includes('cut') || msg.includes('wound') || msg.includes('bleeding')) {
    return 'For cuts: 1) Clean your hands, 2) Stop bleeding with direct pressure, 3) Clean the wound gently, 4) Apply antibiotic ointment, 5) Cover with a bandage. Seek medical help for deep cuts.'
  }
  
  if (msg.includes('burn')) {
    return 'For minor burns: 1) Cool with cold water for 10-20 minutes, 2) Remove jewelry/tight items, 3) Apply aloe vera or moisturizer, 4) Cover loosely with gauze. Seek immediate help for severe burns.'
  }
  
  if (msg.includes('emergency') || msg.includes('urgent')) {
    return 'For medical emergencies, call your local emergency number immediately. Signs of emergency: difficulty breathing, chest pain, severe bleeding, loss of consciousness, or severe allergic reactions.'
  }
  
  return 'I\'m here to help with basic health questions and first-aid guidance. For specific medical concerns, please consult with a healthcare professional. What would you like to know about?'
}

export const diagnosisAPI = {
  analyzeSymptoms: async (symptoms) => {
    // Check if API key is available
    if (!import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      console.warn('OpenRouter API key not configured, using fallback diagnosis')
      return getFallbackDiagnosis(symptoms)
    }

    try {
      const response = await aiApi.post('/chat/completions', {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant. Analyze symptoms and provide possible diagnoses with urgency levels. Format response as JSON with fields: diseases (array), urgency (low/medium/high), advice (string).'
          },
          {
            role: 'user',
            content: `Analyze these symptoms: ${symptoms}`
          }
        ]
      })
      
      const content = response.data.choices[0].message.content
      try {
        return JSON.parse(content)
      } catch {
        // If JSON parsing fails, create structured response
        return {
          diseases: [content.split('\n')[0] || 'Analysis completed'],
          urgency: 'medium',
          advice: content
        }
      }
    } catch (error) {
      console.warn('AI diagnosis API unavailable, using fallback:', error.message)
      return getFallbackDiagnosis(symptoms)
    }
  },

  chatWithBot: async (message, history = []) => {
    // Check if API key is available
    if (!import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
      console.warn('OpenRouter API key not configured, using fallback responses')
      return getFallbackChatResponse(message)
    }

    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful medical chatbot providing first-aid guidance and health advice. Be concise and helpful.'
        },
        ...history.slice(-10), // Keep only last 10 messages for context
        { role: 'user', content: message }
      ]

      const response = await aiApi.post('/chat/completions', {
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages
      })
      
      return response.data.choices[0].message.content
    } catch (error) {
      console.warn('Chatbot API unavailable, using fallback:', error.message)
      return getFallbackChatResponse(message)
    }
  }
}