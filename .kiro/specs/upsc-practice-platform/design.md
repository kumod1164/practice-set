# Design Document: UPSC Practice Platform

## Overview

The UPSC Practice Platform is a full-stack web application built with Next.js 15.3, TypeScript, and MongoDB. The system follows a modern architecture with server-side rendering, API routes for backend logic, and a component-based frontend using React and Tailwind CSS.

The platform consists of three main user flows:
1. **Authentication Flow**: Google OAuth login with role-based access control
2. **Admin Flow**: Question management, bulk imports, and preview functionality
3. **User Flow**: Test configuration, test taking, results review, and progress tracking

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Next.js Pages, React Components, Tailwind CSS)            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                      │
│  - Authentication (NextAuth.js)                             │
│  - Question Management APIs                                  │
│  - Test Management APIs                                      │
│  - User Analytics APIs                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  - Question Service                                          │
│  - Test Service                                              │
│  - Analytics Service                                         │
│  - Bookmark Service                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                         │
│  - Mongoose Models & Schemas                                │
│  - Database Connection Management                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Database                          │
│  - Users Collection                                          │
│  - Questions Collection                                      │
│  - Tests Collection                                          │
│  - Bookmarks Collection                                      │
│  - TestSessions Collection                                   │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Next.js 15.3, React 18, TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js with Google OAuth Provider
- **Charts**: Recharts
- **State Management**: React Context API + Server State (React Query optional)
- **Form Handling**: React Hook Form with Zod validation
- **File Upload**: Multipart form data parsing

## Components and Interfaces

### 1. Authentication System

#### NextAuth Configuration
```typescript
// lib/auth.ts
interface AuthOptions {
  providers: Provider[]
  callbacks: {
    signIn: (params: SignInParams) => Promise<boolean>
    session: (params: SessionParams) => Promise<Session>
    jwt: (params: JWTParams) => Promise<JWT>
  }
  pages: {
    signIn: string
    error: string
  }
}

interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  image?: string
}

interface Session {
  user: User
  expires: string
}
```

#### Admin Access Control
```typescript
// lib/admin.ts
function isAdmin(email: string): boolean {
  const adminEmail = process.env.ADMIN_EMAIL
  return email === adminEmail
}

function requireAdmin(session: Session | null): void {
  if (!session || session.user.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required')
  }
}
```

### 2. Database Models

#### User Model
```typescript
interface IUser {
  _id: ObjectId
  email: string
  name: string
  role: 'user' | 'admin'
  image?: string
  createdAt: Date
  updatedAt: Date
}
```

#### Question Model
```typescript
interface IQuestion {
  _id: ObjectId
  topic: string
  subtopic: string
  question: string
  options: [string, string, string, string] // Exactly 4 options
  correctAnswer: 0 | 1 | 2 | 3 // Index of correct option
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
```

#### Test Model
```typescript
interface ITest {
  _id: ObjectId
  userId: ObjectId
  questions: ObjectId[] // References to Question documents
  answers: (0 | 1 | 2 | 3 | null)[] // User's answers, null if unanswered
  markedForReview: boolean[] // Review flags for each question
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  unansweredQuestions: number
  timeTaken: number // in seconds
  timeExtensions: number // count of extensions used
  startedAt: Date
  submittedAt: Date
  topicWisePerformance: {
    topic: string
    correct: number
    total: number
    accuracy: number
  }[]
  difficultyWisePerformance: {
    difficulty: 'easy' | 'medium' | 'hard'
    correct: number
    total: number
    accuracy: number
  }[]
}
```

#### TestSession Model (for in-progress tests)
```typescript
interface ITestSession {
  _id: ObjectId
  userId: ObjectId
  questions: ObjectId[]
  answers: (0 | 1 | 2 | 3 | null)[]
  markedForReview: boolean[]
  currentQuestionIndex: number
  remainingTime: number // in seconds
  timeExtensions: number
  startedAt: Date
  expiresAt: Date
}
```

#### Bookmark Model
```typescript
interface IBookmark {
  _id: ObjectId
  userId: ObjectId
  questionId: ObjectId
  createdAt: Date
}
```

### 3. API Endpoints

#### Authentication APIs
- `POST /api/auth/signin` - Initiate Google OAuth
- `POST /api/auth/signout` - End user session
- `GET /api/auth/session` - Get current session

#### Question Management APIs (Admin Only)
- `GET /api/admin/questions` - List all questions with filters
- `POST /api/admin/questions` - Create new question
- `PUT /api/admin/questions/[id]` - Update question
- `DELETE /api/admin/questions/[id]` - Delete question
- `POST /api/admin/questions/bulk-import` - Import questions from JSON/CSV

