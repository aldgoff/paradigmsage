## Stack {#stack-1}

Probably the easiest place to critique this variation on the rules of
three-dimensional chess is to point out the apparent incompatibility
between the stated goal, 'feels like chess[]{.indexref
entry="feels like chess:Play in 3D must feel like chess, a one pawn advantage wins."},'
and the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}; the
composite piece of bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, "Ain't no
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} in
2D chess."

### Justification

The justification for the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
comes down to the problem of board size and shape. Placing the dukes on
either side of the royal pieces, followed by bishop, knight and rook
respectively is a reasonable starting lineup on either a 10x10x10[^27]
or an 8x8x10 board. The former leads to a major piece war followed by a
pawn war. While addressable by allowing the pawn a triple advance, they
then outstrip their knight protections, and the en passant[]{.indexref
entry="en passant:Balance rule allowing PxP to a tile where it would have been."}
permutations double. While an asymmetrical board introduces only a
handful of problems for endgames, mostly pawn races between kings and
knights, its lack of board symmetry scales badly with larger dimensions.

There is, therefore, a case to be made for the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}, but
it is a distributed case; the current development, even by the end of
this chapter, may strike some as still short of satisfactory. However,
as the presentation of the game proceeds, additional justification for
the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} will
appear, rather unexpectedly. Indeed, even the final chapter will provide
additional rationale for the appropriateness of the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}.[^28]

### Overlap Tiles

It should be clear from the queen that the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
going to have a few tiles where it may move as both a bishop and a
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} (to two of
the queen's four overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."}, in
fact). Unlike the queen however, which can move like *either* a bishop
or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, the
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} must
be able to move to such tiles as *both* a bishop and a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. If either
sub piece is blocked, the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
blocked. That means two advancement manifolds will have to be open for
the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} to
move as a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}.

If the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} were
allowed to move as either a bishop or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, the bishop
move could be used to change the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} color, and
the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} move could
be used to change the bishop color, which would allow the
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} to
reach every tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
on the board. It would be less of a departure from *feels like
chess*[]{.indexref
entry="feels like chess:Play in 3D must feel like chess, a one pawn advantage wins."},
to simply drop the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} altogether.

Figure 72 shows the tiles the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
covers as a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."};
it's pretty sparse. Stack decorators have an orange border like queen
decorators have a purple border. One of the overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
decorators is for q-tiles (without the red decorator to indicate a rook
move), the other is for Feynman tiles.

From the starting position, there are 9 q-tiles and 5 Feynman tiles.
Like the queen, q-tiles lie on a perimeter N apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."} of a
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} edge
quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."},
but on a perimeter 2N end tile of a bishop linear move[[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."};
thus, one advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}
(duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}) and either
of two advancement rectangles (bishop) must be empty for the
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} to
move as a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} to
q-tiles. Feynman tiles lie on the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of a bishop quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
on perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2N and
a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} face
quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
to perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 3N, and
lies on the tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
1/3 the distance from edge tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
to apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."};
thus, one advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}
(duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}) and one
advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}
(bishop) must be empty for the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} to
move to Feynman tiles.

![[]{#_Ref61278717 .anchor}Figure 72: Stack Overlap
Tiles](media/image73.png){alt="Shape, background pattern Description automatically generated"
width="6.5in" height="6.985416666666667in"}

Stack decorators are bordered in orange like queen decorators are
bordered in purple. From the home location, each stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} can
cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
9 q-tiles and 5 Feynman tiles. White king side stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
shown.

### Coverage

To achieve reasonable coverage, but more critically to allow independent
bishops and dukes on the board, we are going to have to allow the stack
to decompose.

Figure 73 shows the tiles the sub pieces can reach, part bishop, part
duke.

![[]{#_Ref67406518 .anchor}Figure 73: Stack Coverage via Sub
Pieces](media/image74.png){alt="Shape, arrow Description automatically generated"
width="6.5in" height="6.985416666666667in"}

The tiles a stack covers as either a bishop or a duke. New decorators
are introduced, but they follow previous idioms. Note the linear moves,
bishop alternation patterns, and duke duplex tiles.

From the home location, the White kingside stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} can
decay[]{.indexref
entry="decay:Just the bishop, or just the duke sub piece, separates from the stack."}
to 79 gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} tiles, 94
white bishop tiles. They share 14 overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."}; 9
q-tiles and 5 Feynman tiles, thus cover 159 tiles.

Figure 74 shows the advancement manifolds for a stack moving to a
q-tile.

