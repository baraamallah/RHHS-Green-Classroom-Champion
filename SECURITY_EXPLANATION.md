# 🔒 Security System Explained

## How Access Control Works

Your app has **multiple layers of security** to ensure only authorized users can access each dashboard.

---

## 🛡️ Security Layers

### Layer 1: Firebase Authentication
```
Only users created by Admin can login
❌ No public registration
❌ No self-signup
✅ Admin creates accounts only
```

### Layer 2: Firestore User Document
```
Each user MUST have a document in Firestore with:
- uid: matches Firebase Auth
- role: "admin" or "supervisor"
- email, name, createdAt
```

### Layer 3: Login Validation
```javascript
// When user tries to login:
1. Check Firebase Auth credentials ✓
2. Check if user exists in Firestore ✓
3. Check user role ✓
4. Redirect to correct dashboard based on role ✓
```

### Layer 4: Page Protection
```javascript
// Every protected page checks:
1. Is user logged in? ✓
2. Does user have correct role for this page? ✓
3. If wrong role → kicked out ✓
```

### Layer 5: Database Rules
```javascript
// Firestore rules enforce at database level:
- Only admins can create users ✓
- Only admins can delete users ✓
- Users can only read their own data ✓
```

---

## 📋 Step-by-Step: How It Works

### Adding a New Supervisor (Admin Only)

```
Admin Dashboard → Add Supervisor Button → Form

Admin enters:
├── Name: "John Doe"
├── Email: "john@school.edu"
└── Password: "SecurePass123"

System creates:
1. Firebase Auth account (email + password)
2. Firestore user document with role: "supervisor"

Result: John can now login with his unique credentials
```

### What Happens When Supervisor Tries to Login?

```
1. Supervisor enters email + password on login page
   ↓
2. Firebase checks credentials
   ├── ✅ Correct → continue
   └── ❌ Wrong → "Login failed"
   ↓
3. System checks Firestore for user document
   ├── ✅ Exists → continue
   └── ❌ Missing → "User profile not found"
   ↓
4. System reads user role
   ├── role: "supervisor" → redirect to supervisor dashboard
   ├── role: "admin" → redirect to admin dashboard
   └── other → "Invalid user role"
```

### What if Supervisor Tries to Access Admin Dashboard?

```
Supervisor types: /pages/admin-dashboard.html
   ↓
System checks: checkAuth('admin')
   ↓
Checks user's role in database: "supervisor"
   ↓
"supervisor" ≠ "admin"
   ↓
🚫 Access Denied!
   ↓
Redirected back to login page
Alert: "Access denied. You do not have permission to view this page."
```

### What if Someone Without Account Tries to Login?

```
Random person enters any email + password
   ↓
Firebase Authentication checks
   ↓
❌ User doesn't exist in Firebase Auth
   ↓
Error: "Login failed. Please check your credentials."
   ↓
Cannot proceed
```

---

## 🔐 Security Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| No Public Registration | ✅ | Only admin can create accounts |
| Unique Credentials | ✅ | Each user has their own email/password |
| Role-Based Access | ✅ | Admin and Supervisor have different access |
| Page Protection | ✅ | Each dashboard checks user role |
| Database Security | ✅ | Firestore rules enforce permissions |
| Session Management | ✅ | Users stay logged in until logout |
| Auto-Redirect | ✅ | Users sent to correct dashboard based on role |

---

## 👥 User Management Flow

### Creating Users (Admin Only)

```
Admin Dashboard
    ↓
"Add Supervisor" button
    ↓
Fill form:
├── Name
├── Email (becomes username)
└── Password (supervisor will use this)
    ↓
Click "Add Supervisor"
    ↓
System creates:
1. Firebase Auth user
2. Firestore user document
    ↓
✅ New supervisor can now login!
```

### Deleting Users (Admin Only)

```
Admin Dashboard
    ↓
"Manage Supervisors" section
    ↓
Click "Delete" on a supervisor
    ↓
Confirm deletion
    ↓
System removes:
1. Firestore user document
    ↓
✅ User can no longer login
(Firebase Auth user should be deleted manually in Firebase Console)
```

