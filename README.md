# ParadigmSage - Project Notes
  Notes on intent, structure, and non-obvious decisions for the ParadigmSage site.

## Intent
  Capture architectural intent, non-obvious decisions, and rejected alternatives so I don’t re-derive them later.

## Content Structure
  Hugo based.
  Content and nav layouts behave like orthogonal axes in the hypercube programming idiom.

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
    hugo server --disableFastRender --buildFuture
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

  ### 2. Extract Figures (DEPRECATED)
    Open in word, select figure, right click "Save as Picture...".
    Replace the asset line from the pandoc conversion.
      ```
      <img
        src="/paradigmsage/assets/pop/ch/media/ch-0N-portent.png"
        alt="Portent N — <title>"
        style="width: 100%; height: auto;"
      />
      ```

  ### 3. Extract Equations (DEPRECATED)
    yada

## Development Plan (1/14/26)
  1. Pre-publish PoP Ch 3 for the 19th (PDF-first, staged).
  2. Review Ch 1–3 vs WORK-INVENTORY, asking only:
      “What is demanded, not what is interesting?”
  3. Fix nav issues as infrastructure, not as content support.
  4. Demote QT3 to a nav stress test, not reader-facing activation.
  5. Create one branch per inventory item, explicitly marked as:
      exploratory
      supporting
      or dormant
  6. Merge branches only when a PoP chapter requires them, never earlier.

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

### See the Work Inventory Page
  It provides a more indepth capture.

## Unix Commands
  ```
  wc -l $(find . -type f)
  grep
  ```

## Auto Publish Isn't
  Requires a post date commit to publish.
  Post date commit to force publish - 1/26/26.

## 3D Engine for 3D Chess
  AI recommended three.js.

