## Duke 

The duke is the
third base piece.
It is much to the bishop like the bishop is to the rook. As anticipated,
the duke moves
differently than either the rook or the bishop, in a third kind of
plane, to which we have given the name *slant*. The duke continues
to validate the concept of the planar move,
but also reveals additional richness and subtlety. As with the bishop,
we'll take our time getting to know the duke and build
our knowledge and intuition figure by figure.
### Corner Rays

The duke advances
along rays which change *three* coordinates. In 2D, it doesn't exist,
but if it did, it would advance along a *single* ray.
In 3D, it advances along a *pair* of vertex rays (connects the corners
of adjacent cubes). A duke linear
move
will thus define a line which changes three coordinates (one more than
the bishop), and a duke quadrant move
will define a perimeter but which,
surprisingly, can change one, or two, or three coordinates, depending on
the perimeter and the
specific tile
on that perimeter.

For the rook, every pure quadrant
tile
on the perimeter changed
two coordinates; for the bishop, every pure quadrant
tile
on the perimeter changed
three coordinates. Moves to end tiles change one less coordinate. The
duke is stuck,
there are only three coordinates to change (it can't change four), so
the use of two rays 'wraps around', like a modulus function. This is the
first unexpected difference from the previous base pieces; and (teaser)
it has interesting consequences.
### Range 

Because the duke advances
along rays which change three coordinates, it can reach only a *quarter*
of the tiles on the board (half as many as the bishop), but because it
moves in one dimension less than the board, it can still get to each
tile
it can reach in just *two* moves, just like the other base pieces.

[]Congruent Rule : **The duke** **can reach
only a quarter of the tiles on the board.**
### Six Slant Planes

In 3D, the board is a cube, with faces, edges, and corners. Since the
duke advances
along corner rays, it moves in []*slant* *planes*.
A slant plane
separates opposite *edges* of the board; thus 12 edges in 6 pairs
implies *six* planes. This is the second unexpected difference from the
previous base pieces; six planes instead of three or four. However,
unlike either the rook or the bishop, a straight-line duke move is in
*three* planes at once, not two. This is the third unexpected difference
from the previous base pieces. At least each slant plane
has only two straight lines, so like the rook, each plane has four
quadrants,
but like the bishop there are more planes than the previous base
piece.

Like the bishop's *skew* planes, the duke's *slant*
planes come in pairs, called []*cross planes*.
Each pair intersect along an orthogonal line
which connects opposing board faces. The three cross planes
are the []*vertical cross
planes*,
the []*left cross planes*,
and the []*right cross planes*.

It is helpful to see these six planes as a group.

Figure 40 shows the six duke planes inside individual wireframed cubes,
which represent the 3D chess board in symmetric fashion: no level bias.
They naturally arrange themselves in pairs, here grouped vertically.

![[]Figure 40: The Six Duke Slant
Planes](media/image41.png)

The six slant planes of the duke shown in wireframed cubes.

The largest major plane holds the starting lineup of the pieces. For
this reason, this one major plane will also be called the *primary
plane*.

Figure 41 shows each pair of duke planes, grouped as cross planes
together in three individual wireframed cubes.

![[]Figure 41: The Three Pairs of Duke Cross
Planes](media/image42.png)

The six slant planes of the duke shown in pairs, the three sets of cross
planes.

The way dukes use slant planes displays a lot of interesting
mathematical properties; if you're a mathematician. For the rest of us,
visualization of the duke move is challenging, and a mathematical
description is of little help. A review of the skew planes of the bishop
move will provide some useful visualization techniques.

Like the orthogonal planes of the rook, and the skew planes of the
bishop, slant planes stack; one
can envision 'slipping' sideways from one to the next. This is easy for
the rook, but irrelevant; all the orthogonal planes are the same. For
the bishop, 'sliding' between skew planes *is* relevant; as all the
tiles are white in one, then black in the next, then white, etc. In
other words, there are two colors of skew planes: ones with white tiles
only and ones with black tiles only. Call these *bishop colors*. They
are the same as the board colors. Each player has one bishop which
starts on each color, and we generally refer to them by the color of the
tile
they are on. Both players start with one *white* bishop and one *black*
bishop. Each can reach every tile
in its own colored skew planes,
but none of the tiles in the other colored skew planes;
"bishops can't change color."

Slant planes are not 'just' more of the same. While they stack, and one
can envision 'slipping' sideways from one to the next, adjacent slant
planes are of different *types*, not of different *colors*. Furthermore,
each type consists of two colors, but each duke can only get to *one* of
them, not both. That is, each duke can only get to *half* of the tiles
in a slant plane, not like the bishop which can get to *all* the tiles
in its skew plane.

To help make this clear, we went to the periodic table for our
nomenclature. Slant planes will have a *metallicity*;
either *metallic*
or *gemstone*.
Slipping from one slant plane to another changes the metallicity.
Slipping between the skew planes of the bishop changed *color* (white,
black, white, black etc.), while slipping between the slant planes of
the duke change *metallicity* (metal, gem, metal, gem, etc.).

Within each type of plane, there are two 'colors', *gold* and *silver*
for metallic planes, and *ruby* and *jade* for the gemstone planes. As
elements, gold and silver are metals, as crystals, ruby and jade are
gems. Gold and silver are also colors, and ruby and jade can be
portrayed as colors; a dark red and a dark green shall be used.

Inconveniently, these four 'colors' are equally distributed between the
white and black bishop colors, so to fully 'color' a 3D chess board
takes *eight* colors! A quarter of the white tiles are each of these
four metallicities, as are a quarter of the black tiles. Coloring a 3D
board to show the different types of both skew and slant planes together
requires an 8-color scheme.[^18]

In the *metal planes*, half the tiles are gold, the other half silver;
in the *gem planes*, half the tiles are ruby, the other half jade. The
starting lineup of the pieces is chosen to be a metal plane, so all the
dukes are metal dukes. This means the metal planes are the most
important slant plane
metallicity.

Each player gets one *gold*
duke and one
*silver*
duke. White's
gold
duke is on the
king side, silver
duke on the
queen side; just the reverse for Black. Each duke can only
reach *half* the tiles in the metal planes,
and *none* of the tiles in the gem planes, but each pair of dukes can
together cover
all the tiles in the metal planes.
Recall that the duke can only
reach a quarter of the board, so this is how that quarter works out;
half of one metallicity
(metal), zero of the other metallicity
(gem). The only major piece that can move in gem planes is the queen,
even pawn promotion occurs only in a metal plane. This is the fourth
unexpected difference from the other base pieces.

It is a bit of a spoiler, but pawns can also capture like a duke, so
when in a gem plane, they, unlike dukes, may also move in such planes
(but only to capture). Pawns will be covered in Chapter 11.

The fact that a duke can actually reach only half the tiles in a
metallic slant plane will not dissuade us from saying that dukes move in
a slant plane, we just chose to mean that they don't move in the full
geometrical slant plane, rather they move in a subset of it, either the
gold subset or the silver subset. In the context of the duke, saying a
piece moves in a slant plane will imply that it moves only in the tiles
of that plane that are the same color as the color of the tile the duke
is currently on.

It is initially a little daunting, but it provides clarity, and no
better jargon has been found.[^19]

The best board encoding uses two techniques. First, gold
tiles in the primary plane,
and only the primary plane,
are indicated with a small black dot. They may reside under or over the
tile
decorators on a case-by-case basis; whichever is clearer. The advantages
are that the board is not unduly cluttered (only 32 tiles affected),
duke accessible
tiles are clear level by level, which tiles are gold
and which silver
is trivial to ascertain in the primary plane,
and not too hard to abstract in the other planes, and as a bonus,
highlights the starting lineup plane.

The second technique is to treat the board 'squares' as real tiles, thin
three-dimensional objects, with their small edges duke colored, and
their larger flat surfaces bishop colored. This still tends to 'scream'
at the viewer, so most often these colored edges will be masked in
black. However, this allows individual tiles to be 'raised' to reveal
the edge color, which is occasionally useful.

Figure 42 shows both techniques. On every other level only white tiles
are also gold tiles,
while on alternating levels only black tiles are also gold
tiles. Silver
tiles are the unmarked tiles diagonally in between gold
tiles. If the gold
tiles on one level are white, so are the silver
tiles. A few metal tiles on the KR level, and a few gem tiles on the QR
& QB level are raised to hint at the patterns. The black masking of the
edges of each level has been removed revealing the metallicity of each
tile on the edge. As you can see, even this little bit of color
dominates the figure.

![[]Figure 42: Duke Colors & Gold Tiles Primary
Slant Plane (32 of the 64 Metal
Tiles)](media/image43.png)

Tiles are color coded with bishop colors on their surfaces and duke
colors on their edges. Dukes start and stay on metal slant planes;
either gold
or silver
tiles. They can never reach the gem planes. To help deduce duke colors
without cluttering the board, the gold
tiles in the primary plane
are marked with black dots. Silver tiles are the unmarked tiles
diagonally in between the gold
ones. Metal tiles are also black and white tiles but alternate every
other level. Duke colors alternate orthogonally and diagonally. KR1,1 is
a white gold
tile; ruby
to the right, jade
to the left.

Once again, software implementations offer a more suitable interface
than static paper.

In 2D, opposing bishops are on *opposite* colors. In 3D, opposing
bishops are on the *same* color; it is *opposing dukes* which are on
*opposite metals*. Remember, the bishop and duke share some
of the bishop nature because in 2D corner rays change *two* coordinates
and *all* coordinates. The 3D bishop inherits the properties that stem
from changing two coordinates, while the duke inherits
the properties that stem from changing all the coordinates.

The next three figures show the three pairs of cross planes.
Figure 43 shows the vertical cross planes
([]*major plane*
& []*minor plane*),
Figure 44 shows the left cross planes
([]*upleft plane*
& []*downleft plane*),
and Figure 45 shows the right cross planes
([]*upright plane*,
[]*downright plane*).
Up and down apply to traversing the plane so as to head toward your
opponent, thus White's up planes are Black's down planes and
vice-a-versa. However, they define the pairs of cross planes the same,
and the major and minor planes as well.

The largest major plane is called the []*primary
plane*,
as it holds the starting lineup of the pieces and contains the promotion
tiles for the pawn.

This concludes the introduction of the plane jargon. The names of all
the planes are summarized in the Glossary Tables Appendix. While the
learning curve for any nomenclature can be a bit tedious, the gains are
substantial. Good names facilitate thinking, analysis, memorization, and
communication.
### Four Quadrants

The duke has one
more surprise; adjacent quadrants
are not the same. While a duke plane has
*four* quadrants,
same as the rook, they come in *two flavors*; one advances toward an
edge of the board, []*edge
quadrants*[],
the other toward a diagonal on a face of the board, []*face quadrants*[].
A quadrant that advances toward a board *edge* is just like the rook and
bishop quadrants,
but a quadrant that advances toward a board *face* shares its
apex
tiles with *a quadrant from another plane*, (the other diagonal line
down that face, the cross plane). This is the fifth unexpected
difference from the other base pieces.

Therefore, in contrast to the presentation of the rook and bishop, apex
tiles are introduced in the plane figures instead of waiting for the
quadrant figures. The "dual apex tile" is given its own name,
[]*duplex tile*. Duplex tiles figure prominently
in both the queen and the stack, so an investment in understanding them
has multiple returns.

![[]Figure 43: Duke Vertical Cross Planes (Major
and
Minor)](media/image44.png)

The *vertical cross planes*
intersect in a vertical line. *Major* planes extend from player to
player, while *minor* plans are perpendicular to the players. The
largest major plane
(shown here) contains the starting lineup of the pieces. It is also
called the *primary* plane.
The single *apex*
*tiles* (single open diamonds) are all in a horizontal plane,
while the *duplex*
*tiles* (double open diamonds) align along the vertical intersection
line of the vertical cross planes
skipping every other horizontal plane.
Duke is on K4,4; notice its missing image in the White piece tray.

![[]Figure 44: Duke Left Cross Planes (Upleft,
Downleft)](media/image45.png)

The left cross planes
intersect in a horizontal line connecting the left faces. The upleft
plane
extends towards the opponent when traversed in the up direction, and in
perfect symmetry, the downleft plane
extends towards the opponent when traversed in the down direction. The
single apex
tiles are all in a right vertical plane,
while the duplex tiles align along the left intersection line of the
left cross planes
skipping every other right vertical plane.
Duke is on K4,4.

![[]Figure 45: Duke Right Cross Planes (Upright,
Downright)](media/image46.png)

The right cross planes
intersect in a horizontal line connecting the right faces. The upright
plane
extends towards the opponent when traversed in the up direction, and in
perfect symmetry, the downright plane
extends towards the opponent when traversed in the down direction. The
single apex
tiles are all in a left vertical plane,
while the duplex tiles align along the right intersection line of the
right cross planes
skipping every other left vertical plane. Duke
is on K4,4.

As one tours the four quadrants,
the flavors alternate. It is going to require additional figures to
provide clear visualizations of the duke move.

Figure 46 shows the tiles a duke can reach
in a single slant plane,
the primary plane;
recall that it is a metal plane. Since the duke can only
reach 4 tiles on each level it is easy to confirm that it can reach only
half of them. (32 out of 64). This is a gold duke; the tiles have been
raised to show the gold edges. The two straight lines are shown with
dark rhombus decorators; this clearly shows the four
quadrants.
While the shape of a slant plane
is rectangular (4x8, 3x8, 2x8, 1x8), the outline of the tiles within it
that a duke can reach,
follow a zig-zag pattern. The size of the slant plane
depends on the location of the duke (like the bishop), but the
shape is always rectangular (unlike the 3D bishop). While a slant
plane
can connect corners of the board, this is true only for the 4x8 planes.

The two quadrants
that advance toward an edge are the left and right quadrants,
one advancing toward Black (left) and one advancing toward White
(right). Note the use of the conventional tile
decorator for apex
tiles (open black diamond) in the left and right quadrants.
The two quadrants
that advance toward the diagonal on a face are the up and down
quadrants.
A new tile
decorator is introduced here for duplex tiles as these tiles are also
*reachable in the cross plane*, in this case a minor plane
(not shown); a *pair* of open black diamonds is used to suggest access
via two planes.

This new decorator was also used in the previous figures, showing the
cross planes.

This is *not* a linear move,
these apex
tiles do not align along corner rays, but rather along face rays. This
means that apex
tiles in *face quadrants*
can be attacked in two different planes, each with its own advancement
square
(not an advancement rectangle,
as would be the case for a linear move).
In contrast, the apex
tiles in *edge quadrants*
are only reachable in one way. The tactical advantages of duplex tiles
should be immediately apparent; such attacks will be harder to
block
requiring either one piece on a previous duplex tile,
or two separate pieces, each one blocking a different advancement
square.[^20]

The openness of the duke's
quadrants
introduces a new challenge; it is not enough to sight along a slant
plane
to see what pieces a duke might be
attacking, as only every other tile
is actually under attack. One observation that may help is that on each
level a duke can only
reach tiles of the *same* bishop color, which *alternates* between
levels.
### Opposing Quadrants

Starting on the following facing pages, the next two figures show
opposing quadrants.
Figure 47 shows a pair of normal edge quadrants
with two 3x3 advancement squares. Figure 48 shows a pair of the new face
quadrants;
with two 3x3 advancement squares. Both cases show how off-board tiles
will be shown. While pieces cannot move off board, being able to
visualize the whole advancement square
aids understanding of the move. Ghost dukes show the pure quadrant
moves.

![[]Figure 46: Duke Plane is Cut by Two Lines,
thus Four
Quadrants](media/image47.png)

Shown is the *primary major plane*,
it connects the top and bottom faces of the board and opposing vertical
edges. As the largest major plane,
it also contains the starting lineup. It's two straight lines are
readily visible and clearly divide the plane, like the rook, into four
quadrants,
but unlike rook quadrants,
duke
quadrants
come in two flavors, which alternate around the plane. Those
quadrants
advancing toward a board edge (left and right) are regular
quadrants.
They use the conventional apex
tile
decorator. Those quadrants
advancing toward a diagonal line across a board face (up and down) have
duplex tiles, they are also in the cross plane (minor plane,
not shown). Note that the duke can only
reach half of the tiles in its plane (32 out of 64). All the tiles in
this plane have been raised so that their edges are visible. Note they
are all gold tiles; the primary plane
is a metallic
plane.

If bishop advancement squares appear more like rhombi than squares,
duke advancement
squares appear more like diamonds, however they still follow the same
perimeter growth
rule as the other base pieces (3, 5, 7, 9...). Note that the
duke's
advancement squares extend off the board even more quickly than the
bishop's do, so the use of off-board tiles will be common. Furthermore,
both end and body tiles may leave the board before apex (or duplex)
tiles do, but this is very position dependent. In these examples, the
apex and duplex tiles leave first.

![[]Figure 47: Duke Opposing Edge Quadrants in
the Primary Major
Plane](media/image48.png)

The two opposing *edge quadrants*
of the duke move are
shown for the *primary major plane*,
the largest major plane,
the one that contains the starting lineup of the pieces. As these are
edge quadrants,
they utilize the regular apex
tile
decorator (single open black diamond). Each sports a 3x3 advancement
square.
Note the one apex decorator off the board. Ghost dukes show the pure
quadrant moves.

![[]Figure 48: Duke Opposing Face Quadrants in
the Primary Major
Plane](media/image49.png)

The two opposing *face quadrants*
of the duke move are
shown for the *primary plane*,
(see previous figure). As face quadrants,
they utilize the duplex tile
decorator (pair of open black diamonds). Each sports a 3x3 advancement
square. Note the off board duplex decorator and the ghost
dukes.
### 2D Projection of the 3D Move

Since there is no duke in 2D
chess, the projection invariant
does not really apply. However, since the 2D bishop changes all the
coordinates in 2D like the duke does in 3D,
it is worth noting that the duke's linear
move
does reproduce the bishop's 2D move in slant planes. This is more
obvious when the slant plane
directly connects opposite board edges as it then has 64 tiles, same as
a 2D board.

Figure 49 shows the duke
straight-line moves in the primary major plane.
To emphasize this point, the rest of the pieces have been moved from the
tray to their starting lineup positions. The 64 tiles of the primary
plane
can be mapped one-to-one with the 64 squares of the 2D board, one just
has to ignore that the tile
colors don't alternate in both directions.

![[]Figure 49: Duke Pseudo Projection; Linear
Moves in Slant Planes are the 2D Bishop
Move](media/image50.png)

The straight-line moves of the duke in a slant
plane
are the 2D bishop's move. This example is in the primary major
plane,
which contains 64 tiles, 32 of which the duke can reach.
Other than tile
color, this plane is a one-to-one map with the 2D board, which is why in
this figure most of the pieces have been moved from their tray positions
to their starting lineup position.
### Edge Quadrant Move Snapshots

Recall that the duke has two
different types of quadrants,
edge quadrants
and face quadrants.
To show snapshots of the duke's growing
advancement square
will require two sets of dual figures; the second of each is a
continuation of the first. They are shown on facing pages to facilitate
viewing the growing advancement squares.

Figure 50 shows two snapshots (a) -- (b) of a duke edge
quadrant move
in the primary plane
out to perimeters 1 and 2, while Figure 51 continues it (c) with one
more snapshot out to perimeter 3.
Note, this is a silver duke.

![[]Figure 50: Duke Snapshots of Edge Quadrant
Move (Perimeters 1 &
2)](media/image51.png)

Two snapshots of a silver
duke making an
edge quadrant move
in the primary plane
out to perimeter 1 (a)
and perimeter 2 (b).
Silver tiles in the primary plane have been raised. Ghost dukes show the
legal quadrant moves
to perimeters 1 & 2. Note this includes the apex
tiles.

![[]Figure 51: Duke Snapshots of Edge Quadrant
Move (Perimeter
3)](media/image52.png)

Third snapshot of a silver
duke making an
edge quadrant move
in the primary plane
out to perimeter 3 (c).
Ghost dukes show the legal quadrant moves
to perimeter 3. Note
this includes the apex
tiles.
### Face Quadrant Move Snapshots

Figure 52 shows two snapshots (a) -- (b) of a duke face
quadrant move
in the primary plane
out to perimeters 1 and 2, Figure 53 continues it (c) with one more
snapshot out to perimeter 3. Note
that the duke is blocked by the pawn from moving to the duplex tiles in
the minor plane. Such tiles are called []*simplex
tiles*.
A new decorator is introduced; one of the diamonds in the duplex
decorator is missing, indicating advancement in only one advancement
square.

![[]Figure 52: Duke Snapshots of Face Quadrant
Simplex Move (Perimeters 1 &
2)](media/image53.png)

Two snapshots of a duke face
quadrant move
out to perimeter 1 (a)
and perimeter 2 (b)
in the major plane.
Advance in the minor plane is blocked by the pawn, so the duke can only
advance to the 'apex' tile in this plane. Such tiles are called *simplex
tiles*,
and simply delete one diamond from the duplex decorator. Primary plane
silver tiles have been raised. Ghost dukes indicate pure quadrant
moves.

In the perimeter 3 figure, the silver tiles have not been raised, just
the border of the inner 16 tiles has been shown. Both standards will be
used.

![[]Figure 53: Duke Snapshots of Face Quadrant
Simplex Move (Perimeter
3)](media/image54.png)

(Continues previous figure.) Third snapshot of a duke face
quadrant move
out to perimeter 3 (c)
in the major plane. Advance in the minor plane is blocked by the pawn,
note the simplex tiles.
Ghost dukes indicate pure quadrant moves to perimeter 3.

The next two figures show the snapshots for a move to a duplex tile on
perimeter 2: first in the minor plane (a) -- (b) and then in the major
plane (c) -- (d). Such moves occur only in face quadrants. Note that
neither figure places a ghost duke on any of
the perimeter body tiles. This is because those tiles are reachable in
only one plane. Duplex moves are *not* linear moves, even though they
occur along an orthogonal line, that's a linear move for a rook, not for
a duke. Duplex moves are legal if *either* quadrant is unblocked.

![[]Figure 54: Duke Snapshots of a Duplex Move to
Perimeter 2 First in the Minor
Plane](media/image55.png)

Two snapshots of a duke face
quadrant move to the duplex tile
out to perimeter 1 (a)
and perimeter 2 (b)
first in the minor plane only. The silver tiles in this minor plane have
been raised for clarity. Ghost dukes indicate the move. Note the lack of
ghost dukes on the body tiles of perimeter 2.

![[]Figure 55: Duke Snapshots of a Duplex Move to
Perimeter 2 Adding the Major
Plane](media/image56.png)

(Continuation of previous figure.) The advancement squares for the major
plane are added in. The single ghost duke on the final duplex tile was
advancing in *both* cross planes.
Note specifically that the ghost duke is *only* on
the duplex tile,
and there are none on the other tiles on the perimeters as those moves
occur in one plane only. The silver tiles have not been raised, rather
the inner 16 border has been used.

Being cognizant of which flavor of duke quadrant is in play is important
not just for tactics; duplex tiles also play a unique role in those
pieces which are defined in terms of the base pieces.
### Linear Move Snapshots

Like the other base pieces, the duke's linear
move
is composed of two quadrants,
however, because the duke quadrant
comes in two flavors, which alternate around the plane, every linear
move
will have one edge quadrant and one face quadrant. The next few figures
show a potential linear threat on the Black king. Given that the duke
moves in three planes; is the king in check?

![[]Figure 56: Duke Snapshot of Linear Move in
Primary Plane to Perimeter
1.](media/image57.png)

The White duke is on a gold tile, as is the Black king. In addition, the
king is in line with the duke, so a linear attack is a possibility; one
must check all three planes. Snapshot of the 2x3 advancement rectangle
at perimeter 1 of the linear threat in the primary plane. Black's pawn
is in a gem plane and thus safe from the duke.

Black's rook is defending his king side pawn at KR4,3) via a left
vertical plane.

![[]Figure 57: Duke Snapshot of Linear Move in
Primary Plane to Perimeter
2.](media/image58.png)

(Continuation of previous figure.) Snapshot of the 3x5 advancement
rectangle at perimeter 2 of the linear threat to the king in the primary
plane. The duke has three linear move decorators. At perimeter 1 is the
one with three diamonds, so at this point, the move is in all three duke
planes. At perimeter 2, however, one of the diamonds is hollowed, so one
of the other planes is blocked; the duke is polarized in two planes.
Notice that one end tile also sports a change in their decorator at
perimeter 2 (KR5,5), for the same reason. The inner black diamond is
smaller, indicating that a linear move in this direction would be
blocked in one plane as well.

![[]Figure 58: Duke Snapshot of Linear Move in
Primary Plane Blocked by Rook at Perimeter
4.](media/image59.png)

(Continuation of previous figure.) Snapshot of the 4x7 advancement
rectangle at perimeter 3 of the linear threat to the king in the primary
plane. The third duke linear move decorator has only one diamond of
three that is solid, indicating a linear move polarized in one plane
only, so the king is not in check in either of the other two duke
planes. Advance to perimeter 4 is blocked by the rook in a face quadrant
so the king is not in check in the primary plane either. Note that the
king is not threatening the rook, for it is covered by the duke. Both
are on raised tiles to indicate the duke threat. Note the four
decorators off the board to make the advancement rectangle a little
clearer.

While White can capture Black's rook with her bishop (green 4x4
advancement square in the upward plane), there is a more interesting
gambit.
If RxP (right vertical plane) this discovers the duke check (primary
plane), so Black's defense of the pawn via his rook becomes useless, for
it cannot immediately capture the White rook, but which is now
threatening it. After the king moves out of check, RxR (right vertical
plane), and the game is hopeless; Black resigns.

