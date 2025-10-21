// Admin Dashboard JavaScript

// Modal functions
function openAddSupervisorModal() {
  document.getElementById('addSupervisorModal').classList.add('active');
}

function openAddClassModal() {
  document.getElementById('addClassModal').classList.add('active');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// Load dashboard data
window.addEventListener('DOMContentLoaded', () => {
  loadStatistics();
  loadSupervisors();
  loadClasses();
  loadRecentActivity();
});

// Load statistics
function loadStatistics() {
  // Total classes
  db.collection('classes').onSnapshot((snapshot) => {
    document.getElementById('totalClasses').textContent = snapshot.size;
    
    // Calculate total points
    let totalPoints = 0;
    snapshot.forEach((doc) => {
      totalPoints += doc.data().points || 0;
    });
    document.getElementById('totalPoints').textContent = totalPoints;
  });
  
  // Total supervisors
  db.collection('users').where('role', '==', 'supervisor').onSnapshot((snapshot) => {
    document.getElementById('totalSupervisors').textContent = snapshot.size;
  });
}

// Load supervisors
function loadSupervisors() {
  db.collection('users')
    .where('role', '==', 'supervisor')
    .onSnapshot((snapshot) => {
      const supervisors = [];
      snapshot.forEach((doc) => {
        supervisors.push({ id: doc.id, ...doc.data() });
      });
      
      displaySupervisors(supervisors);
    });
}

function displaySupervisors(supervisors) {
  const content = document.getElementById('supervisorsContent');
  
  if (supervisors.length === 0) {
    content.innerHTML = '<p style="text-align: center; color: #7f8c8d; margin-top: 1rem;">No supervisors yet.</p>';
    return;
  }
  
  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  supervisors.forEach((supervisor) => {
    html += `
      <tr>
        <td>${supervisor.name}</td>
        <td>${supervisor.email}</td>
        <td>
          <button onclick="deleteSupervisor('${supervisor.id}')" class="btn btn-danger" style="padding: 0.5rem 1rem;">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  content.innerHTML = html;
}

// Add supervisor
document.getElementById('addSupervisorForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('supervisorName').value;
  const email = document.getElementById('supervisorEmail').value;
  const password = document.getElementById('supervisorPassword').value;

  // A temporary name for the secondary app. Using a random string to avoid conflicts.
  const tempAppName = 'secondary-app-' + Date.now();
  
  // Get the config from the main app.
  const mainAppConfig = firebase.app().options;

  // Initialize a secondary Firebase app.
  const secondaryApp = firebase.initializeApp(mainAppConfig, tempAppName);
  const secondaryAuth = secondaryApp.auth();

  try {
    // 1. Create the new user in the secondary app. This does NOT sign the admin out of the main app.
    const userCredential = await secondaryAuth.createUserWithEmailAndPassword(email, password);
    const newUser = userCredential.user;

    // 2. The admin is still logged in on the main app, so they have permission to write to Firestore.
    await db.collection('users').doc(newUser.uid).set({
      name: name,
      email: email,
      role: 'supervisor',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert('Supervisor added successfully!');
    closeModal('addSupervisorModal');
    document.getElementById('addSupervisorForm').reset();

  } catch (error) {
    console.error('Error adding supervisor:', error);
    // Provide a more specific error message for common issues.
    if (error.code === 'auth/email-already-in-use') {
      alert('Error: This email address is already in use by another account.');
    } else if (error.code === 'auth/weak-password') {
      alert('Error: The password is too weak. Please use a stronger password.');
    } else {
      alert('An error occurred while adding the supervisor: ' + error.message);
    }
  } finally {
    // 3. Clean up: sign out the new user from the secondary app and delete the app.
    await secondaryAuth.signOut();
    await secondaryApp.delete();
  }
});

// Delete supervisor
async function deleteSupervisor(supervisorId) {
  if (!confirm('Are you sure you want to delete this supervisor?')) {
    return;
  }
  
  try {
    await db.collection('users').doc(supervisorId).delete();
    alert('Supervisor deleted successfully!');
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    alert('Error: ' + error.message);
  }
}

// Load classes
function loadClasses() {
  db.collection('classes')
    .orderBy('points', 'desc')
    .onSnapshot((snapshot) => {
      const classes = [];
      snapshot.forEach((doc) => {
        classes.push({ id: doc.id, ...doc.data() });
      });
      
      displayClasses(classes);
    });
}

function displayClasses(classes) {
  const content = document.getElementById('classesContent');
  
  if (classes.length === 0) {
    content.innerHTML = '<p style="text-align: center; color: #7f8c8d; margin-top: 1rem;">No classes yet.</p>';
    return;
  }
  
  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Class Name</th>
          <th>Teacher</th>
          <th>Points</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  classes.forEach((cls) => {
    html += `
      <tr>
        <td><strong>${cls.name}</strong></td>
        <td>${cls.teacher || 'N/A'}</td>
        <td><span class="points-badge">${cls.points || 0} pts</span></td>
        <td>
          <button onclick="editClass('${cls.id}', '${cls.name}', '${cls.teacher}', ${cls.points || 0})" 
                  class="btn btn-secondary" style="padding: 0.5rem 1rem; margin-right: 0.5rem;">
            Edit
          </button>
          <button onclick="deleteClass('${cls.id}')" class="btn btn-danger" style="padding: 0.5rem 1rem;">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  content.innerHTML = html;
}

// Add class
document.getElementById('addClassForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('className').value;
  const teacher = document.getElementById('classTeacher').value;
  
  try {
    await db.collection('classes').add({
      name: name,
      teacher: teacher,
      points: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert('Class added successfully!');
    closeModal('addClassModal');
    document.getElementById('addClassForm').reset();
    
  } catch (error) {
    console.error('Error adding class:', error);
    alert('Error: ' + error.message);
  }
});

// Edit class
function editClass(id, name, teacher, points) {
  document.getElementById('editClassId').value = id;
  document.getElementById('editClassName').value = name;
  document.getElementById('editClassTeacher').value = teacher;
  document.getElementById('editClassPoints').value = points;
  document.getElementById('editClassModal').classList.add('active');
}

document.getElementById('editClassForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('editClassId').value;
  const name = document.getElementById('editClassName').value;
  const teacher = document.getElementById('editClassTeacher').value;
  const points = parseInt(document.getElementById('editClassPoints').value);
  
  try {
    await db.collection('classes').doc(id).update({
      name: name,
      teacher: teacher,
      points: points
    });
    
    alert('Class updated successfully!');
    closeModal('editClassModal');
    
  } catch (error) {
    console.error('Error updating class:', error);
    alert('Error: ' + error.message);
  }
});

// Delete class
async function deleteClass(classId) {
  if (!confirm('Are you sure you want to delete this class?')) {
    return;
  }
  
  try {
    await db.collection('classes').doc(classId).delete();
    alert('Class deleted successfully!');
  } catch (error) {
    console.error('Error deleting class:', error);
    alert('Error: ' + error.message);
  }
}

// Load recent activity
function loadRecentActivity() {
  db.collection('pointsHistory')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .onSnapshot((snapshot) => {
      const activities = [];
      snapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() });
      });
      
      displayActivity(activities);
    });
}

function displayActivity(activities) {
  const content = document.getElementById('activityContent');
  
  if (activities.length === 0) {
    content.innerHTML = '<p style="text-align: center; color: #7f8c8d; margin-top: 1rem;">No activity yet.</p>';
    return;
  }
  
  let html = `
    <table class="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Class</th>
          <th>Points</th>
          <th>Reason</th>
          <th>Added By</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  activities.forEach((activity) => {
    const date = activity.timestamp ? activity.timestamp.toDate().toLocaleString() : 'N/A';
    html += `
      <tr>
        <td>${date}</td>
        <td>${activity.className}</td>
        <td><strong>${activity.points > 0 ? '+' : ''}${activity.points}</strong></td>
        <td>${activity.reason || 'N/A'}</td>
        <td>${activity.supervisorName}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  content.innerHTML = html;
}
