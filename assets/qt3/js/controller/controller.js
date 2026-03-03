// Controller.js.

import { QT3_LAYOUT } from "../layout.js";

// Model layer.
import {modelSetStateString,  // The state of the game is held in the model layer.
        modelGetStateString,
        modelSetStatusString,
        modelGetStatusString,
} from "../model/model.js";
import {newGame,
        loadGame,
        processClick,
} from "../model/process.js";

// View layer.
import {initView,
        updateView,
        setStateString,
        setStatusString,
} from "../view/view.js";
import {setSquareHandler} from "../view/view.js";
import {setButtonHandler} from "../view/controlsView.js";

export function initController () {
  console.log("Controller: qt3/js/controller/controller.js");
  console.log("View informs controller of button and board clicks.");

  // Change state.
  modelSetStatusString("Welcome to quantum tic-tac-toe (QT3). Click on New Game to begin.");
  modelSetStateString("");

  // Callbacks so controller can change state by button or by mouse clicks.
  setButtonHandler( button => {    // Registers function with view so it can be called on button events.
    handleButtonRelease(button);
    });

  setSquareHandler( squareKey => {  // Registers function with view so it can be called on square events.
    handleSquareCellClick(squareKey);
  });

  // Update view for the first time.
  initView();

  positionStateStringBox();
}

// Change state and update view.
function handleButtonRelease(button) {
  console.log(button, "button");

  // Change state.
  switch (button) {
    case "New Game": handleNewGame(); break;
    case "Rerun":    handleRerun(); break;
    case "Undo":     handleUndo(); break;
    case "Redo":     handleRerun(); break;
    case "Load":     handleLoad(); break;
    case "Help":     handleHelp(); break;
    default:
      console.log("default - unknown button.");
      break;
  }

  // Update view.
  updateView();
}

// Methods with change state.
function handleNewGame() {
  newGame();    // model/process.js.
  }

function handleRerun() {
  setStatusString("Player X: place first spooky mark (click on it again to change your mind).");
  // TODO: write handleRerun().
  }

function handleUndo() {
  // TODO: write handleUndo().
  }

function handleRedo() {
  // TODO: write handleRedo().
  }

function handleLoad() {
  const textarea = document.getElementById("qt3-state-input");
  const stateString = textarea.value;

  loadGame(stateString);    // Change state (via model/process.js).
  updateView();
  } 

function handleHelp() {
  let helpString = "";
  helpString = "QT3 is the simplest possible toy universe which can demonstrate superposition. ";
  helpString += "It has an objective measurement mechanism (cyclic entanglements). "
  helpString += "It has a clear interpretation - a quantum game implies "
  helpString += "a set of simultaneous classical games; the classical ensemble."
  modelSetStatusString(helpString);
}

// Change state and update view.
function handleSquareCellClick(event) {  // Respond to clicks in squares down to the cell level.
  // event - {square: 'square1', cell: 'm1'}

  // TADONE:
    // Creates canonical string, alternating players, correct move numbers, ordered squares.
    // Detects cyclic entanglements, stems, and appends canonical loop string.
    // Supports collapse and appends canonical collapse string.
    // Spooky undo.
    // Prevents moves into classical squares.
    // Enforces end of game, computes score.
    // Move listings (quantum and classical).
    // Copy/pastable state string box.

  // TODO:
    // Status strings.
    // Button applications.
  //

  // Change state.
  const squareNum = Number(event.square.slice(-1)); // Last char of 'square' is the move number.
  const cellNum = Number(event.cell.slice(-1)); // Last char of 'cell' is the move number.

  let intent = { squareNum: squareNum, cellNum: cellNum };

  const strings = processClick(intent);  // {state: str, status: str}.

  // Update view.
  let stateString  = strings.stateStr;   // "X1+(1,2); O2+(2,3); X3+(1,3)[132]; "
  let statusString = strings.statusStr;  // "Player O to collapse cyclic entanglement."

  setStateString(stateString);          // Set state string in the view layer.
  setStatusString(statusString);        // Set status string in the view layer.
}

// TODD: This needs to be dynamic, when user changes size of browser window.
function positionStateStringBox() { // Editable, copiable, pasteable field.
  const textarea = document.getElementById("qt3-state-input");
  const container = document.getElementById("qt3-container");
  const canvas = document.getElementById("qt3-game");
  const rect = canvas.getBoundingClientRect();

  const { x, y, w, h } = QT3_LAYOUT.stateBox;

  textarea.style.position = "absolute";
  textarea.style.left = (window.scrollX + rect.left + x) + "px";
  textarea.style.top  = (window.scrollY + rect.top  + y) + "px";
  textarea.style.width = w + "px";
  textarea.style.height = h + "px";

  textarea.style.fontFamily = "monospace";
  textarea.style.fontSize = "13px";
  textarea.style.background = "#555";
  textarea.style.color = "#0f0";
  textarea.style.border = "1px solid #555";
  textarea.style.padding = "8px";
  textarea.style.resize = "none";
}

