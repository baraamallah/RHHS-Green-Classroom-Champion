// Authentication handler
function showAlert(message, type = 'error') {
  const alertContainer = document.getElementById('alertContainer');
  const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
  alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
  
  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 5000);
}

// Handle login form submission
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      // Sign in with Firebase Auth
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Get user role from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      
      if (!userDoc.exists) {
        throw new Error('User profile not found. Please contact administrator.');
      }
      
      const userData = userDoc.data();
      const role = userData.role;
      
      // Store role in session
      sessionStorage.setItem('userRole', role);
      sessionStorage.setItem('userName', userData.name);
      sessionStorage.setItem('userEmail', user.email);
      
      // Redirect based on role
      if (role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else if (role === 'supervisor') {
        window.location.href = 'supervisor-dashboard.html';
      } else {
        throw new Error('Invalid user role.');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      showAlert(error.message || 'Login failed. Please check your credentials.');
    }
  });
}

// Check authentication status on protected pages
function checkAuth(requiredRole = null) {
  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      // User not logged in, redirect to appropriate login page
      // Default to admin login if role not specified
      const preferredRole = sessionStorage.getItem('preferredRole') || 'admin';
      window.location.href = preferredRole === 'admin' ? '../pages/admin-login.html' : '../pages/supervisor-login.html';
      return;
    }
    
    // Get user role
    const userDoc = await db.collection('users').doc(user.uid).get();
    
    if (!userDoc.exists) {
      alert('User profile not found.');
      auth.signOut();
      window.location.href = '../index.html';
      return;
    }
    
    const userData = userDoc.data();
    const role = userData.role;
    
    // Check if user has required role
    if (requiredRole && role !== requiredRole) {
      alert('Access denied. You do not have permission to view this page.');
      auth.signOut();
      sessionStorage.clear();
      window.location.href = '../index.html';
      return;
    }
    
    // Store user info in session
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userName', userData.name);
    sessionStorage.setItem('userEmail', user.email);
  });
}

// Logout function
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    auth.signOut().then(() => {
      sessionStorage.clear();
      window.location.href = '../index.html';
    }).catch((error) => {
      console.error('Logout error:', error);
      alert('Error logging out. Please try again.');
    });
  }
}
