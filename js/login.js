// const users = {}; // Simulates a user database
// let failedAttempts = {};
// const MAX_ATTEMPTS = 3;
// const BLOCK_TIME = 300000; // 5 minutes in milliseconds
// console.log(users);

// //sets an event if the register button is clicked
// document.getElementById('show-register').addEventListener('click', () => {
//   toggleForms('register');
// });

// //sets an event if the login button is clicked
// document.getElementById('show-login').addEventListener('click', () => {
//   toggleForms('login');
// });

// //sets an event if the pressed summit 
// document.getElementById('login').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const email = document.getElementById('login-email').value;
//   const password = document.getElementById('login-password').value;

//   //if its the account is blocked alerts
//   if (failedAttempts[email] && Date.now() < failedAttempts[email].unblockTime) {
//     alert('Account temporarily blocked. Try again later.');
//     return;
//   }
//   //if the password it correct
//   if (users[email] && users[email].password === password) {
//     document.cookie = `user=${email}; max-age=600`; // 10 minutes
//     alert('Login successful');
//     window.location.href = '../pages/menu.html'; //redirects to the menu page
//     failedAttempts[email] = null;
//   } else {//wrong email
//     alert('Invalid email or password');
//     handleFailedAttempt(email);
//   }
// });

// //sets an event when registering a user
// document.getElementById('register').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const name = document.getElementById('register-name').value;
//   const email = document.getElementById('register-email').value;
//   const password = document.getElementById('register-password').value;

//   if (users[email]) {
//     alert('Email already registered');
//   } else {
//     users[email] = { name, password };
//     localStorage.setItem(users[email]);
//     alert('Registration successful');
//     toggleForms('login');
//   }
// });

// //switches between forms log in and register
// function toggleForms(form) {
//   document.getElementById('login-form').classList.toggle('hidden', form !== 'login');
//   document.getElementById('register-form').classList.toggle('hidden', form !== 'register');
// }

// //if it was a failed attempt counts how musch time it fails
// function handleFailedAttempt(email) {
//   //if its the first time it failed
//   if (!failedAttempts[email]) {
//     failedAttempts[email] = { count: 1, unblockTime: null };
//   } else {//if its not the first time it fails
//     failedAttempts[email].count++;
//     if (failedAttempts[email].count >= MAX_ATTEMPTS) {
//       failedAttempts[email].unblockTime = Date.now() + BLOCK_TIME;
//       alert('Account blocked for 5 minutes due to multiple failed attempts.');
//     }
//   }
// }


const users = JSON.parse(localStorage.getItem('users')) || {}; // Retrieve users from localStorage, or use an empty object if not found
let failedAttempts = {};
const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 300000; // 5 minutes in milliseconds
console.log(users);

// sets an event if the register button is clicked
document.getElementById('show-register').addEventListener('click', () => {
  toggleForms('register');
});

// sets an event if the login button is clicked
document.getElementById('show-login').addEventListener('click', () => {
  toggleForms('login');
});

// sets an event when the submit button is pressed for login
document.getElementById('login').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // if the account is blocked, show an alert
  if (failedAttempts[email] && Date.now() < failedAttempts[email].unblockTime) {
    alert('Account temporarily blocked. Try again later.');
    return;
  }

  // if the password is correct
  if (users[email] && users[email].password === password) {
    document.cookie = `user=${email}; max-age=600`; // 10 minutes
    alert('Login successful');
    window.location.href = '../pages/menu.html'; // redirects to the menu page
    failedAttempts[email] = null;
  } else { // wrong email or password
    alert('Invalid email or password');
    handleFailedAttempt(email);
  }
});

// sets an event when registering a user
document.getElementById('register').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  if (users[email]) {
    alert('Email already registered');
  } else {
    users[email] = { name, password };

    // Save the updated users object to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful');
    toggleForms('login');
  }
});

// switches between login and register forms
function toggleForms(form) {
  document.getElementById('login-form').classList.toggle('hidden', form !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', form !== 'register');
}

// if there was a failed attempt, count how many times it fails
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
