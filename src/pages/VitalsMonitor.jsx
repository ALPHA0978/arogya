import { useState, useEffect } from 'react'
import { Activity, Heart, Thermometer, Droplets, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { diagnosisAPI } from '../services/api'

const VitalsMonitor = () => {
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenSaturation: '',
    respiratoryRate: ''
  })
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const analyzeVitals = async () => {
    if (!vitals.bloodPressure && !vitals.heartRate) return
    
    setLoading(true)
    try {
      const result = await diagnosisAPI.analyzeVitals(vitals)
      setAnalysis(result)
      
      // Add to history
      const newEntry = {
        timestamp: new Date(),
        vitals: {...vitals},
        analysis: result
      }
      setHistory(prev => [newEntry, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Vitals analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVitalStatus = (vital, value) => {
    if (!value) return 'text-gray-400'
    
    switch (vital) {
      case 'heartRate':
        const hr = parseInt(value)
        if (hr < 60 || hr > 100) return 'text-red-500'
        return 'text-green-500'
      case 'temperature':
        const temp = parseFloat(value)
        if (temp < 97 || temp > 99.5) return 'text-red-500'
        return 'text-green-500'
      case 'oxygenSaturation':
        const spo2 = parseInt(value)
        if (spo2 < 95) return 'text-red-500'
        return 'text-green-500'
      default:
        return 'text-blue-500'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Vitals Monitor</h1>
          <p className="text-xl text-gray-600">Real-time health monitoring and analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-red-500" />
              Enter Vital Signs
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Pressure
                  </label>
                  <div className="relative">
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                    <input
                      type="text"
                      value={vitals.bloodPressure}
                      onChange={(e) => setVitals(prev => ({...prev, bloodPressure: e.target.value}))}
                      placeholder="120/80"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    value={vitals.heartRate}
                    onChange={(e) => setVitals(prev => ({...prev, heartRate: e.target.value}))}
                    placeholder="72"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 ${getVitalStatus('heartRate', vitals.heartRate)}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature (°F)
                  </label>
                  <div className="relative">
                    <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals(prev => ({...prev, temperature: e.target.value}))}
                      placeholder="98.6"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 ${getVitalStatus('temperature', vitals.temperature)}`}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oxygen Saturation (%)
                  </label>
                  <div className="relative">
                    <Droplets className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
                    <input
                      type="number"
                      value={vitals.oxygenSaturation}
                      onChange={(e) => setVitals(prev => ({...prev, oxygenSaturation: e.target.value}))}
                      placeholder="98"
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 ${getVitalStatus('oxygenSaturation', vitals.oxygenSaturation)}`}
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={analyzeVitals}
                disabled={loading || (!vitals.bloodPressure && !vitals.heartRate)}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Analyzing...' : 'Analyze Vitals'}
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Analysis</h2>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing vitals...</p>
              </div>
            )}

            {analysis && !loading && (
              <div className="space-y-6">
                {/* Overall Status */}
                <div className={`p-4 rounded-lg border-2 ${
                  analysis.status === 'critical' ? 'border-red-500 bg-red-50' :
                  analysis.status === 'concerning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-green-500 bg-green-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {analysis.status === 'critical' ? <AlertTriangle className="w-5 h-5 text-red-500" /> :
                     analysis.status === 'concerning' ? <AlertTriangle className="w-5 h-5 text-yellow-500" /> :
                     <Activity className="w-5 h-5 text-green-500" />}
                    <span className="font-semibold capitalize">{analysis.status} Status</span>
                  </div>
                </div>

                {/* Alerts */}
                {analysis.alerts && analysis.alerts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Alerts</h3>
                    <div className="space-y-2">
                      {analysis.alerts.map((alert, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          alert.severity === 'high' ? 'border-red-300 bg-red-50' :
                          alert.severity === 'medium' ? 'border-yellow-300 bg-yellow-50' :
                          'border-blue-300 bg-blue-50'
                        }`}>
                          <div className="font-medium">{alert.type}</div>
                          <div className="text-sm text-gray-600">{alert.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {!analysis && !loading && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter vitals to get AI analysis</p>
              </div>
            )}
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Readings</h2>
            <div className="space-y-4">
              {history.slice(0, 5).map((entry, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">
                      {entry.timestamp.toLocaleString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.analysis.status === 'critical' ? 'bg-red-100 text-red-800' :
                      entry.analysis.status === 'concerning' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {entry.analysis.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>BP: {entry.vitals.bloodPressure}</div>
                    <div>HR: {entry.vitals.heartRate}</div>
                    <div>Temp: {entry.vitals.temperature}°F</div>
                    <div>SpO2: {entry.vitals.oxygenSaturation}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VitalsMonitor