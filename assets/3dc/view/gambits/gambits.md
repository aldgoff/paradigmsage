# Gambits Spec
  Describe how gambits work.

## 1. Purpose
  Advsqs are captured (frozen) into a growing gambit from which an eventual move will be selected.

## 2. Strategy
  Need to think through how this interface is going to work.

 ### 2.1 AI Prompt
  We have done no button enable logic yet.
  If the stride is not on an end tile, then we have a pure quadrant move.
  Thus the FreezeQuad button should be enabled, but the FreezeLinear should not.
  However, if the stride is on the apex tile, then overlap becomes possible.
  Thus the FreezeOverlap button should be enabled.
  However, I don't want to prevent capturing a single quad even when not pure.
  It may be bad representation during play but will have benefits during teaching and training.
  Now which buttons are enabled provides feedback about the nature of the src/dst tile relationship.
  However, button management is tricky, and changes to a UI cascade through a code base.
  I think we wait for the polish pass.
  In the meantime, the derived fields can provide the same benefit.

  Except, the derived fields are for the gambit entries in the undo buffer.
  We need similar fields for the advsq itself, to live on the AdvSq panel.

  Some of this belongs in a json file. Do we already have it? Perhaps in the geometry layer?
  Perhaps the overlapTiles files? Check those out.
  Do we have enough defined to implement a clean gambits UI?

 ### 2.2 AI Response?
  Very, very verbose. Summary, use the overlapTiles module.

 ### 2.
  text

## N. Invariants (typically last section)
  Formally redundant consequences of the spec that must always hold.
  Used as drift guards and cross-checks across data, code, and tests.