#### Test Configuration APIs
- `POST /api/tests/configure` - Validate test configuration and check question availability
- `POST /api/tests/start` - Create test session and select questions
- `GET /api/tests/session` - Get current test session

#### Test Taking APIs
- `PUT /api/tests/session/answer` - Save answer for a question
- `PUT /api/tests/session/mark-review` - Toggle mark for review
- `POST /api/tests/session/extend-time` - Request time extension
- `POST /api/tests/submit` - Submit test and generate results

#### Results & Analytics APIs
- `GET /api/tests/[id]` - Get test results with detailed review
- `GET /api/tests/history` - Get user's test history
- `GET /api/dashboard/stats` - Get overall user statistics
- `GET /api/dashboard/charts` - Get chart data for progress visualization

#### Bookmark APIs
- `POST /api/bookmarks` - Create bookmark
- `DELETE /api/bookmarks/[id]` - Remove bookmark
- `GET /api/bookmarks` - Get user's bookmarks with filters

### 4. Frontend Components

#### Page Components
- `app/page.tsx` - Landing page (already implemented)
- `app/login/page.tsx` - Login page (already implemented)
- `app/dashboard/page.tsx` - User dashboard with stats and charts
- `app/admin/page.tsx` - Admin dashboard
- `app/admin/questions/page.tsx` - Question management interface
- `app/test/configure/page.tsx` - Test configuration page
- `app/test/[id]/page.tsx` - Test taking interface
- `app/test/[id]/results/page.tsx` - Test results and review
- `app/bookmarks/page.tsx` - Bookmarked questions
- `app/history/page.tsx` - Test history

#### Shared Components
- `components/ui/*` - Shadcn/ui components (button, card, dialog, etc.)
- `components/QuestionCard.tsx` - Display question with options
- `components/QuestionPalette.tsx` - Question navigation palette
- `components/Timer.tsx` - Countdown timer with warnings
- `components/TestSummary.tsx` - Test results summary
- `components/PerformanceChart.tsx` - Charts for analytics
- `components/MotivationalMessage.tsx` - Encouraging feedback component
- `components/AdminQuestionForm.tsx` - Question create/edit form
- `components/BulkImportDialog.tsx` - File upload for bulk import
- `components/ProtectedRoute.tsx` - Route protection wrapper

### 5. Service Layer

#### QuestionService
```typescript
class QuestionService {
  async createQuestion(data: QuestionInput): Promise<IQuestion>
  async updateQuestion(id: string, data: QuestionInput): Promise<IQuestion>
  async deleteQuestion(id: string): Promise<void>
  async getQuestions(filters: QuestionFilters): Promise<IQuestion[]>
  async getQuestionById(id: string): Promise<IQuestion>
  async bulkImport(questions: QuestionInput[]): Promise<BulkImportResult>
  async selectQuestionsForTest(config: TestConfig): Promise<IQuestion[]>
}

interface QuestionInput {
  topic: string
  subtopic: string
  question: string
  options: [string, string, string, string]
  correctAnswer: 0 | 1 | 2 | 3
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  tags?: string[]
}

interface QuestionFilters {
  topic?: string
  subtopic?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  limit?: number
  skip?: number
}

interface TestConfig {
  topics: string[]
  subtopics?: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed'
  questionCount: number
  userId: string
}

interface BulkImportResult {
  successful: number
  failed: number
  errors: { line: number; error: string }[]
}
```

#### TestService
```typescript
class TestService {
  async createTestSession(userId: string, questions: IQuestion[]): Promise<ITestSession>
  async getTestSession(userId: string): Promise<ITestSession | null>
  async saveAnswer(sessionId: string, questionIndex: number, answer: number): Promise<void>
  async toggleMarkForReview(sessionId: string, questionIndex: number): Promise<void>
  async extendTime(sessionId: string, minutes: number): Promise<ITestSession>
  async submitTest(sessionId: string): Promise<ITest>
  async getTestById(testId: string): Promise<ITest>
  async getTestHistory(userId: string, filters: HistoryFilters): Promise<ITest[]>
  async calculateResults(session: ITestSession, questions: IQuestion[]): Promise<TestResults>
}

interface TestResults {
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  unansweredQuestions: number
  percentage: number
  topicWisePerformance: TopicPerformance[]
  difficultyWisePerformance: DifficultyPerformance[]
}

interface TopicPerformance {
  topic: string
  correct: number
  total: number
  accuracy: number
}

interface DifficultyPerformance {
  difficulty: 'easy' | 'medium' | 'hard'
  correct: number
  total: number
  accuracy: number
}

interface HistoryFilters {
  startDate?: Date
  endDate?: Date
  topic?: string
  minScore?: number
  maxScore?: number
  limit?: number
  skip?: number
}
```

