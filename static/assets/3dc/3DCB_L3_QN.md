## Queen

The queen is just the sum of the base pieces.[^22] In 2D, she can move
like either the rook or the bishop. In 3D, she can move like either the
rook, bishop, or duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}.

[]{#_Toc210218252 .anchor}Congruent Rule : **The queen is the sum of the
base pieces.**

The queen is generally considered to be slightly more powerful than the
sum of the base pieces, since in addition to their raw power, she also
has the flexibility of choosing what piece to move like. Since there are
three base pieces in 3D chess, she is relatively more powerful in 3D
than in 2D.

### Queen on Her Own Color

In 2D, this was a consequence of the way the board is tiled (black and
white squares), and the way the pieces line up to start the game.
However, in 3D, both queens start on white tiles.

Given the insistence that 3D chess should *feel like chess*[]{.indexref
entry="feel like chess:Play in 3D must feel like chess, a one pawn advantage wins."},
this may seem like a place where it doesn't, where the
discovery[]{.indexref
entry="discovery:Rules to 3D chess must be discovered, not invented."}
objective fails. However, now that the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} has been
covered, and we've learned that the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, by virtue
of it only being able to reach a quarter of the tiles on the board,
requires *four* colors, we can appreciate the subtle point that the
queens do in fact start on opposite colors; opposite *duke*[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} colors, not
opposite *bishop* colors. It may help to review Figure 42.

The White queen starts on a gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."},
the Black queen on a silver[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}
one. Like all the pieces, they start life in a metallic[]{.indexref
entry="metallic:Dukes start on and can only reach metallic ‘colored’ tiles."}
slant plane[]{.indexref
entry="slant plane:Plane a duke moves in, separates opposite edges of the board."},
the primary plane[]{.indexref
entry="primary plane:Largest major plane, contains starting lineup & promotion tiles."},
the largest major plane[]{.indexref
entry="major plane:Duke vertical cross planes perpendicular to the players."}.
Here is another degeneracy in 2D chess; the board is tiled black and
white, and the pieces are black and white, but it is a coincidence. Many
rollup boards have green and white tiles, some even brown and white
tiles; but we humans are so good at patterns that even on these boards,
the adage "queen on her own color," is easily accommodated. We mentally
map green or brown to black without even noticing the translation.

With malice aforethought, the figures for projecting the 3D rook and
bishop moves onto 2D surfaces used 2D comparison boards without black
tiles. The rook 2D board used green instead of black, while the bishop
2D board used brown instead of black.

[]{#_Toc210218253 .anchor}Congruent Rule : **Queens start on opposite
colors of the highest base piece**[]{.indexref
entry="base piece:A piece which moves along only 1 type of ray; rook, bishop, duke."}**.**

### Overlap Tiles

This is not the only surprise from the queen, however. In 2D, she can
attack a tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
as *either* a rook, *or* as a bishop, but *not both*. In 3D, there are
[]{#overlap_tile .anchor}*overlap* tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."}, a
few tiles which she can attack as more than one base piece[]{.indexref
entry="base piece:A piece which moves along only 1 type of ray; rook, bishop, duke."}.
There are four kinds of overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."};
tiles she can attack as both rook and bishop, as both rook and
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, as both
bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, and as
both rook, bishop, and duke.

Being able to attack as more than one type of piece means that an
opponent will have to block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
more than one attack. When one move results in more than one piece being
attacked (simple fork[]{.indexref
entry="fork:Simultaneously attacking two or more pieces with one move."}),
it is not possible to block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
both attacks with a single move. When one move results in a single piece
being attacked in two different ways (discovered fork[]{.indexref
entry="fork:Simultaneously attacking two or more pieces with one move."}),
it is also not possible to block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
both attacks with a single move. Both of these situations can occur in
2D chess, and in 3D chess as well.

What is new is that a single piece, without using a discovered
fork[]{.indexref
entry="fork:Simultaneously attacking two or more pieces with one move."},
can nonetheless attack another such that it may not be possible to
block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
the attack with a single move. Such an attack will be called a []{#quark
.anchor}*quark*[]{.indexref
entry="quark:Refers to an attack that generally requires more than one piece to block."};
it rhymes with 'fork[]{.indexref
entry="fork:Simultaneously attacking two or more pieces with one move."}'
and since it begins with a 'q', it alludes to the queen as well.
Sometimes a quark[]{.indexref
entry="quark:Refers to an attack that generally requires more than one piece to block."}
can be blocked with a single piece, but only by placing the blocking
piece on an 'earlier' overlap tile of the same type. The rest of the
time, blocking requires multiple pieces. This has significant tactical
implications since with shrewd moves, a player can short-circuit the
general 'attack-block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."},
attack-block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}'
cycle.

A summary of the four overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."} is
presented in the [Table of Overlap Tiles]{.underline} in the Glossary
Table Appendix III.

