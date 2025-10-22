# Deployment Summary

## What's Configured

✅ **GitHub Pages** - Your app will be hosted on GitHub Pages (free)  
✅ **Automatic Deployment** - Pushes to `main` branch auto-deploy  
✅ **Secure Credentials** - Firebase config generated from GitHub Secrets  
✅ **No Firebase Hosting** - Only using Firebase for Auth + Database

## Architecture

```
GitHub Pages (Hosting)
    ↓
Your Static Web App (HTML/CSS/JS)
    ↓
Firebase Services:
    - Authentication (Email/Password)
    - Firestore Database (Real-time data)
```

## Quick Start

### 1. Get Firebase Credentials
Firebase Console → Project Settings → Your apps → Web app

Copy these 6 values:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`

### 2. Push to GitHub
```bash
git add .
git commit -m "Ready for GitHub Pages"
git push origin main
```

### 3. Add GitHub Secrets
Repository → Settings → Secrets and variables → Actions

Add 6 secrets (one for each Firebase credential):
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`

### 4. Enable GitHub Pages
Repository → Settings → Pages → Source: **GitHub Actions**

### 5. Deploy Firestore Rules
```bash
firebase login
firebase init  # Select Firestore only
firebase deploy --only firestore
```

### 6. Create Admin User
Firebase Console → Authentication → Add user → Copy UID

Firebase Console → Firestore → Create collection `users` → Add document with UID:
```json
{
  "name": "Admin",
  "email": "admin@rhhs.edu",
  "role": "admin",
  "createdAt": <current timestamp>
}
```

## Your App URL

```
https://YOUR_USERNAME.github.io/RHHS-Green-Classroom-Champion/
```

## Files Created/Modified

- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
- ✅ `.nojekyll` - Ensures GitHub Pages serves all files
- ✅ `GITHUB_PAGES_SETUP.md` - Detailed deployment guide
- ✅ `index.html` - Fixed paths for GitHub Pages
- ❌ Removed `firebase-deploy.yml` - Not using Firebase Hosting

## What Happens on Push

1. GitHub Actions triggers
2. Checks out your code
3. Creates `js/firebase-config.js` from secrets
4. Deploys to GitHub Pages
5. Your site is live!

## Cost

- **GitHub Pages**: FREE (for public repos)
- **Firebase Auth**: FREE (up to 10K users/month)
- **Firebase Firestore**: FREE (up to 50K reads/day, 20K writes/day)

## Support

- Full guide: `GITHUB_PAGES_SETUP.md`
- Firebase setup: `SETUP.md`
- App documentation: `README.md`
