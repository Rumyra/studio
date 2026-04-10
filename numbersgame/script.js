// ── Number pools ──────────────────────────────────────────────
const LARGE_POOL = [25, 50, 75, 100];
const SMALL_POOL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// ── State ──────────────────────────────────────────────────────
let availableLarge = [...LARGE_POOL];
let availableSmall = [...SMALL_POOL];
let chosenNumbers  = [];
let largeChosen    = 0;
const MAX_TOTAL    = 6;
const MAX_LARGE    = 4;

let timerInterval  = null;
let secondsLeft    = 60;
const CIRCUMFERENCE = 2 * Math.PI * 54; // r=54 → ~339.29

// ── Shuffle helper ─────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Pick a number ──────────────────────────────────────────────
function pickNumber(type) {
  if (chosenNumbers.length >= MAX_TOTAL) return;

  let value;

  if (type === 'large') {
    if (availableLarge.length === 0) return;
    // Shuffle and pop so picks feel random
    shuffle(availableLarge);
    value = availableLarge.pop();
    largeChosen++;
  } else {
    if (availableSmall.length === 0) return;
    shuffle(availableSmall);
    value = availableSmall.pop();
  }

  chosenNumbers.push({ value, type });
  revealCard(chosenNumbers.length - 1, value, type);
  updatePickButtons();

  if (chosenNumbers.length === MAX_TOTAL) {
    document.getElementById('revealBtn').disabled = false;
  }
}

// ── Reveal a card with flip animation ─────────────────────────
function revealCard(index, value, type) {
  const slot = document.getElementById(`slot-${index}`);
  slot.classList.remove('empty');

  slot.innerHTML = `
    <div class="flip-card">
      <div class="card-face card-back"></div>
      <div class="card-face card-front ${type}">${value}</div>
    </div>
  `;
}

// ── Update pick button states ──────────────────────────────────
function updatePickButtons() {
  const total         = chosenNumbers.length;
  const smallChosen   = total - largeChosen;
  const largeBtn      = document.getElementById('pickLarge');
  const smallBtn      = document.getElementById('pickSmall');
  const remaining     = MAX_TOTAL - total;

  // Disable large if: max large reached, no large left, or all 6 chosen
  largeBtn.disabled = largeChosen >= MAX_LARGE || availableLarge.length === 0 || total >= MAX_TOTAL;

  // Disable small if: no small left, or all 6 chosen
  smallBtn.disabled = availableSmall.length === 0 || total >= MAX_TOTAL;

  // Update remaining labels
  document.getElementById('largeRemaining').textContent =
    `(${Math.min(MAX_LARGE - largeChosen, availableLarge.length)} left)`;
  document.getElementById('smallRemaining').textContent =
    `(${availableSmall.length} left)`;
}

// ── Start game: reveal target + begin countdown ────────────────
function startGame() {
  // Disable the button so it can't be pressed again
  document.getElementById('revealBtn').disabled = true;
  document.getElementById('pickLarge').disabled = true;
  document.getElementById('pickSmall').disabled = true;

  // Generate and show target number
  const target = Math.floor(Math.random() * 900) + 100; // 100–999
  const el = document.getElementById('targetNumber');
  el.textContent = target;
  el.classList.add('revealed');

  // Start the 60-second countdown
  secondsLeft = 60;
  updateTimerDisplay();
  timerInterval = setInterval(tick, 1000);
}

// ── Timer tick ─────────────────────────────────────────────────
function tick() {
  secondsLeft--;
  updateTimerDisplay();

  if (secondsLeft <= 0) {
    clearInterval(timerInterval);
    timerInterval = null;
    timeUp();
  }
}

function updateTimerDisplay() {
  const progress   = document.getElementById('timerProgress');
  const display    = document.getElementById('timerDisplay');
  const fraction   = secondsLeft / 60;
  const offset     = CIRCUMFERENCE * (1 - fraction);

  progress.style.strokeDashoffset = offset;
  display.textContent = secondsLeft;

  const urgent = secondsLeft <= 10;
  progress.classList.toggle('urgent', urgent);
  display.classList.toggle('urgent', urgent);
}

function timeUp() {
  // Insert "Time's up!" banner below the timer SVG
  const timerColumn = document.querySelector('.timer-column');
  const banner      = document.createElement('p');
  banner.className  = 'time-up-banner';
  banner.textContent = "⏱ Time's up!";
  timerColumn.appendChild(banner);
}

// ── Reset everything ───────────────────────────────────────────
function resetGame() {
  // Clear timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // Reset state
  availableLarge = [...LARGE_POOL];
  availableSmall = [...SMALL_POOL];
  chosenNumbers  = [];
  largeChosen    = 0;
  secondsLeft    = 60;

  // Reset cards
  for (let i = 0; i < MAX_TOTAL; i++) {
    const slot = document.getElementById(`slot-${i}`);
    slot.classList.add('empty');
    slot.innerHTML = '';
  }

  // Reset target
  const el = document.getElementById('targetNumber');
  el.textContent = '—';
  el.classList.remove('revealed');

  // Reset timer display
  const progress = document.getElementById('timerProgress');
  const display  = document.getElementById('timerDisplay');
  progress.style.strokeDashoffset = 0;
  progress.classList.remove('urgent');
  display.textContent = '60';
  display.classList.remove('urgent');

  // Reset buttons
  document.getElementById('revealBtn').disabled = true;
  updatePickButtons();

  // Remove any time-up banner
  document.querySelectorAll('.time-up-banner').forEach(b => b.remove());
}

// ── Init ───────────────────────────────────────────────────────
updatePickButtons();
// Set correct dasharray on SVG circle
document.getElementById('timerProgress').style.strokeDasharray = CIRCUMFERENCE;
