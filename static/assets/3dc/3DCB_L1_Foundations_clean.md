Discovering the Rules to 3D Chess

by

Allan Goff

Folsom, CA

Copyright © 2022 by Allan Goff

Paralog Books

![](media/image1.png)

Kindle Version 1.0.0

*Library of Congress Catalog Card No.*

ISBN-13: 979-8-9867667-0-6

All rights reserved. This book or any part thereof, may not be
reproduced in any form, in whole or in part, without the express written
permission of the author.

> "An unspeakable horror seized me. There was a darkness; then a dizzy,
> sickening sensation of sight that was not like seeing; I saw a Line
> that was no Line; Space that was not Space: I was myself, and not
> myself. When I could find voice, I shrieked aloud in agony, 'Either
> this is madness, or it is Hell.' 'It is neither,' calmly replied the
> voice of the Sphere, 'it is Knowledge; it is *Three Dimensions*: open
> your eye once again and try to look steadily.'"
>
> --- Flatland
# Acknowledgments

It is a bit of a cliché to thank one's parents, but in a twist of
serendipity they thought it wise one weekend to purchase for their
teenage son a three-level chess board. It kept my interest most of the
afternoon.

It was terribly obvious that the board should be 8x8x8, not 8x8x3, but
what stuck with me was the nagging suspicion that straight-line moves
could not be made to work, symmetric board or not. The board had been
promoted by a dimension, should not the moves also be promoted by a
dimension? What would a "planar" move look like?

Early my first year at Oregon State University, I encountered two
mathematicians (Tim and Rob), who broached the subject of 3D chess.
After a brief tussle of intellectual gymnastics, they too became
convinced that straight-line moves were a dead end, and returning the
next day from classes, I opened the door to my small dorm room to find a
hanging 3D chess board made from string and carboard (scavenged from
pizza cartons, used I am persuaded), each of 8 levels covered with
wrapping paper sporting a 2D chess pattern, brilliantly of just the
right size.

Over the course of the year, several variations of the idea of planar
moves were explored, but no consensus was reached. I have since lost
contact with Tim and Rob, but as things worked out, I ended up with the
prototype board and an enticing but incomplete set of rules. Wherever
you two are, thanks for the great launch; our discussions convinced me
this was a problem worth tackling.

Over the years I sporadically continued the search for a set of rules
that really *felt like chess* and many thanks go to Dale Lehmann, my
best friend, who endured countless long evenings of exploration. He
forced me to articulate what I thought I saw, never permitted us the
luxury of sloppy thinking, nor tolerated the laziness of shortcuts. The
first result of our collaboration was the award of a patent for a
preliminary ruleset in 1991 that introduced planar moves and advancement
squares. In the ensuing years, his rigor allowed us to uncover
additional hidden assumptions and truly discover a rule set as free from
invention as possible.

Likewise, Dr. Joel Siegel, a retired mathematician and gifted teacher,
endured countless sessions of brainstorming, frustrating obstacles,
obscure alternatives, and occasional breakthroughs. His keen insight
into fundamentals were a steady source of encouragement and course
corrections. His passion for pedagogy infuses this work.

Both Dale and Joel share a love of epiphanies; and one of my guilty
pleasures was anticipating the light bulb going off in their minds,
waiting for the 'aha' moment to strike their faces when they 'got it.'
Their delight kept me energized to see this through to the end.

I must also thank my writing group for their professionalism and
generous sharing of the tips and tricks of the trade. This work would be
far less readable without their assistance. A special thanks goes out to
the leader of our group, Donna Cowan, who as the scope of the project
increased provided both encouragement and the technical expertise to
push it over the finish line.

And then there are the reviewers; the countless souls who accepted the
mission request to read this tome from stem to stern; 500 pages is a Big
Ask. Thanks to them, many silly errors and more than a few blunders were
found prior to publication. I am in their debt. Notable contributors
include John Levine, Lance Marcum, Charles Phares, Curt Aikin, Luke
Santostefano, and Dr. Dudley Goff; thanks for the 8x8x3 board, dad.

I am also indebted to Martin Nivinski who dared me to *convince* him
that we had truly found the *one right rule set*. Not one to shy away
from a challenge, he then wrote the core code for a Unity based game
engine which can form the foundation for a game proper and perhaps in
the future a 3D chess puzzle builder. His careful analysis, software
engineering discipline, and critical reasoning resulted in a game engine
which allowed for fast and accurate analyses. Without his efforts, there
would undoubtedly be far more errors in this work than there (ahem) are.

I am also blessed with loyal family members (wife Jamie, and daughters
Leslie and Maggie) who provided both proofreading and advice, (although
in hindsight, none ever actually *played* a game against me, go figure).

The flimsy construction of the original 3D board (that suspended
contraption of string and gift-wrapped cardboard levels, now well hidden
in my den) formed an irritating wave machine. The slightest bump would
send it into a variety of oscillation modes, knocking pieces over and
sometimes completely off the board. Probably should have shelved it
somewhere in the prop room of the physics department.

I eventually retired it, replacing it with something more stable
(engineering) and in my opinion something more aesthetic (art). So, one
more callout to my wife, who has graciously tolerated a behemoth
5-foot-tall multi-level plexiglass chess board in our home for many,
many years.[^1]
# Preface
## Motivation

The premise of this work is that the rules for playing chess in three
dimensions should be discovered, not invented. The discovery
criterion is simple, 'does it []*feel like
chess*?'
Coming up with rules to move chess-like pieces around a
three-dimensional board is a process of []*invention*;
constraining them to yield chess-like behavior is a process of
*discovery*.

This change in approach is driven by two observations. First, the
invention strategy has not paid off; in most rule sets for playing chess
in three dimensions, a one pawn advantage is no longer sufficient to win
the game, and therefore requires an unreasonable material advantage to
force mate. Not only does this not feel like chess, but it also has the
bitter result that games between players of equal skill almost always
end in a draw.

The second observation is that the discipline of discovery typically
reveals just how pervasively hidden assumptions infect our thinking.
Identifying and questioning hidden assumptions is a fundamental aspect
of lateral thinking.[^2] The strongest hidden assumptions, the ones most
deeply buried, lie behind paradigms. A deeply entrenched paradigm blocks
the path to 3D chess, and this one paradigm has singlehandedly made it
seem that play in three dimensions, play that truly 'feels like chess,'
is an impossibility. Because of these considerations, an ambitious goal
was embraced; a quest really, to find the []*one right rule set* for 3D chess. This is an audacious
objective and following it through to completion requires a significant
intellectual investment.

There are delightful surprises along the way, indeed a most unexpected
one; portents of quantum principles show up all on their own, uninvited.
This raises the question, "Just how fundamental are quantum principles,
and have we overlooked them in unusual places?"

Thus, three themes weave this book together: discovery, paradigms, and
the quantum realm.
## Criteria for Success

The rules for most games are invented, carefully chosen to lead to
interesting play; Chess, Go, Pandemic, whatever. For chess in three
dimensions, however, the challenge is different; is there a rule set
that still feels like chess?
Is it even possible?

Five criteria will be our guide.

1.  []*Endgames* must work out the same, else a one
    pawn advantage won't win the game.

2.  The []*midgame*
    must exhibit a similar give and take; forks, pins, discovers,
    attack, defense, blocking, capture, exchanges, sacrifices, etc.

3.  []*Openings* must still stress initiative, control
    of the center, position & mobility, an effective pawn
    wall,
    etc.

4.  The rules should be expressible in a []*dimension agnostic*
    form; so called []*congruent rules* that
    would reasonably extend to 4D chess, or even higher.[^3]

