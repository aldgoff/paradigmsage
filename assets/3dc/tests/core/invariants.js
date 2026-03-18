// ./3dc/tests/core/invariants.js

export function invariant(message, condition) {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}

