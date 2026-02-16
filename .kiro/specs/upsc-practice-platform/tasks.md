# Implementation Plan: UPSC Practice Platform

## Overview

This implementation plan breaks down the UPSC Practice Platform into incremental, testable steps. The platform will be built using Next.js 15.3, TypeScript, MongoDB, and NextAuth.js. Each task builds on previous work, with property-based tests and unit tests integrated throughout to ensure correctness.

The implementation follows this sequence:
1. Database setup and core models
2. Authentication system with admin access control
3. Question management (admin features)
4. Test configuration and question selection
5. Test taking interface with timer and navigation
6. Test submission and results
7. Analytics and dashboard
8. Bookmarks and daily practice
9. Final integration and polish

## Tasks

- [ ] 1. Set up database models and connection
  - Create MongoDB connection utility with Mongoose
  - Define User, Question, Test, TestSession, and Bookmark schemas
  - Add indexes for efficient queries (userId, topic, difficulty, dates)
  - Set up TTL index for TestSession auto-cleanup
  - Create database seed script for development
  - _Requirements: 1.5, 4.1, 15.2, 21.2, 28.4_

- [ ]* 1.1 Write property tests for database models
  - **Property 8: Comprehensive question validation**
  - **Validates: Requirements 4.1, 4.5, 4.6, 29.1-29.6**
  - **Property 58: Bookmark uniqueness**
  - **Validates: Requirements 21.4**

- [ ] 2. Implement authentication system
  - [ ] 2.1 Configure NextAuth.js with Google OAuth provider
    - Set up NextAuth configuration in `app/api/auth/[...nextauth]/route.ts`
    - Configure Google OAuth credentials from environment variables
    - Implement custom callbacks for session and JWT
    - _Requirements: 1.1, 1.2, 1.4_
  
  - [ ] 2.2 Implement admin access control logic
    - Create `lib/admin.ts` with `isAdmin()` and `requireAdmin()` functions
    - Check user email against ADMIN_EMAIL environment variable
    - Set user role during sign-in callback
    - _Requirements: 2.1, 2.2_
  
  - [ ] 2.3 Create session management utilities
    - Implement session validation helper
    - Create protected route wrapper component
    - Add session persistence logic
    - _Requirements: 3.2, 3.4, 3.5_

- [ ]* 2.4 Write property tests for authentication
  - **Property 1: User creation or retrieval on successful authentication**
  - **Validates: Requirements 1.2, 1.5**
  - **Property 2: Session token validity period**
  - **Validates: Requirements 1.4**
  - **Property 3: Admin role assignment**
  - **Validates: Requirements 2.1, 2.2**
  - **Property 4: Admin route protection**
  - **Validates: Requirements 2.3, 2.4**
  - **Property 6: Session invalidation on logout**
  - **Validates: Requirements 3.4**
  - **Property 7: Protected route session verification**
  - **Validates: Requirements 3.5**

- [ ]* 2.5 Write unit tests for authentication edge cases
  - Test authentication failure scenarios
  - Test session expiration handling
  - Test admin access with non-admin user
  - _Requirements: 1.3, 2.3, 3.3_

- [ ] 3. Create validation schemas and error handling
  - Define Zod schemas for Question, TestConfig, Answer in `lib/validations.ts`
  - Create custom error classes (AppError, ValidationError, AuthError, etc.)
  - Implement global error handler for API routes
  - Create error logging utility
  - _Requirements: 26.2, 26.5, 29.1-29.6_

- [ ]* 3.1 Write property tests for validation
  - **Property 65: Validation error specificity**
  - **Validates: Requirements 26.2**
  - **Property 66: Error logging**
  - **Validates: Requirements 26.5**

- [ ] 4. Implement question service layer
  - [ ] 4.1 Create QuestionService class in `lib/services/question-service.ts`
    - Implement `createQuestion()` with validation
    - Implement `updateQuestion()` preserving ID and updating timestamp
    - Implement `deleteQuestion()` with cascade logic
    - Implement `getQuestions()` with filtering
    - Implement `getQuestionById()`
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  
  - [ ] 4.2 Implement question selection algorithm
    - Create `selectQuestionsForTest()` method
    - Implement filtering by topic, subtopic, difficulty
    - Implement prioritization for unseen questions
    - Implement shuffling logic
    - Handle mixed difficulty distribution
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 4.3 Write property tests for question service
  - **Property 9: Question update preserves ID**
  - **Validates: Requirements 4.2**
  - **Property 10: Question deletion completeness**
  - **Validates: Requirements 4.3**
  - **Property 11: Question filtering correctness**
  - **Validates: Requirements 4.4**
  - **Property 19: Question selection criteria matching**
  - **Validates: Requirements 8.1**
  - **Property 20: Mixed difficulty distribution**
  - **Validates: Requirements 8.2**
  - **Property 21: Question uniqueness in test**
  - **Validates: Requirements 8.3**
  - **Property 22: Question prioritization for unseen questions**
  - **Validates: Requirements 8.4**
  - **Property 23: Question order randomization**
  - **Validates: Requirements 8.5**

- [ ] 5. Build admin question management APIs
  - [ ] 5.1 Create question CRUD API endpoints
    - `GET /api/admin/questions` - List with filters
    - `POST /api/admin/questions` - Create question
    - `PUT /api/admin/questions/[id]` - Update question
    - `DELETE /api/admin/questions/[id]` - Delete question
    - Add admin authentication middleware to all endpoints
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 2.4_
  
  - [ ] 5.2 Implement bulk import API
    - Create `POST /api/admin/questions/bulk-import` endpoint
    - Implement JSON parser with validation
    - Implement CSV parser with validation
    - Add file size validation (10MB limit)
    - Implement transactional insert (all or nothing)
    - Return detailed import summary with errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ]* 5.3 Write property tests for bulk import
  - **Property 12: JSON bulk import validation**
  - **Validates: Requirements 5.1**
  - **Property 13: CSV bulk import validation**
  - **Validates: Requirements 5.2, 5.3**
  - **Property 14: Bulk import transactionality**
  - **Validates: Requirements 5.4**
  - **Property 15: Import summary accuracy**
  - **Validates: Requirements 5.5**
  - **Property 16: File size validation**
  - **Validates: Requirements 5.6**

- [ ] 6. Build admin question management UI
  - Create `app/admin/questions/page.tsx` with question list and filters
  - Create `components/AdminQuestionForm.tsx` for create/edit with live preview
  - Create `components/BulkImportDialog.tsx` for file upload
  - Add question preview panel that updates in real-time
  - Implement toast notifications for CRUD operations
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 6.1, 6.4, 27.1_

- [ ] 7. Checkpoint - Verify admin functionality
  - Ensure all admin tests pass
  - Manually test question CRUD operations
  - Test bulk import with sample JSON and CSV files
  - Verify admin access control works correctly
  - Ask the user if questions arise

- [ ] 8. Implement test service layer
  - [ ] 8.1 Create TestService class in `lib/services/test-service.ts`
    - Implement `createTestSession()` to start a test
    - Implement `getTestSession()` to retrieve active session
    - Implement `saveAnswer()` for immediate persistence
    - Implement `toggleMarkForReview()` for marking questions
    - Implement `extendTime()` with limit enforcement
    - Implement `submitTest()` with results calculation
    - Implement `calculateResults()` helper
    - _Requirements: 9.2, 11.1, 14.2, 14.3, 15.2, 15.3, 15.4_
  
  - [ ] 8.2 Implement time calculation utilities
    - Create `calculateTestDuration()` function (N × 1.2 minutes)
    - Create `formatTime()` function for HH:MM:SS display
    - _Requirements: 7.5, 16.4_
  
  - [ ] 8.3 Implement results calculation logic
    - Calculate score, correct, incorrect, unanswered counts
    - Calculate percentage with 2 decimal places
    - Calculate topic-wise performance
    - Calculate difficulty-wise performance
    - Identify weak topics (< 60% accuracy)
    - _Requirements: 15.3, 16.2, 16.3, 16.5, 18.1, 18.2, 18.5_

- [ ]* 8.4 Write property tests for test service
  - **Property 18: Test duration calculation**
  - **Validates: Requirements 7.5**
  - **Property 24: Immediate answer persistence**
  - **Validates: Requirements 9.2**
  - **Property 25: Answer modification**
  - **Validates: Requirements 9.3**
  - **Property 27: Mark for review toggle**
  - **Validates: Requirements 11.1, 11.3**
  - **Property 28: Mark status persistence**
  - **Validates: Requirements 11.4**
  - **Property 29: Marked question count accuracy**
  - **Validates: Requirements 11.5**
  - **Property 30: Time extension addition**
  - **Validates: Requirements 14.2**
  - **Property 31: Extension limit enforcement**
  - **Validates: Requirements 14.3**
  - **Property 34: Score calculation correctness**
  - **Validates: Requirements 15.3**
  - **Property 35: Time taken calculation**
  - **Validates: Requirements 15.4**
  - **Property 36: Auto-submit equivalence**
  - **Validates: Requirements 15.5**
  - **Property 37: Percentage calculation**
  - **Validates: Requirements 16.2**
  - **Property 38: Result breakdown completeness**
  - **Validates: Requirements 16.3**
  - **Property 39: Time formatting**
  - **Validates: Requirements 16.4**
  - **Property 40: Topic-wise performance accuracy**
  - **Validates: Requirements 16.5**
  - **Property 45: Difficulty-wise performance calculation**
  - **Validates: Requirements 18.1, 18.2**

- [ ] 9. Create test configuration and management APIs
  - Create `POST /api/tests/configure` - Validate configuration and check availability
  - Create `POST /api/tests/start` - Create session and select questions
  - Create `GET /api/tests/session` - Get current session
  - Create `PUT /api/tests/session/answer` - Save answer
  - Create `PUT /api/tests/session/mark-review` - Toggle mark
  - Create `POST /api/tests/session/extend-time` - Request extension
  - Create `POST /api/tests/submit` - Submit and calculate results
  - _Requirements: 7.4, 8.1, 9.2, 11.1, 14.2, 15.2, 15.3_

- [ ]* 9.1 Write property tests for test APIs
  - **Property 17: Question availability validation**
  - **Validates: Requirements 7.4**
  - **Property 32: Submission confirmation counts**
  - **Validates: Requirements 15.1**
  - **Property 33: Answer persistence on submission**
  - **Validates: Requirements 15.2**

- [ ] 10. Build test configuration UI
  - Create `app/test/configure/page.tsx` with configuration form
  - Add topic and subtopic multi-select dropdowns
  - Add difficulty level selector (easy/medium/hard/mixed)
  - Add question count input with validation
  - Display calculated test duration
  - Show error if insufficient questions available
  - Add "Start Test" button to create session
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 11. Build test taking interface
  - [ ] 11.1 Create main test page `app/test/[id]/page.tsx`
    - Display one question at a time with 4 radio options
    - Show question number and total count
    - Add Previous/Next navigation buttons
    - Handle boundary conditions (first/last question)
    - Integrate all components (timer, palette, question card)
    - _Requirements: 9.1, 9.4, 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 11.2 Create Timer component `components/Timer.tsx`
    - Display countdown in MM:SS format
    - Update every second
    - Show warning at 5 minutes remaining
    - Change color to red below 1 minute
    - Trigger extension dialog on expiry
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ] 11.3 Create QuestionPalette component `components/QuestionPalette.tsx`
    - Display all question numbers as clickable buttons
    - Show status indicators (answered/unanswered/marked)
    - Handle click to navigate to specific question
    - Update status in real-time as user answers
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ] 11.4 Create QuestionCard component `components/QuestionCard.tsx`
    - Display question text with proper formatting
    - Render 4 radio button options
    - Save answer immediately on selection
    - Allow answer changes
    - Add "Mark for Review" toggle button
    - _Requirements: 9.1, 9.2, 9.3, 11.1, 11.3_
  
  - [ ] 11.5 Implement time extension dialog
    - Show dialog when time expires
    - Offer 5 or 10 minute extension options
    - Track extension count (max 2)
    - Show final warning on second expiry
    - Auto-submit when final time expires
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ] 11.6 Implement test submission flow
    - Create submission confirmation dialog
    - Show answered/unanswered counts
    - Handle manual submission
    - Handle auto-submission on time expiry
    - Navigate to results page after submission
    - _Requirements: 15.1, 15.2, 15.5_

- [ ]* 11.7 Write property tests for test taking
  - **Property 26: Question palette navigation**
  - **Validates: Requirements 10.5**

- [ ]* 11.8 Write unit tests for test taking edge cases
  - Test first question (Previous disabled)
  - Test last question (Next becomes Submit)
  - Test 5-minute warning trigger
  - Test time extension dialog
  - Test auto-submit on final expiry
  - _Requirements: 10.3, 10.4, 13.2, 14.4, 14.5_

- [ ] 12. Implement session persistence
  - Add session state saving on every answer/mark action
  - Implement session restoration on page reload
  - Store session data: answers, marks, current index, remaining time
  - Clean up session on test submission
  - _Requirements: 28.1, 28.2, 28.3, 28.4, 28.5_

- [ ]* 12.1 Write property tests for session persistence
  - **Property 67: Session state round-trip**
  - **Validates: Requirements 28.2, 28.3, 28.4**
  - **Property 68: Session cleanup on completion**
  - **Validates: Requirements 28.5**

- [ ] 13. Checkpoint - Verify test taking flow
  - Ensure all test taking tests pass
  - Manually test complete test flow from configuration to submission
  - Test timer functionality and extensions
  - Test session persistence across page reloads
  - Ask the user if questions arise

- [ ] 14. Implement motivational feedback system
  - Create `lib/motivational.ts` with message selection logic
  - Implement `getMotivationalMessage()` function
  - Define message templates for each score range (≥90%, 70-89%, 50-69%, <50%)
  - Add inspirational quotes collection
  - Implement improvement detection comparing to previous average
  - _Requirements: 16A.1, 16A.2, 16A.3, 16A.4, 16A.5, 16A.6, 16A.7_

- [ ]* 14.1 Write property tests for motivational feedback
  - **Property 41: Motivational message selection**
  - **Validates: Requirements 16A.1-16A.5**
  - **Property 42: Inspirational quote inclusion**
  - **Validates: Requirements 16A.6**
  - **Property 43: Improvement celebration**
  - **Validates: Requirements 16A.7**

- [ ]* 14.2 Write unit tests for motivational messages
  - Test each score range (90%+, 70-89%, 50-69%, <50%)
  - Test improvement message when score increases
  - Test no improvement message when score decreases
  - _Requirements: 16A.2, 16A.3, 16A.4, 16A.5_

- [ ] 15. Build test results and review UI
  - [ ] 15.1 Create results page `app/test/[id]/results/page.tsx`
    - Display score summary (correct/total, percentage)
    - Show breakdown (correct, incorrect, unanswered)
    - Display time taken in HH:MM:SS format
    - Show motivational message and quote
    - Display improvement message if applicable
    - Show topic-wise performance table
    - Show difficulty-wise performance breakdown
    - Add button to view detailed question review
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16A.1-16A.7, 18.1, 18.2_
  
  - [ ] 15.2 Create question review section
    - Display all questions with user's answers
    - Highlight correct answers in green
    - Highlight incorrect answers in red
    - Show correct answer for each question
    - Display explanation for each question
    - Add navigation between questions
    - Add bookmark button for each question
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 21.1_

- [ ]* 15.3 Write property tests for results
  - **Property 44: Review completeness**
  - **Validates: Requirements 17.2, 17.5**
  - **Property 46: Topic-wise accuracy calculation**
  - **Validates: Requirements 18.3**
  - **Property 48: Weak topic identification**
  - **Validates: Requirements 18.5**

- [ ] 16. Implement analytics service layer
  - Create AnalyticsService class in `lib/services/analytics-service.ts`
  - Implement `getUserStats()` - total tests, average score, time spent
  - Implement `getProgressChartData()` - score progression over time
  - Implement `getTopicWiseStrength()` - accuracy by topic with trends
  - Implement `getDailyStreak()` - consecutive days of practice
  - _Requirements: 19.1, 19.2, 19.3, 19.5, 23.4_

- [ ]* 16.1 Write property tests for analytics
  - **Property 49: Total tests count**
  - **Validates: Requirements 19.1**
  - **Property 50: Average score calculation**
  - **Validates: Requirements 19.2**
  - **Property 52: Subject-wise strength calculation**
  - **Validates: Requirements 19.5**
  - **Property 64: Daily streak tracking**
  - **Validates: Requirements 23.4**

- [ ] 17. Create analytics and dashboard APIs
  - Create `GET /api/dashboard/stats` - Overall user statistics
  - Create `GET /api/dashboard/charts` - Chart data for visualizations
  - Create `GET /api/tests/history` - Test history with filters and pagination
  - Create `GET /api/tests/[id]` - Specific test results with review
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 20.1, 20.2_

- [ ]* 17.1 Write property tests for analytics APIs
  - **Property 47: Performance comparison**
  - **Validates: Requirements 18.4**
  - **Property 51: Recent test history retrieval**
  - **Validates: Requirements 19.4**

- [ ] 18. Build user dashboard
  - Create `app/dashboard/page.tsx` with stats overview
  - Display total tests taken and average score
  - Create PerformanceChart component with Recharts
  - Add line chart for score progression (last 10 tests)
  - Add bar chart for topic-wise accuracy
  - Add pie chart for difficulty-wise distribution
  - Display recent test history (last 5 tests)
  - Show subject-wise strength analysis
  - Add "Start New Test" prominent button
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 30.1, 30.2, 30.3_

- [ ] 19. Build test history page
  - Create `app/history/page.tsx` with filterable test list
  - Display tests in reverse chronological order
  - Show date, score, percentage, topics, time for each test
  - Add filters for date range, topic, score range
  - Implement pagination (10 tests per page)
  - Make each test clickable to view full results
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ]* 19.1 Write property tests for test history
  - **Property 53: History chronological ordering**
  - **Validates: Requirements 20.1**
  - **Property 54: History entry completeness**
  - **Validates: Requirements 20.2**
  - **Property 55: History filtering correctness**
  - **Validates: Requirements 20.4**
  - **Property 56: History pagination**
  - **Validates: Requirements 20.5**

- [ ] 20. Implement bookmark service layer
  - Create BookmarkService class in `lib/services/bookmark-service.ts`
  - Implement `createBookmark()` with uniqueness check
  - Implement `removeBookmark()` with authorization
  - Implement `getBookmarks()` with filters and question details
  - Implement `isBookmarked()` helper
  - _Requirements: 21.2, 21.4, 22.1, 22.2, 22.3_

- [ ]* 20.1 Write property tests for bookmarks
  - **Property 57: Bookmark creation**
  - **Validates: Requirements 21.2**
  - **Property 59: Bookmark retrieval with details**
  - **Validates: Requirements 22.1**
  - **Property 60: Bookmark filtering**
  - **Validates: Requirements 22.2**
  - **Property 61: Bookmark deletion**
  - **Validates: Requirements 22.3**
  - **Property 62: Bookmark timestamp inclusion**
  - **Validates: Requirements 22.4**

