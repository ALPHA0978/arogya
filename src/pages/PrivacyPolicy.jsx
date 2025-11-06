const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p>We collect health information you provide, including symptoms, medical history, and vital signs for diagnostic purposes. All data is encrypted and stored securely.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <p>Your health data is used solely for AI-powered medical analysis and diagnosis. We do not share personal health information with third parties without explicit consent.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p>We implement industry-standard encryption and security measures to protect your sensitive health information. All communications are secured with SSL/TLS protocols.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p>You have the right to access, modify, or delete your health data at any time. Contact us to exercise these rights or for any privacy concerns.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy