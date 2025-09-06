# DoktorAi 🌿

[![Expo](https://img.shields.io/badge/Expo-53.0.17-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.50.3-green.svg)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-2.0%20Flash-orange.svg)](https://ai.google.dev/)

A comprehensive mobile application that provides natural and herbal treatment suggestions through AI-powered conversations. Built with React Native, Expo, and powered by Google's Gemini AI.

## 🌟 Features

### Core Functionality
- **AI-Powered Chat**: Intelligent conversations about natural and herbal treatments
- **Multilingual Support**: Available in Turkish (TR) and English (EN)
- **Voice Input**: Record voice messages for hands-free interaction
- **Image Analysis**: Upload photos for AI-powered visual analysis
- **Audio Responses**: Listen to AI responses with text-to-speech
- **Chat History**: Persistent conversation history with session management

### User Experience
- **Modern UI**: Clean, intuitive interface with natural green theming
- **Real-time Chat**: Instant messaging with typing indicators
- **Cross-Platform**: Works on iOS, Android, and Web
- **Offline Support**: Core functionality available without internet
- **Responsive Design**: Optimised for all screen sizes

### Security & Privacy
- **User Authentication**: Secure email-based authentication via Supabase
- **Data Protection**: Row-level security with encrypted data storage
- **Privacy First**: No data sharing with third parties
- **Safe AI**: Built-in safety measures and medical disclaimers

## 🏗️ Architecture

### Technology Stack
- **Frontend**: React Native with Expo
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **AI**: Google Gemini 2.0 Flash API
- **State Management**: React Context API
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet with custom design system

### Project Structure
```
doktorai/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── auth/              # Authentication screens
│   └── _layout.tsx        # Root layout
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── ChatContext.tsx    # Chat functionality
├── lib/                   # External service integrations
│   ├── gemini.ts          # Google Gemini AI service
│   ├── supabase.ts        # Supabase client & database
│   └── elevenlabs.ts      # Text-to-speech service
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── assets/               # Images and static assets
└── supabase/             # Database migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AhmetXHero/doktorai.git
   cd doktorai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Copy the example environment file and fill in your API keys:
   ```bash
   cp env.example .env
   ```
   Then edit `.env` with your actual API keys:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Run the database migrations:
     ```bash
     npx supabase db push
     ```
   - Update your environment variables with the Supabase URL and keys

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Run on your preferred platform**
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web browser
   npm run web
   ```

## 📱 Screenshots

*Screenshots will be added here showing the main app interface, chat functionality, and key features.*

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Enable email authentication in Authentication settings
3. Run the provided SQL migrations to set up the database schema
4. Configure Row Level Security policies as defined in the migrations

### Gemini AI Setup
1. Get your API key from [Google AI Studio](https://aistudio.google.com/)
2. Add the key to your environment variables
3. The app includes built-in safety measures and medical disclaimers

### ElevenLabs Setup (Optional)
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Get your API key and add it to environment variables
3. Configure voice settings in the ElevenLabs service

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npm run build:web` - Build for web deployment
- `npm run lint` - Run ESLint

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commits for version control

### Testing
```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Building for Production

### iOS
```bash
# Build for iOS App Store
expo build:ios
```

### Android
```bash
# Build for Google Play Store
expo build:android
```

### Web
```bash
# Build for web deployment
npm run build:web
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Add TypeScript types for all new code
- Include proper error handling
- Write meaningful commit messages
- Test your changes on multiple platforms

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Medical Disclaimer

**IMPORTANT**: This application provides general information about natural and herbal treatments for educational purposes only. The suggestions and information provided are not intended to replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional before making any health-related decisions or starting any treatment regimen.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/AhmetXHero/doktorai/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 👨‍💻 Developer

**AhmetXHero** - Lead Developer & Maintainer
- GitHub: [@AhmetXHero](https://github.com/AhmetXHero)
- Specializing in React Native, AI integration, and mobile app development

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Supabase](https://supabase.com/) for backend services
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [React Native](https://reactnative.dev/) for cross-platform development
- [ElevenLabs](https://elevenlabs.io/) for text-to-speech functionality

## 📊 Project Status

- ✅ Core chat functionality
- ✅ User authentication
- ✅ Database setup
- ✅ AI integration
- ✅ Multi-platform support
- 🔄 Voice input (in development)
- 🔄 Image analysis (in development)
- 🔄 Premium features (planned)

---

Made with ❤️ for natural health and wellness
