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
  Release is manual by explicit merging of the stage branch on the day of publication.
  In the case of PoP, stage one is empty, as this workflow was not established yet,
  but I want the full sequence to be obvious.

## User Experience
  UX should be ultra clear; you are here, by topic, by post, by concept.
  Make it easy for the Intrepid Reader to revisit site without getting lost with a clear idea of what is new.

## Architectural Invariants
  - Nav must encode "where amI?" unambiguously.
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