- [ ] 21. Create bookmark APIs and UI
  - Create `POST /api/bookmarks` - Create bookmark
  - Create `DELETE /api/bookmarks/[id]` - Remove bookmark
  - Create `GET /api/bookmarks` - Get bookmarks with filters
  - Create `app/bookmarks/page.tsx` with bookmark list
  - Add filters for topic, subtopic, difficulty
  - Display full question details for each bookmark
  - Add remove bookmark button
  - Add "Practice Bookmarked Questions" button to create custom test
  - _Requirements: 21.2, 21.4, 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 22. Implement daily practice mode
  - Add daily practice configuration logic
  - Auto-select 10-20 random questions from all topics
  - Use mixed difficulty distribution
  - Prioritize unseen questions
  - Track daily practice completion
  - Calculate and display streak
  - Add daily practice button to dashboard
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ]* 22.1 Write property tests for daily practice
  - **Property 63: Daily practice auto-configuration**
  - **Validates: Requirements 23.1, 23.2**

- [ ] 23. Checkpoint - Verify analytics and bookmarks
  - Ensure all analytics and bookmark tests pass
  - Test dashboard displays correct statistics
  - Test charts render properly with real data
  - Test bookmark creation and removal
  - Test daily practice flow
  - Ask the user if questions arise

- [ ] 24. Implement responsive design
  - Add Tailwind responsive classes to all components
  - Test mobile layout (< 768px)
  - Test tablet layout (768px - 1024px)
  - Test desktop layout (> 1024px)
  - Ensure touch targets are minimum 44px on mobile
  - Test question palette on mobile (scrollable)
  - Test charts responsiveness
  - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

- [ ] 25. Add loading states and error handling
  - Create loading spinner component
  - Add skeleton screens for data loading
  - Implement loading states for all forms
  - Add error boundaries for React components
  - Implement retry logic for failed requests
  - Add user-friendly error messages
  - Ensure all errors are logged
  - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 26.1, 26.3, 26.4_

- [ ] 26. Implement toast notifications
  - Install and configure toast library (react-hot-toast or sonner)
  - Add success toasts for CRUD operations
  - Add error toasts for failures
  - Configure auto-dismiss after 3 seconds
  - Allow manual dismissal
  - Style toasts to match design system
  - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5_

- [ ] 27. Add navigation and layout
  - Create main navigation component with user menu
  - Add navigation links (Dashboard, New Test, History, Bookmarks)
  - Show admin link only for admin users
  - Add user profile dropdown with logout
  - Create consistent page layout wrapper
  - Add breadcrumbs for navigation context
  - Implement protected route wrapper for all authenticated pages
  - _Requirements: 2.5, 3.5_

- [ ] 28. Polish UI and animations
  - Add Framer Motion animations for page transitions
  - Add hover effects on interactive elements
  - Implement smooth scrolling
  - Add loading animations for charts
  - Polish form inputs with focus states
  - Add success animations for test submission
  - Ensure consistent spacing and typography
  - _Requirements: 24.1, 24.2, 24.3_

- [ ] 29. Write integration tests
  - Test complete test-taking flow (configure → take → submit → review)
  - Test admin workflow (create question → bulk import → preview)
  - Test bookmark workflow (take test → review → bookmark → practice bookmarks)
  - Test daily practice flow
  - Test session persistence across page reloads
  - _Requirements: All major flows_

- [ ] 30. Final checkpoint and deployment preparation
  - Run all tests (unit, property, integration)
  - Verify all 68 correctness properties are tested
  - Check test coverage meets 80% minimum
  - Test with production-like data volume
  - Verify environment variables are documented
  - Test admin access control thoroughly
  - Perform manual testing of all features
  - Ask the user if questions arise before deployment

## Notes

- Tasks marked with `*` are optional test tasks that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties across many inputs
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation and allow for user feedback
- The implementation prioritizes core functionality first, then analytics and polish
- All property tests should run with minimum 100 iterations
- Each property test must include a comment tag referencing the design property
