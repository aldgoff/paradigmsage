# View Spec
  Give AI basic idea of the view layer.

## 1. Brainstorming
  User needs to see an orthographic projection of the tiles which make up the board. 
  Critical features are zoom, POV, rotation of the board, including a user configurable jitter mode (slow rotate left, then right). 
  POV is from White's edge of the board from a shallow angle so the tiles of each plane hide few if any tiles on lower planes. 
  Tiles represent the bottom layer of the unit-cell (cube). 
  Pieces and decorators (flat colored planes slightlly smaller than the tiles) will sit upon them.
  Their aspect ratio will be about a tenth of the vts height, and about 85% of the vts width. 
  Top and bottom of each tile is the bishop color, the edges are the duke colors. 
  So tile separation is what allows the duke colors to be seen, but just barely. 
  If the visible area of the edges is too large the board becomes visually psychedelic and unusable. 
  Will require fine tuning, but the parameters can (and should) belong in a json file. 
  The piece trays are one or two columns off the board, lined up with the starting positions. 
  They therefore anchor the levels, imply the vts shell, and provide quick feedback on the pieces captured. 
  Is this clear?

 ### 1.1. Follow on Specs
  1. Definitions
    A. The levels are the rook's Horizontal planes.
    B. Decorators are color coded by piece: red-rook, green-bishop, blue-duke, queen-purple, knight-yellow, stack-orange, king-purplish, pawns-red/green/blue.
    C. The last perimeter (where the advsq is blocked) has hollow decorators. I have 3 pages of appendices defining the decorators.
    D. Both quadrants (advsqs) are shown around the linear move (in all 2, or 3 planes). It might be useful to have tint difference to make the planes more visually isolatable.
    E. Tiles and pieces are clickable, probably as a toggle. Thus the board is also a command interface.
  2. No, it must be tuned, a human selects the values by eye - the values are stored in the json. Easy experimentation.
  Need a 2d floating canvas for commands, buttons, move listing, and other things we haven't thought of.

 ### 1.2. More Follow Up
  1. Obvious
    A. Planes slant in different directions, 13, their tiles decorated, same colors as base pieces. 
    B. Piece move options on a click, TBD, lots of opportunites for clever UI.
    C. There are decorators for linear moves.
    D. Jitter is sufficient to disambgiuate depth.
  2. Color Exhaustion
    Bishop and decorator colors are flat, duke colors are shiny (metal and gem planes).
  3. Recommended Render tool:
    Three.js.
  4. Recommended using DOM for the 2D panels.

 ### 1.3. High Objectives:
  - Levels = rook horizontal planes
  - Deorator color endcoding
    - Rook - red
    - Bihsop - greeen
    - Duke - blue
    - Queen - purple
    - Knight - yellow
    - Stack - orange
    - King - purplish
    - Pawn - RGB nested rings
  - Hollow decorators indicate the last perimeter.
  - Both quadrants are decorated in both (all) planes for linear moves.
  - Tiles and pieces clickable, the board is as command surface.
  - Tile ratios, decorators, spacing tuned by eye, stored in JSON.
  - Layer separation: 3D rendered board, floating control overlay (2D DOM/canvas).


