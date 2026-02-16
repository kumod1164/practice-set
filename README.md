# 🎯 UPSC Practice Platform

> A comprehensive test preparation platform designed specifically for UPSC aspirants with intelligent analytics, topic-wise practice, and UPSC-standard timing.

![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)

---

## ✨ Features

### 🎓 For Aspirants
- **Topic-Wise Practice** - Focus on specific subjects with customizable difficulty levels (Easy/Medium/Hard)
- **UPSC Standard Timing** - Auto-calculated time limits based on question count (1.2 min per question)
- **Smart Time Extensions** - Get warnings before time expires with option to extend (max 2 extensions)
- **Detailed Analytics** - Comprehensive performance tracking with charts and insights
- **Instant Results** - Immediate feedback with correct answers and detailed explanations
- **Question Bookmarking** - Save important questions for later revision
- **Performance Trends** - Track your progress over time with visual charts
- **Daily Practice Mode** - Quick 10-20 question sets for consistent practice
- **Test History** - Review all past attempts with detailed breakdowns

### 🔐 Authentication
- **Google OAuth** - Secure login with Google account
- **Single Admin Access** - Email-based admin whitelist for question management

### 📊 Admin Dashboard
- **Question Management** - Add, edit, and delete questions
- **Bulk Import** - Upload questions via JSON/CSV format
- **Question Bank Organization** - Organize by topic, subtopic, difficulty, and tags
- **Preview Mode** - Review questions before publishing

### 🎨 User Experience
- **Modern UI** - Clean, distraction-free interface with smooth animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Easy on the eyes during long study sessions
- **Loading States** - Clear feedback during all operations

---

## 🚀 Tech Stack

### Frontend
- **Next.js 15.3** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide Icons** - Beautiful icon library
- **Shadcn/ui** - High-quality component library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication with Google OAuth
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Google OAuth credentials

### Setup Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd practice-set
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-chars

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Admin Access
ADMIN_EMAIL=your_admin_email@gmail.com

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**To get Google OAuth credentials:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

6. **Test Authentication**
- Click "Start Practicing Now" or "Get Started Free"
- Sign in with your Google account
- You'll be redirected to the dashboard
- Admin users (matching ADMIN_EMAIL) will see admin badge

---

## 🗂️ Project Structure

```
practice-set/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── questions/    # Question CRUD
│   │   │   ├── tests/        # Test management
│   │   │   └── analytics/    # Analytics endpoints
│   │   ├── admin/            # Admin dashboard
│   │   ├── dashboard/        # User dashboard
│   │   ├── test/             # Test taking interface
│   │   ├── results/          # Results page
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── ui/               # Shadcn UI components
│   │   ├── test/             # Test-related components
│   │   ├── analytics/        # Chart components
│   │   └── admin/            # Admin components
│   ├── lib/                  # Utility functions
│   │   ├── db.ts             # Database connection
│   │   ├── auth.ts           # Auth configuration
│   │   └── utils.ts          # Helper functions
│   └── models/               # MongoDB models
│       ├── User.ts
│       ├── Question.ts
│       ├── Test.ts
│       └── Bookmark.ts
├── public/                   # Static assets
├── .env.local               # Environment variables
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind configuration
└── package.json             # Dependencies
```

---

## 🎯 Usage Guide

### For Students

1. **Sign In** - Login with your Google account
2. **Choose Topics** - Select subjects and difficulty level
3. **Start Test** - Begin your timed practice session
4. **Answer Questions** - Navigate through questions with the question palette
5. **Submit Test** - Review your answers before final submission
6. **Analyze Results** - Study your performance with detailed analytics
7. **Bookmark Questions** - Save important questions for revision

### For Admin

1. **Access Admin Dashboard** - Login with admin email
2. **Add Questions** - Use the form to add individual questions
3. **Bulk Import** - Upload JSON/CSV files with multiple questions
4. **Manage Questions** - Edit or delete existing questions
5. **Preview** - Test questions before making them live

---

## 📝 Question Format

Questions should follow this JSON structure:

```json
{
  "topic": "Indian Polity",
  "subtopic": "Fundamental Rights",
  "question": "Which article of the Indian Constitution deals with the Right to Equality?",
  "options": [
    "Article 14",
    "Article 19",
    "Article 21",
    "Article 32"
  ],
  "correctAnswer": 0,
  "difficulty": "easy",
  "explanation": "Article 14 guarantees equality before law and equal protection of laws.",
  "tags": ["constitution", "fundamental-rights", "equality"]
}
```

---

## 🔧 Configuration

### Admin Access
Update the admin email in `.env.local`:
```env
ADMIN_EMAIL=youremail@gmail.com
```

### Time Settings
Modify timing constants in `src/lib/constants.ts`:
```typescript
export const TIME_PER_QUESTION = 1.2; // minutes
export const WARNING_TIME = 5; // minutes before end
export const MAX_EXTENSIONS = 2;
export const EXTENSION_OPTIONS = [5, 10]; // minutes
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed on any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for UPSC aspirants
- Inspired by the dedication of civil service aspirants
- Special thanks to all contributors

---

## 📧 Support

For support, email support@upscpractice.com or open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Offline mode support
- [ ] AI-powered question generation
- [ ] Peer comparison features
- [ ] Video explanations
- [ ] Discussion forums
- [ ] Mock interview preparation
- [ ] Current affairs integration

---

**Made with 💙 for UPSC Aspirants**