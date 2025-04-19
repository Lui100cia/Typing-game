const startBtn = document.getElementById("start-btn");
const usernameInput = document.getElementById("username");
const modeSelect = document.getElementById("mode-select");

const gameArea = document.getElementById("game-area");
const playerName = document.getElementById("player-name");
const playerLevel = document.getElementById("player-level");

const timeRemaining = document.getElementById("time-remaining");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");

const inputField = document.getElementById("input-field");

const NUMBER_OF_WORD = 50;
const TIMING = 120;
let timer = TIMING;
let intervalId;
let currentWordIndex = 0;
let totalTyped = 0;
let correctTyped = 0;
let wrongTyped = 0;
let totalCharsTyped = 0;
let correctCharsTyped = 0;
const wpmList = [];

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
  for (let i = 0; i < NUMBER_OF_WORD; i++) {
    const wordList = words[level];
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    generatedWords.push(randomWord);
  }

  displayWords();
  startCountdown();
  currentWordIndex = 0;
  totalTyped = 0;
  correctTyped = 0;
  document.getElementById("input-field").value = "";
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "0";

  inputField.focus()
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
  let timeLeft = TIMING;
  timeRemaining.textContent = timeLeft;

  intervalId = setInterval(() => {
    timeLeft--;
    timeRemaining.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      endGame();
    }
  }, 1000);
}

inputField.addEventListener("keydown", (e) => {
  const typed = inputField.value.trim();
  const target = generatedWords[currentWordIndex];

  if (e.key === " ") {
    e.preventDefault(); // Empêche d’écrire l’espace

    totalTyped++;

    if (typed === target) {
      correctTyped++;
      wordDisplay.querySelector(`.highlight`).classList.add("correct")
    } else {
      wrongTyped++;
      wordDisplay.querySelector(`.highlight`).classList.add("wrong")
    }

    currentWordIndex++;
    inputField.value = "";

    updateWordHighlight();
  } else {
    totalCharsTyped++;
    const correctSoFar = target.startsWith(typed);

    if (correctSoFar) {
      correctCharsTyped++;
    }
  }
  updateStats();


  if (currentWordIndex >= generatedWords.length) {
    clearInterval(intervalId);
    endGame();
    return;
  }
});

function updateWordHighlight() {
  const spans = wordDisplay.querySelectorAll("span");

  spans.forEach((span, index) => {
    span.classList.remove("highlight");
    if (index === currentWordIndex) {
      span.classList.add("highlight");
    }
  });
}

function updateStats() {
  const minutesElapsed = (TIMING - parseInt(timeRemaining.textContent)) / 60;
  const wpm = totalTyped / minutesElapsed;
  wpmList.push(wpm)
  const meanWpm = wpmList.reduce((a, b) => a + b) / wpmList.length;
  const accuracy = (correctCharsTyped / totalCharsTyped) * 100;

  wpmDisplay.textContent = isFinite(meanWpm) ? Math.round(meanWpm) : 0;
  accuracyDisplay.textContent = isFinite(accuracy) ? Math.round(accuracy) : 0;
}

function endGame() {
  clearInterval(intervalId);
  inputField.disabled = true;

  const finalWpm = parseInt(wpmDisplay.textContent);
  const finalAccuracy = (correctCharsTyped / totalCharsTyped) * 100;

  // Remplir le popup
  document.getElementById("popup-total").textContent = totalTyped;
  document.getElementById("popup-correct").textContent = correctTyped;
  document.getElementById("popup-wrong").textContent = wrongTyped;
  document.getElementById("popup-wpm").textContent = isFinite(finalWpm) ? Math.round(finalWpm) : 0;
  document.getElementById("popup-accuracy").textContent = isFinite(finalAccuracy) ? Math.round(finalAccuracy) : 0;

  document.getElementById("popup").classList.remove("hidden");

  document.querySelector(".container").classList.remove("hidden");
  gameArea.classList.add("hidden");
}