5.  Projection of the 3D move onto a two-dimensional surface should
    yield the 2D move.

These are our discovery criteria;
constraints to protect us from the temptation of invention.

As with any quest there is no guarantee of success -- but there is a
chance.

The principal insight is that pieces in 3D should move in
[]*flat planes*,
rather than along []*straight lines*; the
*board* has been promoted by a dimension -- so should the *moves*.
Immediately the endgames work out the same. This discovery
makes an excellent example of a paradigm shift, a practical example of
"thinking out of the box."

The justification for this pedantic perspective is that deeply
entrenched and intransigent paradigm barrier; it hides the correct
solution. An entirely new type of move, one not seen in any other board
game, is required: the []*planar move*.
Alas, []*straight-line moves* cannot be
made to work.

It is the planar move,
the idea that a piece may advance to any location in its type of plane,
*without a unique trajectory*,
that distinguishes this rule set from other 3D chess variants. No other
game has this type of move; it is new, radically so. It is a paradigm
shift in the full Kuhnian sense.[^4] Without this paradigm shift, chess
cannot be elevated to three dimensions and still retain its essential
nature. To reiterate, the board has been []*promoted*
by a dimension, from two to three -- so the moves must also be
*promoted* by a dimension, from one to two. 'Chess-ness' comes from the
difference in these dimensions being *frozen at exactly one*. This is
the most fundamental invariant
in []*congruent chess*
(chess in any dimension), chess pieces move in a space *one dimension
less* than the board. Once this shift is made, the rest follows
naturally, largely inevitably.

The planar move
violates deeply held convictions about what a move is; even what motion
is, as a physical concept. It raises a material question, "is motion
essentially classical, or is it ultimately quantum?"
## Structure

To these ends, Part I presents the rules as a *discovery*
*process*, using insight and rigor to evaluate and reject alternatives
that fail the discovery
test. Overcoming the obstacles to 3D chess requires a careful assessment
of which degenerate invariants[^5] in 2D chess are more fundamental.
This section penetrates the paradigm barrier. Step by step the
discovery
path leads to a foundation for establishing a unique rule set, a
logically coherent set, one that just feels right, replete with
unexpected but confirming "aha" moments.

Part II focuses on how each *individual piece moves*. How do planar
moves differ between the base pieces, and how do they combine to define
the moves of the other pieces. Each piece is given its own chapter, as
are en passant and castling.

Part III focuses on how the new rules impact
the *fundamental interactions between pieces*. The ways in which pieces
can interact is not only richer in 3D chess, but also more complete. The
symmetries between how pieces interact is broken in 2D -- in some sense
there is insufficient resolution -- but in 3D they are restored to their
full glory.

Part IV covers the *tactics and strategies* of 3D chess. Every behavior
one finds in 2D chess is present but nestled in between them are new
behaviors beyond the reach of both classical chess and other 3D chess
variants. Surprises abound, revealing a virgin territory of new gambits
just begging to be explored.

Part V explores the *quantum paradigm*. The planar move, advancement
square and subsequent loss of trajectories lead directly to more than a
dozen analogs with quantum physics. A review of the degenerate
invariants that led to the planar move breakthrough forms a natural
segue into the final chapter -- a quantum version of chess in three
dimensions.[^6]

The book concludes with an Epilog, various Appendices and tables, and
the traditional reference material. The index offers some meta-insight
into the work -- the number of referenced pages per entry is a rough
metric of the importance of that concept.
## Kindle Expectations

The Kindle platform has come a long way since its pioneering inception
and Amazon continues to improve it. It is particularly well suited for
the figures in this book, as one can zoom in on them: something not
possible with print. However, this is a large book, about a complicated
subject, and it was written in Microsoft Word® using many of Word's
advanced features; a few of which challenge Kindle's conversion
algorithms. The technical gurus at Kindle have been easy to work with
and responsive, but it takes time to improve software, so I've chosen to
go to market even though a few glitches remain.

Nobody's eBooks yet support footnotes, but Kindle at least collects them
at the end of the book just before the endnotes. The links can be flaky,
but when they work, you can tap to go to them and tap to return to the
text. Hypertext links are also used in some of the tables, but since
forward and return tapping can be sporadic, your mileage may vary.
Finally, equations may be rendered a little wonky, but there are few and
only in the quantum chapters.

The only major glitch was that Kindle has a limit on the size of tables.
Thus, the very large Jargon table (Table 23, with more than 300 entries)
was broken into three sub tables.

The preferred device type is tablet or larger, however all text and
figures render just fine on a smart phone. The few lists of chess moves
will wrap on a phone which makes them harder to read, and some tables
will wrap some text in small cells.

Obviously, the TOC and index page numbers refer only to the print
version, but the hypertext links in the TOC work flawlessly and form a
truly convenient navigation tool. The hypertext links in the List of
Figures and the Table of Tables are also flawless and likewise offer
convenience not achievable with print.
# Part I -- Foundations

All variants of chess, in particular the 3D variants, have one thing in
common; they show respect for the invariants of 2D chess. However, in
the excursion to three dimensions, some of these invariants display a
duality, they split into incompatible patterns; one must be chosen at
the expense of another. Such invariant pairs are referred to as
[]*degenerate rules*:
different ways of specifying a single rule that have exactly the same
consequences in one realm but divergent consequences in a higher
abstraction. Which invariants are *honored*, and which *shunned*, pretty
much determine the rules.

In most attacks on the problem of playing chess in three dimensions, the
canonical invariant is that pieces which advance move in *straight
lines*. In the approach advocated here, the canonical invariant is that
pieces which advance move in *one dimension less* than the board.

In 2D this means that pieces advance, coincidently, in straight lines
(2 - 1 = 1). The two rules, "advance in a straight line" and "advance in
a space one dimension less than the board" are degenerate in 2D. This
degeneracy is broken in 3D.

In 3D, advancing in a space one dimension less than the board means
pieces advance in flat planes (3 - 1 = 2). These two different ways of
expressing the "advance" rule scale to higher dimensions in very
different ways, with huge consequences.

Planar moves are the initial breakthrough that yields hope there is in
fact *one right rule set* that leads to play that genuinely *feels like
chess*. They are the basis for how pieces *should* move.

The objective of Part I is to discover
the correct *size and shape* of the board, the right *set of pieces*,
and the particular *planes* each piece should move in.

> "The mind, once stretched by a *new idea*, never returns to its
> original dimensions."
>
> --- Ralph Waldo Emerson
## The Trajectory Paradigm

While the moves for each piece will be presented individually in Part
II, they share a common heritage which is best illuminated by
considering the rook. A robust paradigm barrier separates chess in two
dimensions from chess in higher dimensions. A mathematical approach to
discovering the rules to 3D chess would encounter this paradigm somewhat
later in the development. However, there is some tedium involved in that
path, so instead we'll head to high ground for a preliminary view of the
promised land. The intent is to convince the reader that something new
and exciting has been discovered, something unique that sets this rule
set apart from others, a paradigm breakthrough. The breakthrough is what
validates the claim of *one right rule set*,
and justifies the intellectual investment required to follow a formal
line of development.

Of necessity, this means that some initial, plausible choices about the
fundamentals of 3D chess, such as board size and shape, will be
temporarily assumed without justification. For instance, the 3D board
shall be regarded as a cube of cubes, and the dimension
agnostic
term []*tile*
will be used to refer to either square or cube, trusting in context to
disambiguate. Even the piece designs will have a justification. Said
justifications will be more rigorously developed in Part II as the
design of each piece derives from the explicit rule for how it moves. It
is a long-standing chess tradition that the design of each piece alludes
to how it moves; one more pillar in the challenge of finding a rule set
that *feels like chess*.

