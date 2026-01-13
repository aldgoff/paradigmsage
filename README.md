# ParadigmSage - Project Notes
  Notes on intent, structure, and non-obvious decisions for the ParadigmSage site.

## Intent
  Capture architectural intent, non-obvious decisions, and rejected alternatives so I don’t re-derive them later.

## Content Structure
  Hugo based.
  Content and nav layouts behave like orthogonal axes in the hypercube programming idiom.

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
  Release strategy is to develop content on the stage branch.
  Pages are dated for Monday, but can be viewed locally with 'hugo server --buildfuture'
  Merge into main over the weekend (or Friday, or whenever).
  Hugo Pages will publish on the date trigger (UTC).
  Could actually prepare weeks in advance with this strategy.
  In the case of PoP, stage one is empty, as this workflow was not established yet,
  but I want the full sequence to be obvious.

## User Experience
  UX should be ultra clear; you are here, by topic, by post, by concept.
  Make it easy for the Intrepid Reader to revisit site without getting lost with a clear idea of what is new.

## Layout versus Content
  The AI wrote most of this code, so I'm playing catchup to understand the connections.
  ### Defaults affect the simple pages
    - home.html => Paradigm Sage
    - single.htm => Start Here
  ### Serial affect the PoP pages
    - list.html => PoP landing page
    - single.html => PoP leaf pages

## Architectural Invariants
  - Nav must encode "where am I?" unambiguously.
  - Topic role (hypercube separation).
  - Figures live in static/assets, never inline blobs.
  - Instrument nav is hub-anchored.
  This will grow, may need collapsible sections.

## Rejected / Abandoned Approaches
  SEO is explicitly rejected (objective is credibility not engagement metrics).

## Toolchain
  Repo
    GitHub (graphical UI)
    git (CLI)
  VSC (modern code editor, integrated with markdown, git, etc.)
  Hugo server (local and via Pages)
  Word (full featured content editor)
  pandoc (convert Word to markdown)
  Custom chatgpt (paradigmsage), tailored as a website development assistant

## Operational Notes
  Structure is still a work in progress.
  Use custom AI to assist in web site architecture and development, not for content.
  An example script for Word -> markdown (in ~/bin)
    docx-to-md
    "Usage: docx-to-md <topic> <role> <input.docx> <output.md>"
    <role> may only apply to PoP - will need to be modified for other topics.

  ### 1. Add Front Matter
    This drives the nav system.
    Hugo will not publish nor set up nav for pages in the future.
    To confirm behaviour, relaunch: Hugo server --buildFuture.

  ### 2. Extract Figures
    Open in word, select figure, right click "Save as Picture...".
    Replace the asset line from the pandoc conversion.
      ```
      <img
        src="/paradigmsage/assets/pop/ch/media/ch-0N-portent.png"
        alt="Portent N — <title>"
        style="width: 100%; height: auto;"
      />
      ```

  ### 3. Extract Equations
    yada

## Hypercube Architecture
  N dimensional hypercube of orthogonal axes.
  1. **Topics** (QTP, PoP, QT3, 3DC, etc.)
  2. **Navigation** (serial, analytic)
  3. **Typography** (expansive, condensed)

## Potential Topic List
  I have a doc somewhere that lays this out, but as a first pass...
  - NLL
  - QT3
  - IQT3
  - 3D chess
  - QTP
  - Fast hierarchy
  - Fast calculus
  - Absurd numbers
  - FTL
  - NTR
  - etc. etc. etc.
  Even I get lost.
