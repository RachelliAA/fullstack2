let currentLevel = 1;
let maxRange = 10;
let secretNumber = Math.floor(Math.random() * maxRange) + 1;

const rangeMin = document.getElementById('range-min');
const rangeMax = document.getElementById('range-max');
const guessInput = document.getElementById('guess');
const submitButton = document.getElementById('submit');
const message = document.getElementById('message');
const nextLevelButton = document.getElementById('next-level');

function resetGame() {
  guessInput.value = '';
  secretNumber = Math.floor(Math.random() * maxRange) + 1;
  message.textContent = '';
  nextLevelButton.style.display = 'none';
  guessInput.disabled = false;
  submitButton.disabled = false;
}

function nextLevel() {
  currentLevel++;
  maxRange += 10;
  rangeMax.textContent = maxRange;
  resetGame();
}

submitButton.addEventListener('click', () => {
  const playerGuess = parseInt(guessInput.value);
  if (isNaN(playerGuess)) {
    message.textContent = 'Please enter a valid number!';
    return;
  }

  if (playerGuess === secretNumber) {
    message.textContent = `🎉 Correct! The number was ${secretNumber}.`;
    nextLevelButton.style.display = 'block';
    guessInput.disabled = true;
    submitButton.disabled = true;
  } else if (playerGuess < secretNumber) {
    message.textContent = 'Too low! Try again.';
  } else {
    message.textContent = 'Too high! Try again.';
  }
});

nextLevelButton.addEventListener('click', nextLevel);

// Initialize the game
resetGame();
