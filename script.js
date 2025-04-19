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

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

const wordDisplay = document.getElementById("word-display");
let generatedWords = [];

function startGame(level) {
  // Génère 50 mots aléatoires selon le niveau
  generatedWords = [];
  for (let i = 0; i < 50; i++) {
    const wordList = words[level];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    generatedWords.push(randomWord);
  }

  displayWords();
  startCountdown();
}

function displayWords() {
  wordDisplay.innerHTML = "";
  generatedWords.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    if (index === 0) span.classList.add("highlight");
    wordDisplay.appendChild(span);
  });
}

function startCountdown() {
  let timeLeft = 60;
  timeRemaining.textContent = timeLeft;

  intervalId = setInterval(() => {
    timeLeft--;
    timeRemaining.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      endGame(); // À créer plus tard
    }
  }, 1000);
}