![[]{#_Ref67410062 .anchor}Figure 74: Stack Advancement Manifolds for a
Move to a
Q-Tile](media/image75.png){alt="Shape, arrow Description automatically generated"
width="6.5in" height="6.985416666666667in"}

This is a linear move for the bishop sub-piece (outward planes) and an
apex move for the duke sub-piece (primary plane). Note the linear move
decorator. Ghost stack shows the destination.

As a pair, a rook and a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."},
have a similar power projection with respect to the queen in 3D, as a
rook and a bishop have to the queen in 2D, for obvious reasons; their
sum is the queen.

Figure 75 shows the advancement manifolds for a stack moving to a
Feynman tile.

![[]{#_Ref67410076 .anchor}Figure 75: Stack Advancement Manifolds for a
Move to a Feynman
Tile](media/image76.png){alt="Shape Description automatically generated with medium confidence"
width="6.5in" height="6.985416666666667in"}

This is an apex move for the bishop sub-piece (leftward plane) and face
quadrant move for the duke sup-piece (downleft plane). Note the
alternation patterns. Ghost stack shows the destination.

Trick question for the advanced; how do you get Black's
white-silver[]{.indexref entry="white-silver:Black’s king side stack."}
stack in Figure 75 to his Q3,3 tile? It is composed of a white bishop
and a silver duke.

### Decay

To have bishops and dukes as independent pieces on the board, there must
be one or more mechanisms by which the stack may separate into its two
component sub pieces. The first mechanism is called []{#_decay
.anchor}*decay*[]{.indexref
entry="decay:Just the bishop, or just the duke sub piece, separates from the stack."};
the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} may
[]{#emit .anchor}*emit*[]{.indexref
entry="emit:Stack decays by emitting either the bishop or the duke sub piece."}
either a bishop or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. The
emitted sub piece may make either a quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
or a linear move[]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."}
without regard to the left behind sub piece.

Figure 76 shows a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
decay[]{.indexref
entry="decay:Just the bishop, or just the duke sub piece, separates from the stack."}
emitting a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}.

![[]{#_Ref61425747 .anchor}Figure 76: Stack Decay - White Emits
Duke](media/image77.png){alt="A screenshot of a video game Description automatically generated with low confidence"
width="6.5in" height="4.656944444444444in"}

White's queen side stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
(black bishop, silver[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}) decays
emitting a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} to KN5,1.
Move is in an edge quadrant in the upleft plane[]{.indexref
entry="upleft plane:Duke left cross plane which leans toward opponent."}
to the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of a 3x3 advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."},
which is the first q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
in this direction. This means both the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} and the
bishop cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
each other. Note that the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} is fading
out of the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
(QB1,1) leaving only the bishop.

In general, the emitted sub piece will defend the stationary sub piece,
but unless it moves to an overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."},
the reverse is not true.

While it is not unreasonable to restrict decay[]{.indexref
entry="decay:Just the bishop, or just the duke sub piece, separates from the stack."}
to the first move, the side-effect of this to prohibit moves as a
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}.
This does tie more closely with the size/shape justification for the
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}, but
it denies the richness of 3D chess. It also delays major piece
development by one move, which has an impact[]{.indexref
entry="impact:Measures of a piece’s ability to affect the game; range, PPR, & stab."}
on openings.

Note that if the bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} are still
stacked when captured, both sub pieces are removed from the board. Once
they have separated, it's each man for himself.

Figure 77 shows a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
decay[]{.indexref
entry="decay:Just the bishop, or just the duke sub piece, separates from the stack."}
emitting a bishop.

![[]{#_Ref61425762 .anchor}Figure 77: Stack Decay - Black Emits
Bishop](media/image78.png){alt="Shape Description automatically generated"
width="6.5in" height="4.656944444444444in"}

Black's queen side stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
(black bishop, gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}) decays
emitting a bishop to KN4,8, (same tile as the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} from the
previous figure). Move is in the forward up quadrant of the rightward
plane[]{.indexref
entry="rightward plane:Bishop plane that in the up direction leans outward to the right."}
(Black's perspective) to a tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
on the perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} of a
5x5 advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}.
This is not an overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."},
so while the bishop is covering the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, the
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} is not
covering the bishop. Note that the bishop is fading out of the
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
(QB1,1) leaving a hanging duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} (which will
drop to the tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}).

### Recombination

