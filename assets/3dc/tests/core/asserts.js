// ./3dc/tests/core/asserts.js

export function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}\nExpected: ${expected}\nActual:   ${actual}`);
  }
}

export function assertThrows(fn, label) { // TODO: assertThrows is underutilized.
  let threw = false;
  try {
    fn();
  } catch (e) {
    threw = true;
  }
  if (!threw) {
    throw new Error(`Expected invariant failure: ${label}`);
  }
}