To show queen moves, a new set of decorators is introduced. Except for
the overlap tiles, they are just variations on what has already been
introduced, but with the addition of a purple border (royal color)
around them. To avoid being too cluttered, they emphasize what kind of
base piece[]{.indexref
entry="base piece:A piece which moves along only 1 type of ray; rook, bishop, duke."}
can reach a tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
rather than the type of tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.

Figure 62 shows them all for a queen at the center of the chess board.
Each overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is discussed below along with additional figures.

### Brook Tiles

A []{#brook_tile .anchor}*brook* *tile*[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is an overlap tile which the queen may attack as either a rook or a
bishop. The name is a mangled 'bishop-rook'. A brook tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is always an apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
in a rook quadrant, and an end tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
in a bishop linear move[]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."}.
There are thus *three* advancement manifolds which must be blocked; one
advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}
(rook) and two advancement rectangles (bishop).

The decorator consists of two nested diamonds: a red inner one for the
rook, and a green outer one for the bishop. From the center of the
board, the queen covers 24 brook tiles: 4 on the KN and K levels, 8 on
the Q level, and 4 on the QB and QR levels. This is every other level.
More generally, every other orthogonal plane, whether it be a left
vertical plane, a right vertical plane, or a horizontal plane (level).

![[]{#_Ref66197680 .anchor}Figure 62: Queen Quark Attacks from Board
Center to 60 Overlap
Tiles](media/image63.png){alt="Shape, background pattern Description automatically generated"
width="6.5in" height="7.858333333333333in"}

All the queen *quark* moves from the center of the board; 24 *brook*
tiles, 15 *q-tiles*, 9 *hotspots*, 12 *Feynman* tiles, for a total of 60
*overlap* tiles. Note the new decorators with nested diamonds; colors
indicate the base piece that cover such tiles. 12 rook and 25 duke
linear tiles are also shown.

### Q-tiles

A []{#q_tile .anchor}*q-tile*[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is an overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
which the queen may attack as either rook, bishop, or duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. A
q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is always an apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
in a rook quadrant, an end tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
in a bishop linear move[]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."},
*and* an apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
in a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} edge
quadrant; a four-way attack, i.e., *four* advancement manifolds that
must be blocked; one advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}
(rook), two advancement rectangles (bishop), and another advancement
square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}
(duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} edge
quadrant). That's a lot, so the name for this overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
was chosen because it rhymes with 'futile' and since it starts with 'q',
it also alludes to the queen. Q-tiles occur every duke apex tile, but
only every other brook tile, even perimeters only for rook and bishop.

The decorator consists of three nested diamonds: from inner to outer,
blue, green, and red, for duke, bishop, and rook respectively. From the
center of the board the queen covers 15 q-tiles.

Brook and q-tiles alternate down *diagonal* lines in orthogonal planes.
The rook and bishop can get to every diagonal tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."},
but the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} can only
get to every other one. Another way to think of a q-tile is as a duke
apex and a brook tile. If only the duke attack is blocked, then all the
rest of the q-tiles down that diagonal revert to brook tiles.

Figure 63 shows a combined example of the queen advancing down a
diagonal in the horizontal plane. The first ghost queen is on Q4,4, a
*brook* tile. It is a silver tile, but the queen started on a gold tile,
so no duke move goes there. It is a perimeter 3 apex rook move and a
perimeter 3 linear bishop move. The rook and bishop advancement
manifolds are shown in red and green respectively. Instead of the usual
base piece decorators, the overlap decorators are used wherever they
apply.

The second ghost queen is on Q5,5, a *q-tile*. It is a gold tile and on
perimeter 2 of a duke edge quadrant. The 3x3 advancement square for the
duke is shown (blue). The advancement manifolds for the rook and bishop
would be just one perimeter larger than what is shown on the board.
Note, that the bishop advancement rectangles would start to leave the
board for the q-tile attack.

If the queen was advancing only to Q3,3, that would be
perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} *two*
for the rook and bishop, but perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} *one*
for the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. In that
case, just mentally strip off the latest perimeter for all the
advancement manifolds shown in the figure.

![[]{#_Ref60929052 .anchor}Figure 63: Queen Quark (Alternating Brook and
Q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
Overlap
Tiles)](media/image64.png){alt="A picture containing shape Description automatically generated"
width="6.5in" height="6.111805555555556in"}

