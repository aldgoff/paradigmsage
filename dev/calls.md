---
title: "Call Structure"
---

**Call Structure**

## MVC
  Capture the call structure so I can refactor deprecated code out of here.

    | Controller                   | Model                                                   | View                  |
    | :--------------------------- | :------------------------------------------------------ | :-------------------- | 
    | handleNewGame()              | process.newGame()                                       | view.updateView()     |
    |                              |   state = analyzeStateString(modelGetStateString())     |                       |
    |                              |                                                         |                       |
    | handleLoad(stateString)      | process.loadGame(stateString)                           | view.updateView()     |
    |                              |   tokens = process.tokenize(stateString)                |                       |
    |                              |   tokenString = tokensToString(tokens);
    |                              |   structure.processStateString(modelGetStateString())   |                       |
    |                              |     parseStateTranscript(stateString)                   |                       |
    |                              |     parsePlacementMove(move.change)                     |                       |
    |                              |     parseLoopMove(move.change)                          |                       |
    |                              |     buildGraph(placements)                              |                       |
    |                              |     findPath(graph, parse.sq1, parse.sq2)               |                       |
    |                              |     extractCycle(path, placements, parse.turn);         |                       |
    |                              |     extractStems(graph, path, placements, cycleMoves)   |                       |
    |                              |     parseCollapseMove(move.change)                      |                       |
    |                              |     computeCollapseResolution(...)                      |                       |
    |                              |     parseDegenerateMove(move.change)                    |                       |
    |                              |     parseScoreBlock(move.change)                        |                       |
    |                              |     state = analyzeStateString(modelGetStateString())   |                       |
    |                              |   process.getLastMove(stateString)                      |                       |
    |                              |   process.getLastMoveType(modelGetStateString())        |                       |
    |                              |                                                         |                       |
    | handleSquareCellClick(event) | process.processClick(intent)                            |                       |
    |                              |   state = analyzeStateString(modelGetStateString())     |                       |
    |                              |   evaluateGame(state).over                              |                       |
    |                              |   isSquareClassical(modelGetStateString(), squareNum)   |                       |
    |                              |   isDegenerateLastMove(modelGetStateString(), state)    |                       |
    |                              |   isReClickSpooky(modelGetStateString(), state, intent) |                       |
    |                              |   isSpooky(modelGetStateString(), state)                |                       |
    |                              |   isPlacement(modelGetStateString(), state)             |                       |
    |                              |   isCollapse(modelGetStateString(), state)              |                       |
    |                              |                                                         |                       |

## Controller

    | controller.js (export) | controller.js (local)        | process.js                                              |
    | :--------------------- | :--------------------------- | :------------------------------------------------------ | 
    | initController()       | handleButtonRelease(button)  |                                                         |
    |                        | handleNewGame()              |                                                         |
    |                        | handleRerun()                |                                                         |
    |                        | handleUndo()                 |                                                         |
    |                        | handleRedo()                 |                                                         |
    |                        | handleLoad()                 |                                                         |
    |                        | handleHelp()                 |                                                         |
    |                        | handleSquareCellClick(event) | processClick(intent)                                    |
    |                        | positionStateStringBox()     |   state = analyzeStateString(modelGetStateString())     |
    |                        |                              |   evaluateGame(state).over                              |
    |                        |                              |   isSquareClassical(modelGetStateString(), squareNum)   |
    |                        |                              |   isDegenerateLastMove(modelGetStateString(), state)    |
    |                        |                              |   isReClickSpooky(modelGetStateString(), state, intent) |
    |                        |                              |   isSpooky(modelGetStateString(), state)                |
    |                        |                              |   isPlacement(modelGetStateString(), state)             |
    |                        |                              |   isCollapse(modelGetStateString(), state)              |

## Model
    | model.js (export)         | model.js (local)                              |
    | :------------------------ | :-------------------------------------------- | 
    | modelSetStateString(str)  |                                               |
    | modelGetStateString()     |                                               |
    | modelSetStatusString(str) |                                               |
    | modelGetStatusString()    |                                               |
    | modelSetErrorString(str)  |                                               |
    | modelGetErrorString()     |                                               |

    | process.js (export)            | process.js (local)                            |
    | :----------------------------- | :-------------------------------------------- | 
    | newGame()                      | isGameOver(stateString)                       |
    | loadGame(stateString)          | isSquareClassical(stateString, squareNum)     |
    | processClick(intent)           | isDegenerateLastMove(stateString, state)      |
    |                                | isReClickSpooky(stateString, state, intent)   |
    |                                | isSpooky(stateString, state)                  |
    |                                | isPlacement(stateString, state)               |
    |                                | isCollapse(stateString, state)                |
    |                                | selfCollapseLastMove(state, intent)           |

    | structure.js (export)                      | structure.js (local)  |
    | :----------------------------------------- | :-------------------- | 
    | processStateString(stateString)            |                       |
    | parsePlacements(stateString)               |                       |
    | buildSquareMap(placements, collapsedMoves) |                       |

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

    | statusMsgs.js (export)   | statusMsgs.js (local) |
    | :----------------------- | :-------------------- | 
    | ERROR = Object.freeze()  |                       |
    | STATUS = Object.freeze() |                       |

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
    | drawMoves(stateString) | separateResolvedAndUnresolved(placements, stateString) |
    |                        | assignComponentColors(unresolved)                      |
    |                        | overrideCycleColors(stateString, moveColorMap)         |
    |                        | drawSpookyMarks(unresolved, colorMap)                  |
    |                        | drawClassicalMarks(placements, stateString)            |

### 3.2 Miracles
  If the universe is game like, physics cannot rule out miracles.
  They do not require suspension of the laws of physics, merely a change in intent from active agents.
  The rules have not changed, only intent has.
  The change can be strategic, global, local, permanent, temporary, or idosyncratic.
  But in all cases, the change appears **discontinuous**.
