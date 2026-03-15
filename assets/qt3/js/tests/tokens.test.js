// Regression tests for tokens().

import {assertEqual,
        assertThrows,
 } from "./helpers.js";

import { tokenize } from "../model/tokens.js";

/* Method that given a state string will return an array of objects { type, token } where
   type is "empty|invalid|spooky|placement|pureLoop|stemLoop|collapse|degenerate|selfCollapse|score" and 
   token is a string, typically a move element "X1+(1,2);". 
*/

let N = 0;
// --------- --------- --------- --------- //

let fragmentTests = [ 
  { str: "", type: "empty"},
  { str: ".", type: "invalid"},
  { str: "X1+(3", type: "spooky"},
  { str: "X1+(3,8)", type: "placement"},
  { str: "X1+(1,2); O2+(1,2)[12]", type: "pureLoop"},
  { str: "X1+(1,2); O2+(2,3); X3+(2,3)[23|1]", type: "stemLoop"},
  { str: "X2@O2(1)!X1(2)!O2(1)", type: "collapse"},
  { str: "X9+(5,5)", type: "degenerate"},
  { str: "O9@X9(5)!X9(5)", type: "selfCollapse"},
  { str: "{X=1, O=0}", type: "score"},
  ];
N = fragmentTests.length;

for (let test of fragmentTests) {
  const parse = tokenize(test.str);   // Returns: [{ type: "spooky", token: "" }];
  let last = parse[parse.length - 1];

  assertEqual(last.type, test.type);
}

console.log(`tokenize(fragments)   ${N}/${N} tests passed`);
// --------- --------- --------- --------- //


let stringTests = [ 
  // Valid strings.
    { str: "", type: ["empty"]},
    { str: "{X=2, O=0}", type: ["score"]},
    { str: "X9+(5,5); {X=2, O=0}", type: ["degenerate", "score"]},
    { str: "X1+(1,2); O2+(1;", type: ["placement", "spooky"]},
    { str: "X1+(1,2); O2+(1,2)[12]; X2@O2(2)!X1(1)!O2(2); ", type: ["placement", "pureLoop", "collapse"]},
    { str: "X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; O3@O2(2)!X1(1)!O2(2)!X3(3); ", 
      type: ["placement", "placement", "stemLoop", "collapse"]},
    { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,1)[165432]; X6@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8); "
        + "X7+(4,7); O8+(4,7)[78]; X8@X7(7)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X9(5); {X=2, O=0}", 
      type: ["placement", "placement", "placement", "placement", "placement", "pureLoop", "collapse",
            "placement", "pureLoop", "collapse", "degenerate", "selfCollapse", "score"]},

  // Invalid strings.
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,1)[165432]; X6@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8); "
       + "X7+(4,7); O8+(4,7)[78]; X8@X7(7)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X9(5); {X=2, O=}", 
    type: ["placement", "placement", "placement", "placement", "placement", "pureLoop", "collapse",
           "placement", "pureLoop", "collapse", "degenerate", "selfCollapse", "invalid"]},
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,1)[165432]; X6@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8); "
       + "X7+(4,7); O8+(4,7)[78]; X8@X7(7)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X95); {X=2, O=0}", 
    type: ["placement", "placement", "placement", "placement", "placement", "pureLoop", "collapse",
           "placement", "pureLoop", "collapse", "degenerate", "invalid", "score"]},
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,1)[165432]; X6@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8); "
       + "X7+(4,7); O8+(4,7)[78]; X8@X7(7)!X7(7)!O8(4); X9+(5); O9@X9(5)!X9(5); {X=2, O=0}", 
    type: ["placement", "placement", "placement", "placement", "placement", "pureLoop", "collapse",
           "placement", "pureLoop", "collapse", "invalid", "selfCollapse", "score"]},
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,1)[165432]; X6@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8); "
       + "X7+(4,7); O8+(4,7)[78]; X87)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X9(5); {X=2, O=0}", 
    type: ["placement", "placement", "placement", "placement", "placement", "pureLoop", "collapse",
           "placement", "pureLoop", "invalid", "degenerate", "selfCollapse", "score"]},
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,1)[165432]; X6@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8); "
      + "X7+(4,7); O8+(4,7)[7; X8@X7(7)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X9(5); {X=2, O=0}", 
    type: ["placement", "placement", "placement", "placement", "placement", "pureLoop", "collapse",
           "placement", "invalid", "collapse", "degenerate", "selfCollapse", "score"]},
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,1)[165432]; X6@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8); "
      + "X7(4,7); O8+(4,7)[78]; X8@X7(7)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X9(5); {X=2, O=0}", 
    type: ["placement", "placement", "placement", "placement", "placement", "pureLoop", "collapse",
           "invalid", "pureLoop", "collapse", "degenerate", "selfCollapse", "score"]},

  // Corruption pairs:
    { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,9)[56|1234]; X6@X5(9)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8); X7+(7,4); O8+(4,5); X9+(5", 
      type: ["placement", "placement", "placement", "placement", "placement", "stemLoop", "collapse", "placement", "placement", "spooky"]},
    { str: "X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; O3@O2(2)!X1(1)!O2(2)!X3(3); O4+(4,5); X5+(5,6); O6+(9", 
      type: ["placement", "placement", "stemLoop", "collapse", "placement", "placement", "spooky"]},
    { str: "X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; O3@O2(2)!X1(1)!O2(2)!X3(3); O4+(); X5+(5,6); O6+(9", 
      type: ["placement", "placement", "stemLoop", "collapse", "invalid", "placement", "spooky"]},
  ];
N = stringTests.length;

for (let test of stringTests) {
  const tokens = tokenize(test.str);   // Returns: [{ type: "spooky", token: "" }, {...}, ...];

  for (let i=0; i<tokens.length; i++ ) {
    assertEqual(tokens[i].type, test.type[i]);
  }
}

console.log(`tokenize(strings  )   ${N}/${N} tests passed`);
// --------- --------- --------- --------- //


N = fragmentTests.length + stringTests.length;
console.log(`tokenize()           ${N}/${N} tests passed`);
// --------- --------- --------- --------- //

