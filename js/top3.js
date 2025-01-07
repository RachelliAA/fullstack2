function loadTopPlayers() {
  // Load and display Catch the Stars data
  loadGameTopPlayers("catchTheStarsAll", "catchStars");

  // Load and display Color Puzzle data
  loadGameTopPlayers("colorPuzzleAll", "colorPuzzle");
}

function loadGameTopPlayers(localStorageKey, gamePrefix) {
  // Get data from local storage
  const gameData = JSON.parse(localStorage.getItem(localStorageKey)) || [];

  // Clean the data to extract name and score
  const cleanedData = gameData.map(player => ({
    name: player.name,
    score: player.score
  }));

  // Sort the data by score in descending order
  cleanedData.sort((a, b) => b.score - a.score);

  // Fill the podium with top 3 players
  fillPodium(cleanedData.slice(0, 3), gamePrefix);

  // Fill the list with all players
  fillPlayerList(cleanedData, gamePrefix);
}

function fillPodium(topPlayers, prefix) {
  const positions = ['first', 'second', 'third'];

  topPlayers.forEach((player, index) => {
    if (player) {
      document.getElementById(`${prefix}-${positions[index]}-name`).textContent = player.name;
      document.getElementById(`${prefix}-${positions[index]}-score`).textContent = player.score;
    }
  });
}

function fillPlayerList(players, prefix) {
  const playerListContainer = document.getElementById(`${prefix}-player-list`);
  playerListContainer.innerHTML = ''; // Clear existing content

  players.forEach(player => {
    const playerItem = document.createElement("div");
    playerItem.className = "player-item";
    playerItem.innerHTML = `<span class="player-name">${player.name}</span><span class="player-score">${player.score}</span>`;
    playerListContainer.appendChild(playerItem);
  });
}

document.addEventListener("DOMContentLoaded", loadTopPlayers);