The moves of base pieces in chess are []{#time_symmetric .anchor}*time
symmetric*[]{.indexref
entry="time symmetric:The fundamental moves of chess are time symmetric (base pieces)."};
the set of tiles a rook, bishop or duke can get to on the *next* move is
precisely the set of tiles it had to come from on the *previous* move.
The time inversion of decay is []{#recombination-1
.anchor}*recombination*[]{.indexref
entry="recombination:A bishop or duke reconstituting a stack by moving onto the other."}.

Figure 78 shows each player recombining their remaining stacks.

![[]{#_Ref61437610 .anchor}Figure 78: Stack
Recombination](media/image79.png){alt="Background pattern Description automatically generated with medium confidence"
width="6.5in" height="5.7444444444444445in"}

Two examples of *recombination*[]{.indexref
entry="recombination:A bishop or duke reconstituting a stack by moving onto the other."}
are shown. White's gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} recombines
with its white bishop on KB1,1 via a duplex move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
with two independent 3x3 advancement squares in the up
quadrants[]{.indexref
entry="quadrant:The areas of planes bordered by straight-line moves."}
of the major and minor planes (half the tiles are off the board, shown).
Black's white bishop recombines with its silver[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} on Q1,3 via
a 4x4 advancement square[]{.indexref
entry="advancement square:An NxN advancement manifold, must be empty for a legal move."}
in the down forward quadrant of the leftward plane[]{.indexref
entry="leftward plane:Bishop plane that in the up direction leans outward to the left."}.
Destination tiles have ghosted duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} and bishop
respectively. Neither sub piece must be on an overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.

For both players, it is their respective white bishop stacks which are
reconstituted.

+------------------------------------------------------------------------------------------+
| By the way, the bishop in each stack[]{.indexref                                         |
| entry="stack:The composite piece composed of a bishop and a duke."} is attacking the     |
| other stack[]{.indexref                                                                  |
| entry="stack:The composite piece composed of a bishop and a duke."}. If it is White's    |
| move, she has an opportunity to gain a stack[]{.indexref                                 |
| entry="stack:The composite piece composed of a bishop and a duke."} advantage. Black     |
| does not have this option since White's king can capture the bishop if it takes the      |
| stack[]{.indexref entry="stack:The composite piece composed of a bishop and a duke."}.   |
| It is not known if a bishop and duke[]{.indexref                                         |
| entry="duke:The third base piece, moves along vertex rays."} can force a mate against a  |
| lone king, so even if it is White's move, it looks like this game will end in a          |
| stalemate.                                                                               |
|                                                                                          |
| It is worth noting that the White king, even though it is on a straight line             |
| (orthogonal) sandwiched between the duke[]{.indexref                                     |
| entry="duke:The third base piece, moves along vertex rays."} and bishop, does not        |
| block[]{.indexref                                                                        |
| entry="block:Blocks cover, prevents a piece from moving to a desired location."} the     |
| duke[]{.indexref entry="duke:The third base piece, moves along vertex rays."}'s          |
| recombination[]{.indexref                                                                |
| entry="recombination:A bishop or duke reconstituting a stack by moving onto the other."} |
| move; the duke[]{.indexref entry="duke:The third base piece, moves along vertex rays."}  |
| simply []{#diffuses .anchor}*diffuse*[]{.indexref                                        |
| entry="diffuse:The openness of duke planes allow moves to diffuse around pieces."}*s*    |
| around it.                                                                               |
+==========================================================================================+

### Cross Combination

Both players start with two stacks, but they are not of the same type.
White starts with a *gold* duke stacked on top of a *white* bishop on
her king side, and a *silver* duke stacked on top of a *black* bishop on
her queen side. Black starts with a *silver* duke stacked on top of a
*white* bishop on his king side, and a *gold* duke stacked on top of a
*black* bishop on his queen side, the reverse pairing.

Since together the two players cover[]{.indexref
entry="cover:Can move to a tile, generic term for attack foe or defend friend."}
all the permutations, if recombination[]{.indexref
entry="recombination:A bishop or duke reconstituting a stack by moving onto the other."}
is allowed, it seems reasonable to allow []{#cross_combination
.anchor}*cross combinations* as well.

After separating both stacks, White should be free to move her white
bishop onto the silver[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} or
vice-a-versa, or of course recombine her black bishop with her
gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}. Similar
for Black, white bishop with gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} or black
bishop with silver[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}.

The description of what *kind* of stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
going to get wordy, mentioning both bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} when that
is implied, and allowing cross combinations is going to increase the
confusion. Therefore, the following naming convention is proposed;
[]{#bishop_duke_order .anchor}*bishop-duke order*[]{.indexref
entry="bishop-duke order:Naming convention for starting stacks."} for
the starting stacks, and []{#duke_bishop_order .anchor}*duke-bishop
order*[]{.indexref
entry="duke-bishop order:Naming convention for cross-combined stacks."}
for any subsequent cross combined stacks (hyphens, not a slash).

White starts with a []{#white_gold .anchor}*white-gold*[]{.indexref
entry="white-gold:White’s king side stack."} stack (king side) and
[]{#black_silver .anchor}*black-silver*[]{.indexref
entry="black-silver:White’s queen side stack."} stack (queen side),
while Black starts with a []{#white_silver
.anchor}*white-silver*[]{.indexref
entry="white-silver:Black’s king side stack."} stack (king side) and a
[]{#black_gold .anchor}*black-gold*[]{.indexref
entry="black-gold:Black’s queen side stack."} stack (queen side).

White's cross combination[]{.indexref
entry="cross combination:Stack composed of a king side bishop and queen side duke (or reverse)."}
stacks are []{#gold_black .anchor}*gold-black*[]{.indexref
entry="gold-black:A White cross-combined stack, gold duke, black bishop."}
and []{#silver_white .anchor}*silver-white*[]{.indexref
entry="silver-white:A White cross-combined stack, silver duke, white bishop."},
while Black's cross combination[]{.indexref
entry="cross combination:Stack composed of a king side bishop and queen side duke (or reverse)."}
stacks are []{#gold_white .anchor}*gold-white*[]{.indexref
entry="gold-white:A Black cross-combined stack, gold duke, white bishop."}
and []{#silver_black .anchor}*silver-black*[]{.indexref
entry="silver-black:A Black cross-combined stack, silver duke, black bishop."}.
King side and queen side are ambiguous for cross combined stacks as each
sub piece is from a different side. []{#gem_based_stack .anchor}*Gem
based stacks* (ruby, jade) are not disallowed, there is just no way for
them to show up given the initial conditions. However,
devious[]{.indexref
entry="devious:Gambits which leverage broken 2D invariants."} chess
puzzle creators might very well sneak such stacks into their
puzzles.[^29]

Figure 79 shows White with a cross-combined stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."},
gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}-black,
on K2,2,

Note that recombination[]{.indexref
entry="recombination:A bishop or duke reconstituting a stack by moving onto the other."}
is a []{#strict_move .anchor}*strict* *move*[]{.indexref
entry="strict move:One that cannot capture, pawn advance, stack combine, teleportation."},
it cannot achieve capture.

![[]{#_Ref61440234 .anchor}Figure 79: Stack Cross
Combination](media/image80.png){alt="A picture containing text Description automatically generated"
width="6.458333333333333in" height="3.2083333333333335in"}

White has cross combined her black bishop (from QB1,1) with her
gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} (from
KB1,1) onto a *gold-black stack* (K2,2) via a series of unspecified
moves. Either sub piece may make the final move to create a cross
combined stack. The free bishop (KB1,1) and duke (QB1,1) could also
cross combine, forming a *silver-white stack*. Occupied tiles have been
raised to reveal their duke colors.

