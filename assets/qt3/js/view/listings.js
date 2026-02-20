// qt3/view/listings.js

import { QT3_LAYOUT } from "../layout.js";
import { analyzeStateString } from "../model/analyzeStateString.js";
import { listPlacementsWithCollapse } from "../model/analyzeStateString.js";

const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

function setGlobalListStyles() {
  ctx.setLineDash([0, 0]);
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#000";
  ctx.font = "16px sans-serif";
}
function drawTitle(layout, title) {
  setGlobalListStyles();

  // Bound box for title.
  ctx.strokeRect(layout.title.x, layout.title.y, layout.title.w, layout.title.h); 
  ctx.fillText(title, layout.title.x + 7, layout.title.y + 19);
  }
function drawHeader(layout, header) {
  setGlobalListStyles();

  // Shorthand for layout elements.
  let row = layout.header;
  let x_offset = row.h;
  let o_offset = row.h + row.w;

  // X - Classical.
  ctx.strokeRect(row.x, row.y, row.h, row.h);
  ctx.fillText('X', row.x + 9, row.y + 20);
  ctx.strokeRect(row.x + x_offset, row.y, row.w, row.h);
  ctx.fillText(header, row.x + x_offset + 8, row.y + 20);

  // O - Classical.
  ctx.strokeRect(row.x + o_offset, row.y, row.h, row.h);
  ctx.fillText('O', row.x + o_offset + 8, row.y + 20);
  ctx.strokeRect(row.x + x_offset + o_offset, row.y, row.w, row.h);
  ctx.fillText(header, row.x + x_offset + o_offset + 8, row.y + 20);
  }
function drawMoveNums(layout) {
  setGlobalListStyles();

  // Shorthand for layout elements.
  let row = layout.rows;
  let sep = row.h;

  for(let i=1; i<=9; i+=2) { // X moves.
    ctx.strokeRect(row.x, row.y + (i-1)*(sep/2), row.h, row.h);
    ctx.fillText(i, row.x + 10, row.y + (i-1)*(sep/2) + 19);
    ctx.strokeRect(row.x + row.h, row.y + (i-1)*(sep/2), row.w, row.h);
  }
  let o_offset = row.w + row.h;
  for(let i=2; i<=8; i+=2) { // O moves.
    ctx.strokeRect(row.x + row.w+row.h, row.y + (i-2)*(sep/2), row.h, row.h);
    ctx.fillText(i, row.x + row.w+row.h + 10, row.y + (i-2)*(sep/2) + 19);
    ctx.strokeRect(row.x + row.h + o_offset, row.y + (i-2)*(sep/2), row.w, row.h);
  }
  }
function drawQuantumMoves(layout, stateString) {
  setGlobalListStyles();
  let state = analyzeStateString(stateString);  
  const moves = listPlacementsWithCollapse(stateString); //  sq1: p.sq1, sq2: p.sq2, collapse

  let row = layout.rows;  // Graphical layout.
  let sep = 0;
  let xory = 1;
  let offset = 0;

  for(const move of moves) {  // For each move.
    let symbol = "";
    if(     move.collapse === 'none')  {  symbol = "---"; }
    else if(move.collapse === 'left')  {  symbol = "<<"; }
    else if(move.collapse === 'right') {  symbol = ">>"; }
    else { /* TODO: How to throw an exception? */ }

    if (xory%2) {           // X moves.
      offset = 0;
      ctx.fillText(`${move.sq1} ${symbol} ${move.sq2}`, row.x + row.h + offset + 12, row.y + sep + 19);
    } 
    else {                  // O moves.
      offset = row.w + row.h;
      ctx.fillText(`${move.sq1} ${symbol} ${move.sq2}`, row.x + row.h + offset + 12, row.y + sep + 19);
      sep += row.h;
    }
    xory += 1;
  }
  }

function drawClassicalMoves(layout, stateString) {
  setGlobalListStyles();
  let state = analyzeStateString(stateString);
  
  const moves = listPlacementsWithCollapse(stateString); //  sq1: p.sq1, sq2: p.sq2, collapse

  let row = layout.rows;  // Graphical layout.
  let sep = 0;
  let xory = 1;
  let offset = 0;

  for(const move of moves) { // For each move.
    let symbol = "";
    if(     move.collapse === 'none')  {  symbol = "-"; }
    else if(move.collapse === 'left')  {  symbol = move.sq1; }
    else if(move.collapse === 'right') {  symbol = move.sq2; }
    else { /* TODO: How to throw an exception? */ }

    if (xory%2) {    // X moves.
      offset = 0;
      ctx.fillText(`    ${symbol}`, row.x + row.h + offset + 12, row.y + sep + 19);
    } 
    else {           // O moves.
      offset = row.w + row.h;
      ctx.fillText(`    ${symbol}`, row.x + row.h + offset + 12, row.y + sep + 19);
      sep += row.h;
    }
    xory += 1;
  }
}

export function drawQuantumListing(layout, stateString) {
  drawTitle(layout, "       Quantum Moves");
  drawHeader(layout, "Spooky");
  drawMoveNums(layout);
  drawQuantumMoves(layout, stateString);
  }
export function drawClassicalListing(layout, stateString) {
  drawTitle(layout, "       Classical Moves");
  drawHeader(layout, "  Move");
  drawMoveNums(layout);
  drawClassicalMoves(layout, stateString);
}