---

## 🎯 Example Scenario

### School Setup:

**Admin Account:**
- Email: `admin@school.edu`
- Password: `AdminPass123`
- Role: `admin`
- Can access: Admin Dashboard

**Supervisor 1:**
- Email: `teacher1@school.edu`
- Password: `Teacher1Pass`
- Role: `supervisor`
- Can access: Supervisor Dashboard

**Supervisor 2:**
- Email: `teacher2@school.edu`
- Password: `Teacher2Pass`
- Role: `supervisor`
- Can access: Supervisor Dashboard

### What Each Can Do:

**Admin (admin@school.edu):**
- ✅ Login to admin dashboard
- ✅ Create new supervisors
- ✅ Delete supervisors
- ✅ Create classes
- ✅ Edit classes
- ✅ Delete classes
- ✅ View all activity
- ✅ Manually adjust points
- ❌ Cannot access supervisor dashboard (wrong role)

**Supervisor 1 (teacher1@school.edu):**
- ✅ Login to supervisor dashboard
- ✅ Add points to classes
- ✅ Deduct points from classes
- ✅ View leaderboard
- ✅ See their own activity
- ❌ Cannot create other supervisors
- ❌ Cannot create/delete classes
- ❌ Cannot access admin dashboard

**Supervisor 2 (teacher2@school.edu):**
- ✅ Same permissions as Supervisor 1
- ✅ Has separate login credentials
- ✅ Activity tracked separately
- ❌ Cannot see Supervisor 1's activity
- ❌ Cannot access admin dashboard

**Public (no login):**
- ✅ View leaderboard only
- ❌ Cannot login
- ❌ Cannot make any changes

---

## 🚫 What CANNOT Happen

❌ Supervisor cannot create another supervisor
❌ Supervisor cannot access admin dashboard
❌ Supervisor cannot delete classes
❌ Anyone cannot register themselves
❌ Public cannot add points
❌ Deleted users cannot login
❌ Users without Firestore document cannot proceed
❌ Wrong credentials cannot login

---

## ✅ What IS Protected

### Code Level Protection (auth.js):
```javascript
// Lines 78-83: Role check on every protected page
if (requiredRole && role !== requiredRole) {
  alert('Access denied. You do not have permission to view this page.');
  window.location.href = '../pages/login.html';
  return;
}
```

### Database Level Protection (firestore.rules):
```javascript
// Lines 38-44: Only admins can manage users
match /users/{userId} {
  allow read: if isAuthenticated() && request.auth.uid == userId;
  allow create, update, delete: if isAdmin();
}
```

---

## 🔧 Testing Security

### Test 1: Try accessing admin dashboard as supervisor
1. Login as supervisor
2. Manually type: `/pages/admin-dashboard.html`
3. ✅ Should be denied and redirected

### Test 2: Try logging in without account
1. Enter random email/password
2. ✅ Should show "Login failed"

### Test 3: Try accessing supervisor dashboard as admin
1. Login as admin
2. Manually type: `/pages/supervisor-dashboard.html`
3. ✅ Should be denied and redirected

### Test 4: Try creating user as supervisor
1. Login as supervisor
2. Open browser console
3. Try: `db.collection('users').add({...})`
4. ✅ Should fail with "Permission denied"

---

## 📚 Related Files

- `js/auth.js` - Login and role checking logic
- `firestore.rules` - Database security rules
- `pages/admin-dashboard.html` - Calls `checkAuth('admin')`
- `pages/supervisor-dashboard.html` - Calls `checkAuth('supervisor')`

---

## 🎓 Summary

**Your system is SECURE by default:**

1. ✅ Only admin can add supervisors
2. ✅ Each supervisor has unique login
3. ✅ Supervisors cannot access admin features
4. ✅ Public cannot login at all
5. ✅ Multi-layer security (Auth + Code + Database)

**Nobody can:**
- Self-register
- Access wrong dashboard
- Bypass security rules
- Create users without admin privileges

You're all set! 🎉
