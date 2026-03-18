// ./3dc/tests/core/invariants.js

export function invariant(condition, message) {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}