### Intersecting Planes

To fully understood the stack, it is necessary to understand the
underlying geometry. In this case, the relevant geometry is how a set of
non-parallel planes intersect. A pair of planes will intersect in a
*single* line, three planes in *three* lines (rook), four planes in
*six* lines (bishop), etc.

Given N planes, there will be N(N-1)/2 intersection lines. For the 4
planes of the bishop that's (4\*3)/2 = 6 intersection lines. To double
check[]{.indexref
entry="double check:A piece moves to check the king but also discovers a check."},
note that a cube has 12 edges (the bishop edge rays) and each opposing
pair of edges define a line, 6 lines in total. Check.

However, it is possible for more than one pair of non-parallel planes to
intersect along the *same* line. For instance, each of the duke linear
moves occurs in three planes, so three pairs of duke planes intersect
along the same line. A cube has 8 corners (the duke vertex rays), so 4
intersection lines, but each must be counted thrice, for 12 intersection
lines. Using the formula for six planes, (6\*5)/2 = 15. Ahhh, each pair
of duke cross planes[]{.indexref
entry="cross planes:Duke planes come in planes connecting opposing board faces."}
also intersect. They intersect along one of 3 orthogonal lines. These
lines contain the duplex tiles in the face quadrants, the tiles that are
hotspot overlap tiles for the queen, 12 + 3 = 15. Check.

With that warmup, we can tackle how the four planes of the bishop
intersect with the six planes of the duke. That's 10 total planes,
(10\*9)/2 = 45. Bishop-to-bishop intersections account for 6, and
duke-to-duke intersections account for 15, leaving 24 bishop-to-duke
intersection lines to account for. Q-tiles lie along the linear moves of
the bishop, which occur along six lines, but there are two bishop planes
for each, so that's 12, leaving 12 intersection lines for the Feynman
tiles.

Feynman tiles alternate with bishop apex tiles. Since there is one
sequence of apex tiles per quadrant, six quadrants per skew plane and
four skew planes, that's twenty-four pairs of opposing apex tiles; 12
intersection lines. Check.

Table 8 below shows how each bishop plane intersects each duke plane.

+---------------+-------------------------------------------------+
| **Bishop      | **Duke Planes**                                 |
| Plane**       |                                                 |
|               +------------------------+------------------------+
|               | **Q-tile               | **Feynman Tile         |
|               | Intersection**         | Intersection**         |
+===============+========================+========================+
| Upward        | Upleft                 | Downright              |
|               |                        |                        |
| V-D           | Minor                  | Major                  |
|               |                        |                        |
|               | Upright                | Downleft               |
+---------------+------------------------+------------------------+
| Downward      | Downleft               | Upright                |
|               |                        |                        |
| V-D           | Minor                  | Major                  |
|               |                        |                        |
|               | Downright              | Upleft                 |
+---------------+------------------------+------------------------+
| Leftward      | Upright                | Upleft                 |
|               |                        |                        |
| H-D           | Major                  | Minor                  |
|               |                        |                        |
|               | Downleft               | Downright              |
+---------------+------------------------+------------------------+
| Rightward     | Downright              | Downleft               |
|               |                        |                        |
| H-D           | Major                  | Minor                  |
|               |                        |                        |
|               | Upleft                 | Upright                |
+---------------+------------------------+------------------------+

