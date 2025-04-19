const usernameInput = document.getElementById("username");
const modeSelect = document.getElementById("mode-select");
const gameArea = document.getElementById("game-area");
const playerName = document.getElementById("player-name");
const playerLevel = document.getElementById("player-level");
const timeRemaining = document.getElementById("time-remaining");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const inputField = document.getElementById("input-field");
const wordDisplay = document.getElementById("word-display");
const scoreButton = document.querySelector("#score-board button");
const countdownEl = document.getElementById("countdown");

const TIMING = 120;

let timer = TIMING;
let intervalId;
let currentWordIndex = 0;
let totalTyped = 0;
let correctTyped = 0;
let wrongTyped = 0;
let totalCharsTyped = 0;
let correctCharsTyped = 0;
let wpmList = [];
let currentLevel = "";
let generatedWords = [];

const words = {
  easy: ["apple", "banana", "grape", "orange", "cherry"],
  medium: ["keyboard", "monitor", "printer", "charger", "battery"],
  hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

const nbWords = {
  easy: 30,
  medium: 50,
  hard: 75
}

document.querySelector(".container").addEventListener("submit", (e) => {
  e.preventDefault()
  let counter = 3;
  const name = usernameInput.value.trim();
  const level = modeSelect.value;

  if (!name) return alert("Entre ton prénom 😊");

  currentLevel = level;

  countdownEl.textContent = counter;
  document.getElementById("countdown-container").classList.remove("hidden");

  const countdownInterval = setInterval(() => {
    counter--;
    if (counter === 0) {
      clearInterval(countdownInterval);
      playerName.textContent = name;
      playerLevel.textContent = level;
      document.getElementById("countdown-container").classList.add("hidden");
      setTimeout(() => {
        document.querySelector(".container").classList.add("hidden");
        gameArea.classList.remove("hidden");

        startGame(level);
      }, 100)
    } else {
      countdownEl.textContent = counter;
    }
  }, 1000);
});

function startGame(level) {
  generatedWords = Array.from({ length: nbWords[level] }, () => {
    const list = words[level];
    return list[Math.floor(Math.random() * list.length)];
  });

  displayWords();
  startCountdown();
  resetStats();
  inputField.focus();
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

function resetStats() {
  currentWordIndex = totalTyped = correctTyped = wrongTyped = totalCharsTyped = correctCharsTyped = 0;
  wpmList = [];
  inputField.value = "";
  inputField.disabled = false;
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "0";
}

inputField.addEventListener("keydown", (e) => {
  const typed = inputField.value.trim();
  const target = generatedWords[currentWordIndex];

  if (e.key === " ") {
    e.preventDefault();
    totalTyped++;
    const span = wordDisplay.querySelectorAll("span")[currentWordIndex];
    if (typed === target) {
      correctTyped++;
      span.classList.add("correct");
    } else {
      wrongTyped++;
      span.classList.add("wrong");
    }
    currentWordIndex++;
    inputField.value = "";
    updateWordHighlight();
  } else {
    totalCharsTyped++;
    if (target.startsWith(typed)) correctCharsTyped++;
  }

  updateStats();
  if (currentWordIndex >= generatedWords.length) {
    clearInterval(intervalId);
    endGame();
  }
});

function updateWordHighlight() {
  const spans = wordDisplay.querySelectorAll("span");
  spans.forEach((span, index) => {
    span.classList.toggle("highlight", index === currentWordIndex);
  });
}

function updateStats() {
  const minutesElapsed = (TIMING - parseInt(timeRemaining.textContent)) / 60;
  const wpm = totalTyped / minutesElapsed;
  wpmList.push(wpm);
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
  const score = Math.round(
    (correctTyped * 4) +
    (finalWpm * 2) +
    (finalAccuracy * 3) +
    (parseInt(timeRemaining.textContent))
  );



  const result = {
    gamer: usernameInput.value.trim(),
    level: currentLevel,
    timeLeft: TIMING - parseInt(timeRemaining.textContent),
    total: totalTyped,
    correct: correctTyped,
    wrong: wrongTyped,
    wpm: finalWpm,
    accuracy: isFinite(finalAccuracy) ? Math.round(finalAccuracy) : 0,
    score
  };

  showPopup(result, true);

  const best = JSON.parse(localStorage.getItem("best-score-" + currentLevel)) || null;
  if (!best || score > best.score) {
    localStorage.setItem("best-score-" + currentLevel, JSON.stringify(result));
  }
}

function showPopup(result, isGameOver = false) {
  document.getElementById("popup-time").textContent = result.timeLeft || "—";
  document.getElementById("popup-gamer").textContent = result.gamer || "—";
  document.getElementById("popup-total").textContent = `${result.total || 0}/${nbWords[modeSelect.value]}`;
  document.getElementById("popup-correct").textContent = result.correct || 0;
  document.getElementById("popup-wrong").textContent = result.wrong || 0;
  document.getElementById("popup-wpm").textContent = result.wpm || 0;
  document.getElementById("popup-accuracy").textContent = result.accuracy || 0;
  document.getElementById("popup-score").textContent = result.score || 0;

  const best = JSON.parse(localStorage.getItem("best-score-" + result.level));
  if (best && isGameOver) {
    document.querySelector("#popup li.best").classList.remove("hidden");
    document.getElementById("popup-max-score").textContent = best.score;
    document.getElementById("popup-best-gamer").textContent = best.gamer;
  } else {
    document.querySelector("#popup li.best").classList.add("hidden");
  }

  document.getElementById("popup").classList.remove("hidden");
}

scoreButton.addEventListener("click", () => {
  const level = modeSelect.value;
  const best = JSON.parse(localStorage.getItem("best-score-" + level));
  if (!best) return alert("Aucun score enregistré pour ce niveau.");
  showPopup(best, false);
});
