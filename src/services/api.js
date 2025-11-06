import { MedicalAI } from './medicalAI.js'
import { chatWithBot } from './chatAPI.js'

export { MedicalAI }
export { chatWithBot }

export const diagnosisAPI = {
  analyzeSymptoms: async (symptoms, patientData = {}) => {
    return await MedicalAI.analyzeSymptoms(symptoms, patientData)
  },
  analyzeVitals: async (vitals) => {
    try {
      const vitalsText = `Analyze these vital signs and provide medical assessment:
      Blood Pressure: ${vitals.bloodPressure || 'Not provided'}
      Heart Rate: ${vitals.heartRate || 'Not provided'} bpm
      Temperature: ${vitals.temperature || 'Not provided'}°F
      Oxygen Saturation: ${vitals.oxygenSaturation || 'Not provided'}%
      Respiratory Rate: ${vitals.respiratoryRate || 'Not provided'}
      
      Please provide:
      1. Overall status (normal/concerning/critical)
      2. Specific alerts for abnormal values
      3. Medical recommendations
      4. Possible conditions to monitor
      
      Format as JSON with status, alerts array, and recommendations array.`
      
      const aiResponse = await MedicalAI.analyzeSymptoms(vitalsText)
      
      // Parse AI response or provide structured fallback
      let analysis
      try {
        analysis = JSON.parse(aiResponse.analysis || aiResponse)
      } catch {
        // Fallback analysis if AI response isn't JSON
        analysis = {
          status: aiResponse.urgency || 'normal',
          alerts: aiResponse.diseases?.map(d => ({
            type: d,
            message: `Potential concern: ${d}`,
            severity: aiResponse.urgency === 'high' ? 'high' : 'medium'
          })) || [],
          recommendations: aiResponse.recommendations || ['Monitor vitals regularly', 'Consult healthcare provider if symptoms persist']
        }
      }
      
      // Validate status based on critical vitals
      const hr = parseInt(vitals.heartRate)
      const temp = parseFloat(vitals.temperature)
      const spo2 = parseInt(vitals.oxygenSaturation)
      const bpLow = vitals.bloodPressure ? parseInt(vitals.bloodPressure.split('/')[1]) : null
      
      let criticalAlerts = []
      
      if (spo2 && spo2 < 90) {
        analysis.status = 'critical'
        criticalAlerts.push({
          type: 'Severe Hypoxia',
          message: `Oxygen level ${spo2}% is dangerously low (normal: 95-100%). This can cause organ damage.`,
          severity: 'high',
          explanation: 'Your blood is not carrying enough oxygen to vital organs. Immediate medical attention required.'
        })
      }
      
      if (bpLow && bpLow < 60) {
        analysis.status = 'critical'
        criticalAlerts.push({
          type: 'Severe Hypotension',
          message: `Diastolic pressure ${bpLow} is critically low (normal: 60-80). Risk of organ failure.`,
          severity: 'high',
          explanation: 'Low blood pressure means organs may not get enough blood flow to function properly.'
        })
      }
      
      if (hr && (hr < 50 || hr > 120)) {
        analysis.status = 'critical'
        criticalAlerts.push({
          type: hr < 50 ? 'Severe Bradycardia' : 'Severe Tachycardia',
          message: `Heart rate ${hr} bpm is ${hr < 50 ? 'too slow' : 'too fast'} (normal: 60-100 bpm)`,
          severity: 'high',
          explanation: `${hr < 50 ? 'Slow heart rate may not pump enough blood' : 'Fast heart rate may indicate stress or heart problems'}`
        })
      }
      
      if (temp && temp < 96) {
        analysis.status = 'critical'
        criticalAlerts.push({
          type: 'Hypothermia',
          message: `Temperature ${temp}°F is dangerously low (normal: 97-99°F)`,
          severity: 'high',
          explanation: 'Low body temperature can slow down vital body functions and be life-threatening.'
        })
      }
      
      // Add critical alerts to existing alerts
      if (criticalAlerts.length > 0) {
        analysis.alerts = [...(analysis.alerts || []), ...criticalAlerts]
        analysis.emergencyTriggered = true
      }
      
      // Check for concerning but not critical vitals
      if (analysis.status !== 'critical') {
        if ((spo2 && spo2 < 95) || (hr && (hr < 60 || hr > 100)) || (temp && (temp < 97 || temp > 99.5))) {
          analysis.status = 'concerning'
        }
      }
      
      return analysis
    } catch (error) {
      console.error('AI vitals analysis failed:', error)
      // Basic fallback analysis
      return {
        status: 'normal',
        alerts: [],
        recommendations: ['Unable to analyze vitals with AI. Please consult a healthcare professional for proper assessment.']
      }
    }
  },
  chatWithBot
}