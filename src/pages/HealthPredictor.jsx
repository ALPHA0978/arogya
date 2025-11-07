import { useState } from 'react'
import { TrendingUp, Brain, AlertTriangle, Target, Activity, Calendar, Loader, Upload, FileText, Download } from 'lucide-react'
import { diagnosisAPI } from '../services/api'

const HealthPredictor = () => {
  const [activeTab, setActiveTab] = useState('analyzer')
  const [patientData, setPatientData] = useState({
    age: '',
    gender: '',
    medicalHistory: '',
    symptoms: '',
    lifestyle: '',
    familyHistory: ''
  })
  const [vitalsHistory, setVitalsHistory] = useState([])
  const [predictions, setPredictions] = useState(null)
  const [trends, setTrends] = useState(null)
  const [loading, setLoading] = useState(false)
  
  // Document analyzer state
  const [uploadedFile, setUploadedFile] = useState(null)
  const [documentText, setDocumentText] = useState('')
  const [reportAnalysis, setReportAnalysis] = useState(null)
  const [analyzingReport, setAnalyzingReport] = useState(false)

  const analyzePredictions = async () => {
    if (!patientData.age) return
    
    setLoading(true)
    try {
      // Step 1: Get health outcome predictions
      const healthPredictions = await diagnosisAPI.predictHealthOutcomes(patientData, vitalsHistory)
      setPredictions(healthPredictions)
      
      // Step 2: Analyze health trends
      const healthData = {
        patient: patientData,
        vitalsHistory,
        currentSymptoms: patientData.symptoms
      }
      const trendAnalysis = await diagnosisAPI.analyzeHealthTrends(healthData)
      setTrends(trendAnalysis)
      
    } catch (error) {
      console.error('Prediction analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const addVitalRecord = () => {
    const newRecord = {
      date: new Date().toISOString().split('T')[0],
      bp: '',
      hr: '',
      temp: ''
    }
    setVitalsHistory([...vitalsHistory, newRecord])
  }

  const updateVitalRecord = (index, field, value) => {
    const updated = [...vitalsHistory]
    updated[index][field] = value
    setVitalsHistory(updated)
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-500 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-500 bg-green-50 border-green-200'
      default: return 'text-gray-500 bg-gray-50 border-gray-200'
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadedFile(file)
      
      // Read file content
      const reader = new FileReader()
      reader.onload = (event) => {
        setDocumentText(event.target.result)
      }
      reader.readAsText(file)
    }
  }

  const analyzeDocument = async () => {
    if (!documentText.trim()) return
    
    setAnalyzingReport(true)
    try {
      const analysis = await diagnosisAPI.analyzeDocument(documentText)
      setReportAnalysis(analysis)
    } catch (error) {
      console.error('Document analysis error:', error)
      setReportAnalysis({
        error: 'Failed to analyze document. Please try again.'
      })
    } finally {
      setAnalyzingReport(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Report Analyzer</h1>
          <p className="text-xl text-gray-300">AI-powered medical report analysis</p>
        </div>

        {false && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Patient Data */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-2 text-purple-500" />
                Patient Information
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="number"
                  placeholder="Age"
                  value={patientData.age}
                  onChange={(e) => setPatientData(prev => ({...prev, age: e.target.value}))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <select
                  value={patientData.gender}
                  onChange={(e) => setPatientData(prev => ({...prev, gender: e.target.value}))}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-4">
                <textarea
                  placeholder="Medical History (diabetes, hypertension, etc.)"
                  value={patientData.medicalHistory}
                  onChange={(e) => setPatientData(prev => ({...prev, medicalHistory: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
                
                <textarea
                  placeholder="Current Symptoms"
                  value={patientData.symptoms}
                  onChange={(e) => setPatientData(prev => ({...prev, symptoms: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows="3"
                />
                
                <input
                  type="text"
                  placeholder="Lifestyle (exercise, diet, smoking, etc.)"
                  value={patientData.lifestyle}
                  onChange={(e) => setPatientData(prev => ({...prev, lifestyle: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                
                <input
                  type="text"
                  placeholder="Family History"
                  value={patientData.familyHistory}
                  onChange={(e) => setPatientData(prev => ({...prev, familyHistory: e.target.value}))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Vitals History */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-red-500" />
                  Vitals History
                </h3>
                <button
                  onClick={addVitalRecord}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Record
                </button>
              </div>
              
              <div className="space-y-3">
                {vitalsHistory.map((record, index) => (
                  <div key={index} className="grid grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="date"
                      value={record.date}
                      onChange={(e) => updateVitalRecord(index, 'date', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="BP (120/80)"
                      value={record.bp}
                      onChange={(e) => updateVitalRecord(index, 'bp', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="HR (bpm)"
                      value={record.hr}
                      onChange={(e) => updateVitalRecord(index, 'hr', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Temp (°F)"
                      value={record.temp}
                      onChange={(e) => updateVitalRecord(index, 'temp', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={analyzePredictions}
              disabled={loading || !patientData.age}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  Predict Health Outcomes
                </>
              )}
            </button>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Analyzing health data and generating predictions...</p>
              </div>
            )}

            {/* Risk Assessment */}
            {predictions && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-orange-500" />
                  Risk Assessment
                </h2>
                
                <div className="space-y-4">
                  {predictions.riskAssessment && Object.entries(predictions.riskAssessment).map(([condition, data]) => (
                    <div key={condition} className={`p-4 rounded-lg border ${getRiskColor(data.risk)}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold capitalize">{condition}</h3>
                        <span className="px-3 py-1 rounded-full text-sm font-medium">
                          {data.risk} Risk
                        </span>
                      </div>
                      {data.factors && (
                        <div className="text-sm mb-2">
                          <strong>Risk Factors:</strong> {data.factors.join(', ')}
                        </div>
                      )}
                      {data.timeline && (
                        <div className="text-sm">
                          <strong>Timeline:</strong> {data.timeline}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Health Trajectory */}
            {predictions && predictions.healthTrajectory && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-green-500" />
                  Health Trajectory
                </h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">Short Term (1-3 months)</h3>
                    <p className="text-blue-800">{predictions.healthTrajectory.shortTerm}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-900 mb-2">Medium Term (6-12 months)</h3>
                    <p className="text-green-800">{predictions.healthTrajectory.mediumTerm}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-900 mb-2">Long Term (1-5 years)</h3>
                    <p className="text-purple-800">{predictions.healthTrajectory.longTerm}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Trend Analysis */}
            {trends && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-blue-500" />
                  Health Trends
                </h2>
                
                {trends.trendAnalysis && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{trends.trendAnalysis.vitals?.direction}</div>
                      <div className="text-sm text-gray-600">Vitals Trend</div>
                      <div className="text-xs text-gray-500">{trends.trendAnalysis.vitals?.confidence} confidence</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{trends.trendAnalysis.symptoms?.progression}</div>
                      <div className="text-sm text-gray-600">Symptoms</div>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{trends.trendAnalysis.overall?.health}</div>
                      <div className="text-sm text-gray-600">Overall Health</div>
                    </div>
                  </div>
                )}

                {trends.predictions && (
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <strong className="text-yellow-900">Next Week:</strong>
                      <span className="text-yellow-800 ml-2">{trends.predictions.nextWeek}</span>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <strong className="text-blue-900">Next Month:</strong>
                      <span className="text-blue-800 ml-2">{trends.predictions.nextMonth}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {predictions && predictions.interventions && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-2 text-teal-500" />
                  Recommendations
                </h2>
                
                <div className="space-y-4">
                  {predictions.interventions.preventive && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-semibold text-green-900 mb-2">Preventive Measures</h3>
                      <ul className="list-disc ml-5 text-green-800">
                        {predictions.interventions.preventive.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {predictions.interventions.lifestyle && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-semibold text-blue-900 mb-2">Lifestyle Changes</h3>
                      <ul className="list-disc ml-5 text-blue-800">
                        {predictions.interventions.lifestyle.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!predictions && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Brain className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Enter patient information to generate health predictions</p>
              </div>
            )}
          </div>
        </div>
        )}

        {activeTab === 'analyzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Document Upload Section */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-blue-500" />
                Upload Medical Report
              </h2>
              
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Select Document
                  </label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-300">Click to upload medical report</p>
                      <p className="text-sm text-gray-500">Supports TXT, PDF, DOC files</p>
                    </label>
                    {uploadedFile && (
                      <p className="mt-2 text-sm text-blue-600">File: {uploadedFile.name}</p>
                    )}
                  </div>
                </div>

                {/* Manual Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Or Paste Report Text
                  </label>
                  <textarea
                    value={documentText}
                    onChange={(e) => setDocumentText(e.target.value)}
                    placeholder="Paste your medical report text here..."
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                    rows="10"
                  />
                </div>

                <button
                  onClick={analyzeDocument}
                  disabled={analyzingReport || !documentText.trim()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {analyzingReport ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing Report...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Analyze Report
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            <div className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">Analysis Results</h2>
              
              {analyzingReport && (
                <div className="text-center py-8">
                  <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-300">Analyzing medical report...</p>
                </div>
              )}

              {reportAnalysis && !analyzingReport && (
                <div className="space-y-6">
                  {reportAnalysis.error ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800">{reportAnalysis.error}</p>
                    </div>
                  ) : (
                    <>
                      {/* Summary */}
                      {reportAnalysis.summary && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <h3 className="text-lg font-semibold text-blue-900 mb-2">Report Summary</h3>
                          <p className="text-blue-800">{reportAnalysis.summary}</p>
                        </div>
                      )}

                      {/* Key Findings */}
                      {reportAnalysis.keyFindings && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Key Findings</h3>
                          <div className="space-y-2">
                            {reportAnalysis.keyFindings.map((finding, index) => (
                              <div key={index} className="p-3 bg-gray-700 rounded-lg">
                                <span className="text-gray-200">{finding}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Abnormal Values */}
                      {reportAnalysis.abnormalValues && reportAnalysis.abnormalValues.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Abnormal Values</h3>
                          <div className="space-y-2">
                            {reportAnalysis.abnormalValues.map((value, index) => (
                              <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <div className="font-medium text-yellow-900">{value.parameter}</div>
                                <div className="text-sm text-yellow-800">
                                  Value: {value.value} (Normal: {value.normalRange})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations */}
                      {reportAnalysis.recommendations && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Recommendations</h3>
                          <ul className="space-y-2">
                            {reportAnalysis.recommendations.map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <span className="text-gray-300">{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Follow-up Actions */}
                      {reportAnalysis.followUp && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <h3 className="text-lg font-semibold text-green-900 mb-2">Follow-up Actions</h3>
                          <p className="text-green-800">{reportAnalysis.followUp}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {!reportAnalysis && !analyzingReport && (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Upload a medical report to get AI analysis</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthPredictor