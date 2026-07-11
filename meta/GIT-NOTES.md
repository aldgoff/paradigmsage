# ParadigmSage - Git Notes

## Hugo Server Start
  hugo server --disableFastRender --buildFuture

  git log --oneline --decorate --graph --all --boundary -n 30

## Branching and Publishing Model
  For serialization topics (like PoP), use git branches to stage release publications.
  Content for upcoming releases are developed on stage branches.

  ```
    - <topic>-staging-01
    - <topic>-staging-02
    - <topic>-staging-03
    - ---
    - <topic>-staging-nn
  ```

  - Release strategy is to develop content on the stage branch.
  - Pages are dated for Monday, but can be viewed locally with 'hugo server --buildfuture'
  - Merge into main over the weekend (or Friday, or whenever).
  - Hugo Pages will publish on the date trigger (UTC).
  - Could actually prepare weeks in advance with this strategy.
  - In the case of PoP, stage one is empty, as this workflow was not established yet,
  but I want the full sequence to be obvious.

## Git commands:
 ### Git Basic Commands
  ```
  git status
  git branch
  git checkout -b <branch>
  git diff (or VSC diff)
  git push -u origin <branch>
  git switch main
  git merge --no-ff <branch>
  ```

 ### Git Workflow
  ```
  git switch main
  git checkout -b <newBranch>
  git switch <branch>
  Use VSC to commit and sync the changes most of the time.
  add .
  git commit -m "Commit message."
  git push -u origin <branch>   // Only need to do once.
  git push
  git switch main
  git merge --no-ff <branch>
  vi: Merge bug fix|feature add|whatever.
  vi: Merge branch '3dc-port' - planes and quads in the geometry layer.
  vi: Merge branch '3dc-port' - perims module in the geometry layer.
  vi: Merge branch '3dc-port' - overlapTiles module in the geometry layer.
  vi: Merge branch '3dc-port' - AdvSq: first stable point.
  vi: Merge branch '3dc-port' - Perims: allow k=0, degenerate, but eliminates the special case, consistent geometry.
  vi: Merge branch '3dc-port' - AdvSq: first good test coverage.
  vi: Merge branch '3dc' - Begin development of the view layer.
  vi: Merge branch '3dc' - Start on model layer: state module for undo/redoable state.
  vi: Merge branch '3dc' - POC on view layer, tile aspect, 8-color board, decorators, raycasting clicks.
  vi: Merge branch '3dc' - Port canvas panels to DOM panels.
  vi: Merge branch '3dc' - Camera control, partial undo logic, make boards from panel.
  vi: Merge branch '3dc' - Offboard tiles w/ opacity, decorators, responsive advs panel, duplex/apex.
  vi: Merge branch '3dc' - Merge week 6 (advsq panel, gambit panel, latent bugs, tests, stride stability, derived quantities).
  vi: Merge branch '3dc' - Merge & tag progress: gambits, undo, MVC compliance, viewer, jitter, bugs, todos, rewind/forward, race condition.
  vi: Merge branch '3dc' - Standardize UI across layers, load/save, time symmetric idiom for moves, complete state UI functions.
  vi: Merge branch '3dc' - QC. Undo/redo rewind/FF bugs. Delete deprecated items. Plumb trays. May buildPayload canonical.
  vi: Merge branch '3dc' - Safe merge of gambit specs and json.
  vi: Merge branch '3dc' - Fix board gambit undo bug, UI surface reduction, plumb freeze linear gambit.
  vi: Merge branch '3dc' - Linear gambits.
  vi: Merge branch '3dc' - Linear gambits next plane feature.
  vi: Merge branch '3dc' - Duplex gambits, clues, trays, dots.
  git log --oneline --decorate --graph --all --boundary -n 50
  git push origin main
  ```
  
 ### New Merge Process
  ```
  git switch 3dc3
  # code
  git add .
  git commit
  git push origin 3dc3   # optional but wise

  git switch main
  git merge --no-ff 3dc3
    Merge 3dc3 bug fix|feature add|whatever.
    Merge branch '3dc' - Duplex gambits, clues, trays, dots.
    Merge 3dc3 Board occupancy, entry standards, stack simplification.
    Merge 3dc3 Fission, duke lowering, button affordances, clues, tag.
    Merge 3dc3 Affordances, stack, gambits, overlaps, save testsuites, QC.
    Merge 3dc3 Visual tweaks.
  git push origin main
  git switch 3dc3
  ```

 ### Git Tags
  Basic commands.
  ```
  git tag
  git tag -a v0.1-<desc> -m "Tag label."
  git tag -a v1.0.1 -m "Tag label."
  git show v0.5-<desc>  (Better)
  git show v0.5-3dc3-<desc>  (Best)
  git tag -a v0.6-3dc-MVP

  git tag
  git tag -a 3dc-v0.5-<desc> -m "yada yada"
  git push origin <tag>  (Preferred)
  git show tag

  git push --tags  (Just as good on a solo project.)
  ```
  History (a little muddled - all associated with qt3).
  ```
  3dc-advsq-stable-v1
  3dc-foundation-bootstrap
  v0.1-topology
  v0.2-feynman-tile
  v0.3-3dc
  v0.4-move-pieces
  v0.5-3dc-fission
  v1.0.1
  ```
  Canonical Use Going Forward
  ```
  git tag <project>-<layer>-<milestone>
  ...
  git tag 3dc-foundation-bootstrap
  ...
  git push origin 3dc-foundation-coords
  ```

 ### Git Tag Taxonomy
  ```
  Tag format:
    <project>-<layer>-<milestone>

  Where:
    layer ∈ {foundation, geometry, model, view, controller, tests, integration}
    milestone ∈ {bootstrap, port, validate, generalize, refactor, complete}

  Examples:
    git tag 3dc-foundation-bootstrap
    git tag 3dc-foundation-coords-port
    git tag 3dc-geometry-bootstrap

  Tags represent completed, stable milestones — not work-in-progress.
  ```

 ### Git History (sort of)
  - Commit msg: "PoP Ch01: staging complete."
  - Commit msg: "..."
  - Commit msg: "PoP Ch23: staging complete."
  - Commit msg: "PoP Ch24: staging complete."
  - Commit msg: "PoP Ch25: staging complete."
  - Commit msg: "PoP Ch26: staging complete."
  - Commit msg: "PoP Ch27: staging complete."
  - Commit msg: "..."
  - Commit msg: "QT3 content: staging complete."
  - 
  - Merge: release version (1.0.0), pre code cleanup.
  - Merge: empty load string undo bug.
  - Merge: load code working through syntax tokenization.
  - Merge: complete use of GRAMMAR, error & status strings.
  - Merge: get ensemble pruning by contradiction working!
  - Merge: QT3 cell, button, grammar, and test improvements.
  - Merge: QT3 undo functionality.
  - Merge: QT3 fixes and code cleanup.
  - Merge: My favorite game, more code cleanup.
  - 
  - Merge msg: "Merge PoP Chapter 7 (Entanglement)."
  - Merge msg: "Merge PoP Chapter 23 (Critique)."
  - Merge msg: "Merge PoP Chapter 24 (Frame)."
  - Merge msg: "Merge PoP Chapter 25 (LOF)."
  - Merge msg: "Merge PoP Chapter 26 (Digital Circuits)."
  - Merge msg: "Merge PoP Chapter 26 (Engineering)."
  - Merge msg: "Merge PoP Chapter 27 (Infinity)."
  - Merge msg: "Merge QT3 nav."
  - Merge msg: "Merge QT3 content."
  - 
  - Merge 3dc-dirs; regression test harnes, and ported 3 coord functions.

## Abort QT3 Experimental Code
  ```
  checkout main (823ccdd (orign/main, main))
  git checkout -b qt3-baseline
  git add.
  git commit -m "QT3 baseline cleanup/fixes."
  git checkout main
  git merge --no-ff qt3-baseline
    Merge msg: Bypass experimental qt3 code.
  ```

## Cleanup Plan (temporary)
  ```
  git switch -c cleanup-public-surface
  rm -rf public
  hugo
  git status        # sanity check: only expected files changed
  git commit -am "Clean public surface; remove early quantum section"
  git switch main
  git merge --no-ff cleanup-public-surface
  git branch -d cleanup-public-surface
  git push
  ```

