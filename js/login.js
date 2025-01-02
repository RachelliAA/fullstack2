// const users = JSON.parse(localStorage.getItem('users')) || {}; // Retrieve users from localStorage, or use an empty object if not found
// let failedAttempts = {};
// const MAX_ATTEMPTS = 3;
// const BLOCK_TIME = 300000; // 5 minutes in milliseconds
// console.log(users);

// // sets an event if the register button is clicked
// document.getElementById('show-register').addEventListener('click', () => {
//   toggleForms('register');
// });

// // sets an event if the login button is clicked
// document.getElementById('show-login').addEventListener('click', () => {
//   toggleForms('login');
// });

// // sets an event when the submit button is pressed for login
// document.getElementById('login').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const email = document.getElementById('login-email').value;
//   const password = document.getElementById('login-password').value;

//   // if the account is blocked, show an alert
//   if (failedAttempts[email] && Date.now() < failedAttempts[email].unblockTime) {
//     alert('Account temporarily blocked. Try again later.');
//     return;
//   }

//   // if the password is correct
//   if (users[email] && users[email].password === password) {
//     document.cookie = `user=${email}; max-age=600`; // 10 minutes
    
//     // Create a currentUser object to store in localStorage
//     const currentUser = {
//       email: email,
//       password: password,
//       name: users[email].name
//     };

//     // Save the current user object to localStorage
//     localStorage.setItem('current user', JSON.stringify(currentUser));

//     window.location.href = '../pages/menu.html'; // redirects to the menu page
//     failedAttempts[email] = null;
//   } else { // wrong email or password
//     alert('Invalid email or password');
//     handleFailedAttempt(email);
//   }
// });
// //const currentUser = JSON.parse(localStorage.getItem('current user')); GOOD CODE TO RETRIEVE THE CURRENT USER


// // sets an event when registering a user
// document.getElementById('register').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const name = document.getElementById('register-name').value;
//   const email = document.getElementById('register-email').value;
//   const password = document.getElementById('register-password').value;

//   if (users[email]) {
//     alert('Email already registered');
//   } else {
//     users[email] = { name, password };

//     // Save the updated users object to localStorage
//     localStorage.setItem('users', JSON.stringify(users));

//     alert('Registration successful');
//     toggleForms('login');
//   }
// });

// // switches between login and register forms
// function toggleForms(form) {
//   document.getElementById('login-form').classList.toggle('hidden', form !== 'login');
//   document.getElementById('register-form').classList.toggle('hidden', form !== 'register');
// }

// // if there was a failed attempt, count how many times it fails
// function handleFailedAttempt(email) {
//   if (!failedAttempts[email]) {
//     failedAttempts[email] = { count: 1, unblockTime: null };
//   } else {
//     failedAttempts[email].count++;
//     if (failedAttempts[email].count >= MAX_ATTEMPTS) {
//       failedAttempts[email].unblockTime = Date.now() + BLOCK_TIME;
//       alert('Account blocked for 5 minutes due to multiple failed attempts.');
//     }
//   }
// }



// //// Function to set a cookie
// // function setCookie(name, value, hours) {
// //   const date = new Date();
// //   date.setTime(date.getTime() + hours * 60 * 60 * 1000);
// //   document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
// // }

// // // Function to get a cookie by name
// // function getCookie(name) {
// //   const cookies = document.cookie.split('; ');
// //   for (let cookie of cookies) {
// //     const [key, value] = cookie.split('=');
// //     if (key === name) {
// //       return value;
// //     }
// //   }
// //   return null;
// // }

// // // Check for saved email cookie on page load
// // document.addEventListener('DOMContentLoaded', () => {
// //   const savedEmail = getCookie('lastEmail');
// //   if (savedEmail) {
// //     document.getElementById('login-email').value = savedEmail; // Autofill the email input
// //   }
// // });

// // // Save email to cookies after successful login
// // document.getElementById('login').addEventListener('submit', (e) => {
// //   e.preventDefault();
// //   const email = document.getElementById('login-email').value;
// //   const password = document.getElementById('login-password').value;

// //   if (users[email] && users[email].password === password) {
// //     alert('Login successful');
// //     setCookie('lastEmail', email, 24); // Save the email in cookies for 24 hours
// //     document.cookie = `user=${email}; max-age=600`; // Set session cookie for user
// //     window.location.href = '../pages/menu.html';
// //     failedAttempts[email] = null;
// //   } else {
// //     alert('Invalid email or password');
// //     handleFailedAttempt(email);
// //   }
// // });


const users = JSON.parse(localStorage.getItem('users')) || []; // Retrieve users from localStorage as an array
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
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex > -1 && users[userIndex].password === password) {
    document.cookie = `user=${email}; max-age=600`; // 10 minutes
    
    // Create a currentUser object to store in localStorage
    const currentUser = {
      email: email,
      password: password,
      name: users[userIndex].name
    };

    // Save the current user object to localStorage
    localStorage.setItem('current user', JSON.stringify(currentUser));

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

  // Check if the email is already registered
  const userIndex = users.findIndex(user => user.email === email);
  if (userIndex > -1) {
    alert('Email already registered');
  } else {
    // Add the new user to the users array
    users.push({ email, name, password });

    // Save the updated users array to localStorage
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
