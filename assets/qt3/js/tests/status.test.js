// Regression tests for analyzeStateString().

import {assertEqual,
        assertThrows,
 } from "./helpers.js";

import {ERROR,
        STATUS,
} from "../model/status.js";

let state = "";
let res = null;
let N = 0;

let errorTests = [
  { condition: "stem", errorString: "Cannot collapse spooky marks on stems." },
  { condition: "loop", player: 'X', errorString: "X must first collapse the cyclic entanglement." },
  { condition: "squareCollapsed", errorString: "That square has collapsed." },
  { condition: "gameOver", errorString: "Game is over." },
  { condition: "emptyLoad", errorString: "No game in the state string box to load." },
  ];

for (let test of errorTests) {
  // console.log("errorTests", test);
  res = ERROR[test.condition](test.player);
  assertEqual(res, test.errorString, test.condition);
}

N = errorTests.length;
console.log(`error                 ${N}/ ${N} tests passed`);
// --------- --------- --------- --------- //


let statusTests = [
  { condition: "welcome", player: 'X',
    statusString: "Welcome to quantum tic-tac-toe (QT3)."
    },
  { condition: "newGame", player: 'X',
    statusString: "Player X: place first spooky mark (click it again to change your mind)."
    },
  { condition: "spooky", player: 'X',
    statusString: "X, place first spooky mark (click again to change your mind)."
    },
  { condition: "undoSpooky", player: 'X',
    statusString: "Spooky mark undone. X: restart your placement move, place a spooky mark in any uncollapsed square."
    },
  { condition: "spooky2", player: 'X',
    statusString: "Continue with rest of placement move. X, place your second spooky mark, or undo the first one."
    },
  { condition: "placement", player: 'O',
    statusString: "O, begin your next placement move, place a pair of spooky marks in any pair of uncollapsed squares."
    },
  { condition: "collapse", player: 'X',
    statusString: "Loop detected. X, select a purple spooky mark to collapse it into that square."
    },
  { condition: "uncollapsed", player: 'X',
    statusString: "Click on a purple spooky mark."
    },
  { condition: "orange", player: 'X',
    statusString: "X must click on a purple spooky mark, orange marks are stems, their classical value predetermined."
    },
  { condition: "spookyAfterError", player: 'X',
    statusString: "X, place first spooky mark in any uncollapsed square."
    },
  { condition: "alreadyCollapsed",
    statusString: "Choose another."
    },
  { condition: "degenerate",
    statusString: "X: click in lone empty square, no room for a pair of spooky marks. Move will self-collapse."
    },
  { condition: "selfCollapse", score: "X=2.0, O=0.0",
    statusString: "Last move self-collapsed (degenerate). Game over: X=2.0, O=0.0."
    },
  { condition: "score", score: "X=1.5, O=0.0",
    statusString: "Game over: X=1.5, O=0.0"
    },
  { condition: "gameOver",
    statusString: "New Game|Rerun|Undo|Load.",
    },
  // Load specific.
  { condition: "playOrLoad",
    statusString: "Start playing or try something like this, 'X1+(1,2); O2+(2,3); '.",
    },
  ];

for (let test of statusTests) {
  // console.log("statusTests", test);
  if(test.score != null)
    res =  STATUS[test.condition](test.score);
  else
    res =  STATUS[test.condition](test.player);
  assertEqual(res, test.statusString, test.condition);
}

N = statusTests.length;
console.log(`status               ${N}/${N} tests passed`);
// --------- --------- --------- --------- //


// --------- --------- --------- --------- //
N = errorTests.length + statusTests.length;
console.log(`status & error msgs  ${N}/${N} tests passed`);
// --------- --------- --------- --------- //
