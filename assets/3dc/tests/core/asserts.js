// ./3dc/tests/core/asserts.js

export const TEST_MODE = { // "VERBOSE" | "TERSE" | "OFF"
  foundation: "TERSE",
    rays: "TERSE",
  geometry: "TERSE",
    planes: "TERSE",
    quads: "TERSE",
    perims: "TERSE",
    overlaps: "TERSE",
    advsqs: "TERSE",
  view: "TERSE",
  model: "TERSE",
    state: "TERSE",
    gambits: "TERSE",
  // Seampoint - regression test verbosity.
};

let PASS = 0;
let FAIL = 0;

let TOTAL_PASS = 0;
let TOTAL_FAIL = 0;

export function assertEqual(actual, expected, label) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);

  if (ok) {
    PASS++;
    return true;
  } else {
    FAIL++;
    console.error(`FAIL: ${label}`);
    console.error("  expected:", expected);
    console.error("  actual:  ", actual);
    return false;
  }
  }

export function assertThrows(fn, label) {
  let threw = false;

  try {
    fn();
  } catch (e) {
    threw = true;
  }

  if (threw) {
    PASS++;
  } else {
    FAIL++;
    console.error(`FAIL: ${label}`);
    console.error("  expected: throw");
    console.error("  actual:   no throw");
  }
  }

export function assertNotThrows(fn, label) {
  let threw = false;
  let error = null;

  try {
    fn();
  } catch (e) {
    threw = true;
    error = e;
  }

  if (!threw) {
    PASS++;
  } else {
    FAIL++;
    console.error(`FAIL: ${label}`);
    console.error("  expected: no throw");
    console.error("  actual:   threw");
    console.error("  error:    ", error?.message || error);
  }
}

export function snapshotTotals() {
  return { pass: TOTAL_PASS, fail: TOTAL_FAIL };
  }

export function report(name, layer = "foundation") {
  const mode = TEST_MODE[layer] || "TERSE";

  const padded = name.padEnd(17);
  const line = `${padded} ${PASS}/${PASS + FAIL} tests passed`;

  if (mode === "VERBOSE") {
    console.log(line);
  }
  
  TOTAL_PASS += PASS;
  TOTAL_FAIL += FAIL;

  PASS = 0;
  FAIL = 0;
  }

export function finalReport(module="") {
  let name = "TOTAL:";
  const length = Math.abs(TOTAL_PASS).toString().length; 
  const pad = 9 - length;
  const padded = name.padEnd(pad);

  let space = "";
  switch (length) {
    case 1: space = "  "; break;
    case 2: space = " ";  break;
    case 3: space = "";   break;
  }

  console.log(`${padded} ${TOTAL_PASS}/${space}${TOTAL_PASS + TOTAL_FAIL} tests passed - ${module}`);

  TOTAL_PASS = 0;
  TOTAL_FAIL = 0;
}

