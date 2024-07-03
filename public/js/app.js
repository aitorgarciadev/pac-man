let pacman,
  scoreDisplay,
  ghostSpawnInterval,
  gameOver = false,
  ghostsEaten = 0,
  score = 0,
  targetPosition = null;

const moveSpeed = 5;

document.addEventListener("DOMContentLoaded", () => {
  initializeGame();
});

function initializeGame() {
  scoreDisplay = document.querySelector(".score-display");
  pacman = document.querySelector(".pacman-character");
  pacman.style.position = "absolute";
  centerPacman();
  ghostSpawnInterval = setInterval(spawnGhost, 2000);
  document.addEventListener("click", handleClick);
  requestAnimationFrame(movePacman);
}

function centerPacman() {
  const container = document.querySelector(".game-container");
  pacman.style.left = `${(container.clientWidth - pacman.clientWidth) / 2}px`;
  pacman.style.top = `${(container.clientHeight - pacman.clientHeight) / 2}px`;
}

function handleClick(event) {
  const container = document.querySelector(".game-container"),
    containerRect = container.getBoundingClientRect(),
    target = event.target,
    targetRect = target.getBoundingClientRect();

  targetPosition =
    target.classList.contains("ghost-character") ||
    target.classList.contains("cherry-item")
      ? {
          x: targetRect.left - containerRect.left,
          y: targetRect.top - containerRect.top,
          element: target,
        }
      : {
          x: event.clientX - containerRect.left,
          y: event.clientY - containerRect.top,
        };
}

function spawnGhost() {
  if (!gameOver)
    createGameItem("ghost-character", "/src/assets/fantasmito.png");
}

function spawnCherry() {
  createGameItem("cherry-item", "/src/assets/cherry.png");
}

function createGameItem(className, src) {
  const container = document.querySelector(".game-container"),
    item = document.createElement("img");

  item.className = className;
  item.src = src;
  item.style.position = "absolute";
  item.style.left = `${Math.random() * (container.clientWidth - 30)}px`;
  item.style.top = `${Math.random() * (container.clientHeight - 30)}px`;

  container.appendChild(item);
}

function movePacman() {
  if (gameOver || !targetPosition) return requestAnimationFrame(movePacman);

  const container = document.querySelector(".game-container"),
    containerRect = container.getBoundingClientRect(),
    pacmanRect = pacman.getBoundingClientRect(),
    pacmanX = pacmanRect.left - containerRect.left,
    pacmanY = pacmanRect.top - containerRect.top,
    deltaX = targetPosition.x - pacmanX,
    deltaY = targetPosition.y - pacmanY;

  if (Math.abs(deltaX) > moveSpeed) {
    pacman.style.left = `${pacmanX + Math.sign(deltaX) * moveSpeed}px`;
  } else if (Math.abs(deltaY) > moveSpeed) {
    pacman.style.top = `${pacmanY + Math.sign(deltaY) * moveSpeed}px`;
  } else {
    if (targetPosition.element) consumeItem(targetPosition.element);
    targetPosition = null;
  }

  requestAnimationFrame(movePacman);
}

function consumeItem(item) {
  if (item.classList.contains("ghost-character")) {
    ghostsEaten++;
    updateScore(100);
    if (ghostsEaten % 3 === 0) spawnCherry();
  } else if (item.classList.contains("cherry-item")) {
    updateScore(500);
  }
  item.remove();
}

function updateScore(points) {
  score += points;
  scoreDisplay.textContent = score.toString().padStart(4, "0");
  if (score >= 5000) endGame();
}

function endGame() {
  gameOver = true;
  clearInterval(ghostSpawnInterval);
  document.querySelector(".game-over").style.display = "block";
}