If Black blocks the discovered check with his rook at perimeter 4
(QB1,1), RxP, which pins the rook against the king *and* pins the king
against the rook; the rook cannot move, it puts the king in check, but
these are the only pieces Black has left, so the king *must* move. When
it does, DxR, and again the game is hopeless; Black resigns.

If Black blocks the discovered check with his rook to an earlier
perimeter, DxR, and the duke still protects the rook, so the king cannot
take it. The pawn is vulnerable and easily picked off by White. If black
sacrificed his rook so as to block
White's rook's advance to the KR level, then RxR instead of DxR. In
either case, R--KR6,6, pawn advances on the KR level, RxP. Again, Black
resigns.[^21]

Note that three new decorators have been added to the icon repertoire;
they each sport *three* small diamonds,
representing that along linear moves, the duke is
advancing in *three* planes. For unpolarized moves, all three diamonds
are black. For a move partially polarized in two planes, two diamonds
are black, the other one is hollow. For a move fully polarized in just
one plane, only one diamond is black, the other two are hollow. To help
see this progression the usual use of a ghost piece has been abandoned.

The so-called advancement rectangle
of a base piece's
linear move
is less distorted for the duke than for the bishop. However, the same
perimeter growth
rule as for the other base pieces applies (5, 9, 13...). Note the four
tiles off the board which are included solely to better highlight the
4x7 advancement rectangle.

