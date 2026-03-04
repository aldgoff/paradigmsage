---
title: "Call Structure"
---

**Call Structure**

## MVC
  Capture the call structure so I can refactor deprecated code out of here.

    | Controller              | Model                                                 | View                  |
    | :---------------------- | :---------------------------------------------------- | :-------------------- | 
    | handleNewGame()         | process.newGame()                                     | view.updateView()     |
    |                         |   analyzeStateString(modelGetStateString())           |                       |
    | handleLoad(stateString) | process.loadGame(stateString)                         | view.updateView()     |
    |                         |   process.tokenize(stateString)                       |                       |
    |                         |   structure.processStateString(modelGetStateString()) |                       |
    |                         |   process.getLastMoveType(stateString)                |                       |
    |                         |   process.getLastMoveType(modelGetStateString())      |                       |

## Controller

    | controller.js (export) | controller.js (local)        |
    | :--------------------- | :--------------------------- | 
    | initController()       | handleButtonRelease(button)  |
    |                        | handleNewGame()              |
    |                        | handleRerun()                |
    |                        | handleUndo()                 |
    |                        | handleRedo()                 |
    |                        | handleLoad()                 |
    |                        | handleHelp()                 |
    |                        | handleSquareCellClick(event) |
    |                        | positionStateStringBox()     |

## Model

    | model.js (export)         | model.js (local)                              |
    | :------------------------ | :-------------------------------------------- | 
    | modelSetStateString(str)  | validStateString(stateString)                 |
    | modelGetStateString()     | processStateChange(str)                       |
    | modelSetStatusString(str) | updateStateObjects(stateString)               |
    | modelGetStatusString()    | updateStatusString(stateString, stateObjects) |
    | modelSetErrorString(str)  |                                               |
    | modelGetErrorString()     |                                               |

    | process.js (export)            | process.js (local)                            |
    | :----------------------------- | :-------------------------------------------- | 
    | newGame()                      | buildEntanglementNetwork(move)                |
    | loadGame(stateString)          | isDegenerateLastMove(stateString, state)      |
    | processString(moves)           | isReClickSpooky(stateString, state, intent)   |
    | processClick(intent)           | isSpooky(stateString, state)                  |
    |                                | isPlacement(stateString, state)               |
    |                                | isCollapse(stateString, state)                |
    |                                | selfCollapseLastMove(state, intent)           |

    | structure.js (export)                      | structure.js (local)  |
    | :----------------------------------------- | :-------------------- | 
    | processStateString(stateString)            |                       |
    | parsePlacements(stateString)               |                       |
    | buildSquareMap(placements, collapsedMoves) |                       |
    | isSquareClassical(stateString, squareNum)  |                       |

    | parse.js (export)                 | parse.js (local)      |
    | :-------------------------------- | :-------------------- | 
    | parseStateTranscript(stateString) |                       |
    | parseSpookyMove(moveString)       |                       |
    | parsePlacementMove(moveString)    |                       |
    | parseLoopMove(moveString)         |                       |
    | parseCollapseMove(moveString)     |                       |
    | parseDegenerateMove(moveString)   |                       |
    | parseScoreBlock(scoreString)      |                       |

    | tokens.js (export)    | tokens.js (local)               |
    | :-------------------- | :------------------------------ | 
    | tokenize(stateString) | extractScore(working)           |
    |                       | assembleTruncatedString(tokens) |

    | collapse.js (export)                                      | collapse.js (local) |
    | :-------------------------------------------------------- | :------------------ | 
    | cellInLoop(intent, placements, cycleMoves)                |                     |
    | computeCollapseResolution(place, cycle, stem, tMove, tSq) |                     |

    | cycles.js (export)                                             | cycles.js (local)     |
    | :------------------------------------------------------------- | :-------------------- | 
    | buildGraph(placements)                                         |                       |
    | findPath(graph, start, target, visited = new Set(), path = []) |                       |
    | extractCycle(path, placements, pendingMove)                    |                       |
    | movesForEdge(placements, x, y)                                 |                       |
    | extractStems(graph, backboneNodes, placements, cycleMoves)     |                       |

    | scoring.js (export)        | scoring.js (local)                   |
    | :------------------------- | :----------------------------------- | 
    | hasLegalMoves(stateString) | extractClassicalSquares(stateString) |
    | evaluateGame(stateString)  | detectWinningLines(classicalMap)     |
    |                            | computeScoreFromWins(wins)           |
    |                            | isBoardExhausted(stateString)        |

    | analyzeStateString.js (export)                 | analyzeStateString.js (local)                      |
    | :--------------------------------------------- | :------------------------------------------------- | 
    | analyzeStateString(stateString)                | emptyAnalysis()                                    |
    | parseHalfState(state)                          | invariant(message, condition)                      |
    | countSpookyMoves(state)                        | parseState(state)                                  |
    | countMoves(state)                              | trackProgress(stateString, moves, counts, outcome) |
    | countEntanglements(placements, collapsedMoves) |                                                    |
    | countCyclics(placements, collapsedMoves)       |                                                    |
    | countStructures(state)                         |                                                    |
    | listPlacementsWithCollapse(stateString)        |                                                    |
    | getLastMove(stateString)                       |                                                    |
    | getLastMoveType(stateString)                   |                                                    |

    | template.js (export)  | template.js (local)   |
    | :-------------------- | :-------------------- | 
    |                       |                       |
    |                       |                       |

