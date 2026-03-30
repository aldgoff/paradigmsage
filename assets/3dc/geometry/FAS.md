# FAS Spec

# SECTION 1 - HUMAN-READABLE EXPLANATION

# 1.1 Purpose
  Define **full** advancement squares (FAS).

# 1.2 Concepts
  An advancement square is the foundation for how pieces move and interact.
  A source piece may **move** to any tile in an advancement square as long as all earlier perimeters are unblocked.
  A target piece might be 
    - under attack
    - blocking an attack
    - pinned against a third piece
    - discover an attack if moved

  As a geometrical element it fills the entire quadrant, a full advancement square.

## 1.2.1 Overloaded Meaning
  A **full** advancement square (FAS) fills the entire quadrant, without regard to other pieces.
  An **advancing** piece grows the advancememnt square one perimeter at a time.
  Threat assessment requires the **full** advancement square (attacks, blocks, pins, discovers).
  A move requires a **growing** advancement square.

## 1.2.2 Full Advancement Squares
  An advancement square is confined to one quadrant.
  A **full** advancement square fills the entire quadrant.
  It consists of a source (origin) tile and the entire set of nested perimeters.
  The last perimeter is the last one that still has at least one tile onboard.
  It is NxN, where N = k + 1, with k as the kth perimeter (1-based).
  It is specified therefore by three parameters:
    S - source or origin tile.
    Q - the quadrant, (1-60).
    k - the last onboard perimeter.

## 1.2.3 Growing Advancement Square (GAS)
  A **growing** advancement square determines if a move is **allowed**.
  Both source and target tiles must be in the same advancement square.
  They may be in more than one.
  A move is **valid** iff it is both allowed and **unblocked**.
  If a piece advances to perimeter k, it creates an NxN advancement square (N=k+1).

## 1.2.4 Advancement
  A piece may advance into a quadrant of the allowed type.
  Each successive perimeter must be empty for the piece to advance.
  Further advancement is blocked if the next perimeter is not empty.

## 1.2.5 Analysis
  If there is a single piece on perimeter k belonging to the opponent, capture is permitted.
  If there are two or more pieces, neither advance nor capture to or past that perimeter is permitted.


# SECTION 2 — MACHINE‑READABLE CONSTRAINTS
  (This section is the ACTUAL spec for JSON + Python generation)

  Everything below must be rigid, explicit, and unambiguous.
  This is the section the LLM MUST follow exactly.
  No prose, no explanation, no optional interpretations.

# 2.1 Module Name
  No JSON file is used in L7.
  The Python file name shall match the spec name.

# 2.2 Overloading of “Advancement Square”
  Advancement square includes the origin tile, which is synonymous with perimeter 0 (k=0).
  The term advancement square has two distinct meanings:

  FULL Advancement Square (FAS):
    The maximal geometric expansion of a piece’s quadrant, ignoring pieces and move legality.
    Used for threats, pins, blocks, discovered attacks, and structural analysis.
    This is the sole meaning used in this layer (L7).

  GROWING Advancement Square (GAS):
    The perimeter-by-perimeter movement envelope while a piece is advancing on the board.
    Stops when blocked or when the player selects a target square.
    This belongs to later layers (L8+), not L7.

# 2.3 Specifications
  Imports of previous layers.
  Functions.
  Comprehensive smoke test.

# 2.4 Functions
  - Create a FAS:
    Inputs:
      The source (or origin) tile, positional notation.
      The quadrant (in any of its canonical forms).
      The spec_name for the board size ("8x8x8").
    Computation:
      Create a list of nested Perim objects.
      Terminate on the last perimeter which still has at least on tile on board.
        Should be less than the maximum dimension of the board.
      Tally the number of tiles onboard (sum of perimeter onboard tiles).
        L6 guarantees that stride perimeters P(k) are disjoint sets; 
        therefore the total tile count of a FULL Advancement Square is the sum of the sizes of all P(k).
    Output:
      A dictionary: {
        "inputs": {
          "origin": S,
          "origin_vts": S_vts,
          "quad": Q,
          "spec": spec_name
          },
        "qmap":
          the dictionary entry from the json quadMap_module,
        "ray_pairs": {
          "ray_vectors": [v1, v2]
          },
        "perimeters":
          a list of L6 Perim objects in order, k=0..k_final,
        "outputs": {
          "k_final": k_final,
          "N": N,
          "Area": N*N,
          "Onboard": [onboard, N*N-onboard]
          }
      }

  - Display a FAS:
    Inputs:
      Dictionary of the FAS.
      Flag for printing the strides.
    Computation:
      Print the inputs as a group.
      Print the perimeter tiles (one line per primeter, no vertical space).
      Optionally print the strides (separated by one vertical line).
      Print the outputs.
