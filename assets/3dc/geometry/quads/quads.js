/* File: quads.js
  Path: ./3dc/geometry/quads/quads.js
  Purpose: Access to quad numbers, planes, and ray pairs.
  Author: Allan Goff
  Date: 3/26/26
  Recommended access: import * as quads from "../../geometry/quads/quads.js";
  UI: the export functions.
*/

// --- Load module ---
import quadsData from "./quads.json" assert { type: "json" };
  const quadsModule     = quadsData.quads_module;
  export const planeQuadTable  = quadsModule.planeQuadTable;
// Seampoint: more objects...

// --- Dependencies ---
  import * as rays from "../../foundation/rays/rays.js";
// Seampoint: more imports..

const Q_MIN = 1;    // Note the hard coding, not in the json file.
const Q_MAX = 60;

// --- UI ---  
export function pqrTable(Q) { // 1 - 60.
  // returns: { piece, plane, quad:{globalQ,pieceQ,planeQ,rayPair:[r1,r2],quadType,nickname} }.
  const globalQ = Q;

  for (const plane of planeQuadTable) {
    const [lo, hi] = plane.global_range;

    if (globalQ < lo || hi < globalQ) continue;  // Fast reject.
  
    for (const quad of plane.quads) {  // Scan quads in this plane for a match.
      if (quad.globalQ === globalQ) {
        return {  // { piece, plane, quad:{globalQ,pieceQ,planeQ,rayPair:[r1,r2],quadType,nickname} }.
          piece: plane.piece,
          plane: plane.plane,
          ...quad
        };
      }
    }
  }

  throw new Error(`Global quad ${globalQ} not found`);

  // returned: { piece, plane, quad:{globalQ,pieceQ,planeQ,rayPair:[r1,r2],nickname} }.
  }

export function elementsToGlobalQ({ piece, plane, pieceQ, planeQ, rayPair, nickname }) {
  return elementsToQuad({ piece, plane, pieceQ, planeQ, rayPair, nickname });
  }

export function nextQuadInPlane(q) {
  const Q = toQ(q);

  for (const planeRec of planeQuadTable) {
    const quads = planeRec.quads;
    const idx = quads.findIndex(qr => qr.globalQ === Q);

    if (idx !== -1) {
      return quads[(idx + 1) % quads.length].globalQ;
    }
  }

  throw new Error(`nextQuadInPlane: invalid quad ${q}`);
  }

export function prevQuadInPlane(q) {
  const Q = toQ(q);

  for (const planeRec of planeQuadTable) {
    const quads = planeRec.quads;
    const idx = quads.findIndex(qr => qr.globalQ === Q);

    if (idx !== -1) {
      return quads[(idx - 1 + quads.length) % quads.length].globalQ;
    }
  }

  throw new Error(`prevQuadInPlane: invalid quad ${q}`);
}

export function quadToQuadType(q) {
  const Q = toQ(q);
  const rec = pqrTable(Q);

  // Only duke defines quadType
  if (rec.piece !== "duke") {
    return null;
  }

  return rec.quadType || null;
}

// Representation Conversion Routines:
export function strToQ(str) { // Range: "Q1"-"Q60" → 1-60.
  if (typeof str !== "string") {
    throw new Error("strToQ: input must be a string");
  }

  if (!str.startsWith("Q")) {
    throw new Error(`strToQ: invalid format "${str}" (missing 'Q' prefix)`);
  }

  const num = Number(str.slice(1));

  if (!Number.isInteger(num)) {
    throw new Error(`strToQ: invalid numeric value in "${str}"`);
  }

  if (num < Q_MIN || num > Q_MAX) {
    throw new Error(`strToQ: out of range (${num})`);
  }

  return num;
  }

export function qToStr(q) { // Range: 1-60 → "Q1"-"Q60".
  if (!Number.isInteger(q)) {
    throw new Error(`qToStr: input must be an integer, got ${q}`);
  }

  if (q < Q_MIN || q > Q_MAX) {
    throw new Error(`qToStr: out of range (${q})`);
  }

  return `Q${q}`;
}

// Quad to element routines:
export function quadToPiece(q) { // 1-60 → piece (rook, bishop, duke).
  const Q = toQ(q);
  const res = pqrTable(Q);
  return res.piece;
  }

export function quadToPlane(q) { // 1-60 → plane (13 possibilities).
  const Q = toQ(q);
  const res = pqrTable(Q);
  return res.plane;
  }

export function quadToPieceQuad(q) { // 1-60 → piece-local index (1-12, 1-24).
  const Q = toQ(q);
  const res = pqrTable(Q);
  return res.pieceQ;
  }

export function quadToPlaneQuad(q) { // 1-60 → plane-local index (1-4, 1-6).
  const Q = toQ(q);
  const res = pqrTable(Q);
  return res.planeQ;
  }

export function quadToRayPair(q) { // 1-60 → ray pair.
  const Q = toQ(q);
  const res = pqrTable(Q);
  return res.rayPair;
  }

export function quadToNickname(q) { // 1-60 → nickname.
  const Q = toQ(q);
  const res = pqrTable(Q);
  return res.nickname;
}