The duke's linear
move
requires six quadrants
in 3 planes that from the neutral perspective are not cleanly separated.
It is a little clearer on a real physical three-dimensional board;
players tend to walk around the board, their heads bobbing like
ducklings, but seeing each plane clearly pretty much requires three
perspectives. A good presentation in a software implementation can do
even better. That is why each of the three planes have been presented
separately rather than altogether as is more feasible with the rook and
the bishop.
### Linear Move in Three Planes

Now to confirm that the king is not in check in either of the other two
duke planes.

Figure 59 shows that the duke's linear move is blocked in the downright
plane by the knight at perimeter 2.

![[]Figure 59: Duke Linear Move Blocked by Knight
in Downright Plane at Perimeter
2.](media/image60.png)

White's knight (KB7,3) blocks her duke's (KB3,3) potential linear attack
on Black's king (KN2,2) in the downright plane at perimeter 2 in a face
quadrant. Knight and underlying tile are raised to emphasize this. The
knight is on a duplex tile of a face quadrant. The advancement rectangle
is 2x3. At perimeter 1 (K4,4) the duke's move is not yet polarized. Note
the decorator has *three* solid diamonds indicating linear motion in
*three* planes.

Figure 60 shows that the duke's linear move is blocked in the downleft
plane by the bishop at perimeter 3.