#### AnalyticsService
```typescript
class AnalyticsService {
  async getUserStats(userId: string): Promise<UserStats>
  async getProgressChartData(userId: string, limit: number): Promise<ChartData>
  async getTopicWiseStrength(userId: string): Promise<TopicStrength[]>
  async getDailyStreak(userId: string): Promise<number>
}

interface UserStats {
  totalTests: number
  averageScore: number
  totalQuestions: number
  totalTimeSpent: number
  strongTopics: string[]
  weakTopics: string[]
  improvementRate: number
}

interface ChartData {
  labels: string[]
  scores: number[]
  dates: Date[]
}

interface TopicStrength {
  topic: string
  testsAttempted: number
  averageAccuracy: number
  trend: 'improving' | 'declining' | 'stable'
}
```

#### BookmarkService
```typescript
class BookmarkService {
  async createBookmark(userId: string, questionId: string): Promise<IBookmark>
  async removeBookmark(bookmarkId: string, userId: string): Promise<void>
  async getBookmarks(userId: string, filters: BookmarkFilters): Promise<BookmarkedQuestion[]>
  async isBookmarked(userId: string, questionId: string): Promise<boolean>
}

interface BookmarkFilters {
  topic?: string
  subtopic?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

interface BookmarkedQuestion {
  bookmark: IBookmark
  question: IQuestion
}
```

### 6. Validation Schemas

Using Zod for runtime validation:

```typescript
// lib/validations.ts
const QuestionSchema = z.object({
  topic: z.string().min(1).max(100),
  subtopic: z.string().min(1).max(100),
  question: z.string().min(10).max(1000),
  options: z.tuple([
    z.string().min(1).max(500),
    z.string().min(1).max(500),
    z.string().min(1).max(500),
    z.string().min(1).max(500)
  ]),
  correctAnswer: z.number().int().min(0).max(3),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  explanation: z.string().min(10).max(2000),
  tags: z.array(z.string()).optional().default([])
})

const TestConfigSchema = z.object({
  topics: z.array(z.string()).min(1),
  subtopics: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']),
  questionCount: z.number().int().min(1).max(200)
})

const AnswerSchema = z.object({
  sessionId: z.string(),
  questionIndex: z.number().int().min(0),
  answer: z.number().int().min(0).max(3)
})
```

### 7. Utility Functions

#### Time Calculation
```typescript
function calculateTestDuration(questionCount: number): number {
  return Math.ceil(questionCount * 1.2) // minutes
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
```

#### Question Selection Algorithm
```typescript
function selectQuestions(
  availableQuestions: IQuestion[],
  config: TestConfig,
  previouslyAttempted: ObjectId[]
): IQuestion[] {
  // 1. Filter by topic, subtopic, difficulty
  let filtered = filterQuestions(availableQuestions, config)
  
  // 2. Prioritize questions not recently attempted
  const notAttempted = filtered.filter(q => !previouslyAttempted.includes(q._id))
  const attempted = filtered.filter(q => previouslyAttempted.includes(q._id))
  
  // 3. Shuffle both groups
  const shuffledNotAttempted = shuffle(notAttempted)
  const shuffledAttempted = shuffle(attempted)
  
  // 4. Combine: prioritize not attempted
  const combined = [...shuffledNotAttempted, ...shuffledAttempted]
  
  // 5. Take required count
  return combined.slice(0, config.questionCount)
}

function filterQuestions(questions: IQuestion[], config: TestConfig): IQuestion[] {
  return questions.filter(q => {
    const topicMatch = config.topics.includes(q.topic)
    const subtopicMatch = !config.subtopics || config.subtopics.includes(q.subtopic)
    const difficultyMatch = config.difficulty === 'mixed' || q.difficulty === config.difficulty
    return topicMatch && subtopicMatch && difficultyMatch
  })
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
```

