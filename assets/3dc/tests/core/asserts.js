// ./3dc/tests/core/asserts.js

export const TEST_MODE = { // "VERBOSE" | "TERSE" | "OFF"
  foundation: "TERSE",
  geometry: "VERBOSE",
  planes: "TERSE",
  quads: "TERSE",
  perims: "VERBOSE",
  // Seam point - regression test verbosity.
};

let PASS = 0;
let FAIL = 0;

let TOTAL_PASS = 0;
let TOTAL_FAIL = 0;

export function assertEqual(actual, expected, label) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);

  if (ok) {
    PASS++;
  } else {
    FAIL++;
    console.error(`FAIL: ${label}`);
    console.error("  expected:", expected);
    console.error("  actual:  ", actual);
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

export function finalReport() {
  let name = "TOTAL";
  const padded = name.padEnd(11);
  console.log(`${padded} ${TOTAL_PASS}/${TOTAL_PASS + TOTAL_FAIL} tests passed`);

  TOTAL_PASS = 0;
  TOTAL_FAIL = 0;
}

