// Regression tests for GRAMMAR (regular expressions).

import {assertEqual,
        assertThrows,
 } from "./helpers.js";

import { GRAMMAR } from "../model/grammar.js";

const diag = false;

let N = 0;
N += spookyTests(diag);
N += spookyTrailingTests(diag);
N += placementTests(diag);
N += collapseTests(diag);

// --------- --------- --------- --------- //
console.log(`GRAMMAR              ${N}/${N} tests passed`);
// --------- --------- --------- --------- //

function spookyTests(diagnostic=false) {          // spooky:          /([XO])(\d)\+\((\d)$/
  let tests = [ // String, player, turm. sq1.
    { str: "", // Empty.
      invalid: null,
      },
    { str: "X1+(1", // Spooky X1.
      index: 0, length: 4, values: ['X', '1', '1'],
      },
    { str: "X1+(1,2); O2+(2,3); X3+(4,5); O4+(9", // Spooky O.
      index: 30, length: 4, values: ['O', '4', '9'],
      },
    { str: "X1+(1,2); ", // Placement X1.
      invalid: null,
      },
    { str: "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); ", // Collapse.
      invalid: null,
      },
    { str: "X12+(1", // Bad spooky X12.
      invalid: null,
      },
  ];
  
  const regex = new RegExp(GRAMMAR.spooky);      // spooky:         /([XO])(\d)\+\((\d)$/
  if(diagnostic) console.log("Spooky regex tests:");

  for (let test of tests) {
    const match = regex.exec(test.str);
    if(match === null) {
      if(diagnostic) console.log(`${regex}`, match);
      assertEqual(match,    test.invalid,    "empty|placement|collapse");
    }
    else {
      if(diagnostic) console.log(`${regex}`, match);
      assertEqual(match.index,  test.index,     "index");
      assertEqual(match.length, test.length,    "length");
      assertEqual(match[1],     test.values[0], "player");
      assertEqual(match[2],     test.values[1], "turn");
      assertEqual(match[3],     test.values[2], "square");
    }
  }

  const N = tests.length;
  console.log(`Spooky regex          ${N}/ ${N} tests passed`);

  return N;
  }

function spookyTrailingTests(diagnostic=false) {  // spookyTrailing:  /([XO])(\d)\+\((\d+)$/,
  let tests = [ // String, player, turm. sq1.
    { str: "", // Empty.
      invalid: null,
      },
    { str: "X1+(1", // Spooky X1.
      index: 0, length: 4, values: ['X', '1', '1'],
      },
    { str: "X1+(1,2); O2+(2,3); X3+(4,5); O4+(9", // Spooky O.
      index: 30, length: 4, values: ['O', '4', '9'],
      },
    { str: "X1+(1,2); O2+(2; X3+(4,5); ", // Incompleted spooky.
      invalid: null,
      },
    { str: "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); ", // Collapse.
      invalid: null,
      },
    { str: "X1+(12", // Bad spookyTrailing, no square 12.
      invalid: null,
      },
  ];
  
  const regex = new RegExp(GRAMMAR.spookyTrailing); // spookyTrailing: /([XO])(\d)\+\((\d+)$/,
  if(diagnostic) console.log("SpookyTrailing regex tests:");

  for (let test of tests) {
    const match = regex.exec(test.str);
    if(match === null) {
      if(diagnostic) console.log(`${regex}`, match);
      assertEqual(match,    test.invalid,    "empty|placement|collapse");
    }
    else {
      if(diagnostic) console.log(`${regex}`, match);
      assertEqual(match.index,  test.index,     "index");
      assertEqual(match.length, test.length,    "length");
      assertEqual(match[1],     test.values[0], "player");
      assertEqual(match[2],     test.values[1], "turn");
      assertEqual(match[3],     test.values[2], "square");
    }
  }

  const N = tests.length;
  console.log(`Spooky Trailing regex ${N}/ ${N} tests passed`);

  return N;
  }