#### Motivational Messages
```typescript
function getMotivationalMessage(percentage: number, improvement: number | null): MotivationalFeedback {
  let message: string
  let quote: string
  
  if (percentage >= 90) {
    message = "Outstanding! You're on the path to success! 🌟"
    quote = "Excellence is not a destination; it is a continuous journey."
  } else if (percentage >= 70) {
    message = "Great work! Keep up the momentum! 💪"
    quote = "Success is the sum of small efforts repeated day in and day out."
  } else if (percentage >= 50) {
    message = "Good effort! Consistency will lead to excellence! 📈"
    quote = "The expert in anything was once a beginner."
  } else {
    message = "Every expert was once a beginner. Keep practicing! 🎯"
    quote = "It's not about perfect. It's about effort."
  }
  
  let improvementMessage: string | null = null
  if (improvement !== null && improvement > 0) {
    improvementMessage = `Amazing! You've improved by ${improvement.toFixed(1)}% from your last attempt! 🚀`
  }
  
  return { message, quote, improvementMessage }
}

interface MotivationalFeedback {
  message: string
  quote: string
  improvementMessage: string | null
}
```

## Data Models

### MongoDB Schema Definitions

```typescript
// models/User.ts
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  image: { type: String },
}, { timestamps: true })

// models/Question.ts
const QuestionSchema = new Schema<IQuestion>({
  topic: { type: String, required: true, index: true },
  subtopic: { type: String, required: true, index: true },
  question: { type: String, required: true },
  options: { 
    type: [String], 
    required: true,
    validate: {
      validator: (v: string[]) => v.length === 4,
      message: 'Must have exactly 4 options'
    }
  },
  correctAnswer: { 
    type: Number, 
    required: true,
    min: 0,
    max: 3
  },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    required: true,
    index: true
  },
  explanation: { type: String, required: true },
  tags: { type: [String], default: [] },
}, { timestamps: true })

// Compound index for efficient filtering
QuestionSchema.index({ topic: 1, subtopic: 1, difficulty: 1 })

// models/Test.ts
const TestSchema = new Schema<ITest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
  answers: [{ type: Number, min: 0, max: 3, default: null }],
  markedForReview: [{ type: Boolean, default: false }],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  incorrectAnswers: { type: Number, required: true },
  unansweredQuestions: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  timeExtensions: { type: Number, default: 0 },
  startedAt: { type: Date, required: true },
  submittedAt: { type: Date, required: true },
  topicWisePerformance: [{
    topic: String,
    correct: Number,
    total: Number,
    accuracy: Number
  }],
  difficultyWisePerformance: [{
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    correct: Number,
    total: Number,
    accuracy: Number
  }]
}, { timestamps: true })

// Index for efficient history queries
TestSchema.index({ userId: 1, submittedAt: -1 })

// models/TestSession.ts
const TestSessionSchema = new Schema<ITestSession>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question', required: true }],
  answers: [{ type: Number, min: 0, max: 3, default: null }],
  markedForReview: [{ type: Boolean, default: false }],
  currentQuestionIndex: { type: Number, default: 0 },
  remainingTime: { type: Number, required: true },
  timeExtensions: { type: Number, default: 0 },
  startedAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true, index: true }
})

// TTL index to auto-delete expired sessions after 24 hours
TestSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 })

// models/Bookmark.ts
const BookmarkSchema = new Schema<IBookmark>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
}, { timestamps: true })

// Compound unique index to prevent duplicate bookmarks
BookmarkSchema.index({ userId: 1, questionId: 1 }, { unique: true })
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified the following redundancies and consolidations:

**Redundant Properties:**
- 3.1 is duplicate of 1.4 (session creation with 30-day expiration)
- 12.5 is duplicate of 10.5 (palette navigation)
- 14.1 is duplicate of 13.5 (time extension dialog)
- 23.3 is duplicate of 7.5 (time calculation)
- 23.5 is duplicate of 8.4 (question prioritization)
- 28.1 is duplicate of 9.2 (immediate answer saving)

**Consolidation Opportunities:**
- Question validation properties (4.5, 4.6, 29.1-29.6) can be consolidated into a comprehensive question validation property
- Session persistence properties (28.2, 28.3, 28.4) can be combined into a session round-trip property
- Test result breakdown properties (16.3, 16.5, 18.1) can be consolidated into a comprehensive results calculation property
- Motivational message properties (16A.2-16A.5) are examples of the same property (16A.1) and can be tested as edge cases

**Final Property Set:**
After reflection, we have approximately 45 unique, non-redundant properties to implement.

### Correctness Properties

#### Authentication & Authorization Properties

**Property 1: User creation or retrieval on successful authentication**
*For any* successful Google OAuth authentication, the system should either create a new user record or retrieve an existing one based on email, and the record should contain email, name, and provider information.
**Validates: Requirements 1.2, 1.5**

**Property 2: Session token validity period**
*For any* successful authentication, the created session token should have an expiration date exactly 30 days from creation.
**Validates: Requirements 1.4, 3.1**

