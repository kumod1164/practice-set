# Upload Questions Guide

## Quick Steps

### 1. Prepare Your JSON Files

Place your 5 JSON files (with 30 questions each) in the `scripts/questions/` folder.

Example structure:
```
scripts/
  questions/
    polity-questions.json      (30 questions)
    history-questions.json     (30 questions)
    geography-questions.json   (30 questions)
    economy-questions.json     (30 questions)
    science-questions.json     (30 questions)
```

### 2. Run the Upload Script

```bash
npm run upload-questions
```

That's it! The script will:
- ✅ Delete all existing dummy questions
- ✅ Upload all 5 JSON files
- ✅ Show a summary of uploaded questions

## What the Script Does

1. **Connects to MongoDB** - Uses your `.env.local` credentials
2. **Deletes existing questions** - Removes all dummy data
3. **Validates each JSON file** - Checks format and required fields
4. **Uploads questions** - Inserts all questions into database
5. **Shows summary** - Reports success/failure for each file

## JSON Format Example

```json
[
  {
    "topic": "Indian Polity",
    "subtopic": "Constitution",
    "question": "Which article deals with Right to Equality?",
    "options": [
      "Article 14",
      "Article 19",
      "Article 21",
      "Article 32"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Article 14 guarantees equality before law.",
    "tags": ["constitution", "fundamental-rights"]
  },
  {
    "topic": "Indian History",
    "subtopic": "Ancient India",
    "question": "When was Indus Valley Civilization discovered?",
    "options": [
      "1921",
      "1924",
      "1947",
      "1950"
    ],
    "correctAnswer": 0,
    "difficulty": "medium",
    "explanation": "Discovered in 1921 at Harappa.",
    "tags": ["ancient-india", "archaeology"]
  }
]
```

## Validation Rules

The script validates:
- ✅ File is valid JSON
- ✅ Contains an array of questions
- ✅ Each question has all required fields
- ✅ Exactly 4 options per question
- ✅ correctAnswer is 0-3
- ✅ difficulty is "easy", "medium", or "hard"

## Expected Output

```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

🗑️  Step 1: Deleting all existing questions...
   Found 20 existing questions
   ✅ Deleted 20 questions

📤 Step 2: Uploading new questions...

   Found 5 JSON file(s):

   📄 Processing: polity-questions.json
      ✅ Uploaded 30 questions

   📄 Processing: history-questions.json
      ✅ Uploaded 30 questions

   📄 Processing: geography-questions.json
      ✅ Uploaded 30 questions

   📄 Processing: economy-questions.json
      ✅ Uploaded 30 questions

   📄 Processing: science-questions.json
      ✅ Uploaded 30 questions

============================================================
📊 UPLOAD SUMMARY
============================================================
Total files processed: 5
Successful uploads: 5
Failed uploads: 0
Total questions uploaded: 150
============================================================

✨ Upload process completed!

🎉 Success! Your questions are now in the database.
   You can now:
   1. Start your dev server: npm run dev
   2. Login as admin
   3. View questions at: http://localhost:3000/admin/questions
   4. Create and take tests!
```

## Troubleshooting

### Error: "scripts/questions directory not found"
**Solution**: Create the folder and add your JSON files
```bash
mkdir scripts/questions
# Then add your JSON files to this folder
```

### Error: "No JSON files found"
**Solution**: Make sure your files have `.json` extension and are in `scripts/questions/` folder

### Error: "Invalid question at index X"
**Solution**: Check that question has all required fields and correct format

### Error: "Cannot connect to MongoDB"
**Solution**: 
- Check `.env.local` has correct MONGODB_URI
- Ensure MongoDB Atlas is running
- Check IP whitelist in MongoDB Atlas

## After Upload

1. Start dev server: `npm run dev`
2. Login as admin: `http://localhost:3000/login`
3. View questions: `http://localhost:3000/admin/questions`
4. Create a test: `http://localhost:3000/test/configure`

## Need to Re-upload?

Just run the script again:
```bash
npm run upload-questions
```

It will delete old questions and upload fresh ones.

## Alternative: Manual Upload via Admin Panel

If you prefer, you can also:
1. Go to `http://localhost:3000/admin/questions`
2. Click "Bulk Import"
3. Upload each JSON file one by one

But the script is faster for multiple files!
