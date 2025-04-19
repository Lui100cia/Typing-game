const startBtn = document.getElementById("start-btn");
const usernameInput = document.getElementById("username");
const modeSelect = document.getElementById("mode-select");

const gameArea = document.getElementById("game-area");
const playerName = document.getElementById("player-name");
const playerLevel = document.getElementById("player-level");

const timeRemaining = document.getElementById("time-remaining");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

let timer = 60;
let intervalId;

// ✅ Clique sur "Commencer"
startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  const level = modeSelect.value;

  if (name === "") {
    alert("Entre ton prénom 😊");
    return;
  }

  document.querySelector(".container").classList.add("hidden");
  gameArea.classList.remove("hidden");

  playerName.textContent = name;
  playerLevel.textContent = level;

  startGame(level);
});
