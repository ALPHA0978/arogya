const MedicalDisclaimer = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Medical Disclaimer</h1>
        
        <div className="space-y-6 text-gray-700">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="font-semibold text-red-800">IMPORTANT: This platform is for informational purposes only and does not constitute medical advice.</p>
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-3">Not a Substitute for Professional Medical Care</h2>
            <p>Arogya's AI-powered diagnostic tools are designed to provide health information and guidance. They are NOT a substitute for professional medical diagnosis, treatment, or advice from qualified healthcare providers.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Emergency Situations</h2>
            <p>In case of medical emergencies, immediately contact emergency services (108) or visit the nearest hospital. Do not rely on this platform for emergency medical situations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Accuracy Limitations</h2>
            <p>While our AI systems are trained on medical data, they may not account for all individual health factors. Always consult with healthcare professionals for accurate diagnosis and treatment.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Professional Medical Consultation</h2>
            <p>Users are strongly advised to consult with qualified medical professionals before making any health-related decisions based on information provided by this platform.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default MedicalDisclaimer