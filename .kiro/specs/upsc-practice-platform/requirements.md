# Requirements Document: UPSC Practice Platform

## Introduction

The UPSC Practice Platform is a comprehensive web application designed to help users prepare for UPSC examinations through structured practice tests, performance analytics, and question management. The platform provides an admin interface for question management and a user interface for taking tests, reviewing results, and tracking progress over time.

## Glossary

- **System**: The UPSC Practice Platform web application
- **Admin**: A user with administrative privileges granted via email whitelist
- **User**: Any authenticated user of the platform
- **Question**: A multiple-choice question with 4 options, one correct answer, and associated metadata
- **Test**: A collection of questions presented to a user with time constraints
- **Test_Session**: An active instance of a user taking a test
- **Question_Palette**: A visual interface showing the status of all questions in a test
- **Bookmark**: A saved reference to a question for future review
- **Test_Result**: The outcome data generated after a test submission
- **Extension**: Additional time granted when the test timer expires
- **Topic**: A subject area category for questions (e.g., History, Geography)
- **Subtopic**: A subcategory within a topic
- **Difficulty_Level**: Classification of question complexity (easy, medium, hard)

## Requirements

### Requirement 1: Google OAuth Authentication

**User Story:** As a user, I want to log in using my Google account, so that I can access the platform securely without creating a new password.

#### Acceptance Criteria

1. WHEN a user clicks the login button, THE System SHALL redirect to Google OAuth consent screen
2. WHEN Google authentication succeeds, THE System SHALL create or retrieve the user record in the database
3. WHEN Google authentication fails, THE System SHALL display an error message and return to the login page
4. WHEN a user is authenticated, THE System SHALL create a session token valid for 30 days
5. THE System SHALL store user email, name, and authentication provider in the database

### Requirement 2: Admin Access Control

**User Story:** As a system administrator, I want to restrict admin access to specific email addresses, so that only authorized users can manage questions.

#### Acceptance Criteria

1. WHEN a user logs in, THE System SHALL check if their email matches the ADMIN_EMAIL environment variable
2. WHEN the email matches the admin whitelist, THE System SHALL grant admin role to the user
3. WHEN a non-admin user attempts to access admin routes, THE System SHALL return a 403 Forbidden error
4. THE System SHALL protect all admin API endpoints with admin role verification
5. WHEN an admin accesses the dashboard, THE System SHALL display admin-specific navigation and features

### Requirement 3: Session Management

**User Story:** As a user, I want my login session to persist across browser sessions, so that I don't have to log in repeatedly.

#### Acceptance Criteria

1. WHEN a user successfully authenticates, THE System SHALL create a session with 30-day expiration
2. WHEN a user closes and reopens the browser, THE System SHALL maintain the active session if not expired
3. WHEN a session expires, THE System SHALL redirect the user to the login page
4. WHEN a user logs out, THE System SHALL invalidate the session immediately
5. THE System SHALL verify session validity on every protected route access

### Requirement 4: Question Management (CRUD)

**User Story:** As an admin, I want to create, read, update, and delete questions, so that I can maintain an up-to-date question bank.

#### Acceptance Criteria

1. WHEN an admin creates a question, THE System SHALL validate all required fields (topic, subtopic, question text, 4 options, correct answer index, difficulty, explanation)
2. WHEN an admin updates a question, THE System SHALL preserve the question ID and update timestamp
3. WHEN an admin deletes a question, THE System SHALL remove it from the database and all future test selections
4. THE System SHALL allow admins to view all questions with filtering by topic, subtopic, and difficulty
5. WHEN saving a question, THE System SHALL ensure the correct answer index is between 0 and 3
6. WHEN saving a question, THE System SHALL ensure all 4 options are non-empty strings

### Requirement 5: Bulk Question Import

**User Story:** As an admin, I want to import multiple questions via JSON or CSV file, so that I can efficiently populate the question bank.

#### Acceptance Criteria

1. WHEN an admin uploads a JSON file, THE System SHALL parse and validate each question entry
2. WHEN an admin uploads a CSV file, THE System SHALL parse and validate each row as a question
3. WHEN validation fails for any question, THE System SHALL report the specific errors and line numbers
4. WHEN all questions are valid, THE System SHALL insert them into the database in a single transaction
5. WHEN the import completes, THE System SHALL display a summary showing successful imports and any errors
6. THE System SHALL reject files larger than 10MB

### Requirement 6: Question Preview

**User Story:** As an admin, I want to preview questions before publishing, so that I can verify formatting and correctness.

#### Acceptance Criteria

1. WHEN an admin creates or edits a question, THE System SHALL display a live preview panel
2. WHEN the preview is displayed, THE System SHALL render the question exactly as users will see it during tests
3. THE System SHALL highlight the correct answer in the preview for admin verification
4. WHEN an admin modifies any field, THE System SHALL update the preview in real-time

### Requirement 7: Test Configuration

**User Story:** As a user, I want to configure test parameters before starting, so that I can practice specific topics at my chosen difficulty level.

#### Acceptance Criteria

1. WHEN a user configures a test, THE System SHALL allow selection of one or more topics
2. WHEN a user configures a test, THE System SHALL allow selection of one or more subtopics within chosen topics
3. WHEN a user configures a test, THE System SHALL allow selection of difficulty level (easy, medium, hard, or mixed)
4. WHEN a user sets the number of questions, THE System SHALL validate that sufficient questions exist matching the criteria
5. WHEN configuration is complete, THE System SHALL calculate test duration as (number of questions × 1.2) minutes
6. WHEN insufficient questions exist, THE System SHALL display an error message with available question count

### Requirement 8: Test Question Selection

**User Story:** As a user, I want the system to select appropriate questions for my test, so that I receive a fair and relevant practice experience.

#### Acceptance Criteria

1. WHEN a test starts, THE System SHALL randomly select questions matching the configured topics, subtopics, and difficulty
2. WHEN difficulty is set to "mixed", THE System SHALL distribute questions evenly across easy, medium, and hard levels
3. THE System SHALL ensure no duplicate questions appear in a single test
4. WHEN a user has taken previous tests, THE System SHALL prioritize questions the user hasn't seen recently
5. THE System SHALL shuffle the order of questions for each test instance

### Requirement 9: Test Taking Interface

**User Story:** As a user, I want a clean interface to answer questions, so that I can focus on the content without distractions.

#### Acceptance Criteria

1. WHEN a test is active, THE System SHALL display one question at a time with 4 radio button options
2. WHEN a user selects an option, THE System SHALL save the answer immediately to the session
3. THE System SHALL allow users to change their answer before submitting the test
4. WHEN displaying a question, THE System SHALL show the question number and total question count
5. THE System SHALL render question text and options with proper formatting and readability

### Requirement 10: Question Navigation

**User Story:** As a user, I want to navigate between questions easily, so that I can review and modify my answers efficiently.

#### Acceptance Criteria

1. WHEN a user clicks "Next", THE System SHALL display the next question in sequence
2. WHEN a user clicks "Previous", THE System SHALL display the previous question in sequence
3. WHEN a user is on the first question, THE System SHALL disable the "Previous" button
4. WHEN a user is on the last question, THE System SHALL change "Next" button to "Review & Submit"
5. THE System SHALL allow users to jump directly to any question via the question palette

### Requirement 11: Mark for Review

**User Story:** As a user, I want to mark questions for review, so that I can return to uncertain answers before submitting.

#### Acceptance Criteria

1. WHEN a user clicks "Mark for Review", THE System SHALL flag the current question as marked
2. WHEN a question is marked, THE System SHALL display a visual indicator in the question palette
3. WHEN a user unmarks a question, THE System SHALL remove the review flag
4. THE System SHALL preserve mark status when navigating between questions
5. WHEN reviewing before submission, THE System SHALL show count of marked questions

### Requirement 12: Question Palette

**User Story:** As a user, I want to see the status of all questions at a glance, so that I can track my progress and identify unanswered questions.

#### Acceptance Criteria

1. WHEN a test is active, THE System SHALL display a question palette showing all question numbers
2. WHEN a question is answered, THE System SHALL mark it with a green indicator in the palette
3. WHEN a question is unanswered, THE System SHALL mark it with a gray indicator in the palette
4. WHEN a question is marked for review, THE System SHALL mark it with an orange indicator in the palette
5. WHEN a user clicks a question number in the palette, THE System SHALL navigate to that question immediately

### Requirement 13: Test Timer

**User Story:** As a user, I want to see a countdown timer during the test, so that I can manage my time effectively.

#### Acceptance Criteria

1. WHEN a test starts, THE System SHALL display a countdown timer showing remaining time in MM:SS format
2. WHEN time reaches 5 minutes remaining, THE System SHALL display a warning notification
3. WHEN the timer is below 1 minute, THE System SHALL change the timer color to red
4. THE System SHALL update the timer display every second
5. WHEN time expires, THE System SHALL display a time extension dialog

### Requirement 14: Time Extension

**User Story:** As a user, I want to extend test time when it expires, so that I can complete my answers without losing progress.

#### Acceptance Criteria

1. WHEN time expires, THE System SHALL display a dialog offering 5 or 10 minute extensions
2. WHEN a user selects an extension, THE System SHALL add the chosen time to the timer and resume the test
3. THE System SHALL track the number of extensions used and limit to a maximum of 2 extensions
4. WHEN the second extension expires, THE System SHALL display a final warning with no extension option
5. WHEN the final extended time expires, THE System SHALL auto-submit the test immediately

### Requirement 15: Test Submission

**User Story:** As a user, I want to submit my test when ready, so that I can see my results and review my performance.

#### Acceptance Criteria

1. WHEN a user clicks "Submit Test", THE System SHALL display a confirmation dialog showing answered and unanswered question counts
2. WHEN submission is confirmed, THE System SHALL save all answers with timestamps to the database
3. WHEN submission completes, THE System SHALL calculate the score and generate test results
4. THE System SHALL record total time taken from test start to submission
5. WHEN auto-submit occurs due to time expiry, THE System SHALL save all current answers and generate results

### Requirement 16: Test Results Display

**User Story:** As a user, I want to see my test results immediately after submission, so that I can understand my performance.

#### Acceptance Criteria

1. WHEN a test is submitted, THE System SHALL display total score as correct answers out of total questions
2. THE System SHALL display percentage score rounded to 2 decimal places
3. THE System SHALL show breakdown of correct, incorrect, and unanswered questions
4. THE System SHALL display total time taken in HH:MM:SS format
5. THE System SHALL show topic-wise performance with correct/total for each topic

### Requirement 16A: Motivational Feedback

**User Story:** As an aspirant, I want to receive encouraging feedback after completing a test, so that I stay motivated in my preparation journey.

#### Acceptance Criteria

1. WHEN a test is submitted, THE System SHALL display a personalized motivational message based on the score percentage
2. WHEN score is 90% or above, THE System SHALL display an excellent performance message (e.g., "Outstanding! You're on the path to success!")
3. WHEN score is 70-89%, THE System SHALL display a good performance message (e.g., "Great work! Keep up the momentum!")
4. WHEN score is 50-69%, THE System SHALL display an encouraging message (e.g., "Good effort! Consistency will lead to excellence!")
5. WHEN score is below 50%, THE System SHALL display a supportive message (e.g., "Every expert was once a beginner. Keep practicing!")
6. THE System SHALL include an inspirational quote related to perseverance or learning with each result
7. WHEN a user improves their score compared to previous attempts, THE System SHALL display a progress celebration message

### Requirement 17: Question-wise Review

**User Story:** As a user, I want to review each question with correct answers and explanations, so that I can learn from my mistakes.

#### Acceptance Criteria

1. WHEN viewing test results, THE System SHALL provide a detailed review section for all questions
2. FOR EACH question, THE System SHALL display the question text, all options, user's answer, and correct answer
3. WHEN the user's answer is incorrect, THE System SHALL highlight it in red and the correct answer in green
4. WHEN the user's answer is correct, THE System SHALL highlight it in green
5. FOR EACH question, THE System SHALL display the explanation text
6. THE System SHALL allow navigation between questions in the review interface

### Requirement 18: Performance Analytics

**User Story:** As a user, I want to see analytics of my performance, so that I can identify strengths and weaknesses.

#### Acceptance Criteria

1. WHEN viewing test results, THE System SHALL display difficulty-wise performance (easy/medium/hard breakdown)
2. THE System SHALL calculate and display accuracy percentage for each difficulty level
3. THE System SHALL display topic-wise accuracy with visual indicators (progress bars or charts)
4. THE System SHALL show comparison with previous attempts if available
5. THE System SHALL identify weak topics where accuracy is below 60%

### Requirement 19: User Dashboard

**User Story:** As a user, I want a dashboard showing my overall progress, so that I can track my improvement over time.

#### Acceptance Criteria

1. WHEN a user accesses the dashboard, THE System SHALL display total tests taken
2. THE System SHALL display average score across all tests
3. THE System SHALL display a line chart showing score progression over time
4. THE System SHALL display recent test history with dates, scores, and topics
5. THE System SHALL show subject-wise strength analysis with accuracy percentages
6. THE System SHALL provide a "Start New Test" button for quick access

### Requirement 20: Test History

**User Story:** As a user, I want to view my past test attempts, so that I can review previous results and track progress.

#### Acceptance Criteria

1. WHEN a user views test history, THE System SHALL display all completed tests in reverse chronological order
2. FOR EACH test, THE System SHALL show date, score, percentage, topics covered, and time taken
3. WHEN a user clicks on a past test, THE System SHALL display the full results and question review
4. THE System SHALL allow filtering test history by date range, topic, or score range
5. THE System SHALL paginate test history showing 10 tests per page

### Requirement 21: Question Bookmarking

**User Story:** As a user, I want to bookmark questions during review, so that I can revisit challenging questions later.

#### Acceptance Criteria

1. WHEN reviewing test results, THE System SHALL display a "Bookmark" button for each question
2. WHEN a user clicks bookmark, THE System SHALL save the question reference with user ID and timestamp
3. WHEN a question is already bookmarked, THE System SHALL display an "Unbookmark" button instead
4. THE System SHALL prevent duplicate bookmarks for the same user and question
5. WHEN a user bookmarks a question, THE System SHALL display a confirmation notification

### Requirement 22: Bookmark Management

**User Story:** As a user, I want to view and manage my bookmarked questions, so that I can practice difficult questions repeatedly.

#### Acceptance Criteria

1. WHEN a user accesses bookmarks, THE System SHALL display all bookmarked questions with full details
2. THE System SHALL allow filtering bookmarks by topic, subtopic, or difficulty level
3. WHEN a user clicks "Remove Bookmark", THE System SHALL delete the bookmark and update the display
4. THE System SHALL display bookmark creation date for each bookmarked question
5. THE System SHALL allow users to practice bookmarked questions as a custom test

### Requirement 23: Daily Practice Mode

**User Story:** As a user, I want a quick daily practice option, so that I can maintain consistent preparation without extensive configuration.

#### Acceptance Criteria

1. WHEN a user selects daily practice, THE System SHALL automatically configure a test with 10-20 random questions
2. THE System SHALL select questions from all topics with mixed difficulty
3. THE System SHALL calculate time as (number of questions × 1.2) minutes
4. THE System SHALL track daily practice completion and display streak information
5. THE System SHALL prioritize questions the user hasn't attempted recently

### Requirement 24: Responsive Design

**User Story:** As a user, I want the platform to work seamlessly on all devices, so that I can practice on mobile, tablet, or desktop.

#### Acceptance Criteria

1. WHEN accessed on mobile devices (< 768px width), THE System SHALL display a mobile-optimized layout
2. WHEN accessed on tablets (768px - 1024px width), THE System SHALL display a tablet-optimized layout
3. WHEN accessed on desktop (> 1024px width), THE System SHALL display a full desktop layout
4. THE System SHALL ensure all interactive elements are touch-friendly on mobile devices (minimum 44px touch targets)
5. THE System SHALL maintain readability with appropriate font sizes across all screen sizes

### Requirement 25: Loading States

**User Story:** As a user, I want to see loading indicators during data operations, so that I know the system is processing my request.

#### Acceptance Criteria

1. WHEN data is being fetched, THE System SHALL display a loading spinner or skeleton screen
2. WHEN a form is being submitted, THE System SHALL disable the submit button and show a loading state
3. WHEN navigation occurs, THE System SHALL display a loading indicator if the page takes more than 200ms to load
4. THE System SHALL ensure loading indicators are accessible with appropriate ARIA labels
5. WHEN an operation completes, THE System SHALL remove the loading indicator immediately

### Requirement 26: Error Handling

**User Story:** As a user, I want clear error messages when something goes wrong, so that I understand what happened and how to proceed.

#### Acceptance Criteria

1. WHEN a network error occurs, THE System SHALL display a user-friendly error message with retry option
2. WHEN validation fails, THE System SHALL display specific field-level error messages
3. WHEN a server error occurs, THE System SHALL display a generic error message without exposing technical details
4. WHEN authentication fails, THE System SHALL redirect to login with an appropriate error message
5. THE System SHALL log all errors to the console for debugging purposes

### Requirement 27: Toast Notifications

**User Story:** As a user, I want brief notifications for my actions, so that I receive immediate feedback without disrupting my workflow.

#### Acceptance Criteria

1. WHEN a user performs an action (save, delete, bookmark), THE System SHALL display a toast notification
2. THE System SHALL automatically dismiss toast notifications after 3 seconds
3. WHEN an error occurs, THE System SHALL display an error toast with red styling
4. WHEN an action succeeds, THE System SHALL display a success toast with green styling
5. THE System SHALL allow users to manually dismiss toasts before auto-dismiss

### Requirement 28: Data Persistence

**User Story:** As a user, I want my test progress to be saved automatically, so that I don't lose my work if the browser closes unexpectedly.

#### Acceptance Criteria

1. WHEN a user answers a question, THE System SHALL save the answer to the database immediately
2. WHEN a user navigates away during a test, THE System SHALL preserve the test session
3. WHEN a user returns to an incomplete test, THE System SHALL restore all answers and timer state
4. THE System SHALL store test session data with user ID, test ID, answers, and remaining time
5. WHEN a test is submitted or expires, THE System SHALL delete the temporary session data

### Requirement 29: Question Data Validation

**User Story:** As an admin, I want the system to validate question data, so that only properly formatted questions are stored.

#### Acceptance Criteria

1. WHEN saving a question, THE System SHALL ensure question text is between 10 and 1000 characters
2. WHEN saving a question, THE System SHALL ensure each option is between 1 and 500 characters
3. WHEN saving a question, THE System SHALL ensure explanation is between 10 and 2000 characters
4. WHEN saving a question, THE System SHALL ensure topic and subtopic are non-empty strings
5. WHEN saving a question, THE System SHALL ensure difficulty is one of: "easy", "medium", or "hard"
6. WHEN saving a question, THE System SHALL ensure tags is an array of strings (can be empty)

### Requirement 30: Performance Charts

**User Story:** As a user, I want visual charts showing my progress, so that I can quickly understand my performance trends.

#### Acceptance Criteria

1. WHEN viewing the dashboard, THE System SHALL display a line chart showing score progression over the last 10 tests
2. THE System SHALL display a bar chart showing topic-wise accuracy percentages
3. THE System SHALL display a pie chart showing difficulty-wise performance distribution
4. THE System SHALL ensure charts are responsive and readable on all screen sizes
5. THE System SHALL update charts in real-time when new test results are added
