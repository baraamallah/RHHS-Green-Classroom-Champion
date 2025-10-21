# RHHS Green Classroom Champion 🏆🌿

A live leaderboard web application for tracking classroom points with role-based authentication for Admins and Supervisors.

## Features

- **Public Leaderboard**: Anyone can view the live rankings without logging in
- **Admin Dashboard**: Full control to manage supervisors, classes, and points
- **Supervisor Dashboard**: Add or deduct points for classes with reasons
- **Real-time Updates**: Changes instantly reflect on all connected devices
- **Firebase Integration**: Cloud-based authentication and database

## Tech Stack

- HTML5 / CSS3
- Vanilla JavaScript
- Firebase Authentication
- Firebase Firestore (Database)

## Project Structure

```
RHHS-Green-Classroom-Champion/
├── index.html                       # Public leaderboard (landing page)
├── css/
│   └── styles.css                   # All application styles
├── js/
│   ├── firebase-config.js           # Firebase configuration (gitignored)
│   ├── firebase-config.example.js   # Firebase config template
│   ├── auth.js                      # Authentication & authorization
│   ├── admin-dashboard.js           # Admin functionality
│   └── supervisor-dashboard.js      # Supervisor functionality
├── pages/
│   ├── login.html                   # Staff login page
│   ├── admin-dashboard.html         # Admin control panel
│   └── supervisor-dashboard.html    # Supervisor points manager
├── firebase.json                    # Firebase hosting config
├── firestore.rules                  # Firestore security rules
├── firestore.indexes.json           # Firestore database indexes
├── storage.rules                    # Firebase storage rules
├── .gitignore                       # Git ignore file
└── README.md                        # This file
```

## Quick Start for GitHub

### Cloning the Repository

```bash
git clone https://github.com/YOUR_USERNAME/RHHS-Green-Classroom-Champion.git
cd RHHS-Green-Classroom-Champion
```

### Setting Up Your Firebase Config

1. Copy the example config file:
   ```bash
   cp js/firebase-config.example.js js/firebase-config.js
   ```

2. Edit `js/firebase-config.js` with your Firebase credentials

3. **IMPORTANT:** Never commit `js/firebase-config.js` (it's already in .gitignore)

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Save changes

### 3. Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **production mode** (we'll set rules next)
3. Choose a location close to your users

### 4. Set Firestore Security Rules

**Option A: Using Firebase Console**
1. Go to **Firestore Database** → **Rules**
2. Copy the contents from `firestore.rules` file in this repository
3. Paste and publish

**Option B: Using Firebase CLI**
```bash
firebase deploy --only firestore:rules
```

The rules in `firestore.rules` provide:
- Public read access to classes (for leaderboard)
- Admin-only user management
- Supervisor and admin can add points
- Public read access to points history (transparency)

### 5. Get Firebase Configuration

1. Go to **Project Settings** (gear icon) → **Your apps**
2. Click the web icon (`</>`)
3. Register your app
4. Copy the `firebaseConfig` object
5. Paste it into `firebase-config.js` (replace the placeholder values)

### 6. Create Initial Admin User

Since you need an admin to create supervisors, manually create the first admin:

1. Go to **Authentication** → **Users** → **Add user**
2. Add email and password (e.g., `admin@rhhs.edu`)
3. Copy the generated UID
4. Go to **Firestore Database** → **Start collection**
5. Collection ID: `users`
6. Document ID: (paste the UID from step 3)
7. Add fields:
   - `name` (string): `Admin`
   - `email` (string): `admin@rhhs.edu`
   - `role` (string): `admin`
   - `createdAt` (timestamp): (current time)

## Firestore Database Structure

### Collections

#### `users`
Stores user accounts and roles.

```javascript
{
  "uid": {
    "name": "John Doe",
    "email": "john@rhhs.edu",
    "role": "admin" | "supervisor",
    "createdAt": timestamp
  }
}
```

#### `classes`
Stores classroom information and points.

```javascript
{
  "classId": {
    "name": "Grade 9A",
    "teacher": "Ms. Smith",
    "points": 150,
    "createdAt": timestamp
  }
}
```

#### `pointsHistory`
Tracks all point additions/deductions.

```javascript
{
  "historyId": {
    "classId": "abc123",
    "className": "Grade 9A",
    "points": 10,
    "reason": "Excellent recycling efforts",
    "supervisorId": "xyz789",
    "supervisorName": "John Doe",
    "timestamp": timestamp
  }
}
```

## How to Run

### Option 1: Local Development

1. Install a local web server (e.g., Python's http.server):
   ```bash
   python -m http.server 8000
   ```

2. Open browser and navigate to:
   ```
   http://localhost:8000
   ```

### Option 2: Firebase Hosting (Production)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init
   ```
   - Select: Firestore, Hosting, Storage
   - Use existing project
   - Accept default file names (already configured in `firebase.json`)

4. Deploy everything:
   ```bash
   firebase deploy
   ```

5. Deploy specific services:
   ```bash
   firebase deploy --only hosting        # Deploy website only
   firebase deploy --only firestore      # Deploy rules & indexes
   firebase deploy --only storage        # Deploy storage rules
   ```

## Usage Guide

### Admin Workflow

1. Login at `/login.html` with admin credentials
2. Add supervisors from the Admin Dashboard
3. Create classes with teacher names
4. Monitor all points activity
5. Edit or delete classes/supervisors as needed

### Supervisor Workflow

1. Login at `/login.html` with supervisor credentials
2. Select a class from the dropdown
3. Enter points (positive or negative)
4. Provide a reason for the points
5. Submit and view the updated leaderboard

### Public Access

- Anyone can view the live leaderboard at the main page (`index.html`)
- No login required
- Updates in real-time when points change

## Customization

### Colors
Edit CSS variables in `styles.css`:

```css
:root {
  --primary-color: #2ecc71;      /* Main green */
  --secondary-color: #27ae60;    /* Darker green */
  --accent-color: #3498db;       /* Blue */
  --danger-color: #e74c3c;       /* Red */
}
```

### School Name
Update in HTML files (search for "RHHS").

## Troubleshooting

### Issue: "Permission denied" errors
- Check Firestore Security Rules
- Ensure user has correct role in `users` collection

### Issue: Real-time updates not working
- Verify Firebase config is correct
- Check browser console for errors
- Ensure Firestore has proper indexes (Firebase will suggest creating them)

### Issue: Login fails
- Verify Firebase Authentication is enabled
- Check that user exists in both Authentication and Firestore
- Ensure `users` collection document ID matches Authentication UID

## Security Notes

- Never commit `firebase-config.js` with real credentials to public repos
- Change default admin password immediately after setup
- Regularly audit user access and roles
- Use Firebase App Check for additional security in production

## License

MIT License - Feel free to modify and use for your school!

## Support

For issues or questions, contact your school's IT department.