![[]Figure 60: Duke Linear Move Blocked by Bishop
in Downleft Plane at Perimeter
3.](media/image61.png)

White's bishop (QR8,2) blocks her duke's (KB3,3) potential linear attack
on Black's king (KN2,2) in the downleft plane at perimeter 3 in an edge
quadrant. Bishop and underlying tile are raised to emphasize this. The
advancement rectangle is 3x5. At perimeter 2 (Q5,5) the duke's move is
now polarized into just two planes. Note the decorator has *two* solid
diamonds and one hollowed, indicating linear motion in *two* planes.

Note the sequence of regular apex
tile
decorators for the growing advancement square
in the edge quadrant, as well as the sequence of duplex tile
decorators for the growing advancement square
in the face quadrant.
### Shape

Unlike the rook and bishop, placing the duke in the
corner of the board and marking all the tiles it can get to in a single
move reveals no discernable shape. Therefore, since the duke moves along
rays connecting the corners of adjacent cubes, the shape chosen for the
duke is a
*pivoted* *cube*, with one corner cut off to provide a stable base. This
makes the base three sided, and by hollowing out the interior of the
cube, the duke can sit
nicely on top of the bishop, so a new shape is not required for the
stack;
indeed, the stack
actually looks more like a conventional bishop than the tetrahedral
shape does.

