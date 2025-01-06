// Global Variables
let score = 0;
let lives = 3;
let timeLeft = 30;
let level = 1;
let gameInterval;
let yellowStarInterval, redStarInterval;
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

function getUserData(username) {
  return JSON.parse(localStorage.getItem(username)) || { highScores: {} };
}

function updateHighScore(level, score) {
  const currentUser = JSON.parse(localStorage.getItem('current user')) || {};
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (!currentUser.games) {
    currentUser.games = {};
  }
  if (!Array.isArray(currentUser.games.catchTheStars)) {
    currentUser.games.catchTheStars = [0, 0, 0];
  }

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

function getHighScore(level) {
  const currentUser = JSON.parse(localStorage.getItem('current user')) || {};
  const personalScores = currentUser.games?.catchTheStars || [0, 0, 0];
  return personalScores[level - 1];
}

function updateTopScores() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const topScores = JSON.parse(localStorage.getItem("catchTheStarsTop")) || [];

  users.forEach(user => {
    if (user.games && Array.isArray(user.games.catchTheStars)) {
      const highestScore = Math.max(...user.games.catchTheStars);
      if (highestScore > 0) {
        topScores.push({
          name: user.name,
          score: highestScore
        });
      }
    }
  });

  topScores.sort((a, b) => b.score - a.score);
  const topThreeScores = topScores.slice(0, 3);

  localStorage.setItem("catchTheStarsTop", JSON.stringify(topThreeScores));
}

// ** Game Logic **
function startGame() {
  clearAllIntervals();
  resetGameState();

  startStopButton.textContent = "Stop";
  startStopButton.disabled = true;
  startStopButton.style.backgroundColor = "#b0b0b0";
  pauseButton.disabled = false;
  pauseButton.textContent = "Pause";
  pauseButton.style.backgroundColor = "#be9c13";

  gameInterval = setInterval(updateTime, 1000);
  setGameIntervals();
}

function updateTime() {
  if (timeLeft > 0 && lives > 0) {
    timeLeft--;
    updateUI();
  } else {
    endGame();
  }
}

function endGame() {
  clearAllIntervals();
  document.getElementById("game-area").innerHTML = "";
  alert(`Game over! Your score is ${score}.`);

  updateHighScore(level, score);
  updateTopScores();

  resetGameState();
  resetButtons();
}

function resetButtons() {
  startStopButton.textContent = "Start";
  startStopButton.disabled = false;
  startStopButton.style.backgroundColor = "";
  pauseButton.disabled = true;
  pauseButton.textContent = "Pause";
}

function toggleStartStop() {
  if (startStopButton.textContent === "Start") {
    startGame();
  } else {
    endGame();
  }
}

function togglePause() {
  if (pauseButton.textContent === "Pause") {
    pauseGame();
  } else if (pauseButton.textContent === "Continue") {
    resumeGame();
  }
}

function pauseGame() {
  isPaused = true;
  clearAllIntervals();
  pauseButton.textContent = "Continue";
  startStopButton.disabled = false;
  startStopButton.style.backgroundColor = "red";
}

function resumeGame() {
  isPaused = false;
  gameInterval = setInterval(updateTime, 1000);
  setGameIntervals();
  pauseButton.textContent = "Pause";
  startStopButton.disabled = true;
  startStopButton.style.backgroundColor = "#b0b0b0";
}

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

function clearAllIntervals() {
  clearInterval(gameInterval);
  clearInterval(yellowStarInterval);
  clearInterval(redStarInterval);
}

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

  setTimeout(() => {
    if (star.parentNode) {
      star.remove();
    }
  }, lifetime);

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
  level = selectedLevel;

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  const selectedTab = document.getElementById(`tab-level-${selectedLevel}`);
  selectedTab.classList.add("active");
}

function showPopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("visible");

  const closeButton = document.getElementById("close-popup");
  closeButton.addEventListener("click", () => {
    popup.classList.remove("visible");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  showPopup();

  const instructionsButton = document.getElementById("instructions-btn");
  instructionsButton.addEventListener("click", () => {
    showPopup();
  });
});

function handleExit() {
  const confirmExit = confirm("Are you sure you want to exit the game?");
  if (confirmExit) {
    window.location.href = "menu.html";
  }
}
