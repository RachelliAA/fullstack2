const users = JSON.parse(localStorage.getItem('users')) || []; // Retrieve users from localStorage as an array
let failedAttempts = {};
const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 300000; // 5 minutes in milliseconds
console.log(users);

// Sets an event if the register button is clicked
document.getElementById('show-register').addEventListener('click', () => {
  toggleForms('register');
});

// Sets an event if the login button is clicked
document.getElementById('show-login').addEventListener('click', () => {
  toggleForms('login');
});


document.getElementById('login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // If the account is blocked, show an alert
  if (failedAttempts[email] && Date.now() < failedAttempts[email].unblockTime) {
    alert('Account temporarily blocked. Try again later.');
    return;
  }

  // If the password is correct
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex > -1 && users[userIndex].password === password) {
    const timestamp = new Date().toISOString(); // Current timestamp

    // Add the timestamp to the user's timestamps list
    if (!users[userIndex].timestamps) {
      users[userIndex].timestamps = [];
    }
    users[userIndex].timestamps.push(timestamp);

    // Save the updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Save a 12-hour cookie with username and password
    setCookie('user_email', email, 12);
    setCookie('user_password', password, 12);

    // Save the current user object with the latest timestamp to localStorage
    const currentUser = {
      email: email,
      password: password,
      name: users[userIndex].name,
      games: users[userIndex].games,
      timestamps: users[userIndex].timestamps
    };

    localStorage.setItem('current user', JSON.stringify(currentUser));

    // Redirect to the menu page
    window.location.href = './pages/menu.html';
    failedAttempts[email] = null;
  } else { // Wrong email or password
    alert('Invalid email or password');
    handleFailedAttempt(email);
  }
});


// Sets an event when registering a user
document.getElementById('register').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  // Check if the email is already registered
  const userIndex = users.findIndex(user => user.email === email);
  if (userIndex > -1) {
    alert('Email already registered');
  } else {
    // Add the new user to the users array
    users.push({ email, name, password });

    // Save the updated users array to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Save the email and password of the newly registered user to cookies
    setCookie('user_email', email, 12);
    setCookie('user_password', password, 12);

    alert('Registration successful');
    toggleForms('login');

    // Autofill login fields with newly registered credentials
    document.getElementById('login-email').value = email;
    document.getElementById('login-password').value = password;
  }
});

// Autofill login fields with saved credentials on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedEmail = getCookie('user_email');
  const savedPassword = getCookie('user_password');

  if (savedEmail && savedPassword) {
    document.getElementById('login-email').value = savedEmail;
    document.getElementById('login-password').value = savedPassword;
  }
});

// Switches between login and register forms
function toggleForms(form) {
  document.getElementById('login-form').classList.toggle('hidden', form !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', form !== 'register');
}

// If there was a failed attempt, count how many times it fails
function handleFailedAttempt(email) {
  if (!failedAttempts[email]) {
    failedAttempts[email] = { count: 1, unblockTime: null };
  } else {
    failedAttempts[email].count++;
    if (failedAttempts[email].count >= MAX_ATTEMPTS) {
      failedAttempts[email].unblockTime = Date.now() + BLOCK_TIME;
      alert('Account blocked for 5 minutes due to multiple failed attempts.');
    }
  }
}

// Function to set a cookie
function setCookie(name, value, hours) {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Function to get a cookie by name
function getCookie(name) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}
