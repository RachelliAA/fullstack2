// Global Variables
let score = 0;        // Player's score
let lives = 3;        // Remaining lives
let timeLeft = 30;    // Time left in seconds
let level = 1;        // Current game level
let gameInterval;     // Timer for the game
let yellowStarInterval, redStarInterval;
let isPaused = false; // Pause state

// Button references
let startStopButton;  // Start/Stop button
let pauseButton;      // Pause button

// Initialize the game when the page loads
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
  showPopup()
});

// Set up buttons and update UI
function initializeGame() {
  startStopButton = document.getElementById("start-stop-btn");
  pauseButton = document.getElementById("pause-btn");
  pauseButton.disabled = true;
  updateTabs();
  document.getElementById("exit-btn").addEventListener("click", handleExit);
}

// Get current username from local storage
function getCurrentUsername() {
  return localStorage.getItem("current user") || "Guest";
}

// Enable or disable level tabs based on high scores
function updateTabs() {
  const highScoreLevel1 = getHighScore(1);
  const highScoreLevel2 = getHighScore(2);
  document.getElementById("tab-level-2").disabled = highScoreLevel1 < 10;
  document.getElementById("tab-level-3").disabled = highScoreLevel2 < 10;
}

// Reset game variables and update UI
function resetGameState() {
  score = 0;
  lives = 3;
  timeLeft = 30;
  updateUI();
}

// Update score, lives, and time in the UI
function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
  document.getElementById("time").textContent = timeLeft;
}

// Get user data from local storage
function getUserData(username) {
  return JSON.parse(localStorage.getItem(username)) || { highScores: {} };
}

// Update high score for a specific level
function updateHighScore(level, score) {
  const currentUser = JSON.parse(localStorage.getItem('current user')) || {};
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (!currentUser.games) {
    currentUser.games = {};
  }
  if (!Array.isArray(currentUser.games.catchTheStars)) {
    currentUser.games.catchTheStars = [0, 0, 0];
  }

  // Update high score if the new score is higher
  if (score > currentUser.games.catchTheStars[level - 1]) {
    currentUser.games.catchTheStars[level - 1] = score;
    localStorage.setItem("current user", JSON.stringify(currentUser));

    const userIndex = users.findIndex(user => user.email === currentUser.email);
    if (userIndex > -1) {
      users[userIndex] = currentUser;
    } else {
      users.push(currentUser);
    }
    localStorage.setItem("users", JSON.stringify(users));
  }
}

// Get high score for a specific level
function getHighScore(level) {
  const currentUser = JSON.parse(localStorage.getItem('current user')) || {};
  const personalScores = currentUser.games?.catchTheStars || [0, 0, 0];
  return personalScores[level - 1];
}

function updateTopScores() {
  // Retrieve all scores from local storage
  const allScores = JSON.parse(localStorage.getItem("catchTheStarsAll")) || [];

  // Get current player details
  const currentUser = JSON.parse(localStorage.getItem("current user")) || {};
  const currentPlayer = { email: currentUser.email, name: currentUser.name, score: score };

  // Check if the player already exists in the all scores array
  const existingPlayerIndex = allScores.findIndex(player => player.email === currentPlayer.email);

  if (existingPlayerIndex !== -1) {
    // If the player exists, update their score only if the new score is higher
    if (currentPlayer.score > allScores[existingPlayerIndex].score) {
      allScores[existingPlayerIndex].score = currentPlayer.score;
    }
  } else {
    // If the player does not exist, add them to the array
    allScores.push(currentPlayer);
  }

  // Save the updated all scores array in local storage
  localStorage.setItem("catchTheStarsAll", JSON.stringify(allScores));

  // Sort by score in descending order and keep only the top 3
  const topScores = [...allScores].sort((a, b) => b.score - a.score).slice(0, 3);

  // Save the updated Top 3 scores in local storage
  localStorage.setItem("catchTheStarsTop", JSON.stringify(topScores));
}



// Start the game by resetting state, enabling buttons, and starting intervals
function startGame() {
  clearAllIntervals();
  resetGameState();

  startStopButton.textContent = "Stop";
  startStopButton.disabled = true;
  startStopButton.style.backgroundColor = "#b0b0b0";
  pauseButton.disabled = false;
  pauseButton.textContent = "Pause";
  pauseButton.style.backgroundColor = "#be9c13";

  gameInterval = setInterval(updateTime, 1000); // Decrease time every second
  setGameIntervals();
}