: []{#_Ref80111351 .anchor}Table 8: **Bishop/Duke Plane Intersections**

The V-D and H-D annotations are a kind of double check[]{.indexref
entry="double check:A piece moves to check the king but also discovers a check."}
that the plane intersections present a reasonable permutation pattern.
For the major and minor planes, this is obvious, but for others. a
double check[]{.indexref
entry="double check:A piece moves to check the king but also discovers a check."}
is warranted. The first letter applies to the Up/Down part of the plane
name, and the second letter applies to the Left/Right part of the plane
name. V means they match vertically in the table, Q to Q, and Feynman to
Feynman. H means they match horizontally, q-tile to Feynman tile. The D
means they match diagonally between the Q and Feynman tiles.

### Teleportation

Given that cross combinations are allowed, there is a special case of
such, where one sub piece starts on one stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} and
[]{#teleport .anchor}*teleports* into another.[^30] Note that the
teleporting sub piece cannot change color; and the base
piece[]{.indexref
entry="base piece:A piece which moves along only 1 type of ray; rook, bishop, duke."}
must be on different []{#native_color .anchor}*native
colors*[]{.indexref
entry="native color:Teleportation relevant, white/black for bishops, gold/silver for dukes."}.[^31]

Figure 80 shows a duke teleport[]{.indexref
entry="teleport:A stack emits a sub piece onto a base piece of a different native color."}.

Teleportation violates two invariants in 2D chess; when a piece moves,
it leaves behind an empty tile[]{.indexref entry="“tile:Generic"}, and
must either convert another empty tile[]{.indexref
entry="“tile:Generic"} into an occupied tile[]{.indexref
entry="“tile:Generic"} or capture an opponent's piece. Note that like
recombination[]{.indexref entry="“recombination:A"}, teleportation is a
strict move[]{.indexref entry="“strict"}, it cannot achieve capture; a
pawn's advance has a similar restriction, advancing as a rook is a
strict move[]{.indexref entry="“strict"}, capture is not allowed as a
rook, but must be done as a bishop (duke[]{.indexref entry="“duke:The"}
or bishop in 3D). Recombination only violated the first
invariant[]{.indexref entry="“invariant:A"}, teleportation violates
both.

![A picture containing text Description automatically
generated](media/image81.png){width="6.5in"
height="6.611111111111111in"}

[]{#_Ref61448443 .anchor}Figure 80: Stack to Stack Teleportation of a
Duke Between Two Bishops

An original *white-gold stack* (Q5,1) *teleports* by emitting a duke
which combines with the existing black bishop (QR8,6) creating a
*gold-black stack*, one of the two possible *cross combined stacks* for
White. The teleporting sub piece (ghosted) does not change its color
(gold) but must teleport[]{.indexref
entry="teleport:A stack emits a sub piece onto a base piece of a different native color."}
between two sub pieces (bishop) that are on *different native
colors*[]{.indexref
entry="native color:Teleportation relevant, white/black for bishops, gold/silver for dukes."}
(white/black). The example shows the 5x5 advancement square in the
downleft plane; note the two tiles off the board. Occupied tiles have
been raised to reveal their duke colors.

Note that teleportation to duplex, apex or overlap tiles cannot occur,
for they are on the same native color.

Figure 81 shows a bishop teleport[]{.indexref
entry="teleport:A stack emits a sub piece onto a base piece of a different native color."}.

![[]{#_Ref61447434 .anchor}Figure 81: Stack to Stack Teleportation of a
Bishop Between Two
Dukes](media/image82.png){alt="Shape Description automatically generated"
width="6.5in" height="5.7444444444444445in"}

An original *white-gold stack* (KR1,1) *teleports* by emitting a bishop
which combines with the existing silver duke (QN8,2) creating a
*silver-white stack*, one of the two possible *cross combined stacks*
for White. The teleporting sub piece (ghosted) does not change its color
(white) but must teleport[]{.indexref
entry="teleport:A stack emits a sub piece onto a base piece of a different native color."}
between two sub pieces (duke) that are on *different native
colors*[]{.indexref
entry="native color:Teleportation relevant, white/black for bishops, gold/silver for dukes."}
(gold/silver). The example shows the 7x7 advancement square in the
rightward plane; note the many tiles off the board, including two of the
three Feynman tiles. Since the bishop is the traveling piece, it has
been inverted with the duke in the stacks. Occupied tiles have been
raised to reveal their duke colors.

Both bishop and duke could move back, teleporting the stack again,
converting it from a cross-combined stack back into an original stack,
but the advancement squares would not fully overlap.

A questionable technique has been used to indicate bishop teleportation;
the stacking order of the bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} has been
reversed. This is a matter of style only. Given that we now have a
deeper understanding of duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} colors,
another possibility is to have the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} with
the gold[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} on top,
silver[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} on bottom.
One small benefit of this option is that it does serve to better
indicate that dukes across the starting lineup are on opposite
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} colors. The
noise cost of this choice is questionable and is really a matter more of
invention[]{.indexref
entry="invention:Simple primitives chosen to lead to complex play."}
than discovery[]{.indexref
entry="discovery:Rules to 3D chess must be discovered, not invented."},
but if there are cases where it makes the tactical situation clearer, it
might find merit in special cases. It serves that purpose here, treating
bishop teleportation as a kind of special case.[^32] Your mileage may
vary.

### Explosion (Fission)

If you thought that variations on the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} move
could not be taken any further into the Twilight Zone, the
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} has
yet another surprise to tantalize us with.

Consider, just for the moment, if we let the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
[]{#explode .anchor}*explode*[]{.indexref entry="explode:See fission."},
fission[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."}
like, in that *both* the bishop and the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} may
advance; now to *two* destination tiles. Like teleportation, []{#fission
.anchor}*fission*[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."}
violates an invariant of 2D chess. It violates the "fill one empty
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}"
invariant[]{.indexref
entry="invariant:A pattern which remains constant while other things change."}
as it can populate *two* empty tiles. Teleportation violated both the
"fill one empty tile" and the "leave one empty tile behind" invariants.
Decay violated only the "leave one empty tile behind" invariant; all
permutations accounted for.

But that is not its only possibility. It allows a whole new way to
fork[]{.indexref
entry="fork:Simultaneously attacking two or more pieces with one move."}
multiple pieces and an additional way to quark[]{.indexref
entry="quark:Refers to an attack that generally requires more than one piece to block."}
another piece. Even more dramatically, it further allows the capture of
*two* pieces at once. That is a lot of power to invest in one piece, but
it helps to justify the risk that when a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
captured it does in some sense actually amount to two pieces being
captured at once; at least the injured party might look at it that way.

Despite the invariant[]{.indexref
entry="invariant:A pattern which remains constant while other things change."}
violations, the choice has been made to allow this move, but with a
limiting restriction. The justification for this choice of restriction
does not arise naturally until the last chapter.[^33]

A stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} may
explode[]{.indexref entry="explode:See fission."} (fission[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."})
only if the perimeters of the resulting advancement regions of the
bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} *share* an
overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."};
either a q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
or a Feynman tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.
Now, as promised, some justification for the weird choice of
'Feynman'[^34] as the name of the overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
that connects bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} alone; the
allusion to physics is deeper in this game than is apparent from a first
exposure.

