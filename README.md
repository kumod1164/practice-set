# 🎯 UPSC Practice Platform

> A comprehensive test preparation platform designed specifically for UPSC aspirants with intelligent analytics, topic-wise practice, and UPSC-standard timing.

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![Google Gemini](https://img.shields.io/badge/Gemini-AI-orange?style=flat-square&logo=google)

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
- **Role-Based Access** - User, Admin, and Super Admin roles

### 📊 Admin Features

#### Question Management
- **Add/Edit/Delete Questions** - Full CRUD with live preview
- **Bulk JSON Import** - Upload multiple questions at once via JSON
- **PDF Extraction with Gemini AI** - Upload any PDF and automatically extract questions using Google Gemini
- **Pagination** - Browse up to 1000 questions with 50 per page
- **Advanced Filters** - Filter by topic, subtopic, difficulty, and search text
- **Date Added Column** - Track when each question was added

#### Topic Management
- **3-Level Hierarchy** - Super Topic → Topic → Subtopic
- **Collapsible Tree View** - Visual hierarchy with expand/collapse
- **Rename with Bulk Update** - Rename any level and all linked questions update automatically
- **Sync from Questions** - Auto-import topics from existing question data
- **CRUD Operations** - Add, edit, delete topics at any level

### 🤖 AI-Powered PDF Extraction
- Upload any UPSC study material PDF
- Google Gemini AI extracts questions, options, answers, and explanations
- Review extracted questions before importing
- Supports bulk import after review

### 🎨 User Experience
- **Modern UI** - Clean, distraction-free interface with smooth animations
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Mode Support** - Easy on the eyes during long study sessions
- **Loading States** - Clear feedback during all operations
- **Searchable Dropdowns** - Type-to-search and type-to-create for all topic fields

### 📄 Legal & Support Pages
- **Privacy Policy** - GDPR-compliant privacy policy
- **Terms of Service** - Indian law jurisdiction terms
- **FAQ** - 35+ questions across 6 categories
- **Contact Us** - Google Form integration for feedback and feature requests

---

## 🚀 Tech Stack

### Frontend
- **Next.js 16.1** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **Shadcn/ui** - High-quality component library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication with Google OAuth
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling

### AI Integration
- **Google Gemini API** - PDF question extraction

---

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Google OAuth credentials
- Google Gemini API key (for PDF extraction)

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

# Google Gemini AI (for PDF extraction)
GEMINI_API_KEY=your-gemini-api-key
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

**To get Gemini API key:**
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy and paste into `GEMINI_API_KEY`

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🗂️ Project Structure

```
practice-set/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── auth/               # Authentication endpoints
│   │   │   ├── admin/
│   │   │   │   ├── questions/      # Question CRUD + bulk import + PDF extract
│   │   │   │   ├── topics/         # Topic management CRUD + sync + rename
│   │   │   │   └── dashboard/      # Admin stats
│   │   │   ├── tests/              # Test session management
│   │   │   └── dashboard/          # User analytics
│   │   ├── admin/
│   │   │   ├── questions/          # Question management page
│   │   │   └── topics/             # Topic management page
│   │   ├── dashboard/              # User dashboard
│   │   ├── analytics/              # Analytics page
│   │   ├── history/                # Test history
│   │   ├── test/                   # Test taking interface
│   │   ├── contact/                # Contact page with Google Form
│   │   ├── faq/                    # FAQ page
│   │   ├── privacy/                # Privacy policy
│   │   └── terms/                  # Terms of service
│   ├── components/
│   │   ├── ui/                     # Shadcn UI + custom components
│   │   ├── AdminQuestionForm.tsx   # Question create/edit form
│   │   ├── BulkImportDialog.tsx    # JSON bulk import
│   │   ├── PdfReviewDialog.tsx     # PDF extraction review
│   │   ├── TopicFormDialog.tsx     # Topic create form
│   │   ├── RenameTopicDialog.tsx   # Topic rename with bulk update
│   │   └── Sidebar.tsx             # Navigation sidebar
│   ├── lib/
│   │   ├── db.ts                   # Database connection
│   │   ├── validations.ts          # Zod validation schemas
│   │   └── services/
│   │       ├── question-service.ts
│   │       └── topic-service.ts
│   └── models/
│       ├── User.ts
│       ├── Question.ts
│       ├── Topic.ts
│       ├── Test.ts
│       └── Bookmark.ts
├── scripts/
│   ├── seed.ts                     # Database seeding
│   ├── upload-all-questions.ts     # Bulk question upload
│   └── questions/                  # Sample question sets
├── public/
├── .env.local
├── next.config.ts
└── package.json
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

### For Admin

1. **Access Admin Dashboard** - Login with admin email
2. **Add Questions** - Use the form to add individual questions with live preview
3. **Bulk Import** - Upload JSON files with multiple questions
4. **PDF Extraction** - Upload a PDF → Gemini AI extracts questions → Review → Import
5. **Manage Topics** - Create and organize the 3-level topic hierarchy
6. **Sync Topics** - Auto-import topics from existing questions

---

## 📝 Question Format

Questions should follow this JSON structure for bulk import:

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

## 🤖 PDF Extraction Workflow

1. Go to **Admin → Questions**
2. Click **"Import from PDF"**
3. Upload any UPSC study material PDF
4. Gemini AI automatically extracts:
   - Question text
   - 4 options
   - Correct answer
   - Explanation
   - Topic and subtopic
5. Review extracted questions in the dialog
6. Edit any incorrect extractions
7. Click **"Import All"** to save to database

---

## 🗂️ Topic Hierarchy

The platform uses a 3-level topic structure:

```
Super Topic (e.g., "Indian Polity")
└── Topic (e.g., "Fundamental Rights")
    └── Subtopic (e.g., "Right to Equality")
```

- Renaming any level automatically updates all linked questions
- Sync feature imports topics from existing question data
- Searchable dropdowns with type-to-create in question form

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

### Environment Variables for Production

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<generated-secret>
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
ADMIN_EMAIL=<your-admin-email>
MONGODB_URI=<your-mongodb-uri>
GEMINI_API_KEY=<your-gemini-key>
```

## 📧 Support

For support or feedback, visit the [Contact Us](https://practice-set-bice.vercel.app/contact) page or email kumodsharma1164@gmail.com.

---

**Made with 💙 for UPSC Aspirants**
