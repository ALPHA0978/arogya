import { useState } from 'react'
import { MapPin, Camera, Send, AlertTriangle, Droplets, Trash2, Bug } from 'lucide-react'

const CivicIssues = () => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    location: '',
    image: null
  })
  const [loading, setLoading] = useState(false)

  const issueTypes = [
    { id: 'water', label: 'Water Contamination', icon: <Droplets className="w-5 h-5" />, color: 'text-blue-600' },
    { id: 'waste', label: 'Waste Accumulation', icon: <Trash2 className="w-5 h-5" />, color: 'text-green-600' },
    { id: 'vector', label: 'Vector Breeding', icon: <Bug className="w-5 h-5" />, color: 'text-red-600' },
    { id: 'other', label: 'Other Issues', icon: <AlertTriangle className="w-5 h-5" />, color: 'text-orange-600' }
  ]

  const recentReports = [
    { id: 1, type: 'Water Contamination', location: 'Main Street', status: 'Pending', date: '2024-01-15' },
    { id: 2, type: 'Waste Accumulation', location: 'Park Area', status: 'Resolved', date: '2024-01-14' },
    { id: 3, type: 'Vector Breeding', location: 'Residential Area', status: 'In Progress', date: '2024-01-13' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setFormData({ type: '', description: '', location: '', image: null })
      alert('Report submitted successfully!')
    }, 2000)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Civic Issue Reporting</h1>
          <p className="text-xl text-gray-600">
            Report environmental and sanitation issues in your community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit New Report</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Issue Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {issueTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.type === type.id
                          ? 'border-teal-500 bg-teal-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`${type.color} mb-2`}>{type.icon}</div>
                      <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Enter location or address"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    className="hidden"
                    id="civic-image-upload"
                  />
                  <label htmlFor="civic-image-upload" className="cursor-pointer">
                    <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click to upload image</p>
                    <p className="text-sm text-gray-400">PNG, JPG up to 10MB</p>
                  </label>
                  {formData.image && (
                    <p className="mt-2 text-sm text-teal-600">Image selected: {formData.image.name}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.type || !formData.description || !formData.location}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Reports</h2>
            
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{report.type}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{report.location}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{report.date}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Community Impact</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Reports This Month:</span>
                  <span className="ml-2 text-blue-900">24</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Resolved:</span>
                  <span className="ml-2 text-blue-900">18</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CivicIssues