// Controller.js.

// Model layer.
import {analyzeStateString} from "../model/analyzeStateString.js";
import {processClick,
        newGame,
}       from "../model/process.js";

// View layer.
import {initView,
        setSquareHandler,
        setStateString,
        setStatusString,
} from "../view/view.js";
import {setControlHandler} from "../view/controlsView.js";

/* State string examples.  
  X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(6,9); O6+(7,8); 
  X7+(4,6)[347|5]; @X3(4)!X3(4)!O4(5)!X5(9)!X7(6); 
  O8+(7,8)[68]; @O6(8)!O6(8)!O8(7); 
  X9+(1,3)[192]; @O2(2)!X1(1)!O2(2)!X9(3); 
*/

export function initController () {
  console.log("Controller: qt3/js/controller/controller.js");

  setControlHandler( button => {    // Registers function with view so it can be called on button events.
    handleButtonRelease(button);
  });

  setSquareHandler( squareKey => {  // Registers function with view so it can be called on square events.
    handleSquareCellClick(squareKey);   // Refactored: better architecture.
  });

  initView(); // Dev scaffolding.
}

// Main UI routines:
function handleButtonRelease(button) {
  console.log(button);
  switch (button) {
    case "New Game":
      setStatusString("Player X: place first spooky mark (click on it again to change your mind).");
      setStateString("");   // Stores the state string in the view layer.
      newGame();
      break;
    case "Restart":
      setStatusString("Player X: place first spooky mark (click on it again to change your mind).");
      break;
    case "Undo":
      break;
    case "Redo":
      break;
    case "Load":
      let loadString = "";
      loadString = "Eventually will be able to paste in a past game in the state string box."
      setStatusString(loadString);
      break;
    case "Help":
      let helpString = "";
      helpString = "QT3 is the simplest possible toy universe which can demonstrate superposition. ";
      helpString += "It has an objective measurement mechanism (cyclic entanglements). "
      helpString += "It has a clear interpretation - a quantum game implies "
      helpString += "a set of simultaneous classical games; the classical ensemble."
      setStatusString(helpString);
      break;
    default:
      console.log("default - unknown button.");
      break;
  }
  }

function handleSquareCellClick(event) {  // Respond to clicks in squares down to the cell level.
  // event - {square: 'square1', cell: 'm1'}

  // TADONE:
    // Creates canonical string, alternating players, correct move numbers, ordered squares.
    // Also detects cyclic entanglements, stems, and appends canonical loop string.
    // Supports collapse and appends canonical collapse string.
    // Spooky undo.
    // Prevents moves into classical squares.
    // Enforces end of game.

  // TODO:
    // Move listings.
    // Status strings.
    // Copy/pastable state string box.
    // Button applications.

  const squareNum = Number(event.square.slice(-1)); // Last char of 'square' is the move number.
  const cellNum = Number(event.cell.slice(-1)); // Last char of 'cell' is the move number.

  let intent = { squareNum: squareNum, cellNum: cellNum };

  const result = processClick(intent);      // {state: str, status: str}.

  let stateString  = result.stateStr;       // "X1+(1,2); O2+(2,3); X3+(1,3)[132]; "
  let statusString = result.statusStr;      // "Player O to collapse cyclic entanglement."

  setStateString(stateString);              // Stores the state string in the view layer.
  setStatusString(statusString);            // Stores the status string in the view layer.
}

