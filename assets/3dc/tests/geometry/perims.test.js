/* File: perims.tests.js
  Path: ./3dc/tests/perims/
  Purpose: Test the perims module.
  Author: Allan Goff
  Date: 3/27/26
  UI: the export functions.
*/

// --- Regression framework ---
import {TEST_MODE,
        assertEqual,
        assertThrows,
        report,
        snapshotTotals,
        finalReport,
} from "../core/asserts.js";
import {invariant
} from "../core/invariants.js";

// --- Layers ---
import {getBoardSpec,
} from "../../foundation/coords/coords.js";
import {bishopColorVts,
        dukeColorVts,
} from "../../foundation/colors/colors.js";
import { getRayVector
} from "../../foundation/rays/rays.js";

import {quadToRayPair,
        nextQuadInPlane,
        planeToQuads,
        quadToPlane,
} from "../../geometry/quads/quads.js";

// --- Module ---
import {getStride,
        prevPerimeter,
        nextPerimeter,
        isTileInPlane,
} from "../../geometry/perims.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_getStride();
  test_OutAndBack();
  test_bishop_perimeter();
  test_duke_perimeter();
  test_plane_membership();
  test_orbit_perimeters();

  test_invalid_k();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;

  finalReport("Geometry/perims");
}

// ------------------------------------------------------------

// Passing tests.
function test_getStride() {
  const cases = [
    { quad: 1, k: 0,  // Q1 → ["left_fore", "right_fore"]
      expected: [ [0,0,0] ],
      label: "Q1 k=0 basic"
      },
    { quad: 1, k: 1,  // Q1 → ["left_fore", "right_fore"]
      expected: [ [0,1,0],
                  [0,1,1],
                  [0,0,1] ],
      label: "Q1 k=1 basic"
      },
    { quad: 1, k: 2,  // Q1 → ["left_fore", "right_fore"]
      expected: [ [0,2,0],
                  [0,2,1],
                  [0,2,2],
                  [0,1,2],
                  [0,0,2] ],
      label: "Q1 k=2 basic"
      },
    { quad: 1, k: 3,  // Q1 → ["left_fore", "right_fore"]
      expected: [ [0,3,0],
                  [0,3,1],
                  [0,3,2],
                  [0,3,3],
                  [0,2,3],
                  [0,1,3],
                  [0,0,3] ],
      label: "Q1 k=3 basic"
      },
    { quad: 1, k: 4,  // Q1 → ["left_fore", "right_fore"]
      expected: [ [0,4,0],
                  [0,4,1],
                  [0,4,2],
                  [0,4,3],
                  [0,4,4],
                  [0,3,4],
                  [0,2,4],
                  [0,1,4],
                  [0,0,4] ],
      label: "Q1 k=4 basic"
      }
  ];

  for (const { quad, k, expected, label } of cases) {
    const { stride, E1, E2, apex } = getStride({ quad, k });

    assertEqual(stride, expected, `${label} stride`);         // Stride tiles.

    assertEqual(E1, expected[0], `${label} E1`);              // Special tiles.
    assertEqual(apex, expected[k], `${label} apex`);
    assertEqual(E2, expected[expected.length - 1], `${label} E2`);

    assertEqual(stride.length, 2*k + 1, `${label} length`);   // Length.
  }

  report("getStride", "perims");
  }

function test_OutAndBack() {
  const values = [
    [1, 2], [5, 4], [9, 7],         // Rook.
    [13, 2], [19, 4], [25, 6], [31, 7],        // Bishop.
    [40, 2], [44, 3], [48, 4], [52, 5], [56, 6], [60, 7]  // Duke.
  ];

  for (const val of values) {
    const [quad, k] = val;
    const label = `Q${quad} k=${k}`;

    const next = nextPerimeter({ quad, k });
    const prev = prevPerimeter({ quad, k: next.k });

    assertEqual(
      prev.stride,
      getStride({ quad, k }).stride,
      `${label} out and back`
    );
  }

  for (const val of values) {
    const [quad, k] = val;
    const label = `Q${quad} k=${k}`;

    const prev = prevPerimeter({ quad, k });
    const next = nextPerimeter({ quad, k: prev.k });

    assertEqual(
      next.stride,
      getStride({ quad, k }).stride,
      `${label} out and back`
    );
  }

  report("OutAndBack", "perims");
  }