Figure 82 shows a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
explosion[]{.indexref entry="explosion:See fission."} []{#conjoined
.anchor}*conjoined*[]{.indexref
entry="conjoined:Requirement that fission advancement manifolds share an overlap tile."}
by a q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
on the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2 of a
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} edge
quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
in the major plane[]{.indexref
entry="major plane:Duke vertical cross planes perpendicular to the players."}
and on perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 4 of a
bishop linear move[]{.indexref
entry="linear move:A move along end tiles, blocked by advancement rectangle(s)."}
in the outward planes. As a bishop linear move the end tiles of the
advancement rectangle are not allowed, but as the duke move is a
quadrant move, the end tiles of its advancement square are allowed. Some
off the board tile decorators are not shown. Ghost pieces show legal
moves.

![[]{#_Ref61514627 .anchor}Figure 82: Stack Explosion (Fission)
Conjoined by a
Q-Tile](media/image83.png){alt="Shape Description automatically generated with medium confidence"
width="6.5in" height="6.111805555555556in"}

Stack *explodes* at Q1,1 *conjoined*[]{.indexref
entry="conjoined:Requirement that fission advancement manifolds share an overlap tile."}
to a q-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
at Q5,5 which places it on the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2 of a
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} edge
quadrant move in the major plane[]{.indexref
entry="major plane:Duke vertical cross planes perpendicular to the players."},
and on perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 4 of a
bishop liner move in the outward planes. There are 5 potential
destination tiles for the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} and 18 for
the bishop, which implies 89 possible *explosions*. The permutation
where *both* sub pieces end up on the overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is *denied*, as that would be a *stack*[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
*move* not a *fission*[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."}
move, so ghost bishop & duke are not stacked.

Figure 83 shows a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
explosion[]{.indexref entry="explosion:See fission."}
conjoined[]{.indexref
entry="conjoined:Requirement that fission advancement manifolds share an overlap tile."}
by a Feynman tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
on the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2 of a
bishop quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
in the leftward plane[]{.indexref
entry="leftward plane:Bishop plane that in the up direction leans outward to the left."}
and on perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 3 of a
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} face
quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
in the upright plane[]{.indexref
entry="downright plane:Duke right cross plane which leans away from opponent."}.

![[]{#_Ref61514635 .anchor}Figure 83: Stack Explosion (Fission)
Conjoined by a Feynman Tile](media/image84.png){width="6.5in"
height="6.111805555555556in"}

Stack explodes at K2,4 conjoined[]{.indexref
entry="conjoined:Requirement that fission advancement manifolds share an overlap tile."}
by a Feynman tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
at K4,6 which is the apex[]{.indexref
entry="apex:The tiles down the diagonal of an advancement square."}
tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
of perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 2 of a
bishop quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
in the leftward plane[]{.indexref
entry="leftward plane:Bishop plane that in the up direction leans outward to the left."}
and on perimeter[]{.indexref
entry="perimeter:The outside edges of an advancement manifold."} 3 of a
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} face
quadrant move[]{.indexref
entry="quadrant move:A move into a quadrant, blocking is by an advancement square."}
in the upright plane[]{.indexref
entry="downright plane:Duke right cross plane which leans away from opponent."}.
There are 5 potential destination tiles for the bishop and 7 for the
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, which
implies 34 possible explosions. The permutation where both sub pieces
end up on the overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is denied, as that would be a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} move
not a fission[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."}
move. Ghost pieces show legal destinations.

### The Precedence of Ambiguity

Recall that the most fundamental concept in the discovered rules of 3D
chess is the advancement square. In 2D, pieces move in lines, and they
have *two* directions in which they can move in each line. In 3D, pieces
move in planes, and they have *four* directions (*six* for the bishop)
in which they can move. These are the quadrant moves. However, quadrants
are bordered by straight lines. Linear moves are allowed, the game is
silly without them, but there are two ambiguities associated with linear
moves, which *quadrant* they moved in, and which plane they moved in.

The plane ambiguity is resolved via the concept that lines in 2D are
*independent*, thus planes in 3D should be independent, therefore pieces
which make *linear* moves do so in *every* unblocked plane. However, the
quadrant ambiguity was resolved such that *both* quadrants must be
unblocked for a linear move in that plane to be unblocked.

Again, we are faced with a rule degeneracy; which is more primary,
linear moves, or ambiguity? This will matter whenever a situation arises
in which the ambiguity is broken; in which a linear move must clearly be
occurring in only *one* of the quadrants. We will see this shortly for
the pawn.

But the breaking of the ambiguity occurs also for the stack; not for
decay, that's a pure base piece move, and not for any of the
re-combining moves, those are also pure base piece moves; but for
fission, the requirement that the advancement manifolds be conjoined by
an overlap tile breaks the ambiguity. A q-tile is already an end tile
for the bishop, so no problem, but it is an apex tile for the duke. A
Feynman tile is an apex tile for the bishop, but simultaneously also a
perimeter tile (non-end tile, non-duplex tile) for a duke. So, the
question is whether the end tiles of the advancement manifolds for a
fission move are allowed destinations. In other words, are fission moves
*pure quadrant*[]{.indexref
entry="pure quadrant:Quadrant move which does not include the end tiles."}
moves or *full quadrant*[]{.indexref
entry="full quadrant:Quadrant move which does include the end tiles."}
moves?

In stack decay, either a linear move or a quadrant move is selected, for
either the bishop or the duke; recombination, cross-combination, and
teleportation the same. In all those cases a linear move has quadrant
ambiguity, but a stack move requires the selection of an overlap tile
for which there is no quadrant ambiguity. The overlap tile breaks the
quadrant ambiguity. Therefore, the end tiles of the advancement squares
(but not the end tiles of the bishop advancement rectangles in q-tile
fission) should be allowed. This argument will be strengthened in the
last chapter.

Quadrant ambiguity is what leads to linear moves, it is a predicate to
them -- []{#ambiguity_is_ascendant .anchor}*ambiguity takes precedence*
over the linear move. That is why the previous figure shows full
quadrant[]{.indexref
entry="full quadrant:Quadrant move which does include the end tiles."}
moves for both sub pieces.

This has an interesting consequence. It is possible for an end tile to
be blocked in every plane, yet not in the quadrant containing the
overlap tile. Thus, in the previous figure, a Black piece on White's
KN4,4 tile, could potentially be captured with a fission move; even when
capture by decay was blocked.

### Fusion

Of course, if fission is allowed, then fusion cannot be far behind...or
so one would think. Turns out that time reversal in 3D chess comes with
nuances. These nuances arise naturally when piece to piece interactions
are considered, which happens in Part III. The presentation of the rules
for the stack fusion move will therefore be necessarily postponed until
we have developed a better understanding of reversibility in 3D chess.

### Chess Notation[]{.indexref entry="Chess Notation:Concise way to capture moves or a specific position."}

The stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
presents special challenges for chess notation, although indicating a
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} move
is straightforward, S -- Kn,m (Figure 72). Decay is not too bad either,
just prepend the letter S before the sub piece letter, SD -- KN5,1
(Figure 76). Recombination can be implied by the fact that the
destination tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is occupied, but the same could be said for capture, yet it is clearer
to indicate that a capture has happened not just a move (B x P), so
something like this is to be preferred, B r D@Q8,6 (Figure 78). Replace
the 'r' with 'cr' for a cross recombination[]{.indexref
entry="recombination:A bishop or duke reconstituting a stack by moving onto the other."},
B cr D@Q2,2 (Figure 79). A similar technique works for teleportation, D
t QR8,8 (Figure 80 and Figure 81).

The real difficulty occurs for fissions and fusions. Let 'f' be the
conjoining letter, two tiles on the right imply fission[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."},
two tiles on the left implies fusion. Thus, S f B@Q5,6, D@K7,3 (Figure
83), and B@(Q5,4), D@(KB4,4) f S@(QR3,3). If the standard 'bishop first,
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} second' is
employed these can be simplified, for instance fusion example becomes
Q5,4 KB4,4 f QR3,3.

A fission[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."}
can result in two captures, one capture, or none. For instance, S f BxN
& DxP can make perfect sense. A single capture perhaps like this, S f
DxR, B@K2,1. While bishop should precede duke in general, it seems
better to let capture be listed first and to let it trump bishop-duke
order when it is the duke which captured and the bishop which merely
moved.

A fusion can only capture one piece, thus, B, D fx QB, or with extreme
shorthand, BD fx QB.

### Shape

In part by fortunate coincidence the piece design of the bishop and
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} make
stacking them easy; the bishop has a horizontal cross section that is
triangular, and both the top and bottom of the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} have a
horizontal cross section that is triangular (in the middle the cross
section is hexagonal). This means that a tetrahedral cavity in the base
of both allows either to stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
comfortably on top of the other.

The duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} on top
looks more like a conventional bishop, so that is the preferred design
for the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}, but
the opposite order (bishop on top) may find some use; tactical,
aesthetic or both. Placing them side-by-side on a tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
is generally to be avoided, because it suggests that multiple pieces can
be in a tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
at the same time, a concept both wrong and in violation of the
one-tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
one-piece invariant[]{.indexref
entry="invariant:A pattern which remains constant while other things change."}.

However, for those who wish to create a board that is truly a cube,
equal size dimensions all around, there is a need to reduce the height
of the pieces just so they can fit between the levels; a side-by-side
placement of duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} and bishop
will achieve that for the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}. Use
your best judgement keeping in mind the long history and traditions of
classic chess. Perhaps there is a flatter piece design out there to be
invented.[^35]

Figure 84 shows the two possibilities, plus the cheat shape used for the
figures in this document. In this artistic cheat, the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} and bishop
don't actually line up the way they would probably be manufactured, but
this subterfuge allows the two images to be separated into the sub
pieces such that the separated images are readily identifiable. This
avoids the need of having a separate shape for the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} and
saves a lot of cut and paste effort.

![[]{#_Ref61532163 .anchor}Figure 84: Stack
Shape](media/image85.png){alt="Shape, polygon Description automatically generated"
width="3.763888888888889in" height="4.916666666666667in"}

Preferred shape for the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} on top
(upper left image) but for some cases, the reverse has merit (upper
right). Both can be real pieces with a tetrahedral cutout in the bases
that align with the outside surface. The image used in this work (lower
middle) is an artistic cheat that allows the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} and bishop
images to be easily separated for reuse without a lot of cut and paste
effort. Duke-bishop rotation is 60 degrees[]{.indexref
entry="degrees:The degree of a trapdoor is the number of extra moves to retreat."}
around the vertical axis. Stack decorators are typically orange.

### Power Projection

The stack (and queen) have access to 3 Feynman tiles from the corner of
the board, and 12 from the center. For the q-tiles, its 9 from the
corner and 15 from the center.