In due course, a formal color-coding scheme will be introduced. For now,
just know that red will indicate 'rook'. In this section, good ideas --
to shortly be rejected because they do not lead to chess-like play --
will be shown in black; only ultimately correct solutions will be in
color.[^7]

The rook will be our guide, our paradigm trail blazer. We join our hero
in his finest moment, the endgame.
### Obstacle
# 1 -- Demise of the Endgame

Figure 1 shows the classic endgame of a single rook and king against a
lone king. In 2D, the rook's move cuts the board into 4 disjoint regions
(a). The opposing king will find itself trapped in one of them. The
White king and rook work together to shrink the *area* of the region
confining the Black king until mate is achieved.

However, in 3D, even with access to the full vertical extent of the
board, a rook's straight-line move
fails to cut the 3D board into disjoint regions and the opposing king is
free to move to any tile
not directly under attack (b). Mate is not possible with a single rook,
nor with both rooks, nor even with three (which is more than either
player even starts with).

This is not the only endgame to crumble under the weight of three
dimensions; most of them no longer work at all, with the catastrophic
result that games are unwinnable without a vast material advantage.
Games between players of equal skill therefore end in stalemate; boring
-- and again, not like chess.

![[]Figure 1: Single Rook Mate
Endgame
Cannot be Done with Straight-line
Moves](media/image2.png)

In 2D (a), a straight-line rook move cuts the board, so a rook and a
king (White) can checkmate a lone king (Black) -- the most basic endgame
scenario. In 3D (b), a straight-line rook move does *not* cut the board
and so the mate algorithm fails -- doesn't feel like chess.
What kind of a move would cut the board?

What kind of a move would cut the board into disjoint regions, regions
that would confine the lone king, regions that could be shrunk to zero,
allowing a successful mate of the opposing king? To ask the question is
to very nearly answer it, but let's sneak up on it anyway. In 2D, the
major pieces that advance (all but the knight) do so along rays
(directed line segments of unit length), that change either one
coordinate or two. The rook advances along a ray
that changes only *one* coordinate; thus, it moves through the sides
that connect adjacent squares. The bishop advances along a
ray
that changes *two* coordinates; thus, it moves through the corners that
connect adjacent squares. Call the first a []*side
ray*,
and the second a []*corner ray*.
The queen may advance along either a side ray
or a corner ray.

Because a side ray
changes only one coordinate, the rook can reach *every* square on the
board, but because the corner ray
changes two coordinates, the bishop can reach only *half* the squares on
the board.

In 2D, pieces move in straight lines, along a *single* ray,
and thus they move in a one-dimensional space; one dimension less than
the 2D board. If in 3D, pieces moved in planes (flat surfaces), along
*two* rays, they would be moving in a two-dimensional space: one
dimension less than the 3D board. Call this a *planar move*.

In 2D, there are *two* types of rays; *side rays* that connect squares
through their sides and change only *one* coordinate, and *corner rays*
that connect squares through their corners and change all *two*
coordinates. One type of ray for each type of neighbor; side and corner.

In 3D, there are *three* types of rays; *face rays* that connect cubes
through their faces and change only *one* coordinate, *edge
rays*
that connect cubes through their edges and change *two* coordinates, and
*vertex rays* that connect cubes through
their vertices and change all *three* coordinates. One type of ray for
each type of neighbor; face, edge, and vertex.
### Planar Moves

Figure 2 shows exactly the same state of the boards as the previous
figure but this time with planar moves on the 3D board rather than
straight-line moves. This changes everything. Instead of the rook moving
in three []*orthogonal* *lines* it is now
allowed to move in three []*orthogonal*
*planes*.

These three planes slice the board into disjoint regions (now eight
instead of four). Under this move, the opposing king will find itself
trapped in one of them. The White king and rook can now work together to
shrink the *volume* of the region confining the Black king until mate is
achieved. Indeed, it is exactly the same algorithm as in 2D, just a few
extra moves to confine the king against the extra dimension. See
"Chapter 19: Endgames" for the details.

The previous straight-line moves are indicated with dark inserts in the
red diamonds, they indicate the face rays. Each line (two rays in
opposite directions) is the intersection of two planes. The rook is
moving in a space only *one* dimension less than the board, same as in
2D. In contrast, the straight-line move
on a 3D board was moving in a space *two* dimensions less than the board
(previous figure). The planar move
is the critical breakthrough that allows play in three dimensions to
feel like chess.

![[]Figure 2: Single Rook Mate
Endgame
Requires Planar
Moves](media/image3.png)

The orthogonal *lines* of the 2D rook move cut the 2D board into *four*
disjoint *areas* (a). The orthogonal *planes* of the 3D rook move cut
the 3D board into *eight* disjoint *volumes* (b). The single rook mate
algorithm is now *dimension agnostic*.
Planes intersect at the straight-line moves (black diamond inserts). A
projection of the 3D rook move onto a face of the board is the 2D rook
move.

By now the answer should start to feel inevitable; pieces which moved in
*lines* in 2D, should move in *planes* in 3D. In the case of the rook
this means three *orthogonal* planes; one horizontal, two vertical.
### Obstacle
# 2 -- Blocking

Given a pair of rays, it is natural to assume that a piece advances
first along one ray
then along the other. Two different rays define a plane. A pair of rays
is the very foundation of the planar move.
For instance, one might imagine a rook advancing along one face
ray
out N tiles, then advancing M tiles along another face ray
at right angles. The rook is advancing along each ray through the faces
connecting adjoining cubes, changing just one coordinate at a time. But
there is an ambiguity because the rays may be followed in either order.
Is the move MxN or is it NxM?

Figure 3 shows the ambiguity. There are two paths; White has a dual
attack on a single piece, and Black cannot block
both in a single move. In 2D, that can't happen, an attack always comes
from *only one direction*. Because of symmetry, both paths must be
allowed; blocking is busted; there go the chess gambits, there goes the
midgame. The
straight-line move
didn't feel like chess,
and the []*dual path* *move*
doesn't either, yet we were led to it inexorably by the requirement to
have the pieces move in planes. Only planar moves can save the endgame.
A pair of rays define a plane, but they also imply dual path attacks
which cannot be blocked in a single move. Our quest, for the 'one right
rule set',
requires that both the endgame and the midgame feel
like chess.

![[]Figure 3: Rook's Dual Path Attack on a Knight
--
Rejected](media/image4.png)

If a ray
pair defines a plane, then a planar move
might be regarded as two straight-line moves at once; first down one
ray,
then down the other. However, symmetry implies both traversal orders
must be allowed. That means an attack occurs along *two* paths; the rook
attacks both down the 3x6 path and down the 6x3 path. Black cannot
defend in a single move. Blocking busted; there go the gambits, there
goes the midgame --
doesn't feel like chess.

We are being humbled; the paradigm is fighting back. Perhaps there are
no rule sets that can reproduce the feel of chess in three dimensions.
Perhaps, sigh, chess is exclusively a two-dimensional game. The quest is
blocked, by blocking of all things, how ironic.

We were successful in rising to the challenge of figuring out what kind
of move cut the board (a planar move).
Now we face a new question, "What kind of a move can make a planar
attack, but which can be blocked in a single move by the opponent?" How
does a dual path attack get reduced to an attack, "from only one
direction?"

One possibility is to declare that *both* paths must be unblocked for
the piece to be under attack. This allows the attack to be blocked by
placing a third piece on *either* path. While counter-intuitive, it does
at first glance appear to solve the blocking problem.
### STAB (Simultaneous Threat And Barter)