Combined diagram showing a queen advancing to alternating brook and
q-tiles. The rook and bishop advancement manifolds are shown for an
advance to the brook tile at Q4,4, and the duke advancement square is
shown for an advance to the q-tile at Q5,5. Brook tiles alternate with
the q-tiles down diagonal lines. Both are on the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."} of a
rook quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."},
and on the end tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of a bishop linear move[]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."}
in two planes. The q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is also on the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."} of a
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} edge
quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
at half the perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} of the
rook and bishop. The standard decorators are bordered in purple (royal
color). To reduce clutter, queen decorators emphasize what *kind* of
base piece[]{.indexref
entry="base piece:A piece which moves along only 1 type of ray; rook, bishop, duke."}
over what *type* of tile, or number of manifolds for pure base piece
attacks[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.
Brook tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
decorators have two nested diamonds, green and red, and the
q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
decorators have three nested diamonds (red, green, blue). The next
subsections introduce hotspot and Feynman tiles, which are included in
this figure to highlight the relationships between all the overlap
tiles.

### Hotspot Tiles

The third overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
for the queen is the []{#hotspot_tile .anchor}*hotspot*[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."},
tiles she can reach as either a rook or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. A
hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is an end tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
in a rook linear move[]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."}
(two advancement rectangles), and a duke duplex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."} move
in a face quadrant (two advancement squares). Thus, in general, it takes
four pieces to block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
an attack on a hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."},
i.e., *four* advancement manifolds -- hot spot indeed.

Figure 64 shows the White queen advancing to a hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}.
Like the q-tiles, hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}
tiles alternate, in this case with rook end tiles down *orthogonal*
lines. A hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is on the duplex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tiles of the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} face
quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
at perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} N and
on the end tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of a rook linear move[]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."}
at perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2N. As
for the brook/q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
diagonal sequence, the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} can only
get to every other tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
down the hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}/linear-rook
orthogonal sequence, but in this case, it is a dual attack (a pair of
advancement squares) rather than a single attack (a single advancement
square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}).

![[]{#_Ref60931245 .anchor}Figure 64: Queen Quark (Alternating Hotspot &
Rook Linear
Tiles)](media/image65.png){alt="Diagram Description automatically generated with medium confidence"
width="6.5in" height="6.430555555555555in"}

Hotspot tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."} are
the duplex tiles of duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} face
quadrants at perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} N and
the linear tiles[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of rook linear moves[]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."}
at 2N. They are thus in *four* advancement manifolds. Hotspot tiles
alternate with rook linear tiles down orthogonal lines. Shown are the
rook advancement rectangle[]{.indexref
entry="advancement rectangle:The advancement manifold for a linear move, both quadrants."}s
out to perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 4 and
the pair of duke advancement squares in the upright and downright slant
planes out to perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2. The
hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}
decorator consists of two nested diamonds, blue surrounded by red. For
the queen, both rook and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} end
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
decorators are replaced with the linear tile idiom, two inline diamonds
for the rook, and three inline diamonds for the duke. Rook
apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
decorators are replaced with brook decorators. This substitution helps
clarify the relationships between the overlap tiles.

### Feynman Tiles

The fourth and last overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is called a []{#Feynman_tile .anchor}*Feynman* *tile*[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.[^23]
The reason for this name won't become apparent until the discussion of
the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}. The
queen (and the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}) may
attack a Feynman tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
as either a bishop or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. A Feynman
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is on every other bishop apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."} tile
and on every third duke edge quadrant perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} on a
tile 1/3 of the way from each end tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
to the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.
From the perspective of the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} planes,
Feynman tiles come in pairs, but occur four orthogonal planes away, so
the second pair is always off the board. There is therefore a maximum of
12 on the board at any time. The members of each pair, while in the same
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} plane, are
in different bishop planes.[^24]

Figure 65 shows one pair of Feynman tiles[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
for a White queen on her KR4,4 tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.
That places her on a silver[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.
The two Feynman tiles are on the perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 3 of
the downward facing duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} face
quadrant (4x4 advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."})
in the primary plane[]{.indexref
entry="primary plane:Largest major plane, contains starting lineup & promotion tiles."};
both are on the queen level and both sport ghost queens for emphasis.
Each Feynman tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is on the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."} of a
3x3 bishop advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}
(perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2); one
in each forward plane[]{.indexref
entry="forward plane:The two bishop planes that lean toward the opponent."}.

That is not the only beauty of this figure; all four of the queen's
overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."} are
evident. There are *four brook* tiles on the KN level, they are the
initial linear moves of the two bishop quadrants[]{.indexref
entry="quadrant:The areas of planes bordered by straight-line moves."}.
Next level down are the *four q-tiles*, the perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2
linear bishop moves. Down the vertical orthogonal line[]{.indexref
entry="orthogonal line:The space a 2D rook’s straight-line moves occur in."}
are *three hotspots*, attackable via linear rook and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} duplex
attacks in the face quadrants[]{.indexref
entry="quadrant:The areas of planes bordered by straight-line moves."}
of the major and minor (not shown) planes. Finally, there are *two
Feynman* tiles on the queen level; they are at the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
positions of bishop 3x3 advancement squares.

This is a figure worth studying, as it shows the relationships between
the overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."}. For
instance, every other hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
lies between a pair of Feynman tiles.

30 tiles have decorators in this figure, the queen is on one of them. Of
the remaining 29, there are ten tiles the queen can attack through only
1 advancement manifold[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. The four
brook tiles can be attacked in 3 advancement manifolds, the four q-tiles
can be attacked in 4, and the four hotspots can be attacked in 4. The
six linear duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} moves can
be attacked in 3 advancement rectangles, and the two Feynman tiles can
be attacked in 2 advancement quadrants[]{.indexref
entry="quadrant:The areas of planes bordered by straight-line moves."}.
To block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
attacks on all of these 29 tiles could require up to 10\*1 + 4\*3 +
4\*4 + 4\*4 + 6\*3 + 2\*2 = 76 pieces; more than start the game.

