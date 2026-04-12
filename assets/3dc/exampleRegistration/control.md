# Brainstorming How to Use Panels for Logarithmic Undo

## Logarithmic Undo

Camera and lights, separate undo. 
Logarithmic undo for setup, moves, gambits, and advsqs. 
Architecture is leaning toward DOM and away from canvas. 
It think we have a separate panel for undo. 
A setup panel, a move panel, a gambit panel, and an advsq panel. 
Let's say we have looked at a few board and tray configurations with the setup panel. 
We can undo/redo, then pick one. 
Next we create an advsq with the advSq panel and move it around the board, which we can undo/redo, then freeze one. 
First element in the gambit undo list; the advsq undo list is now empty. 
Create a new advsq, move it around, review with undo/redo, freeze it - second gambit element. 
Repeat until our head hurts. 
Now review the gambit with undo/redo, select a move and log it, the gambit undo list is now empty. 
We have just added the first element to the move undo list. 
The gambit and advSq features help the player understand the game and decide on a move. 
The move listing is for post mortem analysis and tutoring. 
What does the gambit panel do, is it just a listing of advsqs? 

So it must be possible to delete an advsq out of the gambit, not just pop the last one. 
I create advsq with the advsq panel, then add to the gambit set (not list). 
It might also make sense to change an advsq already in the gambit; a rook apex quad advsq is also a linear bishop. 
The gambit panel could let me switch back and forth - that's confusing levels. 
Better to add and delete only, let all advsq manipulations go only through that panel. 
Now we have to have a way to select the advsq to delete. 
A list makes this easy, traversing it in construction order (like undo, but with different semantics), or maybe we can even click on the advsq on the board to select it. 
So I can change my mind by deleting an advsq, create a new one, and add it.

Poor man's implementation. 
A pair of select buttons in the gambit panel, next/prev advsq. 
Delete enabled when one is selected. 
A deselect button also enabled when one is selected. 
Make next/prev circular enabled unless set is empty. 
Five buttons: freeze (ads advsq, enable if there is one), 
next/prev highlight one advsq on the board (could elevate tiles a half thickness), 
deselect (tiles return to normal height) and delete. 

Multiple potential methods to select an advsq out of the gambit. 
One of the strengths of the tile lift method (any pieces should lift as well) is that it highlights the duke colors. 
To avoid the psychedelic visual of the 8-color board they are thin with just enough gap to hint at the duke color, so seeing the duke colors is deliberately subdued. 
This gives the gambit UI a secondary use, "show me the duke colors one quad/plane at a time."

I need an example of a DOM panel. 
Give it 5 buttons, 4 checkboxes, 3 radio buttons, one non editable text box, and one editable text box. 
We will probably need a scrollbar for the move listing.
