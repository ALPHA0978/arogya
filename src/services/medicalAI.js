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

  static async analyzeDocument(documentText) {
    try {
      const systemPrompt = `You are a medical report analyzer. Analyze the medical report and return ONLY valid JSON:
{
  "summary": "brief summary of the report",
  "keyFindings": ["finding1", "finding2"],
  "abnormalValues": [{"parameter": "name", "value": "result", "normalRange": "range"}],
  "recommendations": ["recommendation1", "recommendation2"],
  "followUp": "follow-up actions needed",
  "urgency": "low|medium|high"
}`

      const response = await this.callAPI(`Analyze this medical report: ${documentText}`, systemPrompt)
      
      return this.parseJSON(response) || {
        summary: 'Report analysis completed',
        keyFindings: ['Unable to parse specific findings'],
        recommendations: ['Consult with healthcare provider for detailed interpretation']
      }
    } catch (error) {
      console.error('Document analysis error:', error)
      return {
        error: 'Failed to analyze document. Please try again or consult a healthcare professional.'
      }
    }
  }

  static async predictHealthOutcomes(patientData, vitalsHistory) {
    try {
      const systemPrompt = `You are a health prediction AI. Return ONLY valid JSON:
{
  "riskAssessment": {
    "diabetes": {"risk": "low|medium|high", "factors": ["factors"], "timeline": "timeframe"},
    "hypertension": {"risk": "low|medium|high", "factors": ["factors"], "timeline": "timeframe"}
  },
  "healthTrajectory": {
    "shortTerm": "1-3 month outlook",
    "mediumTerm": "6-12 month outlook",
    "longTerm": "1-5 year outlook"
  },
  "interventions": {
    "preventive": ["prevention measures"],
    "lifestyle": ["lifestyle changes"]
  }
}`

      const prompt = `Predict health outcomes for: Age ${patientData.age}, Gender ${patientData.gender}, Medical History: ${patientData.medicalHistory}, Symptoms: ${patientData.symptoms}, Lifestyle: ${patientData.lifestyle}, Family History: ${patientData.familyHistory}, Vitals History: ${JSON.stringify(vitalsHistory)}`
      
      const response = await this.callAPI(prompt, systemPrompt)
      
      return this.parseJSON(response) || {
        riskAssessment: { general: { risk: 'medium', factors: ['Insufficient data'], timeline: 'Unknown' } },
        healthTrajectory: { shortTerm: 'Monitor symptoms', mediumTerm: 'Regular checkups', longTerm: 'Maintain healthy lifestyle' }
      }
    } catch (error) {
      console.error('Health prediction error:', error)
      return { error: 'Unable to generate predictions' }
    }
  }

  static async analyzeHealthTrends(healthData) {
    try {
      const systemPrompt = `Analyze health trends and return ONLY valid JSON:
{
  "trendAnalysis": {
    "vitals": {"direction": "improving|stable|declining", "confidence": "high|medium|low"},
    "symptoms": {"progression": "better|same|worse"},
    "overall": {"health": "good|fair|poor"}
  },
  "predictions": {
    "nextWeek": "prediction",
    "nextMonth": "prediction"
  }
}`

      const response = await this.callAPI(`Analyze health trends: ${JSON.stringify(healthData)}`, systemPrompt)
      
      return this.parseJSON(response) || {
        trendAnalysis: { overall: { health: 'fair' } },
        predictions: { nextWeek: 'Continue monitoring', nextMonth: 'Regular follow-up recommended' }
      }
    } catch (error) {
      console.error('Trend analysis error:', error)
      return { error: 'Unable to analyze trends' }
    }
  }
}