The 3D queen is a fearsome piece.

![[]{#_Ref61041775 .anchor}Figure 65: Queen Quark (Feynman
Tiles)](media/image66.png){alt="Diagram Description automatically generated with medium confidence"
width="6.5in" height="6.111805555555556in"}

Feynman tiles can be attacked as either a bishop or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, both
quadrant moves[]{.indexref
entry="quadrant moves:A move into a quadrant, blocking is by an advancement square."}.
Feynman tiles come in pairs; on the 3N perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} of a
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} face
quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
1/3 of the way from end tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
to dual apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
and simultaneously on the bishop apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of 2N perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."}. Note
also the existence of the other three overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."};
four brook tiles, four q-tiles, and three hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}
tiles.

### Overlap Shells

To block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
an attack on an overlap tile with just one piece requires placing the
blocking piece on an earlier overlap tile of the same family. A blocking
piece on a q-tile will not only block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
all farther attacks on q-tiles but also on brook tiles. A blocking piece
on a brook tile will block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
all farther attacks on brook tiles, but not on q-tiles; however, it will
reduce the number of pieces required to completely block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
attacks to later q-tiles to just one (duke-apex) instead of the usual
four. Brook and q-tiles are in the same family.

Similar arguments apply to hotspots and rook linear tiles. While rook
linear tiles are not formally overlap tiles, they do imply multiple
advancement manifolds. Thus, a blocking piece on a hotspot tile will
block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
attack on all successive hotspot tiles and all successive linear rook
tiles. The reverse is not true, but a blocking piece on a linear rook
tile will reduce by two (duke-duplex) the number of pieces required to
block[]{.indexref
entry="block:Blocks cover, prevents a piece from moving to a desired location."}
later hotspots. Hotspots and linear rook tiles are in the same family.

Linear duke moves are a family unto themselves.

These multiple attack tiles can be envisioned as arranged in
[]{#overlap_shells .anchor}*overlap* *shells*[]{.indexref
entry="overlap shell:Refers to the radial ordering of the sets of overlap tiles."}
centered on the queen. Effective blocking occurs by placing a piece on
an earlier shell. However, Feynman tiles, being every other bishop apex
tile, quickly leave the board, indeed they leave so quickly that from
the center of the board not all the shell one Feynman tiles are even on
the board. Even from the corner, the closet shell two Feynman tiles out
are just off the board. To see any of them requires a 9x9x9 board, which
from a queen in the center would also sport all the shell one Feynman
tiles.

This makes Feynman tiles a little harder to understand, but also gives
them a powerful tactical edge; there are no earlier shell tiles
available for single piece blocking.

### Shape

Figure 66 shows all the tiles the queen can attack from a corner of the
board. They suggest a slender, twisty shape, that gets lighter as one
goes up, but nothing unique.

Potential shapes for the queen might be any elegant shape shorter and
slenderer than the king that suggest she can move like the other base
pieces, so a twisted torso makes a good queen. In this work, a six-sided
star cross section was chosen.

