# GitHub Pages Deployment Guide

This guide will help you deploy the RHHS Green Classroom Champion app to GitHub Pages with automatic deployment.

**Note:** This app uses GitHub Pages for hosting (not Firebase Hosting). Firebase is only used for Authentication and Firestore Database.

## Prerequisites

- A GitHub account
- A Firebase project (see [SETUP.md](SETUP.md) for Firebase setup)
- Git installed on your computer

## Step 1: Prepare Your Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create or select your project
3. Enable **Authentication** → **Email/Password**
4. Create **Firestore Database** in production mode
5. Get your Firebase config:
   - Go to **Project Settings** (⚙️ icon)
   - Scroll to "Your apps" → Click web icon (`</>`)
   - Copy these values (you'll need them for GitHub Secrets):
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`

## Step 2: Deploy Firestore Rules

You need to deploy the security rules before your app will work:

```bash
# Install Firebase CLI (if not already installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project directory
firebase init

# Select: Firestore only (NOT Hosting - we're using GitHub Pages)
# Use existing project: select your Firebase project
# Accept default file names

# Deploy Firestore rules and indexes
firebase deploy --only firestore
```

## Step 3: Create Initial Admin User

1. Go to Firebase Console → **Authentication** → **Users**
2. Click "Add user"
3. Email: `admin@rhhs.edu` (or your preferred admin email)
4. Password: (choose a secure password)
5. Click "Add user" and **copy the UID**

6. Go to **Firestore Database**
7. Start collection: `users`
8. Document ID: (paste the UID from step 5)
9. Add fields:
   - `name` (string): `Admin`
   - `email` (string): `admin@rhhs.edu`
   - `role` (string): `admin`
   - `createdAt` (timestamp): Click "Set to current time"
10. Save

## Step 4: Push to GitHub

### Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `RHHS-Green-Classroom-Champion` (or your preferred name)
3. Make it **Public** (required for free GitHub Pages)
4. **Don't** initialize with README (you already have one)

### Push Your Code

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: RHHS Green Classroom Champion"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/RHHS-Green-Classroom-Champion.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Configure GitHub Secrets

Your Firebase credentials need to be stored as GitHub Secrets (not in your code!):

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets one by one:

| Secret Name | Value |
|-------------|-------|
| `FIREBASE_API_KEY` | Your Firebase `apiKey` |
| `FIREBASE_AUTH_DOMAIN` | Your Firebase `authDomain` |
| `FIREBASE_PROJECT_ID` | Your Firebase `projectId` |
| `FIREBASE_STORAGE_BUCKET` | Your Firebase `storageBucket` |
| `FIREBASE_MESSAGING_SENDER_ID` | Your Firebase `messagingSenderId` |
| `FIREBASE_APP_ID` | Your Firebase `appId` |

**Example:**
- Name: `FIREBASE_API_KEY`
- Secret: `AIzaSyC1234567890abcdefghijklmnopqrstuv`

## Step 6: Enable GitHub Pages

1. Go to your repository → **Settings** → **Pages**
2. Under "Build and deployment":
   - Source: **GitHub Actions**
3. Save

## Step 7: Deploy

The app will automatically deploy when you push to the `main` branch!

### Manual Deployment

You can also trigger deployment manually:
1. Go to **Actions** tab
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

### Check Deployment Status

1. Go to **Actions** tab
2. You'll see the deployment workflow running
3. Once complete (green checkmark), your site is live!

## Step 8: Access Your App

Your app will be available at:
```
https://YOUR_USERNAME.github.io/RHHS-Green-Classroom-Champion/
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 9: Update Firestore Rules for GitHub Pages

Update your `firestore.rules` to allow your GitHub Pages domain:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ... existing rules ...
  }
}
```

Then deploy:
```bash
firebase deploy --only firestore:rules
```

## Testing Your Deployment

1. **Test Public Leaderboard**
   - Visit your GitHub Pages URL
   - Should see the leaderboard (empty if no classes yet)

2. **Test Admin Login**
   - Click "Admin Login"
   - Use the admin credentials you created
   - Should redirect to admin dashboard

3. **Create Test Data**
   - Add a supervisor
   - Add some classes
   - Add points to classes

4. **Verify Real-time Updates**
   - Open leaderboard in two browser tabs
   - Add points in one tab
   - Should update in the other tab immediately

## Troubleshooting

### "Permission denied" errors
- Ensure Firestore rules are deployed: `firebase deploy --only firestore`
- Check that rules allow public read access to `classes` collection

### Login not working
- Verify all GitHub Secrets are set correctly
- Check browser console for errors
- Ensure Firebase Authentication is enabled

### App not loading
- Check GitHub Actions for deployment errors
- Verify GitHub Pages is enabled in repository settings
- Clear browser cache and try again

### Real-time updates not working
- Check browser console for errors
- Verify Firebase config is correct in GitHub Secrets
- Ensure Firestore indexes are created (Firebase will auto-create them)

## Updating Your App

To update your app after making changes:

```bash
# Make your changes to the code
git add .
git commit -m "Description of changes"
git push

# GitHub Actions will automatically redeploy!
```

## Security Best Practices

- ✅ Firebase credentials are stored as GitHub Secrets (not in code)
- ✅ `js/firebase-config.js` is gitignored (never committed)
- ✅ Firestore rules restrict write access to authenticated users
- ✅ Admin and supervisor roles are enforced in Firestore rules
- ⚠️ Change default admin password immediately
- ⚠️ Use strong passwords for all accounts
- ⚠️ Regularly audit user access and roles

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to your repository root:
   ```
   your-domain.com
   ```

2. Configure DNS with your domain provider:
   - Add a CNAME record pointing to `YOUR_USERNAME.github.io`

3. Go to GitHub repository → **Settings** → **Pages**
4. Enter your custom domain
5. Enable "Enforce HTTPS"

## Support

- Check [README.md](README.md) for app documentation
- Check [SETUP.md](SETUP.md) for detailed Firebase setup
- Review GitHub Actions logs for deployment issues
- Check Firebase Console for authentication/database issues

---

**Congratulations!** Your app is now live on GitHub Pages! 🎉

Visit: `https://YOUR_USERNAME.github.io/RHHS-Green-Classroom-Champion/`
