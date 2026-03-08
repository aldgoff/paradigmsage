// Controller.js.

import { QT3_LAYOUT } from "../layout.js";

import {modelSetStateString,  // Model layer.
        modelGetStateString,  // Not used.
        modelSetStatusString,
        modelGetStatusString,  // Not used.
} from "../model/model.js";
import {newGame,
        loadGame,
        processClick,
} from "../model/process.js";
import {tokenize,
        tokensToString,
 } from "../model/tokens.js";
import {invariant} from "../model/core/invariants.js";

import {initView,             // View layer.
        updateView,
        setStateString,
        setStatusString,
} from "../view/view.js";
import {setSquareHandler} from "../view/view.js";
import {setButtonHandler} from "../view/controlsView.js";

let peakTokens = [];          // Manage undo functionality.
let undoIndex = 0;
let buttons = QT3_LAYOUT.controls.buttons;
const Rerun = buttons.find(b => b.label === "Rerun");
const Undo  = buttons.find(b => b.label === "Undo");
const Redo  = buttons.find(b => b.label === "Redo");

// Undo helpers:
function rebuildFromHistory() {
  const stateString = tokensToString(peakTokens, undoIndex);
  loadGame(stateString);
  }

function manageUndoButtons() {
  Rerun.enabled = (undoIndex > 0);
  Undo.enabled  = (undoIndex > 0);
  Redo.enabled  = (undoIndex < peakTokens.length);

  invariant("undoIndex within bounds",
    0 <= undoIndex && undoIndex <= peakTokens.length
  );
}

export function initController() {
  console.log("Controller: qt3/js/controller/controller.js");
  console.log("View informs controller of button and board clicks.");
  console.log("buttons", buttons);

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
  window.addEventListener("resize", positionStateStringBox);
  window.addEventListener("scroll", positionStateStringBox);
  }

// Change state and update view.
function handleButtonRelease(button) {
  switch (button) {  // Change state.
    case "New Game": handleNewGame(); break;
    case "Rerun":    handleRerun(); break;
    case "Undo":     handleUndo(); break;
    case "Redo":     handleRedo(); break;
    case "Load":     handleLoad(); break;
    case "Help":     handleHelp(); break;
    default:
      console.log("default - unknown button.");
      break;
  }

  updateView(); // Covers all the button induced changes.
}

// Button methods tend to change state.
function handleNewGame() {
  newGame();    // model/process.js.

  peakTokens = []; // No moves to undo.
  undoIndex = 0;
  rebuildFromHistory();
  manageUndoButtons();
  }

function handleRerun() {  // Set undo index to first token.
  undoIndex = 0;

  rebuildFromHistory();
  manageUndoButtons();
  }

function handleUndo() {   // Decrement undo index.
  if (undoIndex > 0) {
    const last = peakTokens[undoIndex - 1];    // [{ type: "spooky", token: "" }, ...]

    if (last.type === "score") {  // Loops get incorportated into placement token, 
      undoIndex -= 2;             // but scores do not get incorporated into collapse token.
    } else {
      undoIndex -= 1;
    }

    rebuildFromHistory();
    manageUndoButtons();
  }
  }

function handleRedo() {   // Increment undo index.
  if (undoIndex < peakTokens.length) {
    undoIndex++;
    if((undoIndex < peakTokens.length)
    && (peakTokens[undoIndex].type === "score")) {
      undoIndex++;
    }

    rebuildFromHistory();
    manageUndoButtons();
  }
  }

function handleLoad() {   // Set peak token list to new token list from stateString.
  const textarea = document.getElementById("qt3-state-input");
  const inputString = textarea.value;

  const canonicalString = loadGame(inputString);    // Change state (via model/process.js).

  peakTokens = tokenize(canonicalString);
  undoIndex  = peakTokens.length;
  manageUndoButtons();
  } 

function handleHelp() {
  let helpString = "";
  helpString = "QT3 is the simplest possible toy universe which can demonstrate superposition. ";
  helpString += "It has an objective measurement mechanism (cyclic entanglements). "
  helpString += "It has a clear interpretation - a quantum game implies "
  helpString += "a set of simultaneous classical games; the classical ensemble."
  modelSetStatusString(helpString);
}

function handleSquareCellClick(event) {  // Respond to clicks in squares down to the cell level.
  // event - { square: 'square1', cell: 'm1' }.

  // Change state.
  const squareNum = Number(event.square.slice(-1)); // Last char of 'square' is the move number.
  const cellNum = Number(event.cell.slice(-1)); // Last char of 'cell' is the move number.

  let intent = { squareNum: squareNum, cellNum: cellNum };

  if(undoIndex < peakTokens.length) {    // Branch at current undoIndex.
    peakTokens = peakTokens.slice(0, undoIndex);
    rebuildFromHistory();
  }

  const strings = processClick(intent);  // {state: str, status: str}.

  // Update view and undo system.
  let stateString  = strings.stateStr;   // "X1+(1,2); O2+(2,3); X3+(1,3)[132]; "
  let statusString = strings.statusStr;  // "Player O to collapse cyclic entanglement."

  setStateString(stateString);           // Set state string in the view layer.
  setStatusString(statusString);         // Set status string in the view layer.

  peakTokens = tokenize(stateString);    // Capture new peak tokens for undo functionality.
  undoIndex = peakTokens.length;
  manageUndoButtons();
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