While the rules may require a process of discovery, naming things is a
process of invention. It is useful to introduce the term
*cover*,
to indicate either attacking an opponent's piece or defending one's own
piece. []*STAB*
is the measure of cover. The ideal STAB value is how many pieces any one
piece can cover from the center of an empty board.
In 2D, that's 4 for the rook and bishop, and 8 for the queen, king, and
knight.

'Simultaneous Threat and Defense' would be more accurate but leads to a
meaningless acronym, 'stad,' while 'Simultaneous Attack and Defend' is
even worse.[^8] If 'barter' is regarded as an exchange, "if you take
mine, I'll take yours," then STAB
works out very nicely.

The problem is that the STAB value under the dual path rule is obscenely
high.

Figure 4 shows the problem. The rook can circumvent closer pieces and
attack ones farther away. The 13 ghost rooks show the potential, but for
clarity only one dual path attack is shown; that's 13 pieces per plane.
If the planar move is envisioned as a dual path, even with the blocking
rule
that obstructing *either* path blocks the attack, such an interpretation
results in an astonishing STAB
factor of 39! The rook is able to circumvent closer pieces and reach
ones 'behind' it. A single piece could cover
all the other pieces on the board -- it won't feel like chess.

![[]Figure 4: Rook's Outrageous STAB of 39 for
Dual Path Move -
Rejected](media/image5.png)

A rook allowed to move along dual paths can attack or defend 13 other
pieces in each plane. Shown is one rook near the center of a horizontal
plane.
For clarity only one dual path is highlighted. Similar diagrams would
apply for both vertical planes (not shown). The ghost rooks show the
moves legal under the dual path rule.

While initially promising, the dual path rule fails to feel like chess.
However, this option does have an upside, it introduces the concept of
nonlocality; the mere existence of something *over there* (on the other
path) determines if a piece's presence *over here* (on this path) is
causal or not. In the jargon of brainstorming it is a transitional
concept; a 'bad' idea that leads to a 'good' idea.
### Nonlocality

We begin by backing up.

How does a piece in 2D really move? Does it advance until it runs into
something? It certainly feels that way when we pick up a physical piece
and move it from one square to another. Although, come to think of it,
we do generally pick -- it -- up, into the third dimension, rather than
sliding it along the surface of the board proper.

Is that the only way of describing a move? Recall that a piece starts in
one tile,
ends up in another, perhaps many tiles away. It was *here*, now it's
*there*. Was it really, *ever*, anywhere in between? (Look at a listing
of the moves to a 2D chess game; those intervening squares are nowhere
to be found.)

The physical board and pieces are not the game; they are certainly not
the rules. They are only conventionalizations that help our finite minds
enforce the rules. Only the rules are the game. A mathematician would
call the game a *formal system*.[^9]

In between *here* and *there*, were some small number of tiles. Anything
unique about them? We are talking just about pieces with unlimited
range,
pieces that can be blocked (the knight is another matter). Back to the
in-between tiles; what do they have in common?

They have empty in common.[^10] The set of in-between tiles contain no
pieces, not a single one. The set happens to have, in 2D, the
geometrical form of a line segment. A line segment is in a space *one
dimension less* than a 2D board. A 'plane segment' (whatever that means)
would be in a space *one dimension less* than a 3D board.

2D chess confronts us with a []*conceptual degeneracy*:
does a piece advance until it runs into another piece, or does it just
advance until some growing set of tiles (along a single ray)
ceases to be empty? In the latter case, call the set of tiles which must
be empty an []*advancement
manifold*.

A first guess at an answer is shown in Figure 5.

![[]Figure 5: The Rectangular Advancement
Manifold (RAM) --
Rejected](media/image6.png)

White's rook is attacking the Black knight via a
[]*rectangular advancement
manifold*
(*RAM* for
short). There can be no other pieces in the 18 tiles that make up this
[]RAM. Black can
block
this attack with a single move by moving another piece onto *any* of the
16 empty tiles marked in black.

In 2D, the advancement manifold
is a line segment, in 3D, it is, perhaps, a rectangle, and the MxN
rectangle must be empty of any other pieces for the move to be legal.

Here is a blockable planar attack; gambits restored, midgame saved,
all without sacrificing the endgame. Not too bad, not too bad at all.

So why is Figure 5 in black and white?
### Obstacle
# 3 -- Openings 

The RAM rule
is easy to visualize, it is easy to present and describe, and it is even
easy to program. But this paradigm barrier has another punch to throw.
Does an MxN advancement manifold
grow by M or by N? In the above example of the growing advancement
manifold,
were tiles added three-at-a-time 6 times, or were tiles added
six-at-a-time 3 times? The ambiguity stinks.

A further smell is that moves with skinny rectangular manifolds will be
harder to block
than moves with fat rectangular manifolds. The fattest rectangular
manifolds will actually be square, so the rule isn't very isotropic
either. But it gets worse.

The worst-case STAB value is still 39.

Figure 6 shows an example, broken into 3 parts for enhanced clarity.

![[]Figure 6: RAM STAB --
Rejected](media/image7.png)

Under the RAM rule, the rook STAB value is still 39. Ghost rooks show
the 13 locations that can be simultaneously covered by the rook under
the RAM rule in one plane. None are straight-line moves, so the other
two planes also support 13 targets. For clarity, only 3 rectangular
advancement manifolds are shown (horizontal plane); ghost rooks are
segregated for better visibility (a) -- (c).

The starting lineup for 3D chess has not been derived yet, but the cover
kind of gives it away. Note that a 1xN advancement manifold
must be allowed, else straight-line moves would be illegal. Given that
starting lineup, the side effect of straight-line moves is devastating;
under both the dual path rule and the RAM rule, the rook, bishop, and
queen can all move before a single pawn has advanced. There go the
openings -- doesn't feel like chess.
### The advancement Square

The challenge remains; how to specify a planar move
such that it simultaneously preserves the standard endgames, the
midgame, and
the strategic principles of openings.

Perhaps we can tease some further clues out of 2D chess. If the actual
rule of motion is that the 2D advancement manifold
can grow only as long as some set of tiles is empty, then the algorithm
for legal motion must be to add one tile
at a time and test if it's empty.

How should a 3D advancement manifold
grow? If a line segment grows one tile
at a time, then a 'plane segment' should grow one []*perimeter* at a
time. Call this an []*advancement
square*.

Figure 7 shows a series of snapshots of the rook's expanding advancement
square
for the same rook attack on the knight as in Figure 3.

![[]Figure 7: The Advancement
Square](media/image8.png)

A series of 5 snapshots (a) -- (e) showing each new
perimeter of the
6x6 advancement square
which must be empty of any other pieces for the White rook to be
attacking the Black knight. Each perimeter is two
tiles larger than the previous one (3, 5, 7, 9, 11). The line of red
diamonds with black inserts represent the two rays (the inner edges of
the advancement square).
The presence of the knight on the perimeter (outer
edges of the advancement square)
prevents the rook from moving to those tiles (or beyond); its only legal
move on that perimeter is to
capture the knight. All the diamonds are slightly smaller than a
tile
so the underlying tile's
color (black or white) can peek through.

The key is to constrain the advancement manifold
to be *square*, 2x2, 3x3, ... NxN. To move a 3D rook first requires the
specification of a plane (one of three) and a quadrant (one of four).
The rook can now attack only 4 pieces per plane, for a STAB value of 12,
much more reasonable.

Figure 8 shows a series of snapshots of the rook's expanding advancement
square
in a vertical plane, in an upward quadrant toward Black. In this case,
the advancement square
shows that Black's king is in check.

