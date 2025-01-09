// Main function to load and display top players for both games
function loadTopPlayers() {
  loadGameTopPlayers("catchTheStarsAll", "catchStars"); // Load "Catch the Stars" data
  loadGameTopPlayers("colorPuzzleAll", "colorPuzzle");  // Load "Color Puzzle" data
}

// Loads and processes game top players from local storage
function loadGameTopPlayers(localStorageKey, gamePrefix) {
  const gameData = JSON.parse(localStorage.getItem(localStorageKey)) || []; // Retrieve or initialize data
  const cleanedData = gameData.map(player => ({ name: player.name, score: player.score })); // Extract name & score

  cleanedData.sort((a, b) => b.score - a.score); // Sort by score (descending)
  
  fillPodium(cleanedData.slice(0, 3), gamePrefix); // Display top 3 players
  fillPlayerList(cleanedData, gamePrefix);         // Display full player list
}

// Fills the podium with the top 3 players
function fillPodium(topPlayers, prefix) {
  const positions = ['first', 'second', 'third'];
  
  topPlayers.forEach((player, index) => {
    if (player) {
      document.getElementById(`${prefix}-${positions[index]}-name`).textContent = player.name;
      document.getElementById(`${prefix}-${positions[index]}-score`).textContent = player.score;
    }
  });
}

// Populates the player list below the podium
function fillPlayerList(players, prefix) {
  const playerListContainer = document.getElementById(`${prefix}-player-list`);
  playerListContainer.innerHTML = ''; // Clear previous content

  players.forEach(player => {
    const playerItem = document.createElement("div");
    playerItem.className = "player-item";
    playerItem.innerHTML = `
      <span class="player-name">${player.name}</span>
      <span class="player-score">${player.score}</span>
    `;
    playerListContainer.appendChild(playerItem);
  });
}

// Triggers top players loading after the document is fully loaded
document.addEventListener("DOMContentLoaded", loadTopPlayers);
