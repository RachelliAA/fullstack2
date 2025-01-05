// // let currentLevel = 1;
// // let maxRange = 10;
// // let secretNumber = Math.floor(Math.random() * maxRange) + 1;

// // const rangeMin = document.getElementById('range-min');
// // const rangeMax = document.getElementById('range-max');
// // const guessInput = document.getElementById('guess');
// // const submitButton = document.getElementById('submit');
// // const message = document.getElementById('message');
// // const nextLevelButton = document.getElementById('next-level');

// // function resetGame() {
// //   guessInput.value = '';
// //   secretNumber = Math.floor(Math.random() * maxRange) + 1;
// //   message.textContent = '';
// //   nextLevelButton.style.display = 'none';
// //   guessInput.disabled = false;
// //   submitButton.disabled = false;
// // }

// // function nextLevel() {
// //   currentLevel++;
// //   maxRange += 10;
// //   rangeMax.textContent = maxRange;
// //   resetGame();
// // }

// // submitButton.addEventListener('click', () => {
// //   const playerGuess = parseInt(guessInput.value);
// //   if (isNaN(playerGuess)) {
// //     message.textContent = 'Please enter a valid number!';
// //     return;
// //   }

// //   if (playerGuess === secretNumber) {
// //     message.textContent = `🎉 Correct! The number was ${secretNumber}.`;
// //     nextLevelButton.style.display = 'block';
// //     guessInput.disabled = true;
// //     submitButton.disabled = true;
// //   } else if (playerGuess < secretNumber) {
// //     message.textContent = 'Too low! Try again.';
// //   } else {
// //     message.textContent = 'Too high! Try again.';
// //   }
// // });

// // nextLevelButton.addEventListener('click', nextLevel);

// // // Initialize the game
// // resetGame();

// const colors = ["red", "blue", "green", "yellow"];
// const colorButtons = document.querySelectorAll(".color-btn");
// const startButton = document.getElementById("start-button");
// const message = document.getElementById("message");
// const levelText = document.getElementById("level");

// let gameSequence = [];
// let playerSequence = [];
// let level = 0;
// let acceptingInput = false;

// // // Function to flash a color
// // function flashColor(color) {
// //   const button = document.getElementById(color);
// //   button.classList.add("active");
// //   setTimeout(() => {
// //     button.classList.remove("active");
// //   }, 500);
// // }

// function flashColor(color) {
//     const button = document.getElementById(color);
//     const frequencies = {
//       red: 440,    // A4
//       blue: 554.37, // C#5
//       green: 659.25, // E5
//       yellow: 783.99 // G5
//     };
  
//     playBeep(frequencies[color]); // Play the sound
  
//     button.classList.add("active");
//     setTimeout(() => {
//       button.classList.remove("active");
//     }, 500);
//   }
  

// // Play the game sequence
// function playSequence() {
//   let index = 0;
//   acceptingInput = false;
//   message.textContent = "Watch the sequence...";
  
//   const interval = setInterval(() => {
//     flashColor(gameSequence[index]);
//     index++;

//     if (index >= gameSequence.length) {
//       clearInterval(interval);
//       acceptingInput = true;
//       message.textContent = "Now it's your turn!";
//     }
//   }, 800);
// }

// // Add a new color to the sequence
// function addNewColor() {
//   const randomColor = colors[Math.floor(Math.random() * colors.length)];
//   gameSequence.push(randomColor);
// }

// // Start a new round
// function startNewRound() {
//   level++;
//   levelText.textContent = level;
//   playerSequence = [];
//   addNewColor();
//   playSequence();
// }

// // Handle player's button clicks
// function handlePlayerInput(color) {
//   if (!acceptingInput) return;

//   playerSequence.push(color);
//   flashColor(color);

//   // Check if the player's input matches the game sequence
//   const currentIndex = playerSequence.length - 1;

//   if (playerSequence[currentIndex] !== gameSequence[currentIndex]) {
//     message.textContent = "Game Over! Try Again.";
//     updateHighScore();
//     finishedLevel = level;
//     resetGame();
//     levelText.textContent = finishedLevel;
//     return;
//   }

//   // If the player completes the sequence correctly
//   if (playerSequence.length === gameSequence.length) {
//     message.textContent = "Correct! Get ready for the next round.";
//     setTimeout(startNewRound, 1000);
//   }
// }



// // Update the high score for the current user
// // function updateHighScore() {
// //   const currentUser = JSON.parse(localStorage.getItem('current user'));//gets the current user
// //   const users = JSON.parse(localStorage.getItem("users")) || [];//gets all the users

// //   let highestScore = currentUser["colorPuzzle"] || 0; // Get current highest score for the game

// //   if (level > highestScore) {
// //     currentUser["colorPuzzle"] = level; // Update the color puzzle highest score
// //     localStorage.setItem("current user", JSON.stringify(currentUser));//updates the current user

// //     // Update users list
// //     const userIndex = users.findIndex(user => user.email === currentUser.email);
// //     if (userIndex > -1) {
// //       users[userIndex]["colorPuzzle"] = level;
// //     } else {
// //       users.push({
// //         email: currentUser.email,
// //         password: currentUser.password,
// //         name: currentUser.name,
// //         colorPuzzle: level
// //       });
// //     }

// //     localStorage.setItem("users", JSON.stringify(users));//updates the users 
// //   }
// // }


// function updateHighScore() {
//     const currentUser = JSON.parse(localStorage.getItem('current user')); // Get the current user
//     const users = JSON.parse(localStorage.getItem("users")) || []; // Get all the users
  