Note that parts of an advancement square
may extend off the board, as in this example. In the case of a rook, it
leaves a rectangular shaped manifold behind (3x4). Tiles off the board
will be occasionally shown when it helps visualize a move; however, the
tiles in any part of an advancement square
off the board are regarded as unoccupied and thus cannot
block
the move. Obviously, a piece cannot move off the board.

Some conventions are evident in how advancement squares are going to be
presented in this work. Colored diamonds just smaller than the board
tiles will be used as []*decorators* to indicate
that a tile
is on some special part of the advancement square,
something of tactical significance. Each type of piece will have its own
color. Using decorators a little smaller than the tiles allows the color
of the underlying tile
(black or white) to peek through.

The number of decorators is significant, so to avoid overwhelming the
reader, they will be introduced as needed. A summary of them is provided
in Appendix II for reference. For now, only two decorators will be used.
A plain decorator indicates a tile in the body of the advancement
square. One with a solid black diamond insert indicates a tile along one
of the two rays that specify the plane and quadrant of the move (the
*inner two edges* of the advancement square).
The perimeter is the *outer two edges* of the advancement square.

These conventions should be evident in the previous two figures which
show a 6x6 advancement square
in a horizontal plane,
and a 4x4 advancement square
in a vertical plane.

The king is covered (attacked, checked actually) by White's rook.

The piece shadows on either side of the board represent the *tray*;
where captured pieces go. These shadows serve a dual purpose; they also
label each level -- king-rook, queen-bishop, whatever.

[]Figure 8: Three Snapshots Showing King in Check
by Rook in Left Vertical Plane

(Facing page.) Three snapshots (a) -- (c) proving the Black king is in
check by the White rook via a left vertical advancement
square.
Note how part of the advancement square
extends off the board.

![](media/image9.png)

Each plane is divided into four *quadrants*
separated by face rays. Figure 9 shows the four quadrants
in a horizontal plane.
They are shown in opposite pairs for clarity. The ghost rooks indicate
potential []*quadrant moves*
at particular perimeters of various sizes. Note that the diamond inserts
at the ends of the perimeter are not
red, they are black. These represent []*linear
moves* to be clarified next.

![[]Figure 9: The Four Quadrants of the Rook
Move](media/image10.png)

The four quadrants
are shown in two pairs for clarity. A 3x3 and a 4x4 advancement
square
(a), and a 2x2 and a 6x6 advancement square
(b). The tiles which the rook can move to on the respective perimeters
are shown with ghost rooks. Note that the 6x6 advancement
square
extends off the board, so the ghost rooks on those tiles are not shown.
Note also the subtle implication that linear moves will need to be dealt
with as special cases, for the tiles under them are black not red.

Advancement squares expand into quadrants; what then of linear moves?
### Obstacle
# 4 -- Linear Moves

A linear move
in 3D presents two challenges, which will be referred to as
[]*quadrant ambiguity*
and []*plane ambiguity*.
Recall that two planes intersect in a line. A line of tiles along a
ray
form the intersection between two planes but also form a common boundary
between two adjacent quadrants within *each* of those planes.
It is ambiguous in which *quadrant* a linear move
advances, and it is ambiguous in which *plane* a linear move
advances; all, either, neither, both?

There are a number of possibilities here;

- let a linear move
  be legal if *any* quadrant is clear

- allow only if *all* the quadrants
  are clear

- group in pairs by plane and allow the move if *either* *pair* is clear

The first option can be easily dispensed with. In the starting lineup,
the major pieces are supposed to be blocked by the requirement of the
advancement square,
but as we have seen, it is possible for the advancement
square
to extend off the board. If a linear move
is allowed when *any* quadrant is clear, then the starting lineup only
blocks two of the four quadrants.
For the rook, the pawn blocks motion in the horizontal plane
for the quadrant extending inward, but it does not block
the quadrant that extends outward off the board. Similarly, the knight
blocks motion in each vertical plane only for the quadrant extending
downward, but it doesn't block
the quadrants
that extends upward off the board. Under the *any* rule,
the rook, bishop and queen can all move before a single pawn moves.
We've seen this dance before; there go chess openings.

The second option can also be dispensed with. If *all*
quadrants
have to be clear, then it would be four times easier to
block
a linear move
as a quadrant move;
there goes the ideal of isotropic moves. Also, in 2D chess, the lines
are independent, what happens in one has no direct
effect on the other. Manifold independence (line, plane) should be an
invariant which is honored.
Thus, in 3D chess, the planes should be independent; what happens in one
should have no direct
effect on the others.
### The Advancement Rectangle

This leaves only option three; motion is allowed if *either pair* of
adjacent quadrants
are clear, one plane or the other may be blocked, but as long as both
planes are not blocked, the move is legal. However, both
quadrants
in at least one plane must be clear. A linear move
may occur in only one plane, or it may occur in both, depending on other
pieces. This means that the advancement manifold
for a linear move
is actually an []*advancement
rectangle**.*
This is not to be confused with the debunked rectangular advancement
region (RAM)
which is part of why such a clumsy name was chosen for that concept; it
was intended to avoid later confusion.

While it is almost twice as likely to block
a linear move
in a given plane, it is twice as likely to be unblocked in at least one
of the planes; that restores the ideal of isotropic moves.

Figure 10 shows three snapshots of how the advancement
rectangle
grows with each new perimeter in just
one plane, in this case, the horizontal plane.
Note that the perimeter for a
linear move
grows by 5, 9, 13, ... tiles, twice as fast as for an advancement
square.
If any of these tiles are occupied, then an advance to that
perimeter is
blocked.

![[]Figure 10: Rook's Linear
Move](media/image11.png)

In each plane, a linear move
is ambiguous in which quadrant it advances in, so both advancement
squares must be empty for the move to be unblocked in that plane. Three
snapshots (a) -- (c) of the rook's *advancement rectangle*
are shown for the horizontal plane.

Figure 11 shows two complete advancement rectangles for a linear
move
in the intersection of a horizontal and a vertical plane. Advance is
eventually blocked by another piece in each plane; the knight blocks the
vertical plane limiting the rook's move to perimeter 2
(corresponding to two 3x3 advancement squares, i.e., a 3x5 advancement
rectangle),
and the pawn blocks the horizontal plane
limiting the rook's move to perimeter 4
(corresponding to two 5x5 advancement squares, i.e., a 5x9 advancement
rectangle).
An advancement rectangle 9 tiles long will obviously extend off the
board. Because of their larger size, it is quite common for advancement
rectangles to do so. The tile with the ghost rook (transparent) can only
be reached in the horizontal plane, two of the three previous in-line
tiles were also reachable in the vertical plane.[^11]

The advancement square has a STAB value much closer to 2D; from a low of
4 for the maximum number of simultaneous linear attacks to a high of 12
for the maximum number of simultaneous quadrant attacks.

![[]Figure 11: Linear Rook Move in Horizontal and
Vertical
Planes](media/image12.png)

The two advancement rectangles for a linear rook move are shown. The
vertical one is blocked by the knight, the horizontal one blocked by the
pawn. The tile
containing the ghost rook (king level) can only be reached in the
horizontal plane,
the first two linear tiles are reachable in both planes.
### Loss of Trajectory

The implication of an advancement manifold
is that a piece does not have a []*trajectory*
from its source tile
to its destination tile;
there is no unique sequence of tiles which it traversed. This is a bit
of a surprise, but the steps that led here are inescapable once the
commitment is made to hold discovery
ascendant over invention.
Who would make up such a rule? It violates our everyday experience, all
the perceptual algorithms that evolution has built into us over millions
of years, and even violates the early development of science, now[^12]
referred to as classical physics.

