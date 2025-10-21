// Supervisor Login Handler

function showAlert(message, type = 'error') {
  const alertContainer = document.getElementById('alertContainer');
  const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
  alertContainer.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
  
  setTimeout(() => {
    alertContainer.innerHTML = '';
  }, 5000);
}

// Handle supervisor login form submission
document.getElementById('supervisorLoginForm').addEventListener('submit', async (e) => {
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
    
    // Check if user is actually a supervisor
    if (role !== 'supervisor') {
      await auth.signOut();
      throw new Error('Access denied. This login is for supervisors only.');
    }
    
    // Store user info in session
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('userName', userData.name);
    sessionStorage.setItem('userEmail', user.email);
    
    // Redirect to supervisor dashboard
    window.location.href = 'supervisor-dashboard.html';
    
  } catch (error) {
    console.error('Login error:', error);
    showAlert(error.message || 'Login failed. Please check your credentials.');
  }
});