//     // Ensure the "games" object exists for the current user
//     if (!currentUser["games"]) {
//       currentUser["games"] = {}; // Initialize an empty "games" object if it doesn't exist
//     }
  
//     let highestScore = currentUser["games"]["colorPuzzle"] || 0; // Get current highest score for colorPuzzle
  
//     // Check if the level is higher than the current highest score
//     if (level > highestScore) {
//       currentUser["games"]["colorPuzzle"] = level; // Update the color puzzle highest score
  
//       // Update the current user in localStorage
//       localStorage.setItem("current user", JSON.stringify(currentUser));
  
//       // Update the users list
//       const userIndex = users.findIndex(user => user.email === currentUser.email);
//       if (userIndex > -1) {
//         users[userIndex]=currentUser// Update the game score for the existing user
//       } else {
//         // Add a new user with the updated game score
//         users.push({
//           email: currentUser.email,
//           password: currentUser.password,
//           name: currentUser.name,
//           games: {
//             colorPuzzle: level, // Add color puzzle game score
//           }
//         });
//       }
  
//       // Update the users list in localStorage
//       localStorage.setItem("users", JSON.stringify(users));
//     }
//   }
  
  

// // Reset the game
// function resetGame() {
//   gameSequence = [];
//   playerSequence = [];
//   level = 0;
  
//   acceptingInput = false;
//   startButton.disabled = false;
// }

// // Attach event listeners to color buttons
// colorButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     handlePlayerInput(button.id);
//   });
// });

// // Start the game
// startButton.addEventListener("click", () => {
//   resetGame();
//   startButton.disabled = true;
//   startNewRound();
// });

// function playBeep(frequency) {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();
  
//     oscillator.type = "sine"; // You can also try "square", "triangle", or "sawtooth"
//     oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // Set the tone frequency
//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);
  
//     oscillator.start();
//     gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5); // Fade out the sound
//     oscillator.stop(audioContext.currentTime + 0.5);
//   }
  

const colors = ["red", "blue", "green", "yellow"];
const colorButtons = document.querySelectorAll(".color-btn");
const startButton = document.getElementById("start-button");
const message = document.getElementById("message");
const levelText = document.getElementById("level");

let gameSequence = [];
let playerSequence = [];
let level = 0;
let acceptingInput = false;

// Modal and game over elements
const gameOverModal = document.getElementById("game-over-modal");
const finalLevel = document.getElementById("final-level");
const closeModalButton = document.getElementById("close-modal");

function flashColor(color) {
  const button = document.getElementById(color);
  const frequencies = {
    red: 440,    // A4
    blue: 554.37, // C#5
    green: 659.25, // E5
    yellow: 783.99 // G5
  };

  playBeep(frequencies[color]); // Play the sound

  button.classList.add("active");
  setTimeout(() => {
    button.classList.remove("active");
  }, 500);
}

function playSequence() {
  let index = 0;
  acceptingInput = false;
  message.textContent = "Watch the sequence...";

  const interval = setInterval(() => {
    flashColor(gameSequence[index]);
    index++;

    if (index >= gameSequence.length) {
      clearInterval(interval);
      acceptingInput = true;
      message.textContent = "Now it's your turn!";
    }
  }, 800);
}

function addNewColor() {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  gameSequence.push(randomColor);
}

function startNewRound() {
  level++;
  levelText.textContent = level;
  playerSequence = [];
  addNewColor();
  playSequence();
}

function handlePlayerInput(color) {
  if (!acceptingInput) return;

  playerSequence.push(color);
  flashColor(color);

  const currentIndex = playerSequence.length - 1;

  if (playerSequence[currentIndex] !== gameSequence[currentIndex]) {
    message.textContent = "Game Over! Try Again.";
    finalLevel.textContent = level;
    showGameOverModal();
    updateHighScore();
    resetGame();
    levelText.textContent = level;
    return;
  }

  if (playerSequence.length === gameSequence.length) {
    message.textContent = "Correct! Get ready for the next round.";
    setTimeout(startNewRound, 1000);
  }
}

function updateHighScore() {
  const currentUser = JSON.parse(localStorage.getItem('current user'));
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (!currentUser["games"]) {
    currentUser["games"] = {};
  }

  let highestScore = currentUser["games"]["colorPuzzle"] || 0;

  if (level > highestScore) {
    currentUser["games"]["colorPuzzle"] = level;
    localStorage.setItem("current user", JSON.stringify(currentUser));

    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex > -1) {
      users[userIndex] = currentUser;
    } else {
      users.push({
        email: currentUser.email,
        password: currentUser.password,
        name: currentUser.name,
        games: { colorPuzzle: level }
      });
    }

    localStorage.setItem("users", JSON.stringify(users));
  }
}

function resetGame() {
  gameSequence = [];
  playerSequence = [];
  level = 0;
  acceptingInput = false;
  startButton.disabled = false;
  startButton.style.backgroundColor = "#00bcd4"; // Reset to original color
}

function showGameOverModal() {
  gameOverModal.style.display = "flex";
  startButton.disabled = true; // Disable the start button
  startButton.style.backgroundColor = "#b0bec5"; // Change button color to gray
}

closeModalButton.addEventListener("click", () => {
  gameOverModal.style.display = "none";
});

// Attach event listeners to color buttons
colorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handlePlayerInput(button.id);
  });
});

// Start the game
startButton.addEventListener("click", () => {
  resetGame();
  startButton.disabled = true;
  startButton.style.backgroundColor = "#b0bec5"; // Change button color to gray
  startNewRound();
});

function playBeep(frequency) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
  oscillator.stop(audioContext.currentTime + 0.5);
}