In 2D chess, it was possible to pretend that a move had a definite
trajectory,
a uniquely specified sequence of tiles connecting the source
tile
with the destination tile.
In 3D chess, the pretense of a trajectory
is no longer tenable. The loss of trajectory
violates common sense in deeply profound ways.[^13]

In classical physics, it was possible to pretend that an object in
motion had a definite path, a specific and unique sequence of
intermediate points, but according to quantum physics, it doesn't and
never did. Neither was there ever a trajectory
in 2D chess, but the physicality of the pieces, the very act of picking
one up and moving it, deceived us. Paradigms are strong barriers.

Motion is not classical; it is fundamentally quantum. The
perimeter of the
advancement square
is a portent of the concept of an advancing wave front. How did that
happen? By a disciplined adherence to the discovery
principle.

3D chess is an example of a game that is echoing fundamental principles
of physical reality, even, to a tiny degree, the historical progression
from a naïve classical view of motion to a more refined quantum view of
motion. How very delightful -- how very unexpected.

Had the loss of trajectory
been recognized in classical chess long ago, then it might not have been
such a scientific shock to discover
that an electron in an excited atom is *first* in one orbital, *then* in
another, but is *never*, *ever* anywhere in between.

"Oh," we might have said, "it's just like chess."

The ancient Greeks' love of philosophy lead to many inventive ideas on
the ultimate nature of reality, but until the rise of the scientific
method, little progress was made discovering the correct laws that truly
reveal the nature of reality; discovery
is ascendant over invention.

Our commonsense paradigm of motion is *classical*. Therefore, we
typically invent games where pieces advance along well defined and
unique trajectories, but adherence to the discovery principle reveals
that trajectories are an *illusion*.

The trajectory
paradigm, like all paradigms, seems *so opaque* on the front end, and so
*bloody transparent* on the back end. It is one of the strong reasons to
believe that the planar move,
constrained by the advancement square,
supports the hope that for 3D chess there just might be, *one right rule
set*.
## The Fundamentals

This chapter lays out a formal development of the board size, shape, and
pieces. The primary guide is to determine which invariants in 2D chess
scale.
### Rule Invariants

An []*invariant*
is an aspect of a system that doesn't change while other things do. Some
invariants will be fundamental, others coincidental. The fundamental
invariants are the true genesis of "chess-ness." A fundamental
invariant
is one that scales; it must be dimension agnostic.

For instance, the 2D chess board consists of 64 squares. If this is a
fundamental invariant,
it should scale, thus a 3D board should be 4x4x4. Actually, that's
pretty close to the prop in the original Star Trek (one level of 16
squares was split into 4 mini boards of 2x2 squares off to the
side).[^14]

Does it scale? What would a 4D board look like with 64 squares? Hmmm,
the 4^th^ root of 64 is not integral; 2.83 x 2.83 x 2.83 x 2.83 --
that's not going to work.[^15]
### The Congruent Rules of Chess

The existence of invariants allows the rules of chess to be phrased so
they are largely dimension agnostic.
Recast in this way they will be referred to as the
[]*Congruent Rules of
Chess*.
They will be introduced as we encounter them. They are summarized as a
set in Appendix I.
### Board Shape

While obviously the shape of the board must change in order to have
chess in three dimensions, the *sequence* of board shapes can have
properties that are invariant.
Consider; if the 2D board is a square of squares (8x8), then the 3D
board would be a cube of cubes (8x8x8), and the 4D board could be a
hypercube of hypercubes (8x8x8x8), ad infinitum; now there is an
invariant
that scales!

[]Congruent Rule **:** **A chess board *is* a
regular array of regular things.**

In crystallography, the unit cell is the basis for a regular array of
regular things. To help distinguish adjacent unit cells (squares, cubes,
etc.) they alternate colors, another invariant
that scales.

[]Congruent Rule : **Unit cells (tiles)
alternate between two colors, typically white and black.**

The range
of the unrestricted pieces should also be dimension agnostic.
They can move the full extent of the board; fore and aft, or left and
right, and of course in 3D, or up and down. No dimension is special.

[]Congruent Rule : **Unrestricted pieces may
move the full extent of the board**.

Under these congruent rules,
all chess boards are symmetric, a 90° rotation changes nothing except
converting white tiles into black tiles and vice versa.

Figure 12 shows the 2D board as a square of squares and the 3D board as
a cube of cubes.

![[]Figure 12: Board
Shape](media/image13.png)

If the 2D board is a square of squares, then the 3D board should be a
cube of cubes. A square is the proper unit cell for 2D, a cube the
proper unit cell for 3D. In any dimension, adjacent orthogonal unit
cells alternate colors (white & black).
### Rays

Since the chess board has changed, being able to tie how pieces move to
the topology of the board can go a long way towards finding invariants
that are dimension agnostic.
Geometry provides the necessary clue.

A []*ray*
is a directed line segment of unit length that extends from the source
tile
to an adjacent tile.
Rays come in a few simple types, determined by how many cartesian
coordinates change when advancing along one. A ray
that changes only one coordinate extends through the side of a square or
the face of a cube. One that changes two coordinates extends through a
square's corner or a cube's edge. One that changes all three
coordinates, extends through a cube's vertex.

In 2D, there are two types of rays: *side rays*, and *corner rays*. In
3D, there are three types of rays: *face rays*, []*edge rays*,
and []*vertex rays*.
Side and []face rays change only one coordinate. Each
additional ray
type changes an additional coordinate.
### Base Pieces

A square has 8 nearest neighbors (3x3 - 1); 4 connected by sides, 4
connected by corners; *two* types. The rook advances along a side
ray,
the bishop along a corner ray.

In 2D the rook and bishop are []*base pieces*; all
the other pieces can be defined in terms of them. The queen is the sum,
the knight the anti-queen (very anti, limited range, can't even be
blocked). The king is a short-range
queen, and the pawn, just to mix things up a bit, advances like a rook,
but captures like a bishop, with restrictions on range
and direction.

Promoting up a dimension, the cube has 26 neighbors (3x3x3 - 1); 6
connected by faces, 12 connected by edges, and 8 connected by vertices;
*three* types.

Sounds like a 3D rook should advance along face rays. When a rook
advances to the next square through a side it uses a ray
that changes only one coordinate number. When it advances to the next
cube through a face, it uses a ray
that changes only one coordinate number. If it advanced to the next
hypercube through a hypersurface, it would still use a ray
that changes only one coordinate number. A consequence of the property
of changing only one coordinate number is that a rook, in any dimension,
can reach every location on the board. Here is a scalable
invariant.

[]Congruent Rule : **Rooks advance along rays
which change only *one* coordinate.**

Should the 3D bishop move through edges, or vertices, or both? Should
chess have two base pieces or one base piece
per dimension? These are degenerate invariants in 2D. Which
invariant
is fundamental? Which one should be shunned, and one which should be
honored?

In 2D, the corner of a square has a dual nature; moving through corners
changes *two* coordinates, but it also changes *all* the coordinates
there are. In 3D, the vertex of a cube has a dual nature; moving through
vertices changes *three* of the coordinates, but it also changes *all*
the coordinates there are. Should a bishop advance along rays that
change *two* coordinates, or along rays that change *all* the
coordinates?

The above dilemma is common when promoting from a lower abstraction to a
higher one. Unavoidably, some rules or features in a lower abstraction
will be ambiguous; there will be two or more equivalent descriptions, a
*conceptual degeneracy*,
but when promoted to the higher abstraction the degeneracy is broken and
the two descriptions are seen to be different.

This one turns out to be easy to resolve.

