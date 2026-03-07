// ./assets/qt3/js/model/core/invariants.js

export function invariant(message, condition) {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}