**Property 3: Admin role assignment**
*For any* user login, if the user's email matches the ADMIN_EMAIL environment variable, the user's role should be set to 'admin', otherwise it should be 'user'.
**Validates: Requirements 2.1, 2.2**

**Property 4: Admin route protection**
*For any* admin API endpoint and any non-admin user, attempting to access the endpoint should return a 403 Forbidden error.
**Validates: Requirements 2.3, 2.4**

**Property 5: Session persistence across browser restarts**
*For any* valid session, closing and reopening the browser should maintain the session if it hasn't expired.
**Validates: Requirements 3.2**

**Property 6: Session invalidation on logout**
*For any* active session, performing a logout action should immediately invalidate the session, making it unusable for subsequent requests.
**Validates: Requirements 3.4**

**Property 7: Protected route session verification**
*For any* protected route, accessing it should trigger session validity verification before allowing access.
**Validates: Requirements 3.5**

#### Question Management Properties

**Property 8: Comprehensive question validation**
*For any* question save operation, the system should validate that:
- Question text is 10-1000 characters
- Each of 4 options is 1-500 characters
- Correct answer index is 0-3
- Explanation is 10-2000 characters
- Topic and subtopic are non-empty
- Difficulty is 'easy', 'medium', or 'hard'
- Tags is an array of strings
**Validates: Requirements 4.1, 4.5, 4.6, 29.1, 29.2, 29.3, 29.4, 29.5, 29.6**

**Property 9: Question update preserves ID**
*For any* question update operation, the question ID should remain unchanged and the updatedAt timestamp should be newer than the previous timestamp.
**Validates: Requirements 4.2**

**Property 10: Question deletion completeness**
*For any* deleted question, subsequent queries for that question should return null, and the question should not appear in any new test selections.
**Validates: Requirements 4.3**

**Property 11: Question filtering correctness**
*For any* combination of topic, subtopic, and difficulty filters, all returned questions should match the specified criteria.
**Validates: Requirements 4.4**

#### Bulk Import Properties

**Property 12: JSON bulk import validation**
*For any* JSON file containing question entries, the system should parse each entry and validate it according to question validation rules, returning specific errors for invalid entries.
**Validates: Requirements 5.1**

**Property 13: CSV bulk import validation**
*For any* CSV file containing question rows, the system should parse each row and validate it according to question validation rules, returning specific errors with line numbers for invalid entries.
**Validates: Requirements 5.2, 5.3**

**Property 14: Bulk import transactionality**
*For any* bulk import operation where all questions are valid, either all questions should be inserted successfully or none should be inserted (atomic transaction).
**Validates: Requirements 5.4**

**Property 15: Import summary accuracy**
*For any* bulk import operation, the summary should accurately reflect the count of successful imports and failed imports with their specific errors.
**Validates: Requirements 5.5**

**Property 16: File size validation**
*For any* file upload, files larger than 10MB should be rejected before processing.
**Validates: Requirements 5.6**

#### Test Configuration Properties

**Property 17: Question availability validation**
*For any* test configuration, the system should verify that the number of available questions matching the criteria is greater than or equal to the requested question count.
**Validates: Requirements 7.4**

**Property 18: Test duration calculation**
*For any* question count N, the calculated test duration should equal (N × 1.2) minutes, rounded up to the nearest integer.
**Validates: Requirements 7.5, 23.3**

#### Test Question Selection Properties

**Property 19: Question selection criteria matching**
*For any* test configuration with specified topics, subtopics, and difficulty, all selected questions should match these criteria exactly.
**Validates: Requirements 8.1**

**Property 20: Mixed difficulty distribution**
*For any* test with difficulty set to "mixed" and question count divisible by 3, the selected questions should be distributed evenly across easy, medium, and hard (±1 question tolerance for non-divisible counts).
**Validates: Requirements 8.2**

**Property 21: Question uniqueness in test**
*For any* generated test, all question IDs should be unique (no duplicates).
**Validates: Requirements 8.3**

**Property 22: Question prioritization for unseen questions**
*For any* test generation where the user has previous test history, questions not previously attempted should appear before previously attempted questions in the selection pool.
**Validates: Requirements 8.4, 23.5**

**Property 23: Question order randomization**
*For any* two test instances with the same configuration, the order of questions should be different (with high probability).
**Validates: Requirements 8.5**

#### Test Taking Properties

**Property 24: Immediate answer persistence**
*For any* answer selection during a test, the answer should be saved to the test session immediately and be retrievable in subsequent requests.
**Validates: Requirements 9.2, 28.1**