- The rook can simultaneously cover[]{.indexref
  entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
  12 tiles; 3 orthogonal planes times 4 quadrants[]{.indexref
  entry="quadrant:The areas of planes bordered by straight-line moves."}.

- The bishop can simultaneously cover[]{.indexref
  entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
  24 tiles; 4 skew planes times 6 quadrants[]{.indexref
  entry="quadrant:The areas of planes bordered by straight-line moves."}.

- The duke[]{.indexref
  entry="duke:The third base piece, moves along vertex rays."} can
  simultaneously cover[]{.indexref
  entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
  24 tiles; 6 slant planes times 4 quadrants[]{.indexref
  entry="quadrant:The areas of planes bordered by straight-line moves."}.

Therefore, the queen can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
60 pieces, more than start the game. The six-point star of the queen
design used here alludes to the 60 advancement squares she has access
to. A 13-point cross section (one point for each plane) would also work.
Her shape is the least fixed by the invariant[]{.indexref
entry="invariant:A pattern which remains constant while other things change."}
that a piece should allude to how it moves; lots of possible
interpretations.

### Power Projection

Figure 67 shows all the tiles the queen can attack from the center of
the board. Unlike Figure 66, she is on a gem tile (ruby). While there is
beautiful symmetry here, there is also a sublime complexity. Before
extending our growing Power Projection Table, we'll need to generate an
analysis on all the tiles the queen can cover. This is complicated by
the overlap tiles. The pair of facing figures on the next two pages
provide raw material to collect some stats on how the queen and her
component base pieces project their power.

Two tables will be used, one for the queen in the corner of the board,
the other from the center. Hotspots alternate with but are also rook
linear tiles. Brook and q-tiles alternate but both are bishop linear
tiles. Feynman tiles alternate with but are also bishop apex tiles.
(This analysis was done by hand.[^25])

+---------+--------+--------+--------+------------+---------+--------+--------+--------+--------+
| Hotspot | Rook   | Brook  | Q-tile | Duke       | Feynman | Bishop | Rook   | Bishop | Duke   |
|         | Linear |        |        | Linear     |         | Apex   | Body   | Body   | Body   |
+:=======:+:======:+:======:+:======:+:==========:+:=======:+:======:+:======:+:======:+:======:+
| 9       | 12     | 12     | 9      | 7          | 3       | 6      | 126    | 54     | 51     |
+---------+--------+--------+--------+------------+---------+--------+--------+--------+--------+
| [21]{.mark}      | [21]{.mark}     | [7]{.mark} | 9                | 231                      |
+------------------+-----------------+------------+------------------+--------------------------+

: []{#_Toc210218552 .anchor}Table 4: **Queen Coverage from Corner of
Board**

- Rook = 21 + 21 + 126 = 168 tiles

- Bishop = 21 + 9 + 54 = 84 tiles

- Duke = 9 + 9 + 7 + 3 + 51 = 79 tiles

- Queen = 21 + 21 + 7 + 9 + 231 = 289 tiles

+---------+--------+--------+--------+-------------+---------+--------+--------+--------+--------+
| Hotspot | Rook   | Brook  | Q-tile | Duke Linear | Feynman | Bishop | Rook   | Bishop | Duke   |
|         | Linear |        |        |             |         | Apex   | Body   | Body   | Body   |
+:=======:+:======:+:======:+:======:+:===========:+:=======:+:======:+:======:+:======:+:======:+
| 9       | 12     | 24     | 15     | 25          | 12      | 24     | 108    | 72     | 54     |
+---------+--------+--------+--------+-------------+---------+--------+--------+--------+--------+
| [21]{.mark}      | [39]{.mark}     | [25]{.mark} | 36               | 234                      |
+------------------+-----------------+-------------+------------------+--------------------------+

: []{#_Toc210218553 .anchor}Table 5: **Queen Coverage from Center of
Board**

- Rook = 21 + 39 + 108 = 168 tiles

- Bishop = 39 + 36 + 72 = 147 tiles

- Duke = 9 + 15 + 25 + 12 + 54 = 115 tiles

- Queen = 21 + 39 + 25 + 36 + 234 = 355 tiles

The totals in color are all that the straight-line rules would yield. As
for 2D chess, the queen and bishop lose power when they approach the
limits of the board as does the duke. Only rook-like moves are not
reduced by being closer to the boundary of the board.

![[]{#_Ref61043282 .anchor}Figure 66: Queen
Shape](media/image67.png){alt="Shape, background pattern Description automatically generated"
width="6.5in" height="7.858333333333333in"}

The queen covers 289 tiles[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
from a corner of the board. It's impressive, but chaotic. Pretty much
any design shorter and shapelier than the king which alludes to her
being able to move like any of the base pieces should do.

![[]{#_Ref66284696 .anchor}Figure 67: Queen Power
Projection](media/image68.png){alt="Shape, background pattern Description automatically generated"
width="6.5in" height="7.858333333333333in"}

The queen covers 355 tiles from the center of the board. Purple bordered
decorators are used to indicate hotspot and rook linear tiles, brook and
q-tiles, duke linear tiles, Feynman, and bishop apex tiles, and finally
rook, bishop, and duke body tiles.

Given the above numbers, the PPR[]{.indexref
entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}
for 2D, 3D straight-line, and 3D planar move can be computed for both
corner and center locations. 2D sums will be divided by 63, and 3D sums
by 511, to get the PPR[]{.indexref
entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}.

  -----------------------------------------------------------------------
  Piece               3D -- Straight          2D          3D -- Planar
                           Lines                              Moves
  ------------------ ----------------- ---------------- -----------------
  Rook                     4.11%            22.2%             32.9%

  Bishop (corner)          4.11%            11.1%             16.4%

  Bishop (center)          7.63%            20.6%             28.8%

  Duke (corner)            1.37%            \-\--             15.5%

  Duke (center)            4.89%            \-\--             22.5%

  Queen (corner)           9.59%            33.3%             56.4%

  Queen (center)           16.6%            42.9%             69.3%
  -----------------------------------------------------------------------

  : []{#_Toc210218554 .anchor}Table 6: **Power Projection Ratios
  (PPR**[]{.indexref
  entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}**)
  -- Rook thru Queen**

What is immediately apparent is how low the PPR[]{.indexref
entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}
is for straight-line moves; roughly 300% to 400% lower. In contrast, the
PPRs for planar moves are much closer to the 2D values, around 40-50%
higher. In addition, the rook continues to dominate the PPR[]{.indexref
entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}
for base pieces, whereas for the straight-line rules the bishop
dominated, inverting the 2D case. Each new base piece is less powerful
than the previous one.

The queen's jump in PPR[]{.indexref
entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}
is substantial; she gains the option of moving as a third piece (the
duke). Queen sacrifices are going to be even more dramatic.

### Review

The simple congruent rule that the queen is the sum of the base pieces
hides the full richness of the queen. Not only can she move like any of
the base pieces, she can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
many tiles as more than one piece; these are called *overlap*
tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."} and
come in four types. *Brook* tiles are covered as both rook and bishop,
*q-tiles* are covered as all three base pieces, *hotspots* are covered
as both rook and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, and
*Feynman* tiles are covered as both bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}.

Brook and q-tiles *alternate diagonally*, hotspot[]{.indexref
entry="hotspot:Tile attackable as both rook (linear) & duke (duplex)."}
tiles and rook linear moves *alternate orthogonally.* All the overlap
tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."} are
on somebody's apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."},
with q-tiles being on both rook apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tiles and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} edge
quadrant apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tiles. Feynman and bishop apex tiles also alternate.

New decorators were introduced to deal with the overlap
tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."}, and
all are bordered in purple. Unlike the dukes, she can move in the gem
slant planes. The initially jarring fact that both queens start on white
tiles was resolved by noting that the congruent rule is that queens
start on *opposite colors of the highest base piece*[]{.indexref
entry="base piece:A piece which moves along only 1 type of ray; rook, bishop, duke."}*,*
in this case the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. The White
queen starts on a gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."},
the Black queen on a silver[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.

Additional new jargon included *quark* and *overlap shells*.

The queen's power projection is formidable, about 60% larger than in 2D.

## Knight

Discovery of the planar move[]{.indexref
entry="planar move:A move without a trajectory in a plane which cuts a 3D board."}
was achieved by recognizing that the concept of base pieces would allow
how the pieces move to be *coupled*[]{.indexref
entry="couple:Knight couples to the board as the anti-queen, anti to all base pieces."}
to the board. When the board changed, so then would the moves. It is
not, however, obvious how the 2D knight move is coupled[]{.indexref
entry="couple:Knight couples to the board as the anti-queen, anti to all base pieces."}
to the board. The place to start is to determine the correct invariants,
the ones that yield play that *feels like chess*.

### Invariants

The 2D knight move always changes *color*, but in 3D there are two
choices for colors: *bishop* color and *duke*[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} color. The
2D knight changes *both* coordinates and does so *unequally*. The 2D
knight can (eventually) reach *every* tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
on the board. These are important invariants.

The guiding constant throughout the descriptions of how base pieces move
was that pieces advance according to their type; along *single* rays in
2D, but along a *pair* of rays in 3D. Since the knight jumps rather than
advances, that guide no longer applies, and the concept of an
advancement manifold[]{.indexref
entry="advancement manifold:Regular region of tiles which must be empty to permit move."}
is invalid.

There are many ways to describe the 2D knight's move. While degenerate
in 2D, each way yields a different 3D knight move. Once again, the
challenge of a conceptual degeneracy[]{.indexref
entry="conceptual degeneracy:Two descriptions only equivalent at a lower level of abstraction."}
arises. Which rule is best, which one scales, which one is dimension
agnostic[]{.indexref
entry="dimension agnostic:Rules of chess which scale to higher dimensions as invariants."}?
Adherence to the discovery[]{.indexref
entry="discovery:Rules to 3D chess must be discovered, not invented."}
principle implies that the one to pick is the one that preserves
'chessness.' Are there any that do?

Below is a brief critique of the more obvious options.

**Fixed rook move, one tile by two:** in any orthogonal plane the knight
makes two rook-like moves, either two tiles by one, or one tile by two.
This violates the 2D invariant that rooks and knights can't
simultaneously attack each other, it reduces the knight's reach, so the
knight loses all the knight endgame races.

**Knight makes N linear rook moves:** N, then N-1 at right angles, then
N-2 at right angles to both, etc. This violates the 2D invariant that a
knight changes color when it moves. It also extends the knight's reach,
allowing the knight to win endgame races it loses in 2D.

**Knight makes two advances, one as rook, one as a bishop:** Like the
previous rule, this violates the 2D invariant that a knight changes
color when it moves and it extends the knight's reach, allowing the
knight to win endgame races it loses in 2D.

**Knight makes a straight-line move like each base piece:** Order of the
moves and the definition of 'right-angle' are both ambiguous. Violates
color change, extends the knight reach, perturbing all the knight
endgames.

**Knight makes a 1 perimeter advance like each base piece:** Again,
violates the 2D invariant that a knight changes color when it moves, but
this rule grossly extends the knight's range distorting both midgame and
openings in addition to the endgames.

Five obvious choices, all bad. All correctly describe the knight move in
2D, they are degenerate descriptions of its move; all equivalent in 2D,
but all different in 3D. Is it possible none scale to higher dimensions?
Have we finally found the reason chess in three dimensions is
impossible, that chess is fundamentally and irredeemably a
two-dimensional game? Or is it just that our list is incomplete; that
there is some *sixth* way of describing the knight move?[^26]

### 5x5x5 Queen

Figure 68 shows the tiles the queen can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
in one move that are within a 5x5 square (25 tiles) centered on the
queen in 2D (a), and those she can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
within a 5x5x5 cube (125 tiles) centered on the queen in 3D (b). In 2D
she can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
16 tiles, 8 she cannot, while in 3D she can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
100 tiles, 24 she cannot. Note that in both versions, the color of the
tiles the queen cannot reach are opposite of the color she is on.

![[]{#_Ref61260577 .anchor}Figure 68: Knight as the Anti-Queen (Queen
Covered Tiles Within a 5^N^
Manifold)](media/image69.png){alt="A picture containing shape Description automatically generated"
width="6.5in" height="5.336111111111111in"}

Shown are all the tiles a 2D queen can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
in a 5x5 square (a), and all the tiles a 3D queen can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
in a 5x5x5 cube (b). The tiles she can't cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
(8 and 24) are precisely the tiles the knight can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}.

### 5x5x5 Knight

Figure 69 shows the tiles the knight can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
in one move that are within a 5x5 square (25 tiles) centered on the
knight in 2D (a), and those he can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
within a 5x5x5 cube (125 tiles) centered on the knight in 3D (b). In 2D
he can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
8 tiles, 16 he cannot, while in 3D he can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
24 tiles, 100 he cannot. Not only does this move for the 3D knight
change *bishop* colors, but it also changes *duke* colors.

![[]{#_Ref61259783 .anchor}Figure 69: Knight Covers those Tiles the
Queen Cannot in a 5^N^
Array](media/image70.png){alt="A screenshot of a computer Description automatically generated with low confidence"
width="6.5in" height="5.336111111111111in"}

The knight is the anti-queen. In 2D, he covers the 8 tiles in a 5x5
square the queen does not (a) and in 3D he covers the 24 tiles within a
5x5x5 cube which she does not (b). The knight changes *both* bishop and
duke colors and it projects the 2D move onto each face of the 5x5x5
cube. Its move within a slant plane is its 2D move. The duke-colored
board has been used and destination tiles raised; the knight changes to
the other color in its current metallicity on adjacent levels, but
changes to the other metallicity two levels away. Knight on a jade tile,
changes to a ruby tile one level away, but to gold or silver tiles two
levels away, 8 of each of the other colors.

Knight moves will be indicated with yellow decorators; a large black
diamond insert for the source tile, and nested yellow diamonds for the
destination tiles[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.

### 2D Projection of the 3D Move

Consider the tiles the knight can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
on each of the six faces of the 5x5x5 cube. (Refer to Figure 69). They
are just the 8 tiles the 2D knight could cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
if placed in the center of each face. The projection of the 3D knight
move onto a 2D surface is the 2D move. Also note that within a slant
plane[]{.indexref
entry="slant plane:Plane a duke moves in, separates opposite edges of the board."}
the 3D move is the 2D move.

### Congruent Rules

The knight is the only piece that does not advance, it jumps. It cannot
be blocked.

[]{#_Toc210218254 .anchor}Congruent Rule : **The knight does not
advance, it jumps; thus, it cannot be blocked.**

The important invariant[]{.indexref
entry="invariant:A pattern which remains constant while other things change."}
to preserve is that asymmetrical nature of the queen and knight.

[]{#_Toc210218255 .anchor}Congruent Rule : **The knight is the only
piece which can attack the queen without a counterattack.**

Therefore, consider the knight to be an anti-queen; the queen advances,
the knight jumps; the queen has unlimited range[]{.indexref
entry="range:What percentage of the board a piece can eventually reach."},
the knight a limited range[]{.indexref
entry="range:What percentage of the board a piece can eventually reach."};
the queen can be blocked, the knight cannot.

[]{#_Toc210218256 .anchor}Congruent Rule : **The knight is the
anti-queen, range**[]{.indexref
entry="range:What percentage of the board a piece can eventually reach."}
**limited to a 5^N^ boundary, cannot be blocked.**

[]{#_Toc210218257 .anchor}Congruent Rule : **Projection of the 3D knight
move onto a 2D surface is the 2D knight move.**

### Knight Move Changes Colors (Both Bishop and Duke)

Figure 69 shows that the knight changes both bishop and duke colors.
Discovery does not happen all at once. Sometimes discovery[]{.indexref
entry="discovery:Rules to 3D chess must be discovered, not invented."}
takes a little time. By defining the knight as the anti-queen, a
tactical asymmetry was preserved, and the knight changed board colors
with every move. Pretty good confirmation that the right rule for the
knight move in 3D had been discovered. But since there is no
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} in 2D,
initially, the existence of duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} colors was
not even expected. Now we know they are important. What a pleasant
surprise (and confirmation) that the knight also changes
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} colors as
well as bishop (board) colors.

[]{#_Toc210218258 .anchor}Congruent Rule : **The knight changes all
higher order base piece**[]{.indexref
entry="base piece:A piece which moves along only 1 type of ray; rook, bishop, duke."}
**colors.**

### Coverage

In chess, the knight can eventually reach every tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
on the board. A simple and far from optimal way of demonstrating this is
shown in Figure 70. In 2D, it takes a sequence of 3 moves to return to
an orthogonal adjacent tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."},
while in 3D it takes a sequence of 5 moves. Thus, a knight can run the
board and return in 2D in no more than 3\*64 = 192 moves, while the
knight can run the board and return in 3D in no more than 5\*512 = 2,560
moves. In both cases, its path includes tiles with each of the post rook
base piece colors.

![[]{#_Ref66376046 .anchor}Figure 70: Knight Coverage
Proof](media/image71.png){alt="Background pattern Description automatically generated with low confidence"
width="6.5in" height="5.336111111111111in"}

The knight can (eventually) reach every tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
on the board. In both boards, the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} starts on
the king rook initial tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.
In 2D, a simple three move sequence brings the knight to an adjacent
side square (a), in 3D, a simple five move sequence brings the knight to
an adjacent face cube (b). While not optimal, they prove the knight can
reach every tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
on the board in no more than 192 moves in 2D and 2560 moves in 3D. For
the 3D case, tiles have been raised to reveal the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} colors to
reveal the sequence (G: S, G, R, G, J). In 3D, interestingly, the even
moves []{#lite .anchor}*lite*[]{.indexref
entry="lite:The knight does not advance (it can’t be blocked), it lites upon a tile."}
upon the same color as the knight started on, with each of the other
colors visited exactly once.

### Shape

The shape chosen for the knight is just the adjacent face cubes that
yield its move; its shape is quite exactly its move; two out, two up,
one over. The 'one over' provides the traditional turn of the horse's
head. Tile color[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
will be yellow.

![[]{#_Toc62302724 .anchor}Figure 71: Knight
Shape](media/image72.png){alt="Shape Description automatically generated"
width="2.236111111111111in" height="2.0in"}

The knight's shape is quite literally its move; two out, two up, one
over; just permute the directions. The knight traverses five cubes.
Knight decorators are yellow.

### Power Projection

From the corner of the board, the 2D knight can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
only 2 tiles, but from the center he can cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
8 tiles; 2/63 = 3.17% and 8/63 = 12.7%. From the corner of the board,
the 3D knight can cover only 3 tiles, but from the center he can cover
24 tiles: 3/511 = 0.59% and 24/511 = 4.70%.

The knight loses a lot of power on the 3D board, which makes its status
as the anti-queen even more relevant.

  -----------------------------------------------------------------------
  Piece               3D -- Straight          2D          3D -- Planar
                           Lines                              Moves
  ------------------ ----------------- ---------------- -----------------
  Rook                     4.11%            22.2%             32.9%

  Bishop (corner)          4.11%            11.1%             16.4%

  Bishop (center)          7.63%            20.6%             28.8%

  Duke (corner)            1.37%            \-\--             15.5%

  Duke (center)            4.89%            \-\--             22.5%

  Queen (corner)           9.59%            33.3%             56.4%

  Queen (center)           16.6%            42.9%             69.3%

  Knight (corner)           \--             3.12%             0.59%

  Knight (center)           \--             12.5%             4.69%
  -----------------------------------------------------------------------

  : []{#_Toc210218555 .anchor}Table 7: **Power Projection Ratios
  (PPR**[]{.indexref
  entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}**)
  -- Rook thru Knight**

### Review

There were a lot of possible ways to define the 2D knight move. The one
that scaled well, the one that was dimension agnostic[]{.indexref
entry="dimension agnostic:Rules of chess which scale to higher dimensions as invariants."},
was to define the knight as the anti-queen. This keeps the all-important
asymmetry where queen and knight cannot counterattack each other, thus
helping to ensure that gambits *feel like chess*[]{.indexref
entry="feel like chess:Play in 3D must feel like chess, a one pawn advantage wins."}.

The projection of the 3D knight move yields the 2D move on both
orthogonal and slant planes. It also changes color with each move; both
the bishop colors and the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} colors as
well, the latter being an unexpected confirmation that the anti-queen is
the right rule for the knight. It also changes all coordinates and does
so unequally, and it can eventually reach all the tiles on the board,
with at least one algorithm that is dimension agnostic[]{.indexref
entry="dimension agnostic:Rules of chess which scale to higher dimensions as invariants."}.

For the math inclined, the Euclidean distance of the knight move is

> $\sqrt{(2^{2} + 1^{2})}\ $ = $\sqrt{5}$ = 2.24 (1)

for 2D, and

> $\sqrt{(2^{2} + 2^{2} + 1^{2})}$ = $\sqrt{9}$ = 3.00 (2)

for 3D.

It would be interesting to see if the meta-formula implied by the
sequence of equations (1) and (2) is valid for 4D chess.

> $\sqrt{(2^{2} + 2^{2} + 2^{2} + 1^{2})}$ = $\sqrt{13}$ = 3.61 (3)

In any case, this seems like a reasonable value. We appear to have
chosen the correct invariant to honor.
