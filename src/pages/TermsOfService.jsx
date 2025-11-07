const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
            <p>By using Arogya health diagnostic system, you agree to these terms. This platform provides AI-powered health guidance for informational purposes only.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Service Description</h2>
            <p>Arogya offers AI-powered symptom analysis, medical chatbot assistance, and health monitoring tools. These services supplement but do not replace professional medical care.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
            <p>Users must provide accurate health information and understand that AI recommendations are not medical diagnoses. Always consult qualified healthcare professionals for medical decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
            <p>Arogya is not liable for any health outcomes resulting from use of this platform. This service is provided "as is" without warranties of any kind.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsOfService
