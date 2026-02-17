# Database Seed Script

This directory contains scripts for database management and seeding.

## Seed Script

The `seed.ts` script populates the database with sample data for development and testing purposes.

### What it creates:

1. **Users** (2 total):
   - 1 Admin user (email from `ADMIN_EMAIL` env variable)
   - 1 Regular user (user@example.com)

2. **Questions** (20 total):
   - Covering multiple topics: History, Geography, Polity, Economy, Science & Technology, Environment
   - Mixed difficulty levels: Easy, Medium, Hard
   - Each with 4 options, correct answer, explanation, and tags

3. **Test History** (1 sample test):
   - Completed test for the regular user
   - 10 questions with mixed correct/incorrect answers
   - Includes topic-wise and difficulty-wise performance data

4. **Bookmarks** (3 total):
   - Sample bookmarked questions for the regular user

### Usage:

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Make sure your `.env.local` file contains:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ADMIN_EMAIL=admin@example.com
   ```

3. **Run the seed script**:
   ```bash
   npm run seed
   ```

### Important Notes:

- ⚠️ **Warning**: This script will DELETE all existing data in the following collections:
  - Users
  - Questions
  - Tests
  - TestSessions
  - Bookmarks

- Only run this script in development environments
- The script will create sample data that you can use to test the application
- After seeding, you can log in with the created user accounts (using Google OAuth with the specified emails)

### Sample Data Overview:

**Topics covered:**
- History (Ancient, Medieval, Modern India)
- Geography (Physical, Climate, Economic)
- Polity (Constitution, Parliament, Judiciary)
- Economy (Banking, Budget, Economic Development)
- Science & Technology (Space, Physics, Biology)
- Environment (Ecology)

**Difficulty distribution:**
- Easy: ~60%
- Medium: ~30%
- Hard: ~10%

This distribution mirrors typical UPSC exam patterns.
