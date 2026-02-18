# Vercel Environment Variables

Copy these exact values when deploying to Vercel:

---

## IMPORTANT: Get Your Actual Values

**For Google OAuth credentials:**
- Go to your `.env.local` file (NOT committed to Git)
- Copy your actual `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Use those values in Vercel

---

## 1. MONGODB_URI
```
mongodb+srv://upsc_admin:XHXFKhRnxSrIQ2m8@upsc-cluster.fu9kuo4.mongodb.net/upsc-practice?retryWrites=true&w=majority&appName=upsc-cluster
```

---

## 2. NEXTAUTH_URL
**IMPORTANT**: Replace `your-app-name` with your actual Vercel domain

```
https://your-app-name.vercel.app
```

Example: `https://upsc-practice-platform.vercel.app`

---

## 3. NEXTAUTH_SECRET
**IMPORTANT**: Generate a new secret for production

Run this command in your terminal to generate a secure secret:
```bash
openssl rand -base64 32
```

Or use this pre-generated one (recommended to generate your own):
```
dGhpc2lzYXNlY3VyZXNlY3JldGtleWZvcnByb2R1Y3Rpb24=
```

---

## 4. GOOGLE_CLIENT_ID
```
YOUR_GOOGLE_CLIENT_ID_HERE
```

---

## 5. GOOGLE_CLIENT_SECRET
```
YOUR_GOOGLE_CLIENT_SECRET_HERE
```

---

## 6. ADMIN_EMAIL
```
kumodsharma1164@gmail.com
```

---

## Step-by-Step: Adding to Vercel

### During Initial Deployment:

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Click "Environment Variables" section
5. Add each variable:
   - **Name**: `MONGODB_URI`
   - **Value**: (paste the MongoDB URI above)
   - Click "Add"
6. Repeat for all 6 variables
7. Click "Deploy"

### After Deployment (if you forgot):

1. Go to your project in Vercel
2. Click "Settings" tab
3. Click "Environment Variables" in sidebar
4. Click "Add New"
5. Add each variable one by one
6. After adding all, go to "Deployments" tab
7. Click "..." on latest deployment → "Redeploy"

---

## CRITICAL: Update Google OAuth After Deployment

After your app is deployed, you MUST update Google OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to: **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   ```
   https://your-app-name.vercel.app/api/auth/callback/google
   ```
   (Replace `your-app-name` with your actual Vercel domain)
5. Click "Save"

---

## CRITICAL: Update MongoDB Atlas IP Whitelist

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click on your cluster
3. Click "Network Access" in left sidebar
4. Click "Add IP Address"
5. Select "Allow Access from Anywhere"
6. Or add: `0.0.0.0/0`
7. Click "Confirm"

**Note**: This allows Vercel's dynamic IPs to connect. For better security, you can use Vercel's IP ranges, but `0.0.0.0/0` is simpler and commonly used.

---

## Quick Copy-Paste Format for Vercel

```env
MONGODB_URI=mongodb+srv://upsc_admin:XHXFKhRnxSrIQ2m8@upsc-cluster.fu9kuo4.mongodb.net/upsc-practice?retryWrites=true&w=majority&appName=upsc-cluster

NEXTAUTH_URL=https://your-app-name.vercel.app

NEXTAUTH_SECRET=dGhpc2lzYXNlY3VyZXNlY3JldGtleWZvcnByb2R1Y3Rpb24=

GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE

GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE

ADMIN_EMAIL=kumodsharma1164@gmail.com
```

---

## Verification Checklist

After deployment, verify:

- [ ] App loads at your Vercel URL
- [ ] Landing page displays correctly
- [ ] Google login works (after updating OAuth redirect URI)
- [ ] Dashboard loads after login
- [ ] Can create and take tests
- [ ] Admin panel works (for admin email)
- [ ] Questions display correctly
- [ ] Results page works
- [ ] Dark/light theme toggle works

---

## Troubleshooting

### "Invalid redirect URI" error
- Update Google OAuth redirect URI with your Vercel domain

### "Cannot connect to MongoDB"
- Check MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Verify MONGODB_URI is correct

### "Authentication error"
- Verify NEXTAUTH_URL matches your Vercel domain exactly
- Check NEXTAUTH_SECRET is set

### Build fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`

---

## Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure Google OAuth and MongoDB Atlas are configured properly