**Property 25: Answer modification**
*For any* question with a saved answer, selecting a different answer should update the saved answer to the new value.
**Validates: Requirements 9.3**

**Property 26: Question palette navigation**
*For any* valid question index in a test, clicking that index in the palette should navigate to that question.
**Validates: Requirements 10.5, 12.5**

**Property 27: Mark for review toggle**
*For any* question, marking it for review should set the flag to true, and unmarking should set it to false (toggle behavior).
**Validates: Requirements 11.1, 11.3**

**Property 28: Mark status persistence**
*For any* question marked for review, navigating away and returning to that question should preserve the marked status.
**Validates: Requirements 11.4**

**Property 29: Marked question count accuracy**
*For any* test session, the count of marked questions should equal the number of questions with markedForReview flag set to true.
**Validates: Requirements 11.5**

#### Time Extension Properties

**Property 30: Time extension addition**
*For any* time extension request (5 or 10 minutes), the remaining time should increase by exactly that amount.
**Validates: Requirements 14.2**

**Property 31: Extension limit enforcement**
*For any* test session, the system should allow a maximum of 2 time extensions, and reject any subsequent extension requests.
**Validates: Requirements 14.3**

#### Test Submission Properties

**Property 32: Submission confirmation counts**
*For any* test submission, the confirmation dialog should display counts where answered + unanswered = total questions.
**Validates: Requirements 15.1**

**Property 33: Answer persistence on submission**
*For any* test submission, all answers should be saved to the database with timestamps.
**Validates: Requirements 15.2**

**Property 34: Score calculation correctness**
*For any* submitted test, the score should equal the count of questions where the user's answer matches the correct answer.
**Validates: Requirements 15.3**

**Property 35: Time taken calculation**
*For any* submitted test, the recorded time taken should equal the difference between submission time and start time.
**Validates: Requirements 15.4**

**Property 36: Auto-submit equivalence**
*For any* test that auto-submits due to time expiry, the saved answers and results should be identical to a manual submission at that moment.
**Validates: Requirements 15.5**

#### Test Results Properties

**Property 37: Percentage calculation**
*For any* test result, the percentage should equal (correct answers / total questions) × 100, rounded to 2 decimal places.
**Validates: Requirements 16.2**

**Property 38: Result breakdown completeness**
*For any* test result, correct + incorrect + unanswered should equal total questions.
**Validates: Requirements 16.3**

**Property 39: Time formatting**
*For any* time duration in seconds, the formatted string should be in HH:MM:SS format with proper zero-padding.
**Validates: Requirements 16.4**

**Property 40: Topic-wise performance accuracy**
*For any* test result, for each topic, the correct count should equal the number of questions in that topic where the user's answer matches the correct answer.
**Validates: Requirements 16.5**

**Property 41: Motivational message selection**
*For any* test result, the motivational message should correspond to the score percentage range: ≥90% (excellent), 70-89% (good), 50-69% (encouraging), <50% (supportive).
**Validates: Requirements 16A.1, 16A.2, 16A.3, 16A.4, 16A.5**

**Property 42: Inspirational quote inclusion**
*For any* test result, an inspirational quote should be included in the feedback.
**Validates: Requirements 16A.6**

**Property 43: Improvement celebration**
*For any* test result where the user has previous test history, if the current score is higher than the previous average, an improvement message should be displayed.
**Validates: Requirements 16A.7**

#### Question Review Properties

**Property 44: Review completeness**
*For any* test result review, each question should display the question text, all 4 options, the user's answer (or null), the correct answer, and the explanation.
**Validates: Requirements 17.2, 17.5**

#### Performance Analytics Properties

**Property 45: Difficulty-wise performance calculation**
*For any* test result, for each difficulty level present in the test, the accuracy should equal (correct for that difficulty / total for that difficulty) × 100.
**Validates: Requirements 18.1, 18.2**

**Property 46: Topic-wise accuracy calculation**
*For any* test result, for each topic, the accuracy percentage should equal (correct for that topic / total for that topic) × 100.
**Validates: Requirements 18.3**

**Property 47: Performance comparison**
*For any* test result where the user has previous tests on the same topics, the system should calculate and display the difference in accuracy compared to the previous average.
**Validates: Requirements 18.4**

**Property 48: Weak topic identification**
*For any* user's test history, topics where the average accuracy is below 60% should be identified as weak topics.
**Validates: Requirements 18.5**

#### Dashboard Properties

