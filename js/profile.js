// Retrieve the current user and users list from localStorage
const currentUser = JSON.parse(localStorage.getItem('current user'));
const users = JSON.parse(localStorage.getItem('users')) || [];

// Display user details
document.getElementById('user-email').innerText = currentUser.email;
document.getElementById('user-name').innerText = currentUser.name;

// Toggle password visibility
document.querySelectorAll('.eye-icon').forEach((eyeIcon) => {
    eyeIcon.addEventListener('click', (event) => {
        const passwordInput = event.target.previousElementSibling;
        const inputType = passwordInput.getAttribute('type');
        passwordInput.setAttribute('type', inputType === 'password' ? 'text' : 'password');
    });
});

// Update username
document.getElementById('update-username').addEventListener('click', () => {
    const newUsername = document.getElementById('new-username').value.trim();
    if (newUsername && newUsername !== currentUser.name) {
        currentUser.name = newUsername;
        localStorage.setItem('current user', JSON.stringify(currentUser));

        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex > -1) {
            users[userIndex].name = newUsername;
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Username updated successfully');
        document.getElementById('user-name').innerText = newUsername;
        document.getElementById('new-username').value = '';
    } else {
        alert('Please enter a valid new username.');
    }
});

// Update password
document.getElementById('update-password').addEventListener('click', () => {
    const oldPassword = document.getElementById('old-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (oldPassword !== currentUser.password) {
        alert('Old password is incorrect.');
    } else if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
    } else if (newPassword) {
        currentUser.password = newPassword;
        localStorage.setItem('current user', JSON.stringify(currentUser));

        const userIndex = users.findIndex(user => user.email === currentUser.email);
        if (userIndex > -1) {
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
        }

        alert('Password updated successfully');
        document.getElementById('old-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    } else {
        alert('Please enter a valid password.');
    }
});

// // Populate game scores
// const gameScoresList = document.getElementById('game-scores');
// console.log(currentUser)
// if (currentUser.games) {
//     currentUser.games.forEach(game => {
//         const listItem = document.createElement('li');
//         listItem.innerHTML = `<span>${game.name}</span><span>${new Date(game.timestamp).toLocaleString()}</span>`;
//         gameScoresList.appendChild(listItem);
//     });
// }

// // Display game scores
// const gameScoresContainer = document.getElementById('game-scores');

// // Ensure games is an array before iterating
// if (Array.isArray(currentUser.games)) {
//     currentUser.games.forEach((game, index) => {
//         const gameElement = document.createElement('div');
//         gameElement.classList.add('game-score');
//         gameElement.innerHTML = `
//             <p><strong>Game ${index + 1}:</strong> ${game.name || 'Unknown'}</p>
//             <p><strong>Score:</strong> ${game.score || 'N/A'}</p>
//             <p><strong>Timestamp:</strong> ${game.timestamp || 'No timestamp available'}</p>
//         `;
//         gameScoresContainer.appendChild(gameElement);
//     });
// } else {
//     gameScoresContainer.innerHTML = '<p>No games available to display.</p>';
// }


// Back to menu
document.getElementById('back-button').addEventListener('click', () => {
  window.location.href = '../pages/menu.html'; 
});

document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("current user"));

  if (currentUser) {
    // Display user email and username
    document.getElementById("user-email").textContent = currentUser.email;
    document.getElementById("user-name").textContent = currentUser.name;

    // Display game scores
    const gameScoresList = document.getElementById("game-scores");
    const games = currentUser.games || {}; // Default to an empty object if no games

    if (Object.keys(games).length === 0) {
      // If no games exist, show a placeholder message
      gameScoresList.innerHTML = "<li>No games played yet.</li>";
    } else {
      // Populate the game scores
      Object.entries(games).forEach(([game, score]) => {
        const listItem = document.createElement("li");
        listItem.textContent = `${game}: ${score}`;
        gameScoresList.appendChild(listItem);
      });
    }
  } else {
    // If no current user is found, redirect to login or show an error
    alert("No user is currently logged in.");
    window.location.href = "login.html"; // Redirect to login page
  }
});