Therefore, the stack, as a stack, can threaten 12 tiles from the corner
and 27 from the center for PPR[]{.indexref
entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}'s
of 12/512 = 2.35% and 27/512 = 5.28%.

However, as a bishop or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, it is more
impressive. From the corner it can threaten 151 tiles, and from the
center 235 tiles. Therefore, the stack, as either a bishop or a duke,
has PPR[]{.indexref
entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}'s
of 151/511 = 29.5% and 235/512 = 46.0%. Impressive, yes, but it's a one
shot, as the stack has to decay or fission to realize such a
PPR[]{.indexref
entry="PPR:Power projection ratio, portion of the board reachable in 1 move."},
and it's no longer a stack afterwards either.

The option to allow the stack to move *either* as a bishop (and carry
the duke) *or* as a duke (and carry the bishop) was rejected because it
allowed both the bishop and duke to change colors. Call this a
[]{#free_stack .anchor}*free stack*[]{.indexref
entry="free stack:Allows stack to move as either bishop or duke, carrying the other piece."}.
Its power is comparable to a rook and holds up better against the queen.
Under a free stack rule, decay, recombination, fission, and
teleportation would have to be revisited. Unless disallowed, the very
definition of bishop will have been changed, in effect no more stack,
and no free dukes.

A free stack and stack splitting by either decay or fission have the
same PPR.

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

  As stack (corner)         \--              \--              2.35%

  As stack (center)         \--              \--              5.28%

  Stack splits              \--             11.1%             29.5%
  (corner)                                              

  Stack splits              \--             20.6%             46.0%
  (center)                                              
  -----------------------------------------------------------------------

  : []{#_Toc210218557 .anchor}Table 9: **Power Projection Ratios
  (PPR**[]{.indexref
  entry="PPR:Power projection ratio, portion of the board reachable in 1 move."}**)
  -- Rook thru Stack**

### Review

The primary purpose of the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
to allow an 8x8x8 board without eliminating the duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} or changing
the starting lineup to be nonlinear (which also allowed dukes to move
prior to pawns and thus distorted openings). The stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
an easy critique point, but in our judgement, it was the least offensive
of the options, and as we've gotten to know it, its 'chess-ness' starts
to shine through.

A stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
allowed to move as a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}, but
only to overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."} (Q
or Feynman tiles) and only if both the bishop and duke moves are legal.
If a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} is
captured prior to separating, both sub pieces (bishop & duke) are
captured and returned to the tray.

The stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
supports several unusual new types of moves not allowed of any other
piece. It can decay[]{.indexref
entry="decay:Just the bishop, or just the duke sub piece, separates from the stack."}
by emitting either a bishop or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."}, and a
bishop or a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} may
recombine with either instance of the other piece, even if it is already
a part of a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
(teleportation). Teleportation is a strict move[]{.indexref
entry="strict move:One that cannot capture, pawn advance, stack combine, teleportation."};
it cannot be used to capture another piece.

The stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} also
admits of radically new types of moves, referred to as
fission[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."}
and fusion (inverse operators of each other). In fission[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."},
both sub pieces may simultaneously depart from the stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
leaving an empty tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}
behind. This supports a new way to fork[]{.indexref
entry="fork:Simultaneously attacking two or more pieces with one move."}
multiple pieces and a new way to quark[]{.indexref
entry="quark:Refers to an attack that generally requires more than one piece to block."}
single pieces. In fusion, a bishop and a duke may move simultaneously
reconstituting a stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
which may result in a capture. Fission and fusion are restricted to be
conjoined[]{.indexref
entry="conjoined:Requirement that fission advancement manifolds share an overlap tile."}
by an overlap tile[]{.indexref
entry="tile:Generic term for the unit cell; square in 2D, cube in 3D."}.

All the new types of moves violate one or more of the move invariants of
2D chess. Some refinements to standard chess notation are required to
adequately communicate or record stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
moves.

A quick review of jargon. The basics of stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."}
moves; *sub pieces*, *overlap tiles*[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."},
*q-tiles* and *Feynman tiles*. The single piece moves of
*decay*[]{.indexref
entry="decay:Just the bishop, or just the duke sub piece, separates from the stack."}
(which *emit*[]{.indexref
entry="emit:Stack decays by emitting either the bishop or the duke sub piece."}
a duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} or bishop,
and can result in capture), versus *recombination*[]{.indexref
entry="recombination:A bishop or duke reconstituting a stack by moving onto the other."},
*cross combination*[]{.indexref
entry="cross combination:Stack composed of a king side bishop and queen side duke (or reverse)."},
and *teleportation*, which are *strict* moves and cannot result in
capture. Recombination also led to a refined jargon for the type of
stack[]{.indexref
entry="stack:The composite piece composed of a bishop and a duke."} in
terms of its bishop and duke[]{.indexref
entry="duke:The third base piece, moves along vertex rays."} colors;
*white-gold*[]{.indexref
entry="gold:1 of 2 duke colored metal tiles, players start with one gold duke."},
*black-silver*[]{.indexref
entry="silver:1 of 2 duke colored metal tiles, players start with one silver duke."}*,*
etc. The dual piece moves of *fission*[]{.indexref
entry="fission:Stack separation where both bishop and duke advance to different tiles."}
and *fusion*, and the restriction of such moves to be
*conjoined*[]{.indexref
entry="conjoined:Requirement that fission advancement manifolds share an overlap tile."}
by overlap tiles[]{.indexref
entry="overlap tile:Tiles attackable as more than one base piece."}.
