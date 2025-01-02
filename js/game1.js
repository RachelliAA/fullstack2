// Global Variables
let score = 0;
let lives = 3;
let timeLeft = 30;
let level = 1;
let gameInterval;
let isPaused = false;

// Button references
let startStopButton;
let pauseButton;

// Initialize the game after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
});

// ** Initialization **
function initializeGame() {
  startStopButton = document.getElementById("start-stop-btn");
  pauseButton = document.getElementById("pause-btn");
  pauseButton.disabled = true;

  updateTabs();
  displayHighScores(getCurrentUsername());

  document.getElementById("exit-btn").addEventListener("click", handleExit);
}

// ** Helper Functions **
function getCurrentUsername() {
  return localStorage.getItem("current user") || "Guest";
}

function updateTabs() {
  const highScoreLevel1 = getHighScore(1);
  const highScoreLevel2 = getHighScore(2);

  document.getElementById("tab-level-2").disabled = highScoreLevel1 < 10;
  document.getElementById("tab-level-3").disabled = highScoreLevel2 < 10;
}

function displayHighScores(username) {
  const userData = getUserData(username);
  const personalScores = Object.keys(userData.highScores)
    .map(level => `${userData.highScores[level]}`)
    .join(", ");
  document.getElementById("personal-high-scores").textContent = `Your High Scores: ${personalScores}`;

 // const globalScores = getGlobalHighScores();
 // document.getElementById("global-high-scores").textContent = `Global High Scores: ${globalScores.join(", ")}`;
}

function resetGameState() {
  score = 0;
  lives = 3;
  timeLeft = 30;
  updateUI();
}

function updateUI() {
  document.getElementById("score").textContent = score;
  document.getElementById("lives").textContent = lives;
  document.getElementById("time").textContent = timeLeft;
}

// ** User and Score Management **
function getUserData(username) {
  return JSON.parse(localStorage.getItem(username)) || { highScores: {} };
}

function saveUserData(username, level, score) {
  const userData = getUserData(username);
  if (!userData.highScores[level] || score > userData.highScores[level]) {
    userData.highScores[level] = score;
  }
  localStorage.setItem(username, JSON.stringify(userData));
  updateGlobalHighScores(score);
}

function getHighScore(level) {
  return parseInt(localStorage.getItem(`highScore_level${level}`)) || 0;
}

function updateGlobalHighScores(score) {
  const globalScores = getGlobalHighScores();
  globalScores.push(score);
  globalScores.sort((a, b) => b - a);
  if (globalScores.length > 3) {
    globalScores.pop();
  }
  localStorage.setItem("globalHighScores", JSON.stringify(globalScores));
}

function getGlobalHighScores() {
  return JSON.parse(localStorage.getItem("globalHighScores")) || [];
}

// ** Game Logic **
function startGame() {
  resetGameState();

  startStopButton.textContent = "Stop";
  startStopButton.disabled = true;
  pauseButton.disabled = false;

  gameInterval = setInterval(() => {
    if (timeLeft > 0 && lives > 0) {
      timeLeft--;
      updateUI();
    } else {
      endGame();
    }
  }, 1000);

  spawnStars();
}

function endGame() {
  clearInterval(gameInterval);
  document.getElementById("game-area").innerHTML = "";
  alert(`Game over! Your score is ${score}.`);

  saveUserData(getCurrentUsername(), level, score);
  displayHighScores(getCurrentUsername());

  resetGameState();
  resetButtons();
}

function resetButtons() {
  startStopButton.textContent = "Start";
  startStopButton.disabled = false;
  startStopButton.style.backgroundColor = "";
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause Game";
}

function togglePause() {
  if (isPaused) {
    isPaused = false;
    pauseButton.textContent = "Pause Game";
    startStopButton.disabled=true;
    startStopButton.style.backgroundColor = "#b0b0b0";



    gameInterval = setInterval(() => {
      if (timeLeft > 0 && lives > 0) {
        timeLeft--;
        updateUI();
      } else {
        endGame();
      }
    }, 1000);

    spawnStars();
  } else {
    isPaused = true;
    clearInterval(gameInterval);
    pauseButton.textContent = "Continue Game";
    startStopButton.style.backgroundColor = "red";
    startStopButton.disabled=false;

  }
}

