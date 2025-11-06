import { MedicalAI } from './medicalAI.js'
import { chatWithBot } from './chatAPI.js'

export { MedicalAI }
export { chatWithBot }

export const diagnosisAPI = {
  analyzeSymptoms: async (symptoms, patientData = {}) => {
    return await MedicalAI.analyzeSymptoms(symptoms, patientData)
  },
  chatWithBot
}