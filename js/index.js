import {Game} from "./game.js";

const elements = {
  newGameBtnEl: document.querySelector(".control-panel__new-game"),
  soundBtnEl: document.querySelector(".control-panel__sound"),
  colorThemeBtnEl: document.querySelector(".control-panel__color-theme"),
  showControlsBtnEl: document.querySelector(".show-controls"),
  controlPanelEl: document.querySelector(".control-panel"),
  overlayEl: document.querySelector(".overlay"),
  gameWindowEl: document.querySelector(".game-window"),
  scoreEl: document.querySelector(".stats__score span"),
  highscoreEl: document.querySelector(".stats__highscore span"),
}

const globalVariables = {
  errorSound: new Audio("../sounds/error.wav"),
  burstSound: new Audio("../sounds/burst.wav"),

  mute: false,
  theme: "dark",
  score: 0,
  highscore: 0,
  controlPanelHidden: true,

  fieldSize: 10,
  game: undefined,
}

configureGameWindow();
startNewGame();

function configureGameWindow() {
  elements.gameWindowEl.style =
    `grid-template-columns: repeat(${globalVariables.fieldSize}, 1fr); 
     grid-template-rows: repeat(${globalVariables.fieldSize}, 1fr);`
}

function startNewGame() {
  globalVariables.game = new Game(globalVariables.fieldSize);
  globalVariables.score = 0;
  updateUI();
}

function updateUI() {
  elements.gameWindowEl.innerHTML = "";
  const field = globalVariables.game.field;

  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      const cellType = field[i][j];
      const cell = createCell(cellType, i, j);
      elements.gameWindowEl.append(cell);
    }
  }

  elements.scoreEl.textContent = globalVariables.score;
  elements.highscoreEl.textContent = globalVariables.highscore;
}

function createCell(cellType, row, column) {
  const cell = document.createElement("div");
  if (cellType) {
    cell.classList.add("active-cell", `cell-style-${cellType}`);
    cell.dataset.row = row;
    cell.dataset.column = column;
  }
  return cell;
}

function addAnimationToBurstCells(burstCells) {
  const cells = elements.gameWindowEl.querySelectorAll(".active-cell");
  for (const cell of cells) {
    if (burstCells.has(Number(cell.dataset.row), Number(cell.dataset.column))) {
      cell.classList.add("cell-scale-down");
    }
  }
}

///////////////////////////////////////////////
//////////// Event handlers
elements.newGameBtnEl.addEventListener("click", startNewGame);

elements.gameWindowEl.addEventListener("click", event => {
  if (event.target.classList.contains("active-cell")) {
    const row = Number(event.target.dataset.row);
    const column = Number(event.target.dataset.column);

    const [currentScore, burstCells] = globalVariables.game.click(row, column);
    if (currentScore > 0) {
      addAnimationToBurstCells(burstCells);
      if (!globalVariables.mute) globalVariables.burstSound.play();

      globalVariables.score += currentScore;
      if (globalVariables.score > globalVariables.highscore) globalVariables.highscore = globalVariables.score;

      setTimeout(updateUI, 500);
    } else if (!globalVariables.mute) {
      globalVariables.errorSound.play();
    }
  }
});

elements.colorThemeBtnEl.addEventListener("click", event => {
  if (globalVariables.theme === "dark") {
    document.documentElement.style.setProperty("--color-primary", "#bbb");
    document.documentElement.style.setProperty("--color-secondary", "#333");
    event.currentTarget.textContent = "Dark theme";
    globalVariables.theme = "light";
  } else {
    document.documentElement.style.setProperty("--color-primary", "#222");
    document.documentElement.style.setProperty("--color-secondary", "#fff");
    event.currentTarget.textContent = "Light theme";
    globalVariables.theme = "dark";
  }
});

elements.soundBtnEl.addEventListener("click", event => {
  if (globalVariables.mute) {
    event.currentTarget.textContent = "Mute";
    globalVariables.mute = false;
  } else  {
    event.currentTarget.textContent = "Unmute";
    globalVariables.mute = true;
  }
});

elements.showControlsBtnEl.addEventListener("click", () => {
  if (globalVariables.controlPanelHidden) {
    elements.controlPanelEl.style.display = "flex";
    elements.overlayEl.style.display = "block";
    globalVariables.controlPanelHidden = false;
  } else {
    elements.controlPanelEl.removeAttribute("style");
    elements.overlayEl.removeAttribute("style");
    globalVariables.controlPanelHidden = true;
  }
});