// Decrease time and check if game should end
function updateTime() {
  if (timeLeft > 0 && lives > 0) {
    timeLeft--;
    updateUI();
  } else {
    endGame();
  }
}

// Function to show popup with dynamic message and button text
function showPopup(message) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const closeButton = document.getElementById("close-popup");

  if(message){
  popupMessage.innerHTML = message;
}
  popup.classList.add("visible");

  // Close the popup when the button is clicked
  closeButton.addEventListener("click", () => {
    popup.classList.remove("visible");
  });
}


// End the game, display score, and reset everything
function endGame() {
  clearAllIntervals();
  document.getElementById("game-area").innerHTML = "";

  // Show game over popup with score
  showPopup(`Game over! Your score is ${score}.`, "Close");

  updateHighScore(level, score);
  updateTopScores();
  resetGameState();
  resetButtons();
}



// Reset button states after game ends
function resetButtons() {
  startStopButton.textContent = "Start";
  startStopButton.disabled = false;
  startStopButton.style.backgroundColor = "";
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
}

// Toggle between starting and stopping the game
function toggleStartStop() {
  if (startStopButton.textContent === "Start") {
    startGame();
  } else {
    endGame();
  }
}

// Toggle between pausing and resuming the game
function togglePause() {
  if (pauseButton.textContent === "Pause") {
    pauseGame();
  } else if (pauseButton.textContent === "Continue") {
    resumeGame();
  }
}

// Pause the game by stopping intervals
function pauseGame() {
  isPaused = true;
  clearAllIntervals();
  pauseButton.textContent = "Continue";
  startStopButton.disabled = false;
  startStopButton.style.backgroundColor = "red";
}

// Resume the game by restarting intervals
function resumeGame() {
  isPaused = false;
  gameInterval = setInterval(updateTime, 1000);
  setGameIntervals();
  pauseButton.textContent = "Pause";
  startStopButton.disabled = true;
  startStopButton.style.backgroundColor = "#b0b0b0";
}

// Set intervals for spawning yellow and red stars based on level
function setGameIntervals() {
  const yellowStarRate = level === 1 ? 2000 : level === 2 ? 1500 : 1000;
  const redStarRate = level === 2 ? 7000 : level === 3 ? 1000 : null;
  const yellowLifetime = level === 1 ? 3000 : level === 2 ? 2000 : 1500;
  const redLifetime = level === 2 || level === 3 ? 2000 : null;

  yellowStarInterval = setInterval(() => spawnStar("yellow", yellowLifetime), yellowStarRate);

  if (level === 2 || level === 3) {
    redStarInterval = setInterval(() => spawnStar("red", redLifetime), redStarRate);
  }
}

// Clear all game intervals
function clearAllIntervals() {
  clearInterval(gameInterval);
  clearInterval(yellowStarInterval);
  clearInterval(redStarInterval);
}

// Spawn a star in a random position and set its lifetime
function spawnStar(color, lifetime) {
  const gameArea = document.getElementById("game-area");
  const star = document.createElement("div");
  star.classList.add("star");

  const x = Math.random() * (gameArea.clientWidth - 30);
  const y = Math.random() * (gameArea.clientHeight - 30);

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.backgroundColor = color;

  gameArea.appendChild(star);

  // Remove the star after its lifetime ends
  setTimeout(() => {
    if (star.parentNode) {
      star.remove();
    }
  }, lifetime);

  // Handle star click event
  star.addEventListener("click", () => {
    handleStarClick(color);
    star.remove();
  });
}

// Handle click events on stars (yellow increases score, red decreases lives)
function handleStarClick(color) {
  if (color === "yellow") {
    score++;
  } else if (color === "red") {
    lives--;
    if (lives === 0) {
      endGame(); // End game if no lives left
    }
  }
  updateUI();
}

// Show the selected game level and update tab styles
function showLevel(selectedLevel) {
  level = selectedLevel;
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  const selectedTab = document.getElementById(`tab-level-${selectedLevel}`);
  selectedTab.classList.add("active");
}


// Handle the exit button click event
function handleExit() {
  const confirmExit = confirm("Are you sure you want to exit the game?");
  if (confirmExit) {
    window.location.href = "menu.html"; // Redirect to menu
  }
}