function toggleStartStop() {
  if (startStopButton.textContent === "Start") {
    startGame();
  } else {
    endGame();
  }
}

function spawnStars() {
  const yellowStarRate = level === 1 ? 2000 : level === 2 ? 1500 : 1000; // הזמן בין יצירת כוכבים צהובים
  const redStarRate = level === 2 ? 7000 : level === 3 ? 1000 : null; // הזמן בין יצירת כוכבים אדומים (ברמות 2 ו-3 בלבד)
  const yellowLifetime = level === 1 ? 3000 : level === 2 ? 2000 : 1500; // זמן החיים של כוכבים צהובים
  const redLifetime = level === 2 || level === 3 ? 2000 : null; // זמן החיים של כוכבים אדומים

  // יצירת כוכבים צהובים
  const yellowStarInterval = setInterval(() => {
    if (isPaused || timeLeft <= 0 || lives <= 0) {
      clearInterval(yellowStarInterval);
      return;
    }
    spawnStar("yellow", yellowLifetime);
  }, yellowStarRate);

  // יצירת כוכבים אדומים (רק ברמות 2 ו-3)
  if (level === 2 || level === 3) {
    const redStarInterval = setInterval(() => {
      if (isPaused || timeLeft <= 0 || lives <= 0) {
        clearInterval(redStarInterval);
        return;
      }
      spawnStar("red", redLifetime);
    }, redStarRate);
  }
}


function spawnStar(color, lifetime) {
  const gameArea = document.getElementById("game-area");
  const star = document.createElement("div");
  star.classList.add("star");

  // מיקום אקראי של הכוכב
  const x = Math.random() * (gameArea.clientWidth - 30);
  const y = Math.random() * (gameArea.clientHeight - 30);

  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  star.style.backgroundColor = color;

  gameArea.appendChild(star);

  // מסיר את הכוכב לאחר זמן החיים
  setTimeout(() => {
    if (star.parentNode) {
      star.remove();
    }
  }, lifetime);

  // לחיצה על כוכב
  star.addEventListener("click", () => {
    handleStarClick(color);
    star.remove();
  });
}

function handleStarClick(color) {
  if (color === "yellow") {
    score++;
  } else if (color === "red") {
    lives--;
    if (lives === 0) {
      endGame();
    }
  }
  updateUI();
}

function showLevel(selectedLevel) {
  // Update the current level
  level = selectedLevel;

  // Remove "active" class from all tabs
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  // Add "active" class to the selected tab
  const selectedTab = document.getElementById(`tab-level-${selectedLevel}`);
  selectedTab.classList.add("active");

  // Update the high score display for the current level
  document.getElementById("personal-high-scores").textContent = `High Score (Level ${level}): ${localStorage.getItem(`highScore_level${level}`) || 0}`;
}

// הצגת ה-Popup
function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("visible");

  // סגירת ה-Popup בלחיצה על הכפתור "Close"
  const closeButton = document.getElementById("close-popup");
  closeButton.addEventListener("click", () => {
    popup.classList.remove("visible");
  });
}

// הצגת ה-Popup בפתיחת המשחק
document.addEventListener("DOMContentLoaded", () => {
  showPopup(); // הצגת ה-Popup מיד בטעינה

  // הצגת ה-Popup בלחיצה על כפתור "How to Play"
  const instructionsButton = document.getElementById("instructions-btn");
  instructionsButton.addEventListener("click", () => {
    showPopup();
  });
});



// ** Exit Logic **
function handleExit() {
  const confirmExit = confirm("Are you sure you want to exit the game?");
  if (confirmExit) {
    window.location.href = "menu.html";
  }
}
