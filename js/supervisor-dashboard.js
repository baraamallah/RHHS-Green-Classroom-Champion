// Supervisor Dashboard JavaScript

// Load dashboard data
window.addEventListener('DOMContentLoaded', () => {
  loadClassesDropdown();
  loadLeaderboard();
  loadMyActivity();
});

// Load classes for dropdown
function loadClassesDropdown() {
  db.collection('classes')
    .orderBy('name')
    .onSnapshot((snapshot) => {
      const select = document.getElementById('selectClass');
      select.innerHTML = '<option value="">-- Select a Class --</option>';
      
      snapshot.forEach((doc) => {
        const cls = doc.data();
        const option = document.createElement('option');
        option.value = doc.id;
        option.textContent = `${cls.name} - ${cls.teacher}`;
        option.dataset.name = cls.name;
        option.dataset.currentPoints = cls.points || 0;
        select.appendChild(option);
      });
    });
}

// Add points form submission
document.getElementById('addPointsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const classId = document.getElementById('selectClass').value;
  const points = parseInt(document.getElementById('pointsToAdd').value);
  const reason = document.getElementById('pointsReason').value;
  
  if (!classId) {
    alert('Please select a class');
    return;
  }
  
  const select = document.getElementById('selectClass');
  const selectedOption = select.options[select.selectedIndex];
  const className = selectedOption.dataset.name;
  const currentPoints = parseInt(selectedOption.dataset.currentPoints);
  
  try {
    const user = auth.currentUser;
    const userDoc = await db.collection('users').doc(user.uid).get();
    const supervisorName = userDoc.data().name;
    
    // Update class points
    await db.collection('classes').doc(classId).update({
      points: firebase.firestore.FieldValue.increment(points)
    });
    
    // Add to points history
    await db.collection('pointsHistory').add({
      classId: classId,
      className: className,
      points: points,
      reason: reason,
      supervisorId: user.uid,
      supervisorName: supervisorName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    alert(`Successfully ${points > 0 ? 'added' : 'deducted'} ${Math.abs(points)} points to ${className}!`);
    
    // Reset form
    document.getElementById('addPointsForm').reset();
    
  } catch (error) {
    console.error('Error adding points:', error);
    alert('Error: ' + error.message);
  }
});

// Load leaderboard
function loadLeaderboard() {
  db.collection('classes')
    .orderBy('points', 'desc')
    .onSnapshot((snapshot) => {
      const classes = [];
      snapshot.forEach((doc) => {
        classes.push({ id: doc.id, ...doc.data() });
      });
      
      displayLeaderboard(classes);
    });
}

function displayLeaderboard(classes) {
  const content = document.getElementById('leaderboardContent');
  
  if (classes.length === 0) {
    content.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No classes yet.</p>';
    return;
  }
  
  let html = `
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Class Name</th>
          <th>Teacher</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  classes.forEach((cls, index) => {
    const rank = index + 1;
    const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : 'rank-other';
    
    html += `
      <tr>
        <td>
          <span class="rank-badge ${rankClass}">${rank}</span>
        </td>
        <td><strong>${cls.name}</strong></td>
        <td>${cls.teacher || 'N/A'}</td>
        <td>
          <span class="points-badge">${cls.points || 0} pts</span>
        </td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  content.innerHTML = html;
}

// Load supervisor's activity
function loadMyActivity() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      db.collection('pointsHistory')
        .where('supervisorId', '==', user.uid)
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
  });
}

function displayActivity(activities) {
  const content = document.getElementById('activityContent');
  
  if (activities.length === 0) {
    content.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No activity yet.</p>';
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
        </tr>
      </thead>
      <tbody>
  `;
  
  activities.forEach((activity) => {
    const date = activity.timestamp ? activity.timestamp.toDate().toLocaleString() : 'N/A';
    const pointsColor = activity.points > 0 ? '#2ecc71' : '#e74c3c';
    
    html += `
      <tr>
        <td>${date}</td>
        <td>${activity.className}</td>
        <td><strong style="color: ${pointsColor}">${activity.points > 0 ? '+' : ''}${activity.points}</strong></td>
        <td>${activity.reason}</td>
      </tr>
    `;
  });
  
  html += '</tbody></table>';
  content.innerHTML = html;
}
