import { BaseAI } from './baseAI.js'
import { getFallbackDiagnosis } from './fallbacks.js'

export class MedicalAI extends BaseAI {
  static async analyzeSymptoms(symptoms, patientData = {}) {
    try {
      const systemPrompt = `You are an advanced medical AI. Return ONLY valid JSON:
{
  "primaryDiagnosis": "most likely condition",
  "confidence": 85,
  "urgency": "low|medium|high|critical",
  "diseases": ["condition1", "condition2"],
  "symptoms": {
    "reported": ["patient symptoms"],
    "associated": ["related symptoms"],
    "redFlags": ["warning signs"]
  },
  "investigations": [{"test": "name", "priority": "high|medium|low", "reason": "why needed"}],
  "treatment": {
    "immediate": ["urgent actions"],
    "medications": [{"name": "drug", "dosage": "amount"}],
    "lifestyle": ["recommendations"]
  },
  "advice": "comprehensive medical advice"
}`

      const response = await this.callAPI(`Patient Analysis: Age ${patientData.age || 'unknown'}, Gender ${patientData.gender || 'unknown'}, Symptoms: ${patientData.compiledSymptoms || symptoms}, Duration: ${patientData.duration || 'unknown'}, Medical History: ${patientData.medicalHistory || 'none'}`, systemPrompt)
      
      return this.parseJSON(response) || getFallbackDiagnosis(symptoms)
    } catch (error) {
      console.error('Medical diagnosis error:', error)
      return getFallbackDiagnosis(symptoms)
    }
  }
}