**Property 49: Total tests count**
*For any* user, the dashboard should display a count equal to the number of completed tests in the database for that user.
**Validates: Requirements 19.1**

**Property 50: Average score calculation**
*For any* user with completed tests, the average score should equal the sum of all test scores divided by the number of tests.
**Validates: Requirements 19.2**

**Property 51: Recent test history retrieval**
*For any* user, the recent test history should display the most recent N tests ordered by submission date descending.
**Validates: Requirements 19.4**

**Property 52: Subject-wise strength calculation**
*For any* user, for each subject/topic, the strength percentage should equal the average accuracy across all tests containing that topic.
**Validates: Requirements 19.5**

#### Test History Properties

**Property 53: History chronological ordering**
*For any* user's test history, tests should be ordered by submission date in descending order (most recent first).
**Validates: Requirements 20.1**

**Property 54: History entry completeness**
*For any* test in history, the displayed information should include date, score, percentage, topics covered, and time taken.
**Validates: Requirements 20.2**

**Property 55: History filtering correctness**
*For any* history filter criteria (date range, topic, score range), all returned tests should match the specified criteria.
**Validates: Requirements 20.4**

**Property 56: History pagination**
*For any* page number N in test history, the system should return tests at indices (N-1)×10 to N×10-1.
**Validates: Requirements 20.5**

#### Bookmark Properties

**Property 57: Bookmark creation**
*For any* question and user, creating a bookmark should save a record with the user ID, question ID, and current timestamp.
**Validates: Requirements 21.2**

**Property 58: Bookmark uniqueness**
*For any* user and question, attempting to create a duplicate bookmark should be prevented (only one bookmark per user-question pair).
**Validates: Requirements 21.4**

**Property 59: Bookmark retrieval with details**
*For any* user's bookmarks, retrieving them should return the complete question details along with bookmark metadata.
**Validates: Requirements 22.1**

**Property 60: Bookmark filtering**
*For any* bookmark filter criteria (topic, subtopic, difficulty), all returned bookmarks should have questions matching the criteria.
**Validates: Requirements 22.2**

**Property 61: Bookmark deletion**
*For any* bookmark, deleting it should remove the record from the database, and subsequent queries should not return it.
**Validates: Requirements 22.3**

**Property 62: Bookmark timestamp inclusion**
*For any* retrieved bookmark, the creation date should be included in the response.
**Validates: Requirements 22.4**

#### Daily Practice Properties

**Property 63: Daily practice auto-configuration**
*For any* daily practice request, the system should automatically select 10-20 random questions from all topics with mixed difficulty.
**Validates: Requirements 23.1, 23.2**

**Property 64: Daily streak tracking**
*For any* user, completing a daily practice test should increment the streak counter if completed on consecutive days, or reset to 1 if not consecutive.
**Validates: Requirements 23.4**

#### Error Handling Properties

**Property 65: Validation error specificity**
*For any* validation failure, the error message should specify which field failed validation and why.
**Validates: Requirements 26.2**

**Property 66: Error logging**
*For any* error that occurs in the system, an error log entry should be created with timestamp, error type, and error message.
**Validates: Requirements 26.5**

#### Data Persistence Properties

**Property 67: Session state round-trip**
*For any* test session, navigating away and returning should restore all answers, marked questions, current question index, and remaining time exactly as they were.
**Validates: Requirements 28.2, 28.3, 28.4**

**Property 68: Session cleanup on completion**
*For any* test session, when the test is submitted or expires, the session record should be deleted from the database.
**Validates: Requirements 28.5**

## Error Handling

### Error Categories

1. **Authentication Errors**
   - Invalid OAuth token
   - Expired session
   - Missing authentication
   - Unauthorized access (non-admin accessing admin routes)

2. **Validation Errors**
   - Invalid question data
   - Invalid test configuration
   - File size exceeded
   - Invalid file format

3. **Business Logic Errors**
   - Insufficient questions for test
   - Duplicate bookmark
   - Extension limit exceeded
   - Session not found

4. **Database Errors**
   - Connection failure
   - Query timeout
   - Duplicate key violation
   - Document not found

5. **Network Errors**
   - Request timeout
   - Connection refused
   - DNS resolution failure

### Error Handling Strategy

```typescript
// lib/errors.ts
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

class ValidationError extends AppError {
  constructor(message: string, public fields?: Record<string, string>) {
    super(400, message)
  }
}

class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(401, message)
  }
}

class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(403, message)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`)
  }
}

class BusinessLogicError extends AppError {
  constructor(message: string) {
    super(422, message)
  }
}

