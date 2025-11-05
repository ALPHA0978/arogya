# Arogya - AI Health Diagnostic System

A comprehensive AI-powered healthcare platform designed for rural and semi-urban communities, providing intelligent disease diagnosis, medical chatbot assistance, and community health monitoring.

## 🚀 Features

### Core Modules
- **AI Diagnosis**: Symptom analysis and disease detection using advanced AI
- **Medical Chatbot**: 24/7 AI assistant for health guidance and first-aid
- **Health Dashboard**: Real-time community health monitoring and analytics
- **Civic Issues**: Environmental and sanitation issue reporting
- **Health Awareness**: Educational content and disease prevention resources

### Key Capabilities
- **Multi-modal Analysis**: Text symptoms and image-based diagnosis
- **Real-time Chat**: Conversational AI for medical guidance
- **Data Visualization**: Interactive charts and health trend analysis
- **User Authentication**: Secure Firebase-based authentication
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Offline Support**: Basic functionality in low-connectivity areas

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Integration**: OpenRouter API / Hugging Face
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd arogya
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase and AI API credentials in the `.env` file.

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Add your Firebase config to `.env`

### AI API Setup
1. Get API key from [OpenRouter](https://openrouter.ai) or [Hugging Face](https://huggingface.co)
2. Add API key to `.env`

## 📁 Project Structure

```
src/
├── assets/          # Images, icons, illustrations
├── components/      # Reusable UI components
│   └── Header.jsx
├── pages/           # Main application pages
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Diagnosis.jsx
│   ├── ChatAssistant.jsx
│   └── Dashboard.jsx
├── context/         # React context providers
│   └── AuthContext.jsx
├── services/        # API and Firebase services
│   ├── firebaseConfig.js
│   └── api.js
├── data/           # Static data and constants
├── App.jsx         # Main application component
└── main.jsx        # Application entry point
```

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Vercel
```bash
npm run build
vercel --prod
```

## 🔒 Security Features

- JWT-based authentication
- Encrypted data transmission
- Input validation and sanitization
- Rate limiting for AI API calls
- Privacy-compliant data handling

## 📊 Key Features Implemented

### ✅ Completed
- [x] User authentication system
- [x] AI-powered symptom diagnosis
- [x] Interactive medical chatbot
- [x] Real-time health dashboard
- [x] Responsive UI design
- [x] Firebase integration
- [x] Data visualization charts

### 🚧 In Progress
- [ ] Civic issue reporting module
- [ ] Health awareness content
- [ ] Geolocation integration
- [ ] Push notifications
- [ ] Offline mode support
- [ ] Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@arogya-health.com
- Documentation: [docs.arogya-health.com](https://docs.arogya-health.com)

## 🙏 Acknowledgments

- OpenRouter for AI API services
- Firebase for backend infrastructure
- Tailwind CSS for styling framework
- Recharts for data visualization
- Lucide React for icons

---

**Disclaimer**: This AI diagnostic system is for informational purposes only and should not replace professional medical advice. Always consult qualified healthcare professionals for medical decisions.