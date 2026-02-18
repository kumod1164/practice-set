# Questions Directory

Place your 5 JSON files with questions here.

## File Structure

You can name your files anything, for example:
- `polity-questions.json` (30 questions)
- `history-questions.json` (30 questions)
- `geography-questions.json` (30 questions)
- `economy-questions.json` (30 questions)
- `science-questions.json` (30 questions)

## JSON Format

Each file should contain an array of questions:

```json
[
  {
    "topic": "Indian Polity",
    "subtopic": "Constitution",
    "question": "Your question text here?",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswer": 0,
    "difficulty": "easy",
    "explanation": "Detailed explanation of the correct answer",
    "tags": ["tag1", "tag2"]
  }
]
```

## Required Fields

- `topic` - Main subject (e.g., "Indian Polity")
- `subtopic` - Specific topic (e.g., "Constitution")
- `question` - The question text
- `options` - Array of exactly 4 options
- `correctAnswer` - Index of correct option (0=A, 1=B, 2=C, 3=D)
- `difficulty` - Must be "easy", "medium", or "hard"
- `explanation` - Explanation of the correct answer

## Optional Fields

- `tags` - Array of tags for categorization

## After Adding Files

Run the upload script:
```bash
npm run upload-questions
```

This will:
1. Delete all existing questions
2. Upload all JSON files from this directory
3. Show a summary of uploaded questions