// Global error handler for API routes
function errorHandler(error: Error): Response {
  if (error instanceof AppError) {
    return Response.json(
      { error: error.message, fields: (error as any).fields },
      { status: error.statusCode }
    )
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', error)
  
  // Don't expose internal errors to clients
  return Response.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  )
}
```

### Error Recovery

- **Retry Logic**: Implement exponential backoff for transient network errors
- **Graceful Degradation**: Show cached data when real-time data is unavailable
- **User Feedback**: Always provide actionable error messages
- **Logging**: Log all errors with context for debugging

## Testing Strategy

### Dual Testing Approach

The UPSC Practice Platform requires both unit testing and property-based testing for comprehensive coverage:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs

Both approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Library Selection**: We will use **fast-check** for TypeScript/JavaScript property-based testing.

**Configuration Requirements**:
- Each property test must run a minimum of 100 iterations
- Each test must include a comment tag referencing the design property
- Tag format: `// Feature: upsc-practice-platform, Property N: [property description]`
- Each correctness property from the design must be implemented by exactly ONE property-based test

**Example Property Test**:
```typescript
import fc from 'fast-check'

// Feature: upsc-practice-platform, Property 8: Comprehensive question validation
test('question validation enforces all constraints', () => {
  fc.assert(
    fc.property(
      fc.record({
        topic: fc.string({ minLength: 1, maxLength: 100 }),
        subtopic: fc.string({ minLength: 1, maxLength: 100 }),
        question: fc.string({ minLength: 10, maxLength: 1000 }),
        options: fc.tuple(
          fc.string({ minLength: 1, maxLength: 500 }),
          fc.string({ minLength: 1, maxLength: 500 }),
          fc.string({ minLength: 1, maxLength: 500 }),
          fc.string({ minLength: 1, maxLength: 500 })
        ),
        correctAnswer: fc.integer({ min: 0, max: 3 }),
        difficulty: fc.constantFrom('easy', 'medium', 'hard'),
        explanation: fc.string({ minLength: 10, maxLength: 2000 }),
        tags: fc.array(fc.string())
      }),
      (questionData) => {
        const result = validateQuestion(questionData)
        expect(result.isValid).toBe(true)
      }
    ),
    { numRuns: 100 }
  )
})
```

### Unit Testing Strategy

**Focus Areas for Unit Tests**:
1. Specific examples demonstrating correct behavior
2. Edge cases (empty lists, boundary values, first/last items)
3. Error conditions and validation failures
4. Integration points between components
5. Specific score ranges for motivational messages

**Balance**: Avoid writing too many unit tests for scenarios that property tests already cover. Focus unit tests on concrete examples and edge cases that illustrate specific behaviors.

### Test Organization

```
tests/
├── unit/
│   ├── auth/
│   │   ├── google-oauth.test.ts
│   │   ├── admin-access.test.ts
│   │   └── session-management.test.ts
│   ├── questions/
│   │   ├── crud-operations.test.ts
│   │   ├── bulk-import.test.ts
│   │   └── validation.test.ts
│   ├── tests/
│   │   ├── configuration.test.ts
│   │   ├── question-selection.test.ts
│   │   ├── test-taking.test.ts
│   │   └── results.test.ts
│   ├── analytics/
│   │   ├── dashboard-stats.test.ts
│   │   └── performance-charts.test.ts
│   └── bookmarks/
│       └── bookmark-management.test.ts
├── property/
│   ├── auth.property.test.ts
│   ├── questions.property.test.ts
│   ├── tests.property.test.ts
│   ├── results.property.test.ts
│   ├── analytics.property.test.ts
│   └── bookmarks.property.test.ts
├── integration/
│   ├── test-flow.test.ts
│   ├── admin-workflow.test.ts
│   └── user-journey.test.ts
└── e2e/
    ├── complete-test-cycle.test.ts
    └── admin-question-management.test.ts
```

### Testing Tools

- **Unit & Integration Tests**: Jest with React Testing Library
- **Property-Based Tests**: fast-check
- **E2E Tests**: Playwright
- **API Testing**: Supertest
- **Database Testing**: MongoDB Memory Server
- **Mocking**: Jest mocks for external services

### Coverage Goals

- **Unit Test Coverage**: 80% code coverage minimum
- **Property Test Coverage**: All 68 correctness properties implemented
- **Integration Test Coverage**: All major user flows
- **E2E Test Coverage**: Critical paths (test taking, admin management)

### Continuous Integration

- Run all tests on every pull request
- Block merges if tests fail
- Generate coverage reports
- Run property tests with increased iterations (1000) in CI for thorough validation