If the 3D bishop advances through edges only, it can reach just half the
tiles on the board, and they are all the same color (same as the 2D
bishop). If it advances through vertices only, it can reach just a
quarter of the tiles on the board, and they are half white and half
black (not like the 2D bishop). If it advances through both, it can
reach all the tiles on the board, and thus change color (not at all like
the 2D bishop). Therefore, to maintain chess-like behavior, the 3D
bishop should advance only through edges.

[]Congruent Rule : **Bishops advance along rays
which change *two* coordinates**.
### Royal Pieces

In 2D, the queen, as the sum of the rook and bishop, can cover all the
nearest neighbors (8). In 3D, with the bishop limited to advancing
exclusively through edges, she would only be able to attack 18 of the 26
nearest neighbors; the 8 vertices would be disallowed. Is it a
fundamental invariant
that the queen can cover all the nearest neighbors or is this a
coincidental invariant?

In 2D, the king likewise can cover all the nearest neighbors (8). In 3D,
should the king be able to still cover all the nearest neighbors (26)?
If the bishop can only advance along rays which change two coordinates,
then there is no base piece
which moves through vertices. Thus, the queen (as the sum of the 3D base
pieces) would not be able to attack all the nearest neighbors. Which in
turn implies that a king could attack a queen but not be attacked in
return. Furthermore, if the knight is the anti-queen (the only piece
that can attack the queen without a counterattack) then the knight might
be able to move to vertices and that doesn't look at all like a knight's
move and doesn't project a 2D knight's move onto a two-dimensional
surface. The implication is clear.

[]Congruent Rule : **Chess requires a base
piece**
**for every dimension.**
### Introducing the Duke

The new base piece
must advance through vertices. 'Vertices' is an awkward word, but it was
useful to make clear the differences between the unit cell of 2D, the
square (which has sides and corners), and the unit cell of 3D, the cube
(which has faces, edges, and vertices). From now on the term *corner*
will be used interchangeably trusting the context to disambiguate.

The new base piece
is called a *duke*, it
advances along rays that change three coordinates. It can reach only a
quarter of the tiles on the board, half as many as the bishop, just like
the bishop can reach only half as many tiles as the rook.

The geometry is beautiful; a rook's advance changes one coordinate
value, a bishop's advance changes two, and a duke's advance
changes three. In both 2D & 3D chess, the rook can reach every
tile
on the board, the bishop can reach half the tiles on the board, and in
3D chess the duke can reach a
quarter of the tiles on the board. This is a derivative
invariant.

[]Congruent Rule : **Each new base
piece**
**can reach only half as many tiles as the previous one.**

There is no hard invariant
in 2D chess about the names of the pieces. However, there is a soft
invariant.

[]Congruent Rule : **Piece names derive largely
from a medieval motif.**

The choice of 'duke' as the
name of the next base piece
fits this motif, with the added benefit that its name starts with a
different letter than any other piece, maintaining clear chess notation.

It seems we have our base pieces.

Figure 13 shows the topological basis for base pieces. Adjacent cells
are connected by rays which change one to three coordinates. A
consistent color scheme for adjacent cells (tiles) is used. It shows the
adjacent squares of 2D (a) and the adjacent cubes of 3D (b) color coded
as red, green, and blue; for the rook, bishop, and duke
respectively.

![[]Figure 13: Base Pieces Derive from Adjacent
Unit
Cells](media/image14.png)

The base pieces derive from the topology of the board, a
multi-dimensional array of unit cells. Each type of adjacent cell is
connected by a ray of a different type, which can be ordered by the
number of coordinates it changes. The unit cell of 2D is the square (a),
it has two nearest neighbors; 4 connected by sides (rook), and 4
connected by corners (bishop). Two types of rays connect squares; side
rays which change 1 coordinate, and corner rays which change 2
coordinates (a). The unit cell in 3D is the cube (b), it has 26 nearest
neighbors; 6 connected by faces (rook), 12 connected by edges (bishop),
and 8 connected by vertices (duke). Three
types of rays connect cubes; face rays which change 1 coordinate, edge
rays
which change 2 coordinates, and vertex rays
which change 3 coordinates. Red, green, and blue form the basis of a
consistent color scheme.

In 2D, rooks advance along rays which change only one coordinate,
transitioning through the sides between squares, bishops advance along
rays which change two coordinates, transitioning through corners between
squares.

In 3D, rooks advance along rays which change only one coordinate,
transitioning through the faces between cubes, bishops advance along
rays which change two coordinates, transitioning through edges between
cubes, and dukes advance along rays which change three coordinates,
transitioning corners (vertices) between cubes.

A deep gray (almost black) will generally be used to indicate the source
tile.
### Presentation Layer

Because of the complexity of 3D chess, it is useful pedagogy to
establish some presentation standards. The first of these is to
associate a color with each base piece.

While this color standard will be closely adhered to, minor deviations
will be used to communicate subtle points (mostly varying tints). For
those who might wish to create figures or display software to this
standard, the 8-bit RGB value of the chosen blue tint is (0, 211, 255).
(Pure blue, 0,0,255, was too dark.)
### Board Size

Time to review; the 2D board is 8 tiles long, long enough to hold all a
player's pieces in two straight lines. But now, with the addition of the
duke, there are
more pieces. Assuming the duke lines up as
a pair around the royal pieces (like the rook, bishop, and knight) the
3D board is going to have to be 10 tiles long. That implies a 3D board
of 10x10x10, for 1,000 tiles.

Back to the invariant
question; is the chess board 8 tiles long, or is it long enough to hold
all the pieces? There are so many variations here that considering them
all in detail becomes tedious. Therefore, the major rejected variations
will be critiqued with a single sentence and critics are free to object
as they see fit.

- 10x10x10 separates the pawns too far; yields major piece war followed
  by a pawn war.

- 8x8x10 violates rotational symmetry; busts the pawn race endgames.

- Placing the dukes off edge allow them to move prior to the pawns;
  busts openings.

- Half the offline positions prevent the dukes from attacking any piece
  in the starting lineup; degrades gambits.

- No dukes start the game, but queens can move like one and pawns can
  promote
  to one; odd.

A trial solution to return the board to 8x8x8 is to place the
duke on the same
tile
as the bishop. Now all the pieces fit on the board.

[]Congruent Rule : **The length of a chess board
is 8 tiles.**
### Introducing the Stack

However, placing the duke on the same
tile
as the bishop violates the one piece, one tile
invariant.

[]Congruent Rule : **A tile**
**may be empty or contain one and only one piece.**

The solution proposed here is to start the duke on top of
the bishop as a composite piece called the *stack*. As
a composite piece, it moves differently than its component parts and can
thus be rightly regarded as a single piece. However, as a composite
piece it can also separate into its component parts. This preserves the
one-tile
one-piece invariant.

Fully justifying this choice cannot be done at this stage of
development. In "Chapter 3: The Board and Pieces" the stack will
be formally presented, and further arguments for its existence and
properties will be considered in "Chapter 10: Stack."

[]Congruent Rule : **All base pieces except the
rook may be combined into a composite piece.**
## The Board and Pieces

The board size and shape have been determined, as have the pieces that
should go on it. However, it seems appropriate to have a piece design
unique to 3D, and there is still the task of determining where the
pieces should start.
### Piece Design

Before considering the starting lineup, a piece design should be
selected. Most chess piece designs allude to the move rule for that
piece; the rook (castle) will have four ramparts, one for each
orthogonal direction, the bishop a slotted helmet to indicate its
diagonal move, the queen has eight points on her crown for her eight
directions, the knight's horse head turns to the side, etc.

A conventional design is entirely workable, but a highly stylized,
futuristic look seemed more appropriate, if the pieces could be
intuitively identified and maintain the allude standard.

[]Congruent Rule : **The design of each piece
alludes to how it moves.**

