function loadTopPlayers() {
    // Get all scores from local storage
    const catchTheStarsData = JSON.parse(localStorage.getItem("catchTheStarsAll")) || [];
  
    // Clean the data to extract only name and score
    const cleanedData = catchTheStarsData.map(player => ({
      name: player.name,  // Extract only the name
      score: player.score // Extract only the score
    }));
  
    // Sort the data by score in descending order
    cleanedData.sort((a, b) => b.score - a.score);
  
    // Fill the podium with top 3 players
    fillPodium(cleanedData.slice(0, 3));
  
    // Fill the list with all players
    fillPlayerList(cleanedData);
  }
  
  function fillPodium(topPlayers) {
    const positions = ['first', 'second', 'third'];
  
    topPlayers.forEach((player, index) => {
      if (player) {
        document.getElementById(`catchStars-${positions[index]}-name`).textContent = player.name;
        document.getElementById(`catchStars-${positions[index]}-score`).textContent = player.score;
      }
    });
  }
  
  function fillPlayerList(players) {
    const playerListContainer = document.getElementById("catchStars-player-list");
    playerListContainer.innerHTML = ''; // Clear existing content
  
    players.forEach(player => {
      const playerItem = document.createElement("div");
      playerItem.className = "player-item";
      playerItem.innerHTML = `<span class="player-name">${player.name}</span><span class="player-score">${player.score}</span>`;
      playerListContainer.appendChild(playerItem);
    });
  }
  
  document.addEventListener("DOMContentLoaded", loadTopPlayers);
  