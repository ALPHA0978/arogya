export const getFallbackDiagnosis = (symptoms) => {
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

export const getFallbackChatResponse = (message) => {
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