import { useState } from 'react'
import { BookOpen, Play, Award, Users, Heart, Shield, Droplets, Utensils } from 'lucide-react'

const Awareness = () => {
  const [activeCategory, setActiveCategory] = useState('hygiene')
  const [completedQuizzes, setCompletedQuizzes] = useState([])

  const categories = [
    { id: 'hygiene', label: 'Hygiene Practices', icon: <Shield className="w-5 h-5" />, color: 'text-blue-600' },
    { id: 'nutrition', label: 'Nutrition', icon: <Utensils className="w-5 h-5" />, color: 'text-green-600' },
    { id: 'prevention', label: 'Disease Prevention', icon: <Heart className="w-5 h-5" />, color: 'text-red-600' },
    { id: 'water', label: 'Water Safety', icon: <Droplets className="w-5 h-5" />, color: 'text-cyan-600' }
  ]

  const content = {
    hygiene: {
      articles: [
        {
          title: 'Hand Washing Best Practices',
          description: 'Learn the proper technique for effective hand washing to prevent disease transmission.',
          readTime: '3 min read',
          image: '🧼'
        },
        {
          title: 'Personal Hygiene Essentials',
          description: 'Daily hygiene practices that can significantly reduce your risk of infections.',
          readTime: '5 min read',
          image: '🚿'
        }
      ],
      videos: [
        {
          title: 'Proper Hand Washing Technique',
          duration: '2:30',
          thumbnail: '🎥'
        }
      ],
      quiz: {
        title: 'Hygiene Knowledge Quiz',
        questions: 10,
        description: 'Test your knowledge about hygiene practices'
      }
    },
    nutrition: {
      articles: [
        {
          title: 'Balanced Diet Fundamentals',
          description: 'Understanding the basics of a nutritious and balanced diet for optimal health.',
          readTime: '4 min read',
          image: '🥗'
        },
        {
          title: 'Micronutrient Deficiencies',
          description: 'Common vitamin and mineral deficiencies and how to prevent them.',
          readTime: '6 min read',
          image: '💊'
        }
      ],
      videos: [
        {
          title: 'Healthy Meal Planning',
          duration: '5:15',
          thumbnail: '🎥'
        }
      ],
      quiz: {
        title: 'Nutrition Quiz',
        questions: 8,
        description: 'Test your nutrition knowledge'
      }
    },
    prevention: {
      articles: [
        {
          title: 'Vaccination Importance',
          description: 'Why vaccines are crucial for individual and community health protection.',
          readTime: '4 min read',
          image: '💉'
        },
        {
          title: 'Common Disease Prevention',
          description: 'Simple steps to prevent common infectious diseases in your community.',
          readTime: '5 min read',
          image: '🛡️'
        }
      ],
      videos: [
        {
          title: 'Disease Prevention Strategies',
          duration: '4:45',
          thumbnail: '🎥'
        }
      ],
      quiz: {
        title: 'Prevention Quiz',
        questions: 12,
        description: 'Test your disease prevention knowledge'
      }
    },
    water: {
      articles: [
        {
          title: 'Water Purification Methods',
          description: 'Safe and effective ways to purify water for drinking and cooking.',
          readTime: '3 min read',
          image: '💧'
        },
        {
          title: 'Water Storage Safety',
          description: 'Best practices for storing water to prevent contamination.',
          readTime: '4 min read',
          image: '🏺'
        }
      ],
      videos: [
        {
          title: 'Home Water Treatment',
          duration: '3:20',
          thumbnail: '🎥'
        }
      ],
      quiz: {
        title: 'Water Safety Quiz',
        questions: 6,
        description: 'Test your water safety knowledge'
      }
    }
  }

  const handleQuizComplete = (categoryId) => {
    if (!completedQuizzes.includes(categoryId)) {
      setCompletedQuizzes([...completedQuizzes, categoryId])
    }
  }

  const currentContent = content[activeCategory]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Awareness & Education</h1>
          <p className="text-xl text-gray-600">
            Learn about disease prevention, healthy practices, and community wellness
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Learning Progress</h2>
            <div className="flex items-center gap-2 text-teal-600">
              <Award className="w-5 h-5" />
              <span className="font-medium">{completedQuizzes.length}/4 Quizzes Completed</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-teal-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedQuizzes.length / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-lg">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeCategory === category.id
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className={activeCategory === category.id ? 'text-white' : category.color}>
                {category.icon}
              </span>
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Articles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                Educational Articles
              </h3>
              <div className="space-y-4">
                {currentContent.articles.map((article, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{article.image}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{article.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                        <span className="text-xs text-teal-600 font-medium">{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Play className="w-5 h-5 text-red-600" />
                Educational Videos
              </h3>
              <div className="space-y-4">
                {currentContent.videos.map((video, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">{video.thumbnail}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{video.title}</h4>
                        <span className="text-sm text-gray-600">{video.duration}</span>
                      </div>
                      <Play className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Knowledge Quiz
              </h3>
              <div className="text-center">
                <div className="text-4xl mb-3">🧠</div>
                <h4 className="font-medium text-gray-900 mb-2">{currentContent.quiz.title}</h4>
                <p className="text-sm text-gray-600 mb-4">{currentContent.quiz.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  {currentContent.quiz.questions} questions
                </div>
                <button
                  onClick={() => handleQuizComplete(activeCategory)}
                  disabled={completedQuizzes.includes(activeCategory)}
                  className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                    completedQuizzes.includes(activeCategory)
                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                      : 'bg-yellow-600 text-white hover:bg-yellow-700'
                  }`}
                >
                  {completedQuizzes.includes(activeCategory) ? 'Completed ✓' : 'Start Quiz'}
                </button>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Community Learning
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Learners</span>
                  <span className="font-semibold text-gray-900">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Articles Read</span>
                  <span className="font-semibold text-gray-900">5,678</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quizzes Completed</span>
                  <span className="font-semibold text-gray-900">2,345</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Quick Tip</h3>
              <p className="text-sm text-gray-700">
                Regular hand washing with soap for at least 20 seconds can prevent up to 80% of common infections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Awareness