Figure 61 shows all the tiles a duke can cover from a corner of the
board. Note the triple linear moves down the super diagonal, the apex
tiles down the plane diagonals, and the duplex tiles down the
orthogonals. Interestingly, there are 10 covered tiles in every
orthogonal plane.
### Power Projection

From the corner of the board, the duke covers 72
tiles via quadrant move (of which 18 are apex
tiles; 9 edge quadrant tiles, 9 face quadrant tiles), and 7 tiles via
linear move, for a
total of 79 tiles. Power projection
is 79/511 = 15.5% compared to the bishop in 2D would have been no better
than 7/63 = 11.1% in 2D. Power projection
for the duke is position
dependent. The debunked straight-line move
would have been 7/511 = 1.37% -- *feels like chess**.*

From the center of the board, 3D straight-line moves would have been
1\*7 + 3\*6 = 25 out of 511 = 4.89%, but the planar move
is better. Cross planes have 32 & 28 tiles, minus the 4 tiles of the
intersection line and source, each cross-plane pair thus has 56 tiles.
The 25 straight-line tiles got counted thrice so subtract 50 and
subtract another 3 since the source tile was counted once for each pair
of cross planes.
Thus, 56\*3 -- 50 -- 3 = 115, and 115/511 = 22.5%.

As in 2D, power projection for the base pieces decreases from the rook
on.

  -----------------------------------------------------------------------
  Piece               3D -- Straight          2D          3D -- Planar
                           Lines                              Moves
  ------------------ ----------------- ---------------- -----------------
  Rook                     4.11%            22.2%             32.9%

  Bishop (corner)          4.11%            11.1%             16.4%

  Bishop (center)          7.63%            20.6%             28.8%

  Duke (corner)            1.37%            \-\--             15.5%

  Duke (center)            4.89%            \-\--             22.5%
  -----------------------------------------------------------------------

  : []Table 3: **Power Projection Ratios
  (PPR****)
  -- Rook thru Duke**