function test_bishop_perimeter() {
  const quad = 13;   // pick a bishop-plane quad (adjust as needed)
  const k = 3;

  const { stride } = getStride({ quad, k });

  const firstColor = bishopColorVts(stride[0]);

  for (const tile of stride) {
    assertEqual(
      bishopColorVts(tile),
      firstColor,
      "bishop plane color invariant"
    );
  }

  report("bishop_perimeter", "perims");
  }

function test_duke_perimeter() {
  const quad = 37;   // pick a duke-plane quad (adjust as needed)
  const k = 5;

  const { stride } = getStride({ quad, k });

  const firstColor = dukeColorVts(stride[0]);

  for (const tile of stride) {
    assertEqual(
      dukeColorVts(tile),
      firstColor,
      "duke plane color invariant"
    );
  }

  report("duke_perimeter", "perims");
  }

function test_plane_membership() {
  const values = [
    [1, 3],
    [13, 3],
    [37, 4]
  ];

  for (const [quad, k] of values) {
    const label = `Q${quad} k=${k}`;
    const { stride } = getStride({ quad, k });

    assertStrideInPlane({ quad, stride, label });
  }

  report("plane_membership", "perims");
  }

function test_orbit_perimeters() {
  const cases = [
    { quad:  1, k: 1 },  // rook planes.
    { quad:  5, k: 2 },
    { quad:  9, k: 3 },
    { quad: 13, k: 3 },  // bishop planes.
    { quad: 19, k: 4 },
    { quad: 25, k: 5 },
    { quad: 31, k: 4 },
    { quad: 37, k: 5 },   // duke planes.
    { quad: 37, k: 4 },
    { quad: 41, k: 5 },
    { quad: 45, k: 6 },
    { quad: 49, k: 7 },
    { quad: 53, k: 8 },
    { quad: 57, k: 9 },
  ];

  for (const { quad: startQuad, k } of cases) {
    let quad = startQuad;
    const label = `orbit Q${startQuad} k=${k}`;

    const first = getStride({ quad, k });         // First perimeter.
    let prevE1 = first.E1;

    const plane = quadToPlane(startQuad);         // Number of quads in plane.
    const cycleLength = planeToQuads(plane).length;

    for (let step = 0; step < cycleLength; step++) {  // For each quad in succession.
      const curr = getStride({ quad, k });

      assertEqual(curr.E1, prevE1, `${label} step ${step} continuity`);   // Continuity.

      const nextQ = nextQuadInPlane(quad);                                // Next quad.
      const nextStride = getStride({ quad: nextQ, k });

      assertEqual(curr.E2, nextStride.E1, `${label} step ${step} E2→E1`); // Quad to quad invariant.

      prevE1 = nextStride.E1;
      quad = nextQ;
    }

    const final = getStride({ quad, k });         // Closure.

    assertEqual(final.E1, first.E1, `${label} closure`);
  }

  report("orbit_perimeter", "perims");
}

// Failing tests.
function test_invalid_k() {
  const values = [1, 13, 37]; // Sample quads across plane types.

  for (const quad of values) {
    const label = `Q${quad}`;

    assertThrows( () => getStride({ quad, k: -1 }), `${label} k=-1 invalid`); // k < 0.
    assertThrows( () => prevPerimeter({ quad, k: 0 }), `${label} prev k=1 invalid`); // prevPerimeter with k=1 (invalid).
  }

  report("invalid_k", "perims");
}
// Seampoint: more tests...

// --- Helpers ---
function assertStrideInPlane({ quad, stride, label }) {
  const [ray1, ray2] = quadToRayPair(quad);
  const v1 = getRayVector(ray1);
  const v2 = getRayVector(ray2);

  for (const tile of stride) {
    assertEqual(
      isTileInPlane(tile, v1, v2),
      true,
      `${label} plane membership`
    );
  }
}

