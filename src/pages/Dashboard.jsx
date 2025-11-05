import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, AlertTriangle, Activity, MapPin, Calendar, Info } from 'lucide-react'
import { db } from '../services/firebaseConfig'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { isDemoMode } = useAuth()
  const [stats, setStats] = useState({
    totalDiagnoses: 1234,
    activeUsers: 567,
    criticalCases: 23,
    resolvedIssues: 89
  })

  const [recentDiagnoses, setRecentDiagnoses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen to recent diagnoses (or load from localStorage in demo mode)
    try {
      const q = query(
        collection(db, 'diagnosis_reports'),
        orderBy('timestamp', 'desc'),
        limit(10)
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const diagnoses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setRecentDiagnoses(diagnoses)
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      // Fallback to localStorage in demo mode
      console.warn('Firestore unavailable, loading from localStorage')
      const reports = JSON.parse(localStorage.getItem('diagnosis_reports') || '[]')
      const formattedReports = reports.map(report => ({
        ...report,
        timestamp: { toDate: () => new Date(report.timestamp) }
      }))
      setRecentDiagnoses(formattedReports.slice(0, 10))
      setLoading(false)
    }
  }, [])

  const diseaseData = [
    { name: 'Fever', cases: 45, color: '#ef4444' },
    { name: 'Cough', cases: 32, color: '#f97316' },
    { name: 'Headache', cases: 28, color: '#eab308' },
    { name: 'Skin Issues', cases: 21, color: '#22c55e' },
    { name: 'Digestive', cases: 18, color: '#3b82f6' },
    { name: 'Others', cases: 15, color: '#8b5cf6' }
  ]

  const weeklyData = [
    { day: 'Mon', diagnoses: 12, civic: 3 },
    { day: 'Tue', diagnoses: 19, civic: 5 },
    { day: 'Wed', diagnoses: 15, civic: 2 },
    { day: 'Thu', diagnoses: 22, civic: 7 },
    { day: 'Fri', diagnoses: 18, civic: 4 },
    { day: 'Sat', diagnoses: 25, civic: 6 },
    { day: 'Sun', diagnoses: 16, civic: 3 }
  ]

  const urgencyColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Health Dashboard</h1>
          <p className="text-xl text-gray-600">Community health monitoring and analytics</p>
          
          {isDemoMode && (
            <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                <p className="text-sm">
                  <strong>Demo Mode:</strong> This dashboard shows sample data. In production, it would display real community health data.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Diagnoses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDiagnoses.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4" />
                  +12% from last month
                </p>
              </div>
              <Activity className="w-12 h-12 text-teal-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-sm text-blue-600 flex items-center gap-1 mt-2">
                  <Users className="w-4 h-4" />
                  +8% this week
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Critical Cases</p>
                <p className="text-3xl font-bold text-gray-900">{stats.criticalCases}</p>
                <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
                  <AlertTriangle className="w-4 h-4" />
                  Requires attention
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved Issues</p>
                <p className="text-3xl font-bold text-gray-900">{stats.resolvedIssues}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
                  <MapPin className="w-4 h-4" />
                  Civic reports
                </p>
              </div>
              <MapPin className="w-12 h-12 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="diagnoses" fill="#0d9488" name="Diagnoses" />
                <Bar dataKey="civic" fill="#3b82f6" name="Civic Reports" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Disease Distribution */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Disease Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={diseaseData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="cases"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {diseaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Diagnoses */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Diagnoses</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading recent diagnoses...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentDiagnoses.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent diagnoses found</p>
              ) : (
                recentDiagnoses.map((diagnosis) => (
                  <div key={diagnosis.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            urgencyColors[diagnosis.result?.urgency] || urgencyColors.medium
                          }`}>
                            {diagnosis.result?.urgency || 'Medium'} Priority
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {diagnosis.timestamp?.toDate?.()?.toLocaleDateString() || 'Recent'}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium mb-1">
                          {diagnosis.result?.diseases?.[0] || 'Diagnosis pending'}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {diagnosis.symptoms}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard