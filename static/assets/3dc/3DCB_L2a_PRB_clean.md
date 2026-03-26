# Part II -- How the Pieces Move

Part I addressed two challenges, the trajectory
paradigm and a formal development process to uncover a consistent
foundation for the rules. The trajectory
paradigm was breached by the introduction of the planar move
and the constraint of advancement squares; it is what most distinguishes
this variation from others.

The formal development process focused on identifying those invariants
of 2D chess that were dimension agnostic;
those that can scale to larger dimensions and which capture the true
"chess-ness" of chess. The result of that effort was a good start on the
congruent rules
of chess, a formalism intended to protect us from the temptation of
invention. We continue to grow the congruent rules
of chess in Part II for the same reason.

Part II extends this start, applying the planar idiom to each piece. The
idea that a pair of rays determine a plane, and that for each base
piece, the type of pair (and type of plane) is different, allows the
idea of the planar move to be extended in a natural and intuitive way.
The need for a third base piece is hardly surprising, many other
approaches to 3D chess have introduced one, and for largely the same
reasons. How the rest of the pieces move can be defined in terms of the
base pieces; the queen is the sum, the pawn advances like a rook, but
captures like a bishop or duke (all with restricted range and
direction), and the king is a limited range queen. Even the knight's
move derives from the base pieces, albeit in a kind of anti-base piece
way.

We will also be looking to confirm that the projection of the 3D move
onto 2D does in fact yield the 2D move, as one more guide rail to keep
us on the discovery path.

Implicitly, we have been developing a jargon for 3D chess. Through the
rest of this book, we shall be a bit more formal about this basic
pedagogy. First use will be in *italics*. Appendix III holds the Jargon
Table, where each term is hyperlinked to the first occurrence of the
term in the text. The terms are listed in chronological order, grouped
by chapter. For an alphabetical list, see the index.

Clearly defined terms are essential when trying to communicate and/or
master a complicated subject. The strategy is to choose (ok, invent)
meaningful names that are simple and intuitive but capture the concept.
Acronyms have been kept to a minimum.

> "And God brought all the animals before Adam, and whatever he *named*
> them, that was their name."
>
> --- Genesis
## The Bedrock

By choosing scalable invariants, it has been possible to
discover
the correct size and shape of the board (8x8x8), tie how pieces advance
to the topology of the board (through the concepts of rays and base
pieces), discover
the need for a new base piece
and name it (the duke), and even,
tentatively, propose the need for a composite piece (the
stack). It
was also possible to determine a starting lineup, a generalized chess
notation, and with a little future hindsight, establish a post-modern
yet mnemonic design for the pieces.
### Invariants

Before dealing with each piece, a quick review of the invariants already
discovered will allow us to expand the list of congruent
rules
while avoiding duplication later.

The first chapter (on the trajectory
paradigm), revealed that one of the critical invariants in chess was to
freeze the difference between the dimensions of the board space and the
dimensions of the move space to precisely one. This
invariant
is dimension agnostic,
and so scales perfectly. Thus, pieces move in straight lines in 2D, flat
planes in 3D, and would move in cubes in 4D. This preserved the
endgames.

[]Congruent Rule : **Base pieces move in a space
one dimension less than the board.**

It was also discovered that blocking required us to resolve the
degenerate 2D advance rule into an invariant
form. Thus, pieces may move until blocked, but blocking is not defined
as "until running into another piece" but rather as "a regular set of
tiles (called a manifold) which must be empty." Thus, advancement
manifolds are a straight line in 2D which
grows by one tile
at-a-time, a square in 3D which grows by one perimeter
at-a-time, and a cube in 4D which would grow by one 3-faced surface
at-a-time, etc. Perimeter will be used as the generic term for the
advancing element of any advancement manifold. This preserved the
midgame.

[]Congruent Rule : **A piece may advance only as
long as the next perimeter** **is
empty.**

Furthermore, the advancement manifolds are oriented differently for
different base pieces, being defined by N-1 rays of the same type.
That's the scalable invariant.
Thus, there are two types of advancement manifolds in 2D defined by
*single* rays; orthogonal lines defined by one side ray,
and diagonal lines defined by one corner ray.
By extension, there are three types of advancement manifolds in 3D
defined by *pairs* of rays; *orthogonal planes* which are defined by two
face rays, *skew planes* defined by two edge rays,
and *slant planes* defined by two corner (vertex) rays. The extension to
4D is straight forward.

[]Congruent Rule : **An advancement
manifold**
**is defined by N-1 rays of the same type.**

One of the consequences of this is that all the base pieces can move to
any of the tiles they can reach in just two moves. With the debunked
straight-line move,
it would have taken three moves; and by extension four moves in 4D.

[]Congruent Rule : **A base piece**
**can move to any tile**
**it can reach in just two moves.**

To eliminate quadrant and plane ambiguities, a distinction was required
between quadrant and linear moves. A linear move is legal in any plane
in which the two adjacent quadrants are unblocked, that is, the
advancement squares combine into a single advancement rectangle. This
preserved the fundamentals of openings.

[]Congruent Rule : **An advancement rectangle is
composed of two adjacent advancement squares.**

The fact that lines in 2D are independent leads to the
invariant
that advancement manifolds should be independent. Thus, lines are
independent in 2D, planes are independent in 3D, and cubes would be
independent in 4D.

[]Congruent Rule : **A linear move**
**is legal if at least one advancement rectangle**
**is empty.**

A classic invariant
in physics is "what is not forbidden is allowed." So, if a linear
move
is unblocked in two planes, it is advancing in both
planes.[]

Congruent Rule : **A linear move**
**occurs in every unblocked plane that intersect along it.**
### Visualizing the Planes

In 2D, the two base pieces (rook & bishop) move in *two* types of
*lines*; orthogonal for the rook and diagonal for the bishop, while the
number of lines for each piece is precisely two. This is now such a
familiar concept that we may have forgotten that mastering the diagonal
move of the bishop took a little more effort than mastering the
orthogonal move of the rook. For instance, there are two names for
orthogonal lines, horizontal and vertical (or for the purist, rank and
file) but only one name for the diagonal lines. The terms *diagonal* and
*slant* would almost have made good candidates, but which direction was
which pretty much put the kibosh on that idea.

In 3D, the three base pieces (rook, bishop & duke) move in *three* types
of *planes*, but the number of planes for each piece is now *more than
two* and, surprise, *no longer constant*. It will prove very useful to
identify and name these planes, as well as provide the Intrepid Reader
with a visualization of them which can be internalized.

Figure 16 shows all thirteen planes. The 3D board is shown as a
wire-framed cube. All left/right designators in this figure are from the
perspective of the right vertical edge (White's perspective).

There are 3 *orthogonal* planes (rook); horizontal, left vertical, and
right vertical (a). There are 4 *skew* planes (bishop): upward,
downward, leftward, and rightward (b). Note their hexagonal shape. The
first pair are the *forward planes*, the second pair the *outward
planes.* There are 6 *slant* planes (duke) which come in pairs called
*cross planes*; the major & minor, the upleft & downleft, and the
upright & downright.

Up and down designators imply the plane tilts toward the opponent in
that direction.

![[]Figure 16: The 13 Planes of 3D
Chess](media/image17.png)

There are three types of planes in 3D chess. *Orthogonal* for the rook
(3); *horizontal*, *left vertical*, and *right vertical* (a). *Skew* for
the bishop (4); *upward*, *downward*, *leftward*, and *rightward* (b).
*Slant* for the duke (6): the *major* & *minor* cross pairs, the
*upleft* & *downleft* cross pairs, and the *upright* & *downright* cross
pairs (c). All left and right designators are from each players'
perspective. Up and down designators indicate in which direction the
plane approaches the opponent. Except for the horizontal, major, and
minor planes, these designators are swapped between Black and White
(shown). From the neutral point of view of this figure the duke minor
plane is edge on; it has been rotated ever so slightly to make it
visible.
### Definitions

It is useful to label some of the tiles in an advancement square. An
[]*apex*
*tile*
is one diagonally opposed to the source tile.
The line of apex tiles divides an advancement square into two triangular
regions. An []e*nd tile* lies down the inner edges of
an advancement square. A linear move will always be to an end tile. A
quadrant move may or may not end up on the apex tile, but it is more or
less headed in that direction.

Recall that the outer pair of edges of an advancement square is called
the perimeter, and that the last end tiles are both on the perimeter and
on the inner pair of edges.
### Impact

There are several ways to measure the *impact*
of a piece.

The *range*
of a piece is what percentage of the board it can *eventually* reach. In
2D, the rook's range
is 100%, the bishop's only 50%, and the duke's is 25%. All can reach any
tile in its range
on an empty board in just two moves. The knight also has a
range
of 100% but it can take many moves to reach an arbitrary tile.

[]*Power projection*
is the number of tiles a piece can reach in *one* move. The power
projection ratio (*PPR*)
is the *percentage* of tiles a piece can reach in one move.

The *STAB* value was the number of pieces that could be covered
*simultaneously*.
### Presentation

Advancement squares are fundamental to defining the legality of a move.
To help visualize them the tiles within will be indicated with a variety
of *decorators*, colored diamonds that just fit inside a tile.
Decorators come in a variety of types and colors, one color for each
piece (such as red for rook), one type for each kind of tile (edge,
apex, body, etc.). For instance, edge tiles will have a dark diamond in
the center of the decorator, while apex tiles will have a hollow diamond
in the center, and body tiles will be unadorned.
### Structure

In the chapters to follow, the movement rules for each piece will be
presented. For the base pieces, look for the type of plane it moves in,
how many planes it can move in, how many quadrants
are in each plane, and how the perimeters grow. The planes,
quadrants,
and perimeters are all consequences of the type of rays that govern a
piece's move. For the derived pieces, look for how the base pieces are
combined and constrained.

Because the rook was our paradigm guide, the next section duplicates
some of the information presented in Chapter 1. The duplication will be
tolerated because it affords three benefits.

- keeps all move rules in one place, eases comparing different moves

- continues to accumulate the conjugate rules of chess without
  duplication

- introduces additional decorators for the advancement squares

- eases comparison of sub sections between the individual piece chapters
## Rook

From the discovery
perspective the rook is the most fundamental piece on the board as it is
tied to the topology of the board in the simplest possible way. It is
first amongst the base pieces, it has the easiest move to visualize, the
clearest to present, and it just served as the point of the paradigm
spear in penetrating the trajectory
paradigm.
### Face Rays

The rook advances along rays which change *one* coordinate. In 2D, it
advances along a *single* side ray.
In 3D, it advances along a *pair* of face rays. A rook linear
move
will thus define a growing line which changes one coordinate and a rook
quadrant move
will define a growing square which changes two coordinates.
### Range 

Because the rook advances along rays which change only one coordinate,
it can reach *every* tile
on the board but because it moves in one dimension less than the board,
it can still get to each tile
it can reach in just *two* moves, same as in 2D.

[]Congruent Rule : **The rook can reach all the
tiles on the board.**
### Three Orthogonal Planes

In 2D, the board is a square, with sides and corners. Since the rook
advances along side rays, it moves in two *orthogonal lines*. An
orthogonal line
separates opposite *sides* of the board; thus 4 sides in 2 pairs implies
2 lines.

In 3D, the board is a cube, with faces, edges, and corners. Since the
rook advances along face rays, it moves in *orthogonal* *planes*. An
orthogonal plane
separates opposite *faces* of the board; thus 6 faces in 3 pairs implies
*three* planes.

The rook moves in three orthogonal planes; one []*horizontal plane*,
and two vertical planes (the []*left vertical
plane* and
the []*right vertical plane*).
From either player's point of view, envision sticking your left arm into
the left face of the board, palm vertical; there's the left
plane.
Similarly, envision sticking your right arm into the right face of the
board, palm vertical; there's the right plane. See
Figure 19.
### Four Quadrants

A rook plane is cut by *two* straight lines connecting adjacent cubes
(tiles) by their faces. Thus, a rook plane has *four*
quadrants.

Figure 17 shows the tiles a rook can cover in a single *orthogonal*
plane,
the horizontal one. Note that it covers all of them. The two straight
lines are shown with dark diamond decorators; this clearly shows the
four quadrants.
The shape of an orthogonal plane
is always an 8x8 square, independent of the location of the rook, just
as the orthogonal lines in 2D were always 8 tiles long and independent
of the rook's location. Orthogonal planes connect four faces of the
board. See Figure 16.

![[]Figure 17: Rook's Plane is Cut by Two Lines,
Thus Four
Quadrants](media/image18.tiff)

A rook plane is cut by 2 lines yielding 4 quadrants.
The black decorators are used to indicate the 4 rays that originate from
the rook on KR5,4. The shape of an orthogonal plane
is always an 8x8 square, independent of the rook's position.
### Opposing Quadrants

Figure 18 shows the rook quadrants
in opposing pairs for clarity. The ghost rooks indicate legal moves to
those perimeters. It will become useful to distinguish between
[]*pure quadrant*
moves and []*full quadrant*
moves; full quadrant
moves include the end tiles.

![[]Figure 18: Rook Opposing Quadrants in
Horizontal
Plane](media/image19.png)

Each plane of the rook move contains four quadrants.
Advancement squares of various sizes are shown for the horizontal
plane
in opposing quadrants
for clarity. A 3x3 and a 4x4 advancement square are shown in (a) and a
2x2 and a 6x6 advancement square (extends off board) are shown in (b).
The []*single ghosted*
rooks show the locations where the rook can make pure
quadrant
moves (60% opacity).
The end tiles contain []*double
ghosted*
rooks (30% opacity); including them implies a full quadrant move. Moves
to end tiles are linear moves, not quadrant moves,
and require at least one advancement rectangle
to be unblocked.
### 2D Projection of the 3D Move

Figure 19 shows the three planes of the rook (b). The straight-line
moves are indicated with dark diamond decorators, they indicate the face
rays. Each line (two face rays in opposite directions) is the
intersection of two planes. The orthogonal lines of the rook's 2D move
are shown for comparison (a). Note that projection of the 3D rook's
planar move onto a two-dimensional surface is just the 2D move.

![](media/image20.png)

[]Figure 19: Rook's Three Orthogonal Planes

The 2D rook moves in two orthogonal *lines* (a). The 3D rook moves in
three orthogonal *planes* (b). Planes intersect at the straight-line
moves (black diamond inserts). Projection of the 3D rook move onto any
face of the 3D board is the 2D rook move.

Invariants can apply between abstraction levels, not just within them.
One way to validate the rules of 3D chess is to check if a projection of
the 3D move onto a two-dimensional surface yields the 2D move. Note that
the projection of the 3D rook's planar move
on a face of the 3D board is just the 2D rook's move. The face of a cube
is a two-dimensional space.

[]Congruent Rule : **Projection of the 3D rook
move onto two dimensions yields the 2D move.**
### Quadrant Move Snapshots

Figure 20 shows a series of snapshots of the rook's advancement
square
as it advances into the upper quadrant of the horizontal
plane.
In this figure, a new diamond decorator is used, but first a definition.
An *apex*
*tile*
is one diagonally opposed to the source tile.
An open black diamond decorator is used to indicate an apex
tile.
This figure shows the sequence of apex
tiles in each snapshot. Having a decorator for the apex
tiles becomes more and more useful as each new base piece
is considered, so it is introduced now to establish familiarity. As
before, straight-line moves (the rays) are indicated with solid black
diamond decorators, the growing tip of which will be called an *end*
*tile*.
They are conceptual cousins to apex
tiles. Also, as before, an unadorned diamond indicates an interior
tile
of no special significance.

Note that capture does require a piece to move to the one specific
tile
which is occupied. A rule to allow capture of all pieces on a
perimeter by
moving to any tile
on the perimeter is
impossible to defend; there go the gambits, so it was summarily
rejected.

Obviously, a piece may not advance past another piece, just like it may
not in 2D.

An advancement square
may extend off the board. In the case of a rook, it leaves a rectangular
shape behind. If any part of a rook's advancement square
extends off the board, so does its apex
tile.
The off-board tiles have no effect on a pieces' moves (they count as
empty tiles) and of course the piece may not move to them.

