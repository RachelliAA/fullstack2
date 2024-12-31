// Variables to track game state
let score = 0; // Tracks the player's score
let lives = 3; // Tracks the player's remaining lives
let timeLeft = 30; // Time left in seconds
let level = 1; // Current level (1, 2, or 3)
let gameInterval; // Main interval for managing the game
let isPaused = false; // Tracks whether the game is paused
// Define variables for buttons
let startStopButton;
let pauseButton;

// Initialize button variables after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  startStopButton = document.getElementById("start-stop-btn");
  pauseButton = document.getElementById("pause-btn");
  pauseButton.disabled = true; // Disable pause button by default
  updateTabs(); // Enable or disable tabs based on Local Storage

  // Display High Score for Level 1 on page load
  const highScoreLevel1 = localStorage.getItem("highScore_level1") || 0;
  document.getElementById("high-score").textContent = `High Score (Level 1): ${highScoreLevel1}`;
});


function updateTabs() {
  const highScoreLevel1 = localStorage.getItem("highScore_level1") || 0;
  const highScoreLevel2 = localStorage.getItem("highScore_level2") || 0;

  document.getElementById("tab-level-2").disabled = highScoreLevel1 < 10;
  document.getElementById("tab-level-3").disabled = highScoreLevel2 < 10;
}


// Show a specific level (only updates the view)
function showLevel(selectedLevel) {
  if (selectedLevel > 1) {
    const previousLevelHighScore = localStorage.getItem(`highScore_level${selectedLevel - 1}`) || 0;
    if (previousLevelHighScore < 10) {
      alert(`You need to score at least 10 points in Level ${selectedLevel - 1} to unlock this level.`);
      return;
    }
  }

  level = selectedLevel;

  // Update active tab UI
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.getElementById(`tab-level-${level}`).classList.add("active");

  // Update the high score display for the current level
  document.getElementById("high-score").textContent = `High Score (Level ${level}): ${localStorage.getItem(`highScore_level${level}`) || 0}`;
}

function startGame() {
  // Reset variables to their initial values
  score = 0;
  lives = 3;
  timeLeft = 30;

  // Update the UI with initial values
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
  document.getElementById("time").textContent = timeLeft;

  // Disable and enable buttons
  startStopButton.textContent = "Stop";
  startStopButton.style.backgroundColor = "red";
  pauseButton.disabled = false;
  startStopButton.disabled = true;

  // Start the game timer
  gameInterval = setInterval(() => {
    if (timeLeft > 0 && lives > 0) {
      timeLeft--;
      document.getElementById("time").textContent = timeLeft;
    } else {
      endGame();
    }
  }, 1000);

  // Start spawning stars
  spawnStars();
}

function spawnStars() {
  const yellowStarRate = level === 1 ? 2000 : level === 2 ? 1500 : 800; // Faster for level 3
  const yellowStarLifetime = level === 1 ? 3000 : level === 2 ? 2000 : 1500; // Shorter for level 3

  // Interval for spawning stars
  const starInterval = setInterval(() => {
    if (isPaused || timeLeft <= 0 || lives <= 0) {
      clearInterval(starInterval);
      return;
    }

    // Rely on level-specific logic
    if (level === 3) {
      spawnStarWithMovement();
    } else {
      // Determine star color based on level
      const isYellow = level === 1 || (level === 2 && Math.random() < 0.85) || (level === 3 && Math.random() < 0.5);
      const color = isYellow ? "yellow" : "red";
      spawnStar(color, yellowStarLifetime);
    }
  }, yellowStarRate);
}

// Function to spawn a star with additional movement for level 3
function spawnStarWithMovement() {
  const gameArea = document.getElementById("game-area");
  const star = document.createElement("div");
  star.classList.add("star");

  // Random initial position
  const gameAreaRect = gameArea.getBoundingClientRect();
  const x = Math.random() * (gameAreaRect.width - 30);
  const y = Math.random() * (gameAreaRect.height - 30);

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;

  // Set random color for level 3
  star.style.backgroundColor = Math.random() < 0.5 ? "yellow" : "red";

  gameArea.appendChild(star);

  // Add animation for movement
  const moveX = Math.random() * 100 - 50; // Random horizontal movement
  const moveY = Math.random() * 100 - 50; // Random vertical movement
  star.animate(
    [
      { transform: `translate(0, 0)` },
      { transform: `translate(${moveX}px, ${moveY}px)` }
    ],
    {
      duration: 1000, // Duration of the movement
      iterations: 1 // Single iteration
    }
  );

  // Remove the star after its lifetime
  setTimeout(() => {
    if (star.parentNode) {
      star.remove();
    }
  }, 1500); // Short lifetime for level 3

  // Add click event to the star
  star.addEventListener("click", () => {
    handleStarClick(star.style.backgroundColor);
    star.remove();
  });
}



// Function to spawn a single star
function spawnStar(color, lifetime) {
  const gameArea = document.getElementById("game-area");
  const star = document.createElement("div");
  star.classList.add("star");

  // Random position within the game area
  const gameAreaRect = gameArea.getBoundingClientRect();
  const x = Math.random() * (gameAreaRect.width - 30);
  const y = Math.random() * (gameAreaRect.height - 30);

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.backgroundColor = color;

  gameArea.appendChild(star);

  // Remove the star after its lifetime
  setTimeout(() => {
    if (star.parentNode) {
      star.remove();
    }
  }, lifetime);

  // Add click event to the star
  star.addEventListener("click", () => {
    handleStarClick(color);
    star.remove();
  });
}

// Handle logic when a star is clicked
function handleStarClick(color) {
  if (color === "yellow") {
    score++;
  } else if (color === "red") {
    lives--;
    if (lives === 0) {
      endGame();
    }
  }

  // Update UI after each click
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
}


function endGame() {

  clearInterval(gameInterval); // Stop the game timer
  isPaused = true; // Ensure game is not paused
  document.getElementById("game-area").innerHTML = ""; // Clear stars

  alert(`Game over! Your score is ${score}.`);

  // Update high score
  const highScoreKey = `highScore_level${level}`;
  const currentHighScore = localStorage.getItem(highScoreKey) || 0;
  if (score > currentHighScore) {
    localStorage.setItem(highScoreKey, score);
    alert(`New High Score for Level ${level}: ${score}`);
  }

  updateTabs();
  // Reset UI
  timeLeft = 30;
  score = 0;
  lives = 3;
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
  document.getElementById("time").textContent = timeLeft;

  // Reset buttons
  startStopButton.textContent = "Start";
  startStopButton.disabled=false;
  startStopButton.style.backgroundColor = "";
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause Game";
}

function togglePause() {
  if (isPaused) {
    isPaused = false;
    pauseButton.textContent = "Pause Game";

    // Resume game timer
    gameInterval = setInterval(() => {
      if (timeLeft > 0 && lives > 0) {
        timeLeft--;
        document.getElementById("time").textContent = timeLeft;
      } else {
        endGame();
      }
    }, 1000);

    // Resume spawning stars
    spawnStars();
  } else {
    isPaused = true;
    startStopButton.disabled = false;
    pauseButton.textContent = "Continue Game";

    // Stop game timer
    clearInterval(gameInterval);
  }
}

function toggleStartStop() {
  if (startStopButton.textContent === "Start") {
    startGame();
  } else {
    endGame();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const exitButton = document.getElementById("exit-btn");
  if (exitButton) {
    exitButton.addEventListener("click", () => {
      const confirmExit = confirm("Are you sure you want to exit the game?");
      if (confirmExit) {
        window.location.href = "menu.html"; // Redirect to the menu page
      }
    });
  }
});
