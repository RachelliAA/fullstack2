// Retrieve the current user from localStorage
const currentUser = JSON.parse(localStorage.getItem('current user'));
const users = JSON.parse(localStorage.getItem('users')) || {}; // Get users list

// Display current user's email and other info on the profile page
document.getElementById('user-email').innerText = currentUser.email;
document.getElementById('user-name').innerText = currentUser.name;

// Dynamically create stars for the password based on its length
const passwordLength = currentUser.password.length;
document.getElementById('user-password').innerText = '•'.repeat(passwordLength);

// Toggle visibility of the password
const passwordField = document.getElementById('user-password');
const eyeIcon = document.getElementById('eye-icon');

eyeIcon.addEventListener('click', () => {
  // Check if the password is currently hidden or visible
  if (passwordField.innerText === '•'.repeat(passwordLength)) {
    // Show the password
    passwordField.innerText = currentUser.password;
    eyeIcon.src = '../img/eye-close-1-32.png'; // Change to open eye icon
  } else {
    // Hide the password
    passwordField.innerText = '•'.repeat(passwordLength);
    eyeIcon.src = '../img/eye-close-1-32.png'; // Change to closed eye icon
  }
});

// Update username
document.getElementById('update-username').addEventListener('click', () => {
  const newUsername = document.getElementById('new-username').value;
  if (newUsername && newUsername !== currentUser.name) {
    // Update the current user's name in localStorage
    currentUser.name = newUsername;
    localStorage.setItem('current user', JSON.stringify(currentUser));

    // Update the users list
    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex > -1) {
      users[userIndex].name = newUsername;
      localStorage.setItem('users', JSON.stringify(users));
    }

    alert('Username updated successfully');
    document.getElementById('user-name').innerText = newUsername; // Update the displayed username
  } else {
    alert('Please enter a new username');
  }
});

// Update password
document.getElementById('update-password').addEventListener('click', () => {
  const newPassword = document.getElementById('new-password').value;
  if (newPassword) {
    // Update the current user's password in localStorage
    currentUser.password = newPassword;
    localStorage.setItem('current user', JSON.stringify(currentUser));

    // Update the users list
    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex > -1) {
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
    }

    alert('Password updated successfully');
    document.getElementById('user-password').innerText = '•'.repeat(newPassword.length); // Update stars
  } else {
    alert('Please enter a new password');
  }
});

// Back to menu button
document.getElementById('back-button').addEventListener('click', () => {
  window.location.href = 'menu.html'; // Redirect to the menu page
});
