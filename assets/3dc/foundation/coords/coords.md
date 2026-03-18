# Coordinate System Spec

# SECTION 1 - HUMAN READABLE EXPLANATION

# 1. Purpose
  Centralize and abstract the coordinate systems and standard board sizes.

# 2. Concepts

## 2.1 The Virtual Tile Space
  The distributed nature of advancement squares breaks the board boundary paradigm.
  In conventional games there are no off board elements.
  However, full visualization of advancement squares requires making visible their offboard extensions.
  Therefore, the board proper is surrounded by a thick shell of **virtual tiles**.
  This is the **virtual tile system** - **vts**.
  Conceptually, the board generates the vts shell.
  For simplicity's sake, the thickness is equal to the largest dimension of the board proper.
  Thus, no possible advancement square can extend outside the vts.
  The board sits at the center of the vts, with Q4,4 as the anchor point (0,0,0).
  This allows the presentation layer to decorate complete advancement squares.
  Pieces cannot move off the board, and off board tiles cannot contribute to blocking.
  Their existence is entirely existential - for cognitive convenience.

## 2.2 Board Notation
  For 3D chess the most natural notation is a generalization of the old positional notation.
  The positional notation (KR2) predates the algebraic notation (f2), the current international standard.
  For 3D chess, the positional notation labels each level according to the piece that starts on that level.
  The x and y directions (each player's left and right respectively) complete tile identification.
  The level indicator is a 1 or 2 capital letter (as in 2D), followed by the X,Y values.
  Thus, the standard king pawn opening would be represented as: P - K4,4.
  Therefore, the canonical axial order is (z, x, y), which makes a lefthanded coordinate system.

## 2.3 Board Sizes
  There are three standard board sizes, each with is virtual space size:
    8x8x8    - 24x24x24
    10x8x8   - 30x30x30
    10x10x10 - 30x30x30
  The vts is essentially 27 times larger than the *physical* board.
  On board tiles have two representations, one positional <LL>X,Y, the other vts (z, x, y).
  Off board tiles have only one representation, vts (z, x, y).
  It is, however, convenient to also have an algebraic notation for on board tiles (Z, X, Y).
  This permits easy on/off board calculations.

# 3. Examples


# SECTION 2 - MACHINE READABLE REQUIREMENTS AND CONSTRAINTS

## 1. Two Coordinate Systems
  Both specify the integral coords of tiles.
  Aligned with each other.
  Left-handed (standard geometric definition).

## 2. Board coordinates
  Form: <LL>X,Y (1-offset)
  Three supported board sizes.
  All dimensions are even.

  ### 2.1 Board Specs
    For 8x8x8 board:
      Nz = 8
      Nx = 8
      Ny = 8
      <LL> ∈ {QR,QN,QB, Q,K, KB,KN,KR}
      Forward and inverse maps of Z and <LL>:
        QR→1, QN→2, QB→3, Q→4, K→5, KB→6, KN→7, KR→8
        1→QR, 2→QN, 3→QB, 4→Q, 5→K, 6→KB, 7→KN, 8→KR

    For 10x8x8 board:
      Nz = 10
      Nx = 8
      Ny = 8
      <LL> ∈ {QR,QN,QB,QD, Q,K, KD,KB,KN,KR}
      Forward and inverse maps of Z and <LL>:
        QR→1, QN→2, QB→3, QD→4, Q→5, K→6, KD→7, KB→8, KN→9, KR→10
        1→QR, 2→QN, 3→QB, 4→QD, 5→Q, 6→K, 7→KD, 8→KB, 9→KN, 10→KR

    For 10x10x10 board:
      Nz = 10
      Nx = 10
      Ny = 10
      <LL> ∈ {QR,QN,QB,QD, Q,K, KD,KB,KN,KR}
      Forward and inverse maps of Z and <LL>:
        QR→1, QN→2, QB→3, QD→4, Q→5, K→6, KD→7, KB→8, KN→9, KR→10
        1→QR, 2→QN, 3→QB, 4→QD, 5→Q, 6→K, 7→KD, 8→KB, 9→KN, 10→KR

  ### 2.2 Max Dimension
    N = max(Nz, Nx, Ny)

## 3. VTS coordinates

  ### 3.1 Ranges
    Form: (z,x,y) (0-offset)
    -N - N/2 ≤ z,x,y < N + N/2
    Example 10x10x10 board: Integral grid from -15...0...+14 (30x30x30).
    
  ### 3.2 Anchors
    8x8x8 board:    Q4,4 = (0,0,0)
    10x8x8 board:   Q4,4 = (0,0,0)
    10x10x10 board: Q5,5 = (0,0,0)

  ### 3.3 Conceptual Idiom
    The board generates a 'shell' of virtual tiles around it, one board thick (N).
    Let the board be NxNxN, then the space of VTS tiles is 3Nx3Nx3N with the board in the center.
  
## 4. Conversions

  ### 4.1 Board → RCS
    Z = <LL>
    X = X
    Y = Y

  ### 4.2 RCS → VTS
    z = Z - Nz/2
    x = X - Nx/2
    y = Y - Ny/2

  ### 4.3 VTS → Board 
    Z = z + Nz/2
    X = x + Nx/2
    Y = y + Ny/2

  ### 4.4 RCS → Board 
    <LL> = Z
    X    = X
    Y    = Y

  ### 4.5 Example
    (8x8x8 board): KR8,8 = (Z=8, X=8, Y=8) = (z=4, x=4, y=4)
    (8x8x8 board): QR1,1 = (Z=1, X=1, Y=1) = (z=-3, x=-3, y=-3)

## 5. Formats
  <LL>X,Y indicates Board-space.
  (Z,X,Y) indicates RCS-space (exact overlap with Board-space).
  (z,x,y) indicates VTS-space (offset from RCS by (4,4,4), 3Nx3Nx3N encompassing space).
  VTS and board-space formats are disjoint.

## 6. Membership (RCS)
  On-board iff
    (Z ∈ 1–Nz) and (X ∈ 1–Nx) and (Y ∈ 1–Ny)
  Invalid if point is outside the VTS in any coordinate.
  Off-board iff
    Valid and not on-board.
  Format does not decide membership.

## 7. Parsing
  In <LL>X,Y, <LL> is the level prefix; X,Y are decimal integers.
  LL determines Z by table lookup.
  Z determines LL by inverse table lookup
  Parsed Board coordinate is (Z,X,Y).

## 8. Layered Architecture
  Spec will be used to create a json module to be used by both javascript and python code.
  Smoke test should include full round trip from board representation (<LL>X,Y) to vts and back.

# SECTION 3 - IMPLEMENTATION PLAN

## Phases:
  0. File Placement
  1. Contract Extraction
  2. Implement coords.js
  3. Test Strategy
  4. Match .out
  5. Visual Check
  6. Freeze Module

