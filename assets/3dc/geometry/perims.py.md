# Perims Spec

# SECTION 1 — HUMAN‑READABLE EXPLANATION

# 1. Purpose
  Define a class whose instantiations are perimeters.

# 2. Concepts
  A **perimeter** is a fundamental element in 3D chess.
  It is defined by a quad (in particular the quad's ray pair) and a distance, k.

## 2.1 Philosophy
  The common paradigm is to regard the **board** as the most fundamental element.
  It consists of tiles.
    In this model, every **tile** has a color, and may optionally hold a single piece.
    Every tile would be assigned a **color** - a static property.
    Every tile might hold a **piece** - a dynamic property.
    Tiles in any advancement manifold might be assigned **decorators** - another dynamic property.
  The **state** of the board is thus captured.

  In 2D this is efficient, as there are only twice as many squares as pieces.
  In 3D this becomes inefficient:
    - There are 16 times as many **onboard** tiles as pieces.
    - There are 432 times as many coordinate locations (**vts**).

  Therefore, it is better to
    - Specify perimeters exclusively in terms of geometry.
    - Maintain a list of piece **positions** as a separate layer thread.
    - Maintain advancement squares and dynamically decorate them via the **presentation layer**.
  The board is **rendered**, the decorators are rendered, the pieces are rendered.
  An **advancement square** is just a nested list of perimeters.

## 2.2 Instantiations
  A perimeter is defined by an **origin** tile (vts), a **quad** (direction), and a **distance** (k).
  Together they define the potential destinations with final selection by **stride**.
  To know which perimeter tiles are on board requires the **board specs**, defined in L1, coords.
    - Defined in the coords layer (L1).

## 2.3 Board Awareness
  Perimeters could function with only vts coordinates, but the combined coords is better.
  As parts of advancement squares, the onboard/offboard distinction is vital.

## 3. Examples
  boardSpecString = "8x8x8"
  P3 = Perims((0,0,0), Q1, 3, boardSpecStr)  # Implies origin is Q4,4.

---

# SECTION 2 — MACHINE‑READABLE CONSTRAINTS
  (This section is the ACTUAL spec for JSON + Python generation)

  Everything below must be rigid, explicit, and unambiguous.
  This is the section the LLM MUST follow exactly.
  No prose, no explanation, no optional interpretations.

## 2.1 Module Name
  perims_module

  The JSON root key and Python variable name shall match exactly.

## 2.2 DEPENDENCIES
  REQUIRES:
    - L1 coords
    - L2 colors (the 8 color scheme => piece equivalence sets)
    - L3 rays (the 26 unit cell rays, 6 + 12 + 8)
    - L4 quads (adjacency cycles)
    - L5 quadMaps (quad plane relationships)

  If a dependency is missing here -> the generator MUST NOT use it.

## 2.3 JSON SCHEMA
  JSON SCHEMA:
    perims_module:
      List the stride types (strings):
        E1, 
        B<n+1>+ ('outbound', where n is 1...k)
        Apex, 
        B<n+k+1>- ('inbound' where n 1...k)
        E2
      Note: B1-, B2-, and B3- are not possible, constrained by the geometry of perimeters.

## 2.4 Stride Structure (Machine-Spec Definition)
  A Perim of radius k consists of 2k + 1 tiles arranged in the following fixed conceptual order:
    E1  →  B(1) … B(k−1)  →  Apex  →  B(k+1) … B(2k−1)  →  E2

  Where:
    E1: The tile reached by translating the origin by k steps along Ray1.
    Apex: The tile reached by translating the origin by k steps along Ray1 and k steps along Ray2.
    E2: The tile reached by translating the origin by k steps along Ray2.

  B(n) Tiles
    These are the tiles between E1, Apex, and E2.
    The tiles between E1 and Apex are conceptually “outbound”, meaning they lie on the outward segment of Ray1.
    The tiles between Apex and E2 are conceptually “inbound”, meaning they lie on the inward segment of Ray2.

    These labels (“outbound”, “inbound”) are conceptual only.
    They do not define formatting names, JSON labels, or Python identifiers.

  Indexing
    Stride tiles are indexed 1 through 2k+1:
      - Index 1 → E1
      - Index k+1 → Apex
      - Index 2k+1 → E2
      - Indices 2…k → B(1)…B(k−1)
      - Indices k+2…2k → B(k+1)…B(2k−1)

  Type Field Stored in the Stride
    Each stride tile stores its conceptual type, chosen from:
      - E1"
      - B2+"
      - B3+"
      - B4+"
      - B5+"
      - B6+"
      - B7+"
      - B8+"
      - B9+"
      - Apex"
      - B4-"
      - B5-"
      - B6-"
      - B7-"
      - B8-"
      - B9-"
      - B10-"
      - B11-"
      - B12-"
      - B13-"
      - B14-"
      - B15-"
      - B16-"
      - B17-"
      - B18-"
      - E2"

  Notes:
    JSON schema lists the enumerations.
    The between tiles all start with the letter "B".
    The distinction between outbound B<n> and inbound B<n> is derived from the stride index
    B<n> position relative to Apex is interpreted via stride index only.

## 2.5 PYTHON API CONTRACT
  Define the required Python functions and their signatures.
  Perims should be a class.
  The ctor expects:
    An origin tile in vts coords (z, x, y), all integers.
    A quadrant, the global quadrant number, either as a number <nm> or as string "Q<nn>".
    A distance (k).

  Questions the interface permits:
    How many tiles in the perimeter (2k+1)?
    How many tiles on board?
    How many tiles off board?
  
  Actions the class can execute.
    Create the stride: the list of tiles in order around the perimeter from ray1 to ray2:
      Treat as a 1-based python array.
      A stride tile has multiple elements:
        Type: end, apex, between.
          E1 and E2 are the two end tiles associated with ray1 and ray2, respectively.
          Examples:
            E1 -> Apex -> E2.
            E1 -> B2 -> B3 -> Apex -> B5 -> B6 -> E2.
          Schema:
            E1 -> outbound -> Apex -> inbound -> E2.
            Note the *outbound* **between** tiles are B2...Bk, the *inbound* **between** tiles are Bk+2...B2k.
        Coordinates: in combined position/vts notation.
          Position notation if onboard.
          Vts notation if offboard.
          Therefore, stride constuction requires the **board specs** (size, anchors, etc.).
        Color: Each stride tile has a combined color.
          Color can broken into bishop and duke components if it makes presentation clearer (columns).
    List the stride (position notation if onboard, vts notation if offboard).
      Header:
        -- <Origin (color)  Quad  Perimeter> --
      Columns:
        Stride  Tile   Type  Color       Pieces(<n>)
      List:
        id_num, combined_coords(postional, vts(z,x,y)), type, color
      Example:
        KR1,1 (white-gold)  Q1   P4
        Q1  rook(Q1)  Horizontal(Q1)  left_fore,right_fore  Forward
        -----------------------------------------------------------
        Stride  Tile    Type  Color
          1     KR5,1   E1    white-gold
          2     KR5,2   B2    black-ruby
                ...
          5     KR5,5   Apex  white-gold
          6     KR4,5   B6    black-jade
                ...
          9     KR1,5   E1    white-gold
               (z,x,y)
    Just the tiles in combined coords; in stride order.
      Example:
      3 : ['Q7,6', 'Q7,7', 'Q7,8', (0, 3, 5), (0, 2, 5), (0, 1, 5), (0, 0, 5)]

  Together they define the potential destinations with final selection by **stride**.
  To know which perimeter tiles are onboard requires the **board specs**, defined in L1, coords.

## 2.6 INVARIANTS
  Rules that must NEVER be violated. These govern correctness.

  INVARIANTS:
    - Output length of P(k) MUST equal 2*k + 1.
    - VTS must always be used for internal computation.
    - Board coordinate conversion MUST use coords layer.

## 2.7 ALLOWED OPERATIONS
  Enumerate what the generator is allowed to use.

  ALLOWED:
    - Lookup of rays via rays_module.
    - Use of coords for conversions.
    - Use of adjacency via quads_module.

## 2.8 FORBIDDEN OPERATIONS
  Enumerate what the generator must NOT do.

  FORBIDDEN:
    - Hardcoding any ray-cycle.
    - Inferring adjacency without consulting L4.
    - Making assumptions not present in schema or invariants.
    - Using examples as definitions.

## 2.9 OUTPUT REQUIREMENTS
  Define exactly what JSON and Python outputs must exist.

  OUTPUT FILES:
    - perims.json with root "perims_module"
    - perims.py implementing PYTHON API
