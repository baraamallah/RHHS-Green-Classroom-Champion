# Quick Reference Card

## 🚀 Common Commands

### Firebase Deployment
```bash
# Deploy everything
firebase deploy

# Deploy only hosting (website)
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore

# Deploy only Storage rules
firebase deploy --only storage
```

### Git Commands
```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
```

### Local Development
```bash
# Start local server (Python)
python -m http.server 8000

# Start local server (Node.js)
npx http-server -p 8000

# Open in browser
# http://localhost:8000
```

## 📂 File Structure Quick Reference

```
Root Level:
├── index.html              → Public leaderboard (main page)
├── css/styles.css          → All styling
├── js/                     → All JavaScript
│   ├── firebase-config.js  → Your Firebase credentials (GITIGNORED)
│   ├── auth.js            → Login/logout logic
│   ├── admin-dashboard.js  → Admin functions
│   └── supervisor-dashboard.js → Supervisor functions
└── pages/                  → Internal pages
    ├── login.html
    ├── admin-dashboard.html
    └── supervisor-dashboard.html
```

## 🔑 User Roles

### Admin Can:
- ✅ Create/delete supervisors
- ✅ Create/edit/delete classes
- ✅ View all activity
- ✅ Manually adjust points

### Supervisor Can:
- ✅ Add points to classes
- ✅ Deduct points from classes
- ✅ View current leaderboard
- ✅ See their activity history

### Public Can:
- ✅ View live leaderboard
- ❌ No login required

## 🔥 Firebase Collections

### `users` Collection
```
users/{userId}
  - name: string
  - email: string
  - role: "admin" | "supervisor"
  - createdAt: timestamp
```

### `classes` Collection
```
classes/{classId}
  - name: string
  - teacher: string
  - points: number
  - createdAt: timestamp
```

### `pointsHistory` Collection
```
pointsHistory/{historyId}
  - classId: string
  - className: string
  - points: number (can be negative)
  - reason: string
  - supervisorId: string
  - supervisorName: string
  - timestamp: timestamp
```

## 🛠️ Common Tasks

### Add First Admin User
1. Firebase Console → Authentication → Add User
2. Copy the UID
3. Firestore → Create `users` collection
4. Add document with that UID
5. Set fields: name, email, role: "admin", createdAt

### Change Colors
Edit `css/styles.css`:
```css
:root {
  --primary-color: #2ecc71;
  --secondary-color: #27ae60;
  --accent-color: #3498db;
}
```

### Update Firebase Config
1. Get config from Firebase Console
2. Edit `js/firebase-config.js`
3. Replace values in `firebaseConfig` object
4. Never commit this file!

### Deploy to GitHub
```bash
git add .
git commit -m "Description of changes"
git push
```

### Reset Points for a Class
1. Admin Dashboard
2. Edit Class
3. Change points to 0
4. Save

## 🐛 Troubleshooting

### Can't Login
- Check Firebase Authentication is enabled
- Check user exists in both Auth and Firestore
- Check role is set correctly in Firestore

### "Permission Denied" Errors
- Deploy Firestore rules: `firebase deploy --only firestore`
- Check user role in Firestore
- Verify rules allow the operation

### Real-time Updates Not Working
- Check browser console for errors
- Verify Firestore indexes exist
- Try refreshing the page

### Changes Not Appearing After Deployment
- Clear browser cache (Ctrl+Shift+R)
- Wait a few minutes for CDN
- Check Firebase Hosting console

## 📱 URLs

### Local Development
```
http://localhost:8000
http://localhost:8000/pages/login.html
```

### Production (Replace with your project)
```
https://YOUR-PROJECT-ID.web.app
https://YOUR-PROJECT-ID.web.app/pages/login.html
```

### Firebase Console
```
https://console.firebase.google.com/project/YOUR-PROJECT-ID
```

## 🔐 Security Reminders

- ❌ Never commit `js/firebase-config.js`
- ❌ Never share admin credentials
- ✅ Always use strong passwords
- ✅ Deploy Firestore rules
- ✅ Review user access regularly

## 📞 Getting Help

1. Check `README.md` for details
2. Check `SETUP.md` for step-by-step
3. Check `CONTRIBUTING.md` for dev info
4. Check browser console for errors
5. Open GitHub Issue

## 💡 Tips

- Test in incognito mode to check public view
- Use different browsers for testing roles
- Export Firestore data regularly as backup
- Monitor Firebase usage in console
- Keep admin credentials secure

---

**Save this file for quick access!** 📌