## View

    | view.js (export)          | view.js (local)                                   |
    | :------------------------ | :------------------------------------------------ | 
    | initView()                | render()                                          |
    | updateView()              | drawLayoutBounds(layout = QT3_LAYOUT)             |
    | setViewControlHandler(fn) | installPointerHandlers()                          |
    | setSquareHandler(fn)      | getCanvasCoords(e)                                |
    | setStateString(str)       | drawBoardGrid(layout)                             |
    | setStatusString(str)      | drawSquareNumbers(layout)                         |
    |                           | handleSquareClicks(x, y)                          |
    |                           | drawStateString(stateString)                      |
    |                           | drawStatusString(errorText, statusText)           |
    |                           | drawWrappedText(text, x, y, maxWidth, lineHeight) |

    | controlsView.js (export) | controlsView.js (local)      |
    | :----------------------- | :--------------------------- | 
    | setButtonHandler(fn)     | drawButton(button, isActive) |
    | function drawButtons()   | hitButtonQ(x_pt, y_pt)       |
    | handlePointerDown(x, y)  |                              |
    | handlePointerMove(x, y)  |                              |
    | handlePointerUp(x, y)    |                              |

    | ensemble.js (export)      | ensemble.js (local)                         |
    | :------------------------ | :------------------------------------------ | 
    | drawBounds(x, y)          | drawClassicalGame(moves, X, Y)              |
    | drawEnsemble(stateString) | indexToCoord(index, turns)                  |
    | drawBackground(x, y)      | drawPruned(x, y)                            |
    | drawLines(x, y)           | drawCollapsed(x, y)                         |
    | drawGame(x, y, moves)     | generateClassicalEnsemble(stateString)      |
    |                           | applyMark(board, index, player)             |
    |                           | applyCollapsePruning(ensemble, stateString) |

    | listing.js (export)                       | listing.js (local)                      |
    | :---------------------------------------- | :-------------------------------------- | 
    | drawQuantumListing(layout, stateString)   | setGlobalListStyles()                   |
    | drawClassicalListing(layout, stateString) | drawTitle(layout, title)                |
    |                                           | drawHeader(layout, header)              |
    |                                           | drawMoveNums(layout)                    |
    |                                           | drawQuantumMoves(layout, stateString)   |
    |                                           | drawClassicalMoves(layout, stateString) |

    | moves.js (export)      | moves.js (local)                                       |
    | :--------------------- | :----------------------------------------------------- | 
    | drawMoves(stateString) | parsePlacements(stateString)                           |
    |                        | separateResolvedAndUnresolved(placements, stateString) |
    |                        | assignComponentColors(unresolved)                      |
    |                        | overrideCycleColors(stateString, moveColorMap)         |
    |                        | drawSpookyMarks(unresolved, colorMap)                  |
    |                        | drawClassicalMarks(placements, stateString)            |

