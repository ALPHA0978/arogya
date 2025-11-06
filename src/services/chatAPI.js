import { BaseAI } from './baseAI.js'
import { getFallbackChatResponse } from './fallbacks.js'

export const chatWithBot = async (message, history = []) => {
  if (!import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY === 'your_openrouter_api_key_here') {
    console.warn('OpenRouter API key not configured, using fallback responses')
    return getFallbackChatResponse(message)
  }

  try {
    const response = await BaseAI.callAPI(message, 'You are a helpful medical chatbot providing first-aid guidance and health advice. Be concise and helpful.')
    return response
  } catch (error) {
    console.warn('Chatbot API unavailable, using fallback:', error.message)
    return getFallbackChatResponse(message)
  }
}