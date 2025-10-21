# Setup Guide - Quick Start

This guide will help you get your RHHS Green Classroom Champion app up and running on GitHub and Firebase.

## Prerequisites

- Git installed
- Node.js installed (for Firebase CLI)
- A Firebase account
- A GitHub account

## Step 1: Set Up Firebase Project

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it: `rhhs-classroom-champion`
4. Follow the wizard (Google Analytics optional)

### 1.2 Enable Firebase Authentication
1. In Firebase Console → **Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method

### 1.3 Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **Production mode**
4. Choose your region (closest to users)

### 1.4 Get Your Firebase Config
1. Go to **Project Settings** (⚙️ icon)
2. Scroll to "Your apps"
3. Click the web icon (`</>`)
4. Register app: `RHHS Classroom Champion`
5. Copy the `firebaseConfig` object

## Step 2: Prepare Local Project

### 2.1 Copy Firebase Config
1. Open `js/firebase-config.js`
2. Replace the placeholder values with your Firebase config:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "rhhs-classroom-champion.firebaseapp.com",
  projectId: "rhhs-classroom-champion",
  storageBucket: "rhhs-classroom-champion.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 2.2 Deploy Firebase Rules
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select Firestore, Hosting, Storage)
firebase init

# Deploy rules and indexes
firebase deploy --only firestore,storage
```

## Step 3: Create Admin User

Since you need an admin to create other users, manually create the first one:

### 3.1 Create Auth User
1. Firebase Console → **Authentication** → **Users**
2. Click "Add user"
3. Email: `admin@rhhs.edu`
4. Password: (choose a secure password)
5. Click "Add user"
6. **Copy the UID** shown in the user list

### 3.2 Create Firestore User Document
1. Go to **Firestore Database**
2. Start collection: `users`
3. Document ID: (paste the UID from 3.1)
4. Add fields:
   - `name` (string): `Admin`
   - `email` (string): `admin@rhhs.edu`
   - `role` (string): `admin`
   - `createdAt` (timestamp): Click "Set to current time"
5. Save

## Step 4: Push to GitHub

### 4.1 Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name: `RHHS-Green-Classroom-Champion`
4. Description: `Live leaderboard for classroom points`
5. Public or Private (your choice)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

### 4.2 Push Your Code
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: RHHS Green Classroom Champion"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/RHHS-Green-Classroom-Champion.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Deploy to Firebase Hosting

### 5.1 Deploy Manually
```bash
# Deploy everything
firebase deploy

# Your site will be live at:
# https://rhhs-classroom-champion.web.app
```

### 5.2 Set Up Automatic Deployment (Optional)

To deploy automatically when you push to GitHub:

1. Generate Firebase token:
   ```bash
   firebase login:ci
   ```
   Copy the token shown

2. Add secrets to GitHub:
   - Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Click "New repository secret"
   - Add these secrets:
     - `FIREBASE_TOKEN` (from step 1)
     - `FIREBASE_API_KEY` (from your firebase config)
     - `FIREBASE_AUTH_DOMAIN`
     - `FIREBASE_PROJECT_ID`
     - `FIREBASE_STORAGE_BUCKET`
     - `FIREBASE_MESSAGING_SENDER_ID`
     - `FIREBASE_APP_ID`

3. Now every push to `main` branch will auto-deploy!

## Step 6: Test Your App

### 6.1 Test Public Leaderboard
1. Visit your Firebase hosting URL
2. Should see empty leaderboard (no classes yet)

### 6.2 Test Admin Login
1. Click "Staff Login"
2. Login with admin credentials
3. Should redirect to admin dashboard

### 6.3 Create Test Data
1. In Admin Dashboard, add a supervisor
2. Add some classes
3. Logout

### 6.4 Test Supervisor
1. Login with supervisor credentials
2. Add points to a class
3. Check the public leaderboard updates

## Step 7: Customize

### 7.1 Change Colors
Edit `css/styles.css`:
```css
:root {
  --primary-color: #2ecc71;      /* Your school color */
  --secondary-color: #27ae60;
  --accent-color: #3498db;
}
```

### 7.2 Change School Name
Search and replace "RHHS" in all HTML files with your school name.

### 7.3 Add Logo
1. Add your logo image to root folder
2. Update `index.html`:
```html
<span class="logo">
  <img src="your-logo.png" alt="School Logo" height="40">
</span>
```

## Troubleshooting

### "Permission denied" errors
- Check Firestore rules are deployed: `firebase deploy --only firestore`
- Verify user has correct role in Firestore

### Login not working
- Verify Firebase config is correct
- Check browser console for errors
- Ensure Authentication is enabled in Firebase

### Real-time updates not working
- Check browser console
- Verify Firestore indexes are created
- Firebase will auto-create missing indexes

### GitHub Actions failing
- Verify all secrets are set correctly
- Check the Actions tab for detailed logs

## Security Checklist

- [ ] `js/firebase-config.js` is in `.gitignore`
- [ ] Firebase rules are deployed
- [ ] Admin password is strong
- [ ] Only trusted users have admin access
- [ ] Firebase App Check enabled (optional, for production)

## Next Steps

1. Add more supervisors via Admin Dashboard
2. Create classes for all classrooms
3. Train supervisors on adding points
4. Display leaderboard on school monitors/website
5. Regular backups of Firestore data

## Getting Help

- Check [README.md](README.md) for detailed documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub
- Review Firebase documentation

---

**Congratulations!** Your leaderboard is now live! 🎉

Visit: `https://YOUR-PROJECT-ID.web.app`
