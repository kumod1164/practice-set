# Quick Start Guide

## Delete Dummy Questions

Run this command to clear all existing questions:

```bash
npm run clear-questions
```

## Add Real Questions

### Method 1: Bulk Import via Admin Panel (Recommended)

1. Prepare your questions in JSON format (see `scripts/real-questions-template.json`)
2. Go to `http://localhost:3000/admin/questions`
3. Click "Bulk Import" button
4. Upload your JSON file
5. Done!

### Method 2: Update Seed Script

1. Edit `scripts/seed.ts`
2. Replace the dummy questions with your real questions
3. Run: `npm run seed`

## Question Format

Each question must have:

```json
{
  "topic": "Main topic (e.g., Indian Polity)",
  "subtopic": "Specific subtopic (e.g., Constitution)",
  "question": "Your question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,  // Index: 0=A, 1=B, 2=C, 3=D
  "difficulty": "easy", // easy, medium, or hard
  "explanation": "Detailed explanation of the answer",
  "tags": ["tag1", "tag2"]  // Optional
}
```

## Available Topics

Common UPSC topics:
- Indian Polity
- Indian History
- Indian Geography
- Indian Economy
- Environment and Ecology
- Science and Technology
- Current Affairs
- International Relations
- Art and Culture
- Ethics and Integrity

## Deploy to Vercel

### Quick Deploy

1. Push to GitHub:
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables (copy from `.env.local`)
5. Deploy!

### Environment Variables Needed

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
ADMIN_EMAIL=kumodsharma1164@gmail.com
```

### After Deployment

1. Update Google OAuth redirect URI:
   - Add: `https://your-domain.vercel.app/api/auth/callback/google`

2. Update MongoDB Atlas IP whitelist:
   - Add: `0.0.0.0/0` (allow all IPs for Vercel)

## Testing Checklist

Before going live:
- [ ] Delete all dummy questions
- [ ] Add real questions (at least 50-100)
- [ ] Test login with Google
- [ ] Test creating a test
- [ ] Test taking a test
- [ ] Test submitting and viewing results
- [ ] Test admin panel
- [ ] Test on mobile devices
- [ ] Test dark/light theme

## Support

For detailed deployment instructions, see `DEPLOYMENT.md`