Since we have not yet fully discussed how the pieces move, we are
getting a bit ahead of ourselves, but having a starting lineup
facilitates that very discussion, so a classic chicken and egg problem
prevents a clean linear presentation. As the move for each piece is
presented, the connection with that move and its shape will become
evident and will be explicitly called out.

Figure 14 shows a rendition of the 3D piece design in the Blender 3D
modeling application. In order from left to right they are; king, queen,
rook, bishop, duke, two
knights (with opposite parity), stack (the
combined bishop and duke), and the
pawn. This design is not far from conventional designs and should be
easily recognizable. Only the bishop and the duke might be a
tad confusing at first, but stacked they appear how a 'post-modern' 2D
bishop might look.

![[]Figure 14: 3D Chess Piece Design](media/image15.png)

Each of the 3D chess pieces allude to how they move in 3D. From left to
right they are; king, queen, rook, bishop, duke, knights
(with opposite parity), stack (the
combined bishop and duke), and the
pawn. In this rendition, the basic shapes have been covered with a
marbled surface.

For the Intrepid Reader who takes a perverse pride in getting to where
the author is heading but first, the shapes offer clues to the proposed
move set; particularly the base pieces and knight.
### Starting Lineup

There are several invariants of the starting lineup in 2D to consider.
There is a dual line for both players with a pawn for every major piece.
The dual line extends the full breadth of the board. The dual lines are
on opposite extents of the board. The major pieces mirror each other
around the royal pieces. Half the tiles have a piece. That last one
seems dubious, it would imply 256 pieces on the 3D board, probably with
128 pawns -- enough said.

Pressing on, notice that the line of major pieces (being a line) changes
only one coordinate number. Considering the major piece line as a
reference, the pawns change the other coordinate. Once again, the
some/all conceptual degeneracy
confronts us. Does each pawn change just the *one* unused coordinate
from its major piece, or does it change *all* the unused coordinates? In
the former case, there are lots of ways to structure a starting lineup;
pretty much any straight line on opposing
faces of the board will suffice. Even diagonal lines are an option. For
all these options, getting the Black and White pieces to be fully
opposed to each other is, however, awkward at best.

To resolve the degeneracy, consider standard *chess notation*, where the
files are identified by the major pieces (K, KB, QR, etc.) and the ranks
are identified by number (1 to 8). If the *all* option is taken, then a
pawn starts on K2, or K2,2 or K2,2,2 (for 4D); this is the
invariant
that scales.

[]Congruent Rule : **Pieces start in two lines
opposed on 2^nd^ highest order feature, pawns in *front*.**

Therefore, the major pieces should start on opposite edges of the board
with their respective pawns in front. There are 12 edges, thus 6 edge
pairs, and by symmetry they are technically all equivalent. However, a
physical board made out of levels breaks this symmetry, gravity and all
that, so the natural solution is to select a pair of *vertical* edges.
This means each level can be referred to by its base piece
(king level, queen-knight level, etc.). It also means the players start
face to face on an equal footing. A pair of horizontal edges would have
one Player looking down at the other. This separates the 3D pawns by
four tiles (diagonally), just as they are separated by four tiles
(orthogonally) in 2D.

Now to select *which pair* of opposing vertical edges to use. This same
challenge exists on the 2D chess board and a sure sign of novices
playing chess is when they go against convention and place the White
king rook on a black square rather than on a white one. For a folding
board, the correct orientation
has the fold separate the players. For both solid and rollup boards, the
players have to pay a little more attention; while just a convention,
there is no good reason to violate it.

[]Congruent Rule : **White king rook starts on a
white tile****.**

This does have side effects; the Black king rook will also start on a
white tile,
and the pseudo rule, 'Queen on her own color' no longer works; both
queens start on white tiles. The equivalent rule in 3D chess is that the
king starts on the level above the queen.

Figure 15 shows the starting lineup.

![[]Figure 15: Starting Lineup](media/image16.png)

Opponents face each other on opposite extents of the board. The major
pieces mirror each other around the royal pieces, pawns in front. The
White king-side rook starts on a white tile. In 2D, they align along
opposing sides (a), in 3D, they align along opposing vertical columns
(b).
Stack starts next to the royal pieces (bishop level). King is above the
queen, so both queens start on white tiles. Pawns are on
tile
2,2 (left, right; from each player's perspective) and
promote
only on the opponent's home column (8,8). The piece trays lie outside
the board, serving to ID each level. On each level a thin border
surrounds the center 4x4 grid of tiles; easier to visualize multi-level
moves.

The convention in this book is that White lines up on the right, even
though she moves first. This is in contrast to the usual idiom of
starting from left to right. The justification for this choice is that
if one takes a 2D board as seen from White's perspective and tilts it
vertical so that the king is on top of the queen, one ends up with White
on the right. This particular 'rule' is rather arbitrary and as a mere
convention might well morph the other way around over time. However, it
won't much matter when played on a computer as each player will simply
rotate the board per taste and may well prefer a White or Black
dominated perspective, rather than the neutral one used here.

The 1,1 vertical column, from each player's perspective, is the home
column, with the respective pawn columns at 2,2.

[]Congruent Rule : **A pawn's promotion
tile**
**is any of the opponent's home tiles (8,8).**

[]Congruent Rule : **White moves first.**

A couple of visual tricks have been used to improve board presentation.
For instance, a thin line borders the inner 4x4 grid of tiles on each
level; this aids in aligning moves which span multiple levels. In
addition, the black and white tiles are tinted slightly darker at lower
levels; this helps ameliorate the moiré pattern.

Most significantly, the levels overlap. Depending on the needs of the
topic, the degree of overlap will be greater or lessor. More overlap
keeps the board closer to its formal definition of being a cube, but at
the cost of hiding tiles and any pieces on them. Less overlap allows
more of the board to be visible, but at the cost of vertically
elongating the board which puts an undo emphasize on levels.

Formally, from the perspective of the rules, the board *is a cube*,
vertical planes are just as important as horizontal planes, but as we
are not yet four-dimensional beings, we are prevented from seeing (and
reaching) inside a truly cubical 3D board. There is a perceptual cost to
this, levels dominate the view when the game itself, with the exception
of the pawns, is level agnostic, but it is an unavoidable compromise. A
good computer-based presentation layer can ameliorate this compromise to
some degree.
### Chess Notation

Chess notation on this board is easy and natural; P -- K4,4. Coordinate
order is from each player's perspective; piece, 'dash', level, left
distance, 'comma,' right distance. A pawn move by White to KB3,4 will be
seen from Black's perspective to be on tile
KB6,5; each opposing pair of indices should sum to 9.

Such moves can also be annotated, such as 'x' for capture or 'ch' for
check, and of course '!' for a good move and '?' for a questionable one.
3D chess requires a larger list of annotations. They will be introduced
as needed.

For instance, a list of the classic Ruy Lopez opening of 2D chess might
(duke plays the
bishop role in this opening) look something like this. This is not
actually a strong opening in 3D chess, for reasons that will become
apparent; it is intended to show how move notation looks, but from a
framework the reader is likely familiar with.

[WHITE] [BLACK]

1 P -- K4,4 P -- K4,4

2 N -- KB3,3 N -- QB3,3?

3 D -- QN5,5 P -- QR4,3!

Analysis of openings will be covered in Chapter 21. We still need to
finish discovering how the pieces move, so once again, we are a bit
ahead of ourselves.

A succinct notation for an initial position is desired to facilitate
chess puzzles.
Capturing the state of the board is done similarly,

[WHITE] [BLACK]

R @ K5,4 K @ Q2,3

K @ Q8,3

which is the initial position for the single rook mate of Figure 1 and
Figure 2.