The next three figures show the rook quadrant and linear moves in a
variety of contexts. Some of this should sound familiar as it was
previously introduced in the first chapter (the paradigm chapter).

![[]Figure 20: Rook Snapshots of a Quadrant Move
in a Horizontal
Plane](media/image21.png)

A series of 5 snapshots (a) -- (e) showing each new
perimeter of the
6x6 advancement square
which must be empty of any other pieces for the rook to be able to
advance to perimeter 5 (e). Each perimeter is two
tiles larger than the previous one (3, 5, 7, 9, 11). Decorated red
diamonds indicate tactically significant aspects of advancement squares;
the line of solid black decorators represents the two rays, the open
black decorators the sequence of apex
tiles. Undecorated tiles (pure red tiles) indicate uninteresting
interior tiles. All highlight diamonds are slightly smaller (very
slightly) than a tile
so the underlying tile's
color (black or white) can peek through. (Zooming on supported platforms
makes this more useful.)

Figure 21 shows three snapshots of the rook's quadrant advance in a left
vertical plane (*left plane*). In
this example, the advancement square
extends off the board leaving a rectangular shape behind, which should
not be confused with an advancement rectangle;
that's for linear moves. The lightly ghosted rooks indicate which tiles
on the successive perimeters are unblocked *pure* quadrant
moves,
the heavily ghosted rooks are all on end tiles (*full* quadrant moves)
and remind us that they are actually linear moves (the adjacent
advancement square for them has been suppressed). Rooks may make pure
quadrant moves or linear moves, but not full quadrant moves. This can be
a little confusing at this stage of development, but the distinction
between pure and full becomes relevant for the pawn and very relevant
when the discussion turns to blocking.

Hang in there.

[]Figure 21: Rook Snapshots of a Pure Quadrant
Move in a Vertical Plane

(Facing page.) Three snapshots (a) -- (c) of a rook making a pure
quadrant
move
in the upward quadrant of the left vertical plane are shown, which
happens to extend off the board. The ghost rooks indicate pure and full
quadrant
moves,
but also that a piece may not move off the board. Note the addition of
the apex
decorators.

![](media/image22.png)
### Linear Move Snapshots

Figure 22 shows three snapshots of a linear advance blocked in both
planes by the king. For clarity, only the horizontal plane
is shown. Note there are now two diagonal lines of apex decorators: one
for each quadrant. These quadrants share the linear move and together
form the advancement rectangle.

In addition, a new decorator is added. It consists of a pair of
side-by-side solid black diamonds and is used to indicate the tiles of a
linear move
(the shared end tiles of each quadrant). It is a conceptual cousin to
the decorator for apex
tiles.

![[]Figure 22: Rook Snapshots of Linear Move in
Horizontal
Plane](media/image23.tiff)

Three snapshots (a) -- (c) of a rook making a linear move
are shown in the horizontal plane
only. Because the king is in the direct
line of this move, it blocks both planes (vertical plane not shown).
Note the use of the new two black diamond decorator to indicate the
sequence of end tiles along which a linear move
occurs.
### Linear Move in Two Planes

To achieve a full and complete understanding of linear moves, it is
necessary to see them in both planes simultaneously. Figure 23 shows a
linear move
for the rook which at first appears to have the Black king in check, as
the king is in a straight line from the
rook. However, both advancement rectangles are blocked, and furthermore
are blocked at different perimeters. The right vertical
plane is
blocked by the knight to a 3x3 advancement square
while the horizontal plane
is blocked by the bishop to a 5x5 advancement square.
(This implies a 5x9 advancement rectangle
which of necessity extends off the board.)

Note the half stack in the White tray, since the bishop is on the board,
but the duke is not.

Another decorator is now introduced, the offset single solid black
diamond decorator. It is just the double diamond decorator with one of
the two black diamonds removed. It indicates that this linear
move
is now occurring in *one plane only*. Call this *polarization*.

![[]Figure 23: Rook Linear Move in Two
Planes](media/image24.png)

Rook makes a linear move
to the ghost rook location but falls short of putting the king in check.
The two quadrants
in each plane form the pair of advancement rectangles, one of which must
be unblocked for the linear move
to be legal. They can be, and typically are, blocked at different
distances, as shown here. The vertical plane is blocked by the knight to
a 3x5 advancement rectangle,
while the horizontal plane
is blocked by the bishop to a 5x9 advancement rectangle
(which of necessity extends off the board). Note that the end
tile
of the linear move
at perimeter 3 has a
single black diamond decorator. This decorator shows that the linear
move
is now unblocked in only plane. Note also that the apex
decorator has been added to all four quadrants.
### Shape

Let us now show how the design of the rook alludes to how it moves.

Figure 24 shows a rook in the corner of the board and marks out all the
tiles it can get to in a single move. They outline three sides of a
cube. Thus, the rook is a cube, just elongated for style (which
conveniently matches the visual of the board anyway).

![[]Figure 24: Rook
Shape](media/image25.png)

From the corner of the board the rook's move outlines a cube, elongated
on a physical board. Thus, the shape chosen for the rook is an elongated
cube and alludes to its move.
### Power Projection

From the corner of the board, the rook covers 147 tiles via quadrant
move (of which 21 are apex
tiles), and 21 tiles via linear move, for a total of 168 tiles. Power
projection
is 168/511 = 32.9% compared to 14/63 = 22.2% in 2D. The power projection
ratio ([]PPR)
for the rook is position independent, just like in 2D. The debunked
straight-line move
would have been 21/511 = 4.11%; woefully inadequate -- *feels like
chess**.*

  -----------------------------------------------------------------------
  Piece               3D -- Straight          2D          3D -- Planar
                           Lines                              Moves
  ------------------ ----------------- ---------------- -----------------
  Rook                     4.11%            22.2%             32.9%

  -----------------------------------------------------------------------

  : []Table 1: **Power Projection Ratio
  (PPR****)
  -- Rook**
### Review

A lot has been asked of the reader in this chapter. The concepts and
terminology will be a continuing aid in understanding the rest of the
pieces. However, as each new piece is introduced additional nuances
appear. If you have the rook down well then you are in good shape for
grasping what comes next.

Some jargon to recall; face rays, orthogonal planes,
quadrant moves
versus linear moves, advancement squares and advancement rectangles,
perimeters, apex tiles, end
tiles, and linear tiles, diamond tile
decorators (open, closed, double, offset single), and congruent
rules.
The three planes of the rook are the horizontal, left vertical, and
right vertical, each with four quadrants.

As a reminder, all these terms have been captured in the Jargon Table of
Appendix III.
## Bishop

The bishop is the second simplest base piece.
It moves differently than the rook; diagonally in 2D, along a different
kind of plane in 3D. In 3D, all base pieces have both quadrant moves and
linear moves. If the rook revealed the paradigm barrier that separates
2D and 3D chess, then the bishop cements the planar move,
but delightfully, it also reveals unexpected nuances. Paradigms are the
great revealer, and the bishop provides additional epiphanies about what
it means to *move in a plane*. We'll take our time getting to know the
bishop and build our knowledge and intuition figure by figure.
### Edge Rays

The bishop advances along rays which change *two* coordinates. In 2D, it
advances along a *single* corner ray.
In 3D, it advances along a *pair* of edge rays.
A bishop linear move
will thus define a line which changes two coordinates (one more than the
rook) and a bishop quadrant move
will define a perimeter which
changes all three coordinates (one more than the rook).
### Range 

Because the bishop advances along rays which change two coordinates, it
can reach only *half* the tiles on the board, (half as many as the
rook), but because it moves in one dimension less than the board, it can
still get to each tile
it can reach in just *two* moves, same as in 2D; (32 versus 256).

[]Congruent Rule : **The bishop can reach half
the tiles on the board.**
### Four Skew Planes

In 2D, the board is a square, with sides and corners. Since the bishop
advances along corner rays, it moves in two *diagonal* *lines*. A
diagonal line separates opposite *corners* of the board; thus 4 corners
in 2 pairs implies 2 lines.

In 3D, the board is a cube, with faces, edges, and corners. Since the
bishop advances along edge rays,
it moves in []*skew* *planes*.
A skew plane
separates opposite *corners* of the board; thus 8 corners in 4 pairs
implies *four* planes. This is the first unexpected difference from the
rook; four planes instead of three.

Skew planes come in pairs; two which lean between the players, called
[]*forward planes*, and two which lean
outwards, called []*outward planes*. The
intersection of each pair of planes occurs along a single diagonal line
connecting tiles by their edges.

The skew planes of the bishop are more difficult to visualize than the
orthogonal planes of the rook; it is going to require additional figures
to clarify the bishop move.

The next two figures show the bishop's skew planes in pairs. Figure 25
shows the forward planes. Each player regards the plane which leans
toward the opponent as the up-forward plane
([]*upward plane*
for short) and regards the plane which leans toward them as the
down-forward plane
([]*downward plane*
for short). This means that White's upward plane
is Black's downward plane,
and vice-a-versa.

![[]Figure 25: Bishop Forward
Planes](media/image26.png)

The two *forward planes* for a bishop in the center of the board (K5,4)
are shown. The three straight lines in each plane are indicated with
black diamond decorators (apex
tiles have been suppressed for clarity). These two planes intersect in a
diagonal line perpendicular to the two players. As in 2D the bishop is
confined to the color of the tile
it starts on.

Figure 26 shows the outward planes. The outward plane that
leans to the right is called the right outward plane
([]*rightward plane*),
and the outward plane that
leans to the left is called the left outward plane
([]*leftward plane*).
As for the forward planes, White's rightward plane
is Black's leftward plane,
and vice-a-versa.

![[]Figure 26: Bishop Outward
Planes](media/image27.png)

The two *outward planes* for a bishop in the center of the board (K5,4)
are shown. The three straight lines in each plane are shown with black
diamond decorators (apex
tiles have been suppressed for clarity). These two planes intersect in a
diagonal line which extends between the players.

It is not so easy to visualize all four bishop planes at once as it was
to visualize all three rook planes at once.

The size and shape of a skew plane
depends on the location of the bishop, just as the length of the two
diagonal lines in 2D depend on its location. However, in 3D, both the
size and the shape can vary. When in the center of the board, the shape
of any of the four planes is an irregular hexagon. As the bishop
approaches the outer limits of the board, some of these planes become
equilateral triangles, until at the extreme limit of the corner, three
are triangular, and one appears to be missing (it is the single
tile
the bishop is on).

In 2D, the maximum extents occur when the bishop is in the center of the
board, while at the corner one line appears to disappear (again, it is
just one tile
long, consisting of just the tile
the bishop is on). In 3D, the same phenomenon occurs, but now with the
added wrinkle that not only does the size of the bishop's manifold
change, but so does its shape.

Figure 27 shows the four bishop planes inside a cubical wireframe of the
3D chess board that is better proportioned than the level view.

![[]Figure 27: The Four Skew Planes of the
Bishop](media/image28.png)

Shown are the four skew planes of the bishop inside a cubical wire fame
rendition of the 3D chess board. *Upward* and *downward* are the
*forward* planes, *leftward* and *rightward* are the *outward* planes.
Names are from White's perspective (right vertical edge).
### Six Quadrants

Surprisingly, a bishop plane is cut by *three straight lines,* rather
than the two in the rook's orthogonal planes, so instead of four
quadrants,
there are *six quadrants*.[^16]
This is the second unexpected difference from the rook.

Figure 28 shows the tiles a bishop can reach in a single *skew*
plane,
an outward plane, the
right one from White's point of view (rightward). Note that it can reach
all of the tiles in this plane, all of which are white. The three
straight lines are shown with dark diamond decorators; this clearly
shows the six quadrants.
Skew planes connect either three edges of the board (triangle shape) or
six edges as shown here (hexagonal shape).

![[]Figure 28: Bishop Plane is Cut by Three
Lines, thus Six
Quadrants](media/image29.png)

A bishop plane is cut by 3 lines yielding 6 quadrants.
The black decorators are used to indicate the 6 rays that originate from
the bishop on K4,5. The shape of a skew plane
can be either an irregular hexagon (as in this figure) or an equilateral
triangle, it depends on the position of the bishop.
### Opposing Quadrants

In order to make the six quadrants
of the bishop move a little clearer, the next two figures show
alternating quadrants
for White's rightward plane.
For no particular reason, the first set is called the odd
quadrants
and the second set the even quadrants.

![[]Figure 29: Bishop Alternating Quadrants in
Right Outward Plane (1, 3,
5)](media/image30.png)

Three alternating quadrants
in White's rightward plane
are shown (K3,4). Starting at the top and advancing clockwise the
advancement squares are of size 2x2, 3x3 and 4x4. Ghost bishops indicate
where on the perimeter of
these three advancement squares the bishop can advance to as a pure
quadrant move,
double ghosted as a full quadrant move (the end tiles).

Note how quickly the advancement squares extend off the board. In every
case, the apex
tile
is the first to leave the board. As for the rook, a bishop may not move
off the board and tiles off the board do not block
a move.

In both figures, the pair of up and down quadrants
look different than the four side-to-side quadrants.
This is an artifact of the board not being cubicle in its level-by-level
presentation. Therefore, unfortunately, it takes a little practice to
visualize bishop quadrants
without a perceptual bias. On a truly cubical board this bias
evaporates.

![[]Figure 30: Bishop Alternating Quadrants in
Right Outward Plane (2, 4,
6)](media/image31.png)

The other three alternating quadrants
in White's rightward plane
are shown (K3,4). Starting at the right and advancing clockwise the
advancement squares are of size 2x2, 3x3 and 4x4. Ghost bishops indicate
where on the perimeter of
these three advancement squares the bishop can advance to as a pure
quadrant move,
double ghosted as a full quadrant move (the end tiles).

While the advancement squares are more diamond shaped than square
shaped, their perimeters grow by the same mathematical law as those for
the rook; (3, 5, 7, 9...).
### 2D Projection of the 3D Move

An important criterion for discovering the rules of 3D chess was the
principle that projecting a 3D move onto a 2D surface should yield the
2D move. Demonstrating this for the rook was trivial. Any pair of
intersecting rook planes projected the 2D rook move into all the other
planes perpendicular to the pair, all 7 of them. (Review Figure 19.)

Because the bishop moves in 4 planes, however, its case is more
intricate. Each of the 3 orthogonal planes intersecting at the location
of a bishop *directly* sport the two diagonal lines of the 2D bishop
move. For all the other orthogonal planes (7 horizontal, 7 left
vertical, and 7 right vertical) there are *four* lines, not two. There
are 6 ways to group these 4 lines by pairs; 4 pairs project the
*intersecting* diagonal lines of the 2D bishop, the other 2 pairs
project two *parallel* diagonal lines which don't intersect. In a sense,
a 3D bishop projects *two* 2D bishops.

For any *pair* of intersecting bishop planes, two of the three sets of
orthogonal planes show a single 2D bishop move; the other set shows two
*parallel* diagonal lines. There is a lot of symmetry and mathematical
beauty here, but, ahem, we shall leave the full appreciation of such to
the mathematicians. In adherence to the discovery principle, the bishop
planar move does in fact project the 2D move. Indeed, it does so even
better than the rook; given a pair of intersecting skew planes the
bishop projects the 2D move into 2/3 of the orthogonal planes, while for
a pair of intersecting orthogonal planes the rook projects the 2D move
into only 1/3 of them.

The bishop cross-plane pairs, the two forwards (upward and downward) and
the two outwards (leftward and rightward), project the 2D bishop move
only into the vertical orthogonal planes. Thus, it is easiest to see the
2D projection for one forward plane
and one outward plane.

Figure 31 shows an example with the corresponding diagonal lines on a 2D
board.

The projections on the horizontal planes are easy to see. To help see
the projection in the right vertical planes, ghost bishops have been
used in the left most one (from White's point of view, on the left from
the neutral point of view). Note that the projection can imply a
*virtual* bishop; for instance, on the queen-rook level, the bishop
would be off the board, (what would be QR9,4).

The projection onto left vertical planes (White's point of view) yields
two parallel lines. They are indicated with yellow stars for the left
most left plane (right most right vertical plane for the neutral point
of view of these diagrams).

[]Congruent Rule : **Projection of the 3D bishop
move onto two dimensions yields the 2D move.**
### Quadrant Move Snapshots

Figure 32 and Figure 33 show the four snapshots of a bishop making an
advance out to a 5x5 advancement square (perimeter 4).
The empty piece trays on either side of the board should help in keeping
alignment from one snapshot to the next (a) -- (d). In each snapshot the
perimeter grows
by two additional tiles (3, 5, 7, 9...). The inside edges of each
advancement square
(more of a rhombus shape for the bishop) are indicated with black
diamond decorators. Even though a bishop advancement square
is rhombus shaped, it still grows by the same mathematical law as for a
rook. The apex
tiles are indicated with hollow black diamond decorators. Ghost bishops
show the legal quadrant moves
on each successive perimeter. Larger
advancement squares begin to extend off the board starting with the
apex
tile,
so no ghost bishop at what would be QN*9*,5.

![[]Figure 31: Bishop Projection of 3D Move onto
2D Orthogonal
Planes](media/image32.png)

Projection of the 3D bishop move is the 2D bishop move (a). One forward
and one outward plane project onto horizontal planes and vertical
planes, in this example the right vertical planes (b). Ghost bishops are
on the left most right vertical plane (White's point of view). On the
left vertical planes, the projection is two parallel lines, which are
marked with yellow stars in the outer left face of the board (all from
White's perspective).

![[]Figure 32: Bishop Snapshots of Quadrant Move
in a Rightward Plane (2x2 &
3x3)](media/image33.png)

Snapshots of White's bishop advancing into the lower forward quadrant of
the rightward plane
from its home position (KR1,1) (a) -- (b). Black diamond decorators
indicate tiles on the inner edges of the advancement square.
The sequence of apex
tiles is indicated with hollow black diamond decorators. Ghosted and
double ghosted bishops are on the respective perimeter tiles
for these quadrants.
The yellow rhombi highlight how the bishop move is a distorted
advancement square, but perimeters still grow by the same mathematical
law.

![[]Figure 33: Bishop Snapshots of Quadrant Move
in a Rightward Plane (4x4 &
5x5)](media/image34.png)

Continuation of previous figure; snapshots of White's bishop advancing
still further into the lower forward quadrant of the rightward
plane[^17]
(c) -- (d). Ghosted and double ghosted bishops are on the respective
perimeter tiles
for these quadrants.
The yellow rhombi highlight how the bishop move is a distorted
advancement square, but perimeters still grow by the same mathematical
law. The empty piece trays on each side may help keep visual alignment
between the series of snapshots, particularly for such continuation
figures.
### Linear Move Snapshots

Figure 34 and Figure 35 show 3 snapshots of a bishop linear advance
(only one plane is shown).

![[]Figure 34: Bishop Snapshots of Linear Move in
Rightward Plane (2x3 &
3x5)](media/image35.png)

This (a) -- (b) and the next figure (c) show three snapshots of a bishop
linear move in the outward plane for White's white bishop (K2,1)
eventually advancing to K5,4. Only the rightward plane is shown. Note
that the rook (K6,5) will eventually block
advances in both planes.

Each advancement rectangle
consists of the adjacent quadrants.
The so-called advancement rectangle
is hardly rectangular because of the rhombus shaped advancement squares.
Nonetheless, its perimeter grows
by the same mathematical rule as for the rook's linear move;
5, 9, 13, etc.

![[]Figure 35: Bishop Snapshots of Linear Move in
Rightward Plane
(4x7)](media/image36.png)

This is the 3rd snapshot of a bishop making a linear advance from K2,1
ultimately blocked by the rook at K6,5 (c). Since it is in line with the
linear move, it blocks advance in both planes,
but for clarity only one plane is shown. As for the rook, the linear
move
is indicated with double diamond decorators indicating that it is moving
in two planes. The so-called advancement rectangle
of a bishop linear move
is distorted because of the rhombus shape of its advancement squares.

Double diamond decorators are used to highlight the straight-line
sequence of tiles of linear moves. Any piece which lies along this
straight-line sequence will block
the move in both planes, as the rook does in this example. Apex tiles
help a bit in visualizing the rhombus shapes.
### Linear Move in Two Planes

Because the 3D board is biased towards levels, three examples of its
linear move
will be provided. Figure 36 shows a linear move
in both forward planes, Figure 37 shows a linear move
in both outward planes, and Figure 38 shows a linear move
in one forward and one outward plane.

In all three cases, it at first appears that White has Black's king in
check, but this is not so as the king is on the perimeters of two
5x9 advancement rectangles
which is blocked in one plane by a knight at a 3x3 advancement
square,
and in the other by a rook at a 4x4 advancement square.
The three situations are not rotations of each other but are otherwise
conceptually identical.

![[]Figure 36: Bishop Linear Move in Two Forward
Planes](media/image37.png)

At first glance it appears that White's bishop is putting Black's king
in check with a linear move
along the forward planes (toward the viewer), but the king is on the
perimeters of four 5x5 advancement squares, paired up in two planes for
two 5x9 advancement rectangles. Since, the knight (KR level) blocks the
attack in the upward plane
to a 3x3 advancement square,
and the rook (QR level) blocks the attack in the downward
plane
to a 4x4 advancement square,
the king is not actually in check. Note the artwork trick where the king
and ghost bishop are offset sideways in the tiles, so both are visible.

![[]Figure 37: Bishop Linear Move in Two Outward
Planes](media/image38.png)

Same situation as in the previous figure, but with the linear
move
along two outward planes; knight (KR level) blocks the attack in the
leftward plane
to a 3x3 advancement square,
while the rook (QR level) blocks the attack in the rightward
plane
to a 4x4 advancement square.
The ghost bishop shows the farthest legal move the bishop can make in
this direction. The ghost bishop partially hides the offset diamond
decorator that indicates that the bishop at this point has been reduced
to traveling in only one plane. As before, the Black king is not
actually in check.

![[]Figure 38: Bishop Linear Move in Forward and
Outward
Plane](media/image39.png)

The bishop at first appears to have Black's king in check with a linear
move
along the downward and rightward planes, but the king is just out of
reach. White's attack in the downward plane
is blocked by the knight (KB level) to a 3x3 advancement
square
and in the rightward plane
its attack is blocked by the rook (Q level) to a 4x4 advancement
square.
### Shape

Figure 39 shows a bishop in the corner of the board and marks out all
the tiles it can get to in a single move. They outline three sides of a
tetrahedron. Therefore, the shape chosen for the bishop is a vertically
elongated tetrahedron.

![[]Figure 39: Bishop
Shape](media/image40.png)

From a corner of the board, the bishop can move in only three planes,
each with the shape of an equilateral triangle. The three triangles form
three sides of an equilateral tetrahedron. Thus, the shape chosen for
the bishop is an elongated tetrahedron and alludes to its move.
### Power Projection

From the corner of the board, the bishop covers 63 tiles via quadrant
move (of which 9 are apex
tiles), and 21 tiles via linear move, for a total of 84 tiles. Power
projection
is 84/511 = 16.4% compared to 7/63 = 11.1% in 2D. Power
projection
for the bishop is position dependent, it grows as the bishop approaches
the center of the board. The debunked straight-line move
would have been 21/511 = 4.11%, way lower than for 2D -- *feels like
chess**.*

From the center of the board; 2D is (7+6)/63 = 20.6%, 3D straight-line
is (6+7)\*3/511 = 7.63%. For the planar moves, for a bishop in one of
the 8 center tiles, such as K4,4, there are 147 tiles the bishop can
reach for a PPR
of 147/511 = 28.8%.

  -----------------------------------------------------------------------
  Piece               3D -- Straight          2D          3D -- Planar
                           Lines                              Moves
  ------------------ ----------------- ---------------- -----------------
  Rook                     4.11%            22.2%             32.9%

  Bishop (corner)          4.11%            11.1%             16.4%

  Bishop (center)          7.63%            20.6%             28.8%
  -----------------------------------------------------------------------

  : []Table 2: **Power Projection Ratios
  (PPR****)
  -- Rook thru Bishop**

In every case, the power projection of the 3D planar move
is closer to the power projection of the 2D piece. The debunked
straight-line moves would have
granted a 3D bishop in the center of the board a larger PPR
than the rook!
### Review

The 3D bishop is to the 3D rook, much like the 2D bishop is to the 2D
rook. Its move is governed by rays which change two coordinates; thus,
it moves in a different type of plane, and can reach only half the tiles
on the board. Like the 2D bishop it stays on whatever color it started
on. Like the rook it can get to any tile
it can reach in just two moves.

Some jargon to recall; edge rays,
skew planes, forward planes and outward planes, (upward & downward,
rightward & leftward), 4 planes each with 6 quadrants;
all new. Then as for the rook; quadrant moves
versus linear moves, advancement squares (rhombus shaped) and
advancement rectangles (double rhombi), perimeters, apex
tiles, end tiles and linear tiles, diamond tile
decorators (open, closed, double, offset single), and congruent
rules.

As a reminder, all these terms have been captured in the Jargon Table of
Appendix III.
