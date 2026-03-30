# GAS Spec

# SECTION 1 - HUMAN-READABLE EXPLANATION

# 1.1 Purpose
  Define **growing** advancement squares (GAS).

# 1.2 Concepts
  An advancement square is the foundation for how pieces move and interact.
  An advancement square encapsulates power projection.

## 1.2.1 Overloaded Meaning
  A **full** advancement square (**FAS**) fills the entire quadrant, without regard to other pieces.
  A **growing** advancement square may expand and contract betweenn the source tile and the full quadrant.

## 1.2.2 Growing Advancement Square (GAS)
  A **growing** advancement square expands one perimeter at a time.
    Into a quadrant of the allowed type.
    Out to perimeter k creates an NxN advancement square (N=k+1).
    It may not grow into a perimeter with all tiles off board.
  A **shrinking** advancement square contracts one perimeter at a time.
    Into a quadrant of the allowed type.
    Back down to perimeter k creates an NxN advancement square (N=k+1).
    It may not shrink below the source tile (P0).

## 1.3 Use Cases
  Think of an advancement square as a kind of sonar, it 'samples' the contents of its quadrant.
  Empty advancement squares reveal full power projection.
  Occupied advancement squares are used for tactical analysis.

## 1.4 Analysis
  Player wants to expand and contract advancement squares.
  An adjacent pair is required to specify an advancement rectangle, required for linear moves.
  A pair which share a source tile, and also one or more tiles on perimeters, represent overlap tiles.
  A pair with different source tiles are useful to see where power projection intersects.
  Thus, an advancement square must be an object, for there can be more than one at a time on the board.


# SECTION 2 — MACHINE‑READABLE CONSTRAINTS
  (This section is the ACTUAL spec for JSON + Python generation)

  Everything below must be rigid, explicit, and unambiguous.
  This is the section the LLM MUST follow exactly.
  No prose, no explanation, no optional interpretations.

# 2.1 Module Name
  No JSON file is used in L8.
  The Python file name shall match the spec name.

# 2.2 Code Order
  Imports of previous layers.
  Class AdvSq.
  Public Functions.
  Comprehensive smoke test.

# 2.3 Functions
  - __init__()
  - next_perimeter() -> Perim
  - prev_perimeter() -> Perim
  - union(gas1, gas2) -> list
  - intersection(gas1, gas2) -> list
  - difference(gas1, gas2) -> list

## 2.3.1 Method: next_perimeter()
  Public method, returns the next perimeter, creates it if necessary, returns None if offboard.

## 2.3.2 Method: prev_perimeter()
  Publich method, returns prev perimeter, returns Source if no more perimeters.

## 2.3.3 Function: union(GAS gas1, GAS gas2)
  Public function, computes the union of two growing advancement squares.
  If adjacent, merges their perimeters into an **advancement rectangle**, must have the same number of perimeters.

## 2.3.4 Function: intersection(GAS gas1, GAS gas2)
  Public function, computes the intersection of two growing advancement squares.
  If adjacent, keeps only the **linear move** tiles, may have different number of perimeters.
  If not adjacent with common source, returns an ordered list of tiles.
    If both duke quads, these are the duplex tiles.
    If one bishop and one duke, these are the **Feynman** tiles.
  If different type with common source, returns the ordered list of **overlap** tiles.
  If different sources and different planes, returns the ordered list of intersection tiles.
  If different sources and same plane, returns the **RAM** of their intersection.

## 2.3.5 Function difference(GAS gas1, GAS gas2)
  Subracts gas2 from gas1.
  If common source, and gas2 smaller than gas1, this yields a thick frontier.
  If swapped source and target tiles, yields the **extant** tiles.