export function findDuplexFaceQuad(faceQuad) {

  const Q = toQ(faceQuad);

  const rec = pqrTable(Q);

  if (rec.piece !== "duke") {
    throw new Error(
      `findDuplexFaceQuad: ${Q} is not a duke quad`
    );
  }

  if (rec.quadType !== "face") {
    throw new Error(
      `findDuplexFaceQuad: ${Q} is not a face quad`
    );
  }

  const [r1, r2] = rec.rayPair;

  const v1 = rays.getRayVector(r1);
  const v2 = rays.getRayVector(r2);

  const apex = [
    v1[0] + v2[0],
    v1[1] + v2[1],
    v1[2] + v2[2]
  ];

  const dukeQuads = pieceToQuads("duke");

  for (const q of dukeQuads) {

    if (q === Q) continue;

    const qr = pqrTable(q);

    if (qr.quadType !== "face") continue;

    const [s1, s2] = qr.rayPair;

    const w1 = rays.getRayVector(s1);
    const w2 = rays.getRayVector(s2);

    const candidate = [
      w1[0] + w2[0],
      w1[1] + w2[1],
      w1[2] + w2[2]
    ];

    if (
      apex[0] === candidate[0] &&
      apex[1] === candidate[1] &&
      apex[2] === candidate[2]
    ) {
      return q;
    }
  }

  throw new Error(
    `findDuplexFaceQuad: no companion found for ${Q}`
  );
}

// Element to quad routines:
export function pieceToQuad(piece, pieceQ) {  // Range of pieceQ: rook 1–12, bishop 1–24, duke 1–24.
  if (!Number.isInteger(pieceQ)) {
    throw new Error(`pieceToQuad: invalid pieceQ (${pieceQ})`);
  }

  for (const planeRec of planeQuadTable) {
    if (planeRec.piece !== piece) continue;

    for (const quadRec of planeRec.quads) {
      if (quadRec.pieceQ === pieceQ) {
        return quadRec.globalQ;
      }
    }
  }

  throw new Error(`pieceToQuad: no match for piece "${piece}" with pieceQ ${pieceQ}`);
  }

export function planeToQuad(plane, planeQ) {  // Range of planeQ: rook 1–4, bishop 1–6, duke 1–4.
  if (!Number.isInteger(planeQ)) {
    throw new Error(`planeToQuad: invalid planeQ (${planeQ})`);
  }

  for (const planeRec of planeQuadTable) {
    if (planeRec.plane !== plane) continue;

    for (const quadRec of planeRec.quads) {
      if (quadRec.planeQ === planeQ) {
        return quadRec.globalQ;
      }
    }
  }

  throw new Error(`planeToQuad: no match for plane "${plane}" with planeQ ${planeQ}`);
  }

export function pieceQuadToQuad(piece, pieceQ) {
  return elementsToQuad({ piece, pieceQ });
  }

export function planeQuadToQuad(plane, planeQ) {
  return elementsToQuad({ plane, planeQ });
  }

export function rayPairToQuad(rayPair) {
  validateRayPair(rayPair);
  return elementsToQuad({ rayPair });
  }

export function nicknameToQuad(nickname) {
  return elementsToQuad({ nickname });
}

// Element to quads routines:
export function pieceToQuads(piece) {
  const result = [];

  for (const planeRec of planeQuadTable) {
    if (planeRec.piece !== piece) continue;

    for (const quadRec of planeRec.quads) {
      result.push(quadRec.globalQ);
    }
  }

  if (result.length === 0) {
    throw new Error(`pieceToQuads: no quads for piece "${piece}"`);
  }

  return result;
  }

export function planeToQuads(plane) {
  const result = [];

  for (const planeRec of planeQuadTable) {
    if (planeRec.plane !== plane) continue;

    for (const quadRec of planeRec.quads) {
      result.push(quadRec.globalQ);
    }
  }

  if (result.length === 0) {
    throw new Error(`planeToQuads: no quads for plane "${plane}"`);
  }

  return result;
}
// Seampoint: more global functions...

// --- Helpers ---
function toQ(input) {
  if (typeof input === "string") return strToQ(input);
  if (Number.isInteger(input)) {
    if (input < Q_MIN || input > Q_MAX) {
      throw new Error(`toQ: out of range (${input})`);
    }
    return input;
  }
  throw new Error(`toQ: invalid input (${input})`);
  }

function validateRayPair(rayPair) {
  if (!Array.isArray(rayPair) || rayPair.length !== 2) {
    throw new Error(`Invalid rayPair: ${rayPair}`);
  }
  }

function elementsToQuad({ piece, plane, pieceQ, planeQ, rayPair, nickname }) {
  for (const planeRec of planeQuadTable) {
    if (piece && planeRec.piece !== piece) continue;
    if (plane && planeRec.plane !== plane) continue;

    for (const quadRec of planeRec.quads) {
      if (pieceQ != null && quadRec.pieceQ !== pieceQ) continue;
      if (planeQ != null && quadRec.planeQ !== planeQ) continue;
      if (rayPair != null) {
        if (
          quadRec.rayPair[0] !== rayPair[0] ||
          quadRec.rayPair[1] !== rayPair[1]
        ) continue;
      }
      if (nickname != null && quadRec.nickname !== nickname) continue;

      return quadRec.globalQ;
    }
  }

  throw new Error(`elementsToQuad: no match found`);
}
// Seampoint: more local functions...

// --- Helpers ---
// Seampoint: more local functions...

