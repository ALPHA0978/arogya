export class BaseAI {
  static async callAPI(prompt, systemPrompt = '') {
    const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY
    
    if (!API_KEY || API_KEY === 'your_openrouter_api_key_here') {
      throw new Error('OpenRouter API key not found')
    }

    try {
      const messages = [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt }
      ]

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-nano-9b-v2:free",
          messages: messages,
          max_tokens: 2000,
          temperature: 0.1
        })
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || 'Analysis completed successfully'
    } catch (error) {
      console.error('BaseAI API Error:', error)
      if (error.message.includes('ERR_NAME_NOT_RESOLVED') || error.message.includes('Network Error')) {
        throw new Error('Network connection failed. Please check your internet connection.')
      }
      throw error
    }
  }

  static parseJSON(response) {
    try {
      return JSON.parse(response)
    } catch (error) {
      try {
        const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/)
        if (codeBlockMatch) {
          return JSON.parse(codeBlockMatch[1].trim())
        }
        
        const jsonMatches = response.match(/\{(?:[^{}]|\{[^{}]*\})*\}/g)
        if (jsonMatches) {
          for (let i = jsonMatches.length - 1; i >= 0; i--) {
            try {
              const parsed = JSON.parse(jsonMatches[i])
              if (parsed && typeof parsed === 'object') {
                return parsed
              }
            } catch (e) { continue }
          }
        }
        
        return null
      } catch (parseError) {
        console.warn('JSON parsing failed:', parseError.message)
        return null
      }
    }
  }
}