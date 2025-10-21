# 🔐 Separate Login System

## Overview

Your app now has **completely separate login pages** for Admins and Supervisors!

---

## 📍 Login Pages

### 1️⃣ Admin Login
**URL:** `/pages/admin-login.html`

- ⚙️ **For administrators only**
- Validates that user has `role: "admin"`
- If supervisor tries to login here → **Access Denied**
- Redirects to: Admin Dashboard

### 2️⃣ Supervisor Login
**URL:** `/pages/supervisor-login.html`

- 📝 **For supervisors only**
- Validates that user has `role: "supervisor"`
- If admin tries to login here → **Access Denied**
- Redirects to: Supervisor Dashboard

---

## 🎯 How It Works

### Public Leaderboard Page (index.html)
```
┌─────────────────────────────────────┐
│  🏆 RHHS Green Classroom Champion   │
│                                     │
│  [Admin Login] [Supervisor Login]  │
└─────────────────────────────────────┘
```

Two separate buttons:
- **Admin Login** → Takes you to admin-login.html
- **Supervisor Login** → Takes you to supervisor-login.html

---

## 🛡️ Security Features

### Admin Login (`pages/admin-login.html`)
```javascript
// JavaScript validates role BEFORE allowing access
if (role !== 'admin') {
  await auth.signOut();
  throw new Error('Access denied. This login is for administrators only.');
}
```

**What happens if Supervisor tries to login here:**
1. Enters correct supervisor credentials
2. System checks: `role === 'supervisor'`
3. ❌ Not admin!
4. Immediately signs them out
5. Shows error: "Access denied. This login is for administrators only."

### Supervisor Login (`pages/supervisor-login.html`)
```javascript
// JavaScript validates role BEFORE allowing access
if (role !== 'supervisor') {
  await auth.signOut();
  throw new Error('Access denied. This login is for supervisors only.');
}
```

**What happens if Admin tries to login here:**
1. Enters correct admin credentials
2. System checks: `role === 'admin'`
3. ❌ Not supervisor!
4. Immediately signs them out
5. Shows error: "Access denied. This login is for supervisors only."

---

## 📊 Login Flow Diagram

### Admin Trying to Login

```
Admin visits: pages/admin-login.html
    ↓
Enters: admin@school.edu + password
    ↓
System checks Firebase Auth ✓
    ↓
System checks Firestore role: "admin" ✓
    ↓
✅ Success!
    ↓
Redirected to: Admin Dashboard
```

### Supervisor Trying Admin Login (BLOCKED)

```
Supervisor visits: pages/admin-login.html
    ↓
Enters: supervisor@school.edu + password
    ↓
System checks Firebase Auth ✓
    ↓
System checks Firestore role: "supervisor"
    ↓
Role is NOT "admin" ❌
    ↓
Immediately logged out
    ↓
Error: "Access denied. This login is for administrators only."
```

### Admin Trying Supervisor Login (BLOCKED)

```
Admin visits: pages/supervisor-login.html
    ↓
Enters: admin@school.edu + password
    ↓
System checks Firebase Auth ✓
    ↓
System checks Firestore role: "admin"
    ↓
Role is NOT "supervisor" ❌
    ↓
Immediately logged out
    ↓
Error: "Access denied. This login is for supervisors only."
```

---

## 🎨 Visual Differences

### Admin Login Page
```
┌──────────────────────────────┐
│  ⚙️ Admin Login              │
│  For administrators only     │
│                              │
│  Admin Email:                │
│  [admin@rhhs.edu        ]    │
│                              │
│  Password:                   │
│  [******************    ]    │
│                              │
│  [Login as Admin]            │
│                              │
│  ← Back to Leaderboard       │
└──────────────────────────────┘
```

### Supervisor Login Page
```
┌──────────────────────────────┐
│  📝 Supervisor Login         │
│  For supervisors only        │
│                              │
│  Supervisor Email:           │
│  [supervisor@rhhs.edu   ]    │
│                              │
│  Password:                   │
│  [******************    ]    │
│                              │
│  [Login as Supervisor]       │
│                              │
│  ← Back to Leaderboard       │
└──────────────────────────────┘
```

---

## 📁 New Files Created

```
pages/
├── admin-login.html         ← NEW: Admin-only login
├── supervisor-login.html    ← NEW: Supervisor-only login
├── login.html              (old, can be removed)
├── admin-dashboard.html
└── supervisor-dashboard.html

js/
├── admin-login.js          ← NEW: Admin login handler
├── supervisor-login.js     ← NEW: Supervisor login handler
├── auth.js                 (updated)
├── admin-dashboard.js
└── supervisor-dashboard.js
```

---

## 🚀 Usage Examples

### Scenario 1: Admin Wants to Login
1. Go to homepage
2. Click **"Admin Login"** button
3. Enter admin email and password
4. ✅ Redirected to Admin Dashboard

### Scenario 2: Supervisor Wants to Login
1. Go to homepage
2. Click **"Supervisor Login"** button
3. Enter supervisor email and password
4. ✅ Redirected to Supervisor Dashboard

### Scenario 3: Supervisor Clicks Wrong Button
1. Supervisor clicks "Admin Login" by mistake
2. Enters their supervisor credentials
3. ❌ Error: "Access denied. This login is for administrators only."
4. Should click "Supervisor Login" instead

### Scenario 4: Admin Clicks Wrong Button
1. Admin clicks "Supervisor Login" by mistake
2. Enters their admin credentials
3. ❌ Error: "Access denied. This login is for supervisors only."
4. Should click "Admin Login" instead

---

## 🔧 Configuration

### Old Login Page (login.html)
You can now **delete** or **keep** the old `pages/login.html`:
- **Delete it:** Clean, only separate logins exist
- **Keep it:** As a backup/alternative unified login

The old login page is no longer linked from the homepage.

---

## ✅ Benefits of Separate Logins

### 1. **Clear Separation**
- Admins know exactly where to go
- Supervisors know exactly where to go
- No confusion about roles

### 2. **Extra Security Layer**
- Each login validates the specific role
- Wrong role = immediate rejection
- Prevents accidental cross-role access

### 3. **Better User Experience**
- Customized messages for each role
- Clear labeling (Admin vs Supervisor)
- Reduces login errors

### 4. **Professional Appearance**
- Shows organization and planning
- Easy to explain to users
- Clear access control

---

## 🎓 Summary

**Before:**
```
Homepage → [Staff Login] → Universal login → Checks role → Redirects
```

**Now:**
```
Homepage → [Admin Login] → Admin-only login → Validates admin role → Admin Dashboard
         → [Supervisor Login] → Supervisor-only login → Validates supervisor role → Supervisor Dashboard
```

**Security:**
- ✅ Each login page validates specific role
- ✅ Wrong role = immediate logout + error
- ✅ No cross-role access possible
- ✅ Clear separation of concerns

---

## 📞 User Instructions

**For Admins:**
- Click "Admin Login" on homepage
- Use your admin email and password

**For Supervisors:**
- Click "Supervisor Login" on homepage
- Use your supervisor email and password

**If you click the wrong button:**
- You'll see an error message
- Go back and click the correct button

---

Perfect! Your separate login system is ready! 🎉