function placementTests(diagnostic=false) {       // placement:       /([XO])(\d)\+\((\d),(\d)\)/g,
  let tests = [
    { str: "", // Empty.
      length: 0,
      },
    { str: "X1+(1", // Spooky X1.
      length: 0, values: [],
      },
    { str: "X1+(1,2); ", // Placement X1.
      length: 1, values: [{move: 1, sq1: 1, sq2: 2}],
      },
    { str: "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); ", // Collapse O2.
      length: 2, values: [{move: 1, sq1: 1, sq2: 2}, {move: 2, sq1: 1, sq2: 2}],
      },
    { str: "X1+(1,2); O2+(2,3); X3+(4,5); O4+(9", // Spooky O4.
      length: 3, values: [{move: 1, sq1: 1, sq2: 2}, {move: 2, sq1: 2, sq2: 3}, {move: 3, sq1: 4, sq2: 5}],
      },
    { str: "X11+(1,2); ", // Bad placement X11.
      length: 0, values: [],
      },
  ];
  
  const regex = new RegExp(GRAMMAR.placement);
  if(diagnostic) console.log("Placement regex tests:");

  for (let test of tests) {
    let results = [];
    let match;
    while ((match = regex.exec(test.str)) !== null) { // Capture every placement move.
      results.push({
        move: Number(match[2]),
        sq1:  Number(match[3]),
        sq2:  Number(match[4])
      });
    }
    if(diagnostic) console.log(`${regex}`, results);
    assertEqual(results.length, test.length, "length");

    let i = 0;
    for(const result of results) {                     // Test every placement move.
      if(diagnostic) console.log("result", result, test.values);
      assertEqual(result.move, test.values[i].move, "move");
      assertEqual(result.sq1,  test.values[i].sq1,  "sq1");
      assertEqual(result.sq2,  test.values[i].sq2,  "sq2");
      i++;
    }
  }

  const N = tests.length;
  console.log(`Placement regex       ${N}/ ${N} tests passed`);

  return N;
  }

function collapseTests(diagnostic=false) {        // collapseResolve: /!([XO])(\d+)\((\d)\)/g,
  let tests = [
    { str: "!O2(2)", // Example pattern.
      values: [{player: 'O', turn: 2, square: 2}],
      },
    { str: "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); ", // Single collapse.
      values: [{player: 'X', turn: 1, square: 1}, 
               {player: 'O', turn: 2, square: 2}],
      },
    { str: "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(4,5)[34]; X4@O4(4)!X3(5)!O4(4); X5+(7,8); O6+(7,8)[56]; ", // Two plus loop.
      values: [{player: 'X', turn: 1, square: 1}, 
               {player: 'O', turn: 2, square: 2},
               {player: 'X', turn: 3, square: 5}, 
               {player: 'O', turn: 4, square: 4}],
      },
  ];
  
  const regex = new RegExp(GRAMMAR.collapseResolve);
  if(diagnostic) console.log("collapseResolve regex tests:");

  for (let test of tests) {
    const classicalMap = new Map();
    let results = [];
    let match;

    while ((match = regex.exec(test.str)) !== null) { // Capture every collapseResolve move.
      const player = match[1];
      const turn   = Number(match[2]);
      const square = Number(match[3]);

      results.push({ player, turn, square });
    }
    if(diagnostic) console.log(results);

    let i = 0;
    for(const result of results) {                     // Test every collapseResolve move.
      if(diagnostic) console.log("result", result, test.values);
      assertEqual(result.player, test.values[i].player, "player");
      assertEqual(result.turn,   test.values[i].turn,   "turn");
      assertEqual(result.square, test.values[i].square, "square");
      i++;
    }
  }

  const N = tests.length;
  console.log(`collapseResolve regex ${N}/ ${N} tests passed`);

  return N;
}

/*** ----- ----- ----- ----- ***/

function templateTests(diagnostic=null) {
  let tests = [
    { str: "X1+(1", // pattern.
      length: 0, values: [],
      },
    { str: "X1+(1,2); ", // template.
      length: 1, values: [{move: 1, sq1: 1, sq2: 2}],
      },
  ];
  
  const regex = new RegExp(GRAMMAR.template);
  if(diagnostic) console.log("template regex tests:");

  for (let test of tests) {
    let results = [];
    let match;
    while ((match = regex.exec(test.str)) !== null) { // Capture every template move.
      results.push({
        move: Number(match[2]),
        sq1:  Number(match[3]),
        sq2:  Number(match[4])
      });
    }
    if(diagnostic) console.log(`${regex}`, results);
    assertEqual(results.length, test.length, "length");

    let i = 0;
    for(const result of results) {                     // Test every template move.
      if(diagnostic) console.log("result", result, test.values);
      assertEqual(result.move, test.values[i].move, "move");
      assertEqual(result.sq1,  test.values[i].sq1,  "sq1");
      assertEqual(result.sq2,  test.values[i].sq2,  "sq2");
      i++;
    }
  }

  const N = tests.length;
  console.log(`template regex       ${N}/ ${N} tests passed`);

  return N;
}

