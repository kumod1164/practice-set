# Deployment Guide - UPSC Practice Platform

## Prerequisites
- MongoDB Atlas account (already set up)
- Vercel account (free tier works)
- Google OAuth credentials (already configured)

## Step 1: Prepare Environment Variables

Make sure you have these environment variables ready:

```env
# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Admin Email
ADMIN_EMAIL=kumodsharma1164@gmail.com
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and add environment variables when asked

### Option B: Deploy via Vercel Dashboard (Recommended)

1. Push your code to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
6. Add Environment Variables (from your .env.local):
   - MONGODB_URI
   - NEXTAUTH_URL (use your Vercel domain)
   - NEXTAUTH_SECRET
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - ADMIN_EMAIL
7. Click "Deploy"

## Step 3: Update Google OAuth Settings

After deployment, update your Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client ID
4. Add Authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`
5. Save changes

## Step 4: Update MongoDB Atlas IP Whitelist

1. Go to MongoDB Atlas
2. Network Access
3. Add IP Address: `0.0.0.0/0` (allow all) for Vercel
   - Or use Vercel's IP ranges if you want more security

## Step 5: Generate NEXTAUTH_SECRET

If you need a new secret:
```bash
openssl rand -base64 32
```

## Step 6: Test Deployment

1. Visit your deployed URL
2. Test login with Google
3. Test creating a test
4. Test admin features

## Troubleshooting

### Build Errors
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `dependencies` (not `devDependencies`)

### Authentication Issues
- Verify NEXTAUTH_URL matches your domain
- Check Google OAuth redirect URIs
- Verify NEXTAUTH_SECRET is set

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify MONGODB_URI is correct
- Check MongoDB Atlas cluster is running

## Alternative Deployment Options

### Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Add environment variables
4. Deploy

### Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. New site from Git
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables

## Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] Google login works
- [ ] Admin can access admin panel
- [ ] Users can create and take tests
- [ ] Results page displays correctly
- [ ] Analytics work properly
- [ ] Dark/light theme toggle works
- [ ] Mobile responsive design works

## Updating After Deployment

To update your deployed app:

1. Make changes locally
2. Test locally: `npm run dev`
3. Commit changes: `git commit -am "Your message"`
4. Push to GitHub: `git push`
5. Vercel will automatically redeploy

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/db |
| NEXTAUTH_URL | Your app URL | https://your-app.vercel.app |
| NEXTAUTH_SECRET | Random secret key | generated with openssl |
| GOOGLE_CLIENT_ID | Google OAuth client ID | xxx.apps.googleusercontent.com |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | GOCSPX-xxx |
| ADMIN_EMAIL | Admin user email | admin@example.com |

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Check MongoDB Atlas connection