![[]Figure 61: Duke
Shape](media/image62.png)

Marking all the tiles a duke can reach
in one move from the corner fails to reveal any fundamental shape,
unlike for the rook and bishop. Since the duke moves
through corners connecting adjacent cubes, the shape chosen for the
duke is a cube
pivoted onto one truncated corner. Hollowed out this allows it to
stack
neatly on top of the bishop to create the composite piece, the
stack.
Three planes are shown, with linear move
decorators, the apex
tile
decorators (edge quadrants), and the duplex tile decorators (face
quadrants).
### Review

The duke is to the
bishop much like the bishop is to the rook. Its move is governed by rays
which change *three* coordinates; thus, it moves in a different type of
plane, a *slant* plane, and can reach only *a quarter* of the tiles on
the board. As the bishop stays on whatever *color* it starts on, the
duke stays on whatever *metallicity* it started on. For the
duke that is one
of the two *metal* tiles; either *gold*
or *silver*.
Only the queen can make duke like moves in the *gem planes*. Like the
other base pieces, it can get to any tile
it can reach in just two moves.

Some jargon to recall; corner (vertex) rays, slant planes, cross plane
pairs,
vertical cross planes,
(major and minor), left cross planes
(upleft and downleft), right cross planes
(upright and downright), 6 planes each with 4 quadrants;
all new. The largest major plane
contains the starting lineup of the pieces and is called the primary
plane.
Duke quadrants
come in two flavors, edge quadrants
and face quadrants,
and linear moves occur in three planes, one quadrant of the advancement
rectangle
is an edge quadrant, the other is a face quadrant. The duplex tiles of
face quadrants
are in two different planes, cross planes,
which can be attacked in both, but it is not a linear move,
there is no advancement rectangle,
just two independent advancement squares.

Then as for the rook and bishop; quadrant moves
versus linear moves, advancement squares (rhombus shaped) and
advancement rectangles (double rhombus), perimeters, apex
tiles, linear tiles and end tiles, multiple new diamond tile
decorators (open, closed, double, offset, triples, etc.), and of course
more congruent rules.

In addition, the duplex tile for face quadrants came in a simplex form
for when one of the two advancements squares is blocked.

Finally, new polarization states for linear moves; not polarized
(advancing in all three planes), partial polarization (advancing in just
two planes) and full polarization (advancing in only one plane).
