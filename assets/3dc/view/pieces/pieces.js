/* File: pieces.js
  Path: ./3dc/view/pieces/pieces.js
  Purpose: desc
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as vPieces from "../../view/pieces/pieces.js";
  UI: the export functions.
*/

// --- Load JSON ---
import piecesData from "./pieces.json" assert { type: "json" };
  const piecesModule = piecesData.pieces_module;
  
  const materials = piecesModule.materials;
  const white     = materials.white;
  const black     = materials.black;
  const clickSize = piecesModule.clickSize;
  
  const rook   = piecesModule.rook;
  const bishop = piecesModule.bishop;
  const duke   = piecesModule.duke;
  const stack  = piecesModule.stack;
  const queen  = piecesModule.queen;
  const knight = piecesModule.knight;
  const pawn   = piecesModule.pawn;
  const king   = piecesModule.king;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as utils   from "../../../utils/utils.js";

  import * as planes  from "../../geometry/planes/planes.js";
  import * as coords  from "../../foundation/coords/coords.js";
  import * as cViewer from "../../controller/viewer/viewer.js";
  import * as mPieces from "../../model/pieces/pieces.js";
  import * as mTrays  from "../../model/trays/trays.js";
  import * as mBoards from "../../model/boards/boards.js";

  import * as view       from "../../view/view.js";
  import * as coordsMaps from "../render/coordsMaps.js"
  import * as tiles      from "../../view/tiles/tiles.js";
// Seampoint: more imports...

// --- Globals ---
  const THREE = window.THREE;
  let currPiecesGroup = null;
  const pieceGroups = {};
// Seampoint: more globals...

// --- UI ---
export function initPieces(pieceList) {
  console.log("view : pieces.js - initPieces()");

  currPiecesGroup = new THREE.Group();

  // const pieces = mPieces.getPieceList();  // { loc: "~", pos: "QR1,1", coords: [k,1,1] };

  for(const key in pieceList) {      // "WKRR", ...
    const group = createPiece(key);
    pieceGroups[key] = group;
    placePieceInTray(key);    // Pieces start in the trays.
    currPiecesGroup.add(group);
    // renderPiece(key);
  }  
  // console.log("view : pieces.js - initPieces(): currPiecesGroup", currPiecesGroup);

  view.context.scene.add(currPiecesGroup);
  }
  
export function placePieceInTray(key) {      // "WKRR", ...
  // console.log("view : pieces.js - placePieceInTray(key)", key);
  // placePiece(key);
  // return;

  const piece = mPieces.getPieceList()[key];              // Arg validation.
  if(!piece) throw Error(`No such piece ${key}.`);

  const { loc, pos, coords, vts, home } = piece;                     // Parse location.
  const player = key[0];  // W|B.                         // Parse arg.

  const group = pieceGroups[key];                         // Fetch the mesh (group).
  group.userData.vts = home.trayVts;

  const tileSize = tiles.tileSize();                      // Place just above tile.
  const tileHeight = tileSize[0];  // Z.
  const zOffset = tileHeight/2;
  const decoratorGap = 2;
  const grid2 = coordsMaps.vts2pixels(group.userData.vts)

  // console.log("*** position: ", grid2[0], grid2[1]+zOffset+decoratorGap, grid2[2]); // Debug instrumention.

  group.position.set(grid2[0], grid2[1]+zOffset+decoratorGap, grid2[2]);
  }

export function placePiece(key) {      // "WKRR", ...
  // console.log("view : pieces.js - placePiece(key)", key);

  const piece = mPieces.getPieceList()[key];              // Arg validation.
  if(!piece) throw Error(`No such piece ${key}.`);

  const { loc, pos, coords } = piece;                     // Parse location.
  const player = key[0];  // W|B.                         // Parse arg.

  const group = pieceGroups[key];                         // Fetch the mesh (group).

  if(     loc === "~") {                                  // Place in tray.
    let gap = cViewer.getTrayGap() + 2; // Tray offset from board with zero gap.
    group.userData.vts = tileToVts(player, pos, gap);
    }
  else if(loc === "@") {                                  // Place on board.
    group.userData.vts = tileToVts(player, pos, 0);
    }
  else {
    throw new Error(`Piece ${key} was neither on board, nor in a tray.`);
  }

  const tileSize = tiles.tileSize();                      // Place just above tile.
  const tileHeight = tileSize[0];  // Z.
  const zOffset = tileHeight/2;
  const decoratorGap = 2;
  const grid2 = coordsMaps.vts2pixels(group.userData.vts)

  // console.log("*** position: ", grid2[0], grid2[1]+zOffset+decoratorGap, grid2[2]); // Debug instrumention.

  group.position.set(grid2[0], grid2[1]+zOffset+decoratorGap, grid2[2]);
  console.log("*** Piece moved to", loc, pos, "coords:", coords, "vts:", group.userData.vts);
}

export function renderPiece(key) {  // "WKRR".  // Deprecated.
  // console.log("view : pieces.js - renderPiece(key)", key);

  const piece = mPieces.getPieceList()[key];              // Arg validation.
  if(!piece) throw Error(`No such piece ${key}.`);

  const { loc, pos, coords } = piece;                     // Parse args.
  const player = key[0];  // W|B.
  const side   = key[1];  // K|Q.
  const level  = key[2];  // R|N|B|Q|K.
  const type   = key[3];  // R|B|D|S|Q|N|P|U|K.

  if(     loc === "~") {                                  // Render in tray.
    const tray = (player === "W") 
      ? mTrays.getWhiteTray() 
      : mTrays.getBlackTray();
      const group = renderInTray(player, side, type, tray, pos);
      if(group)
        group.userData.key = key;
    }
  else if(loc === "@") {                                  // Render on board.
      renderOnBoard(player, side, type, pos);
    }
  else {
    throw new Error(`Piece ${key} was neither on board, nor in a tray.`);
  }
  }

export function derenderPiece(piece) {
  console.log("view : pieces.js - derenderPiece(piece)", piece);
  // TODO: write function derenderPiece.

  }

export function setLevelSep(levelSep) {
  console.log("view : pieces.js - setLevelSep(levelSep):", levelSep);

  if(!currPiecesGroup) return;

  view.reprojectGroup(currPiecesGroup, levelSep);
  }

export function reprojectTrayPieces(levelSep, trayGap) {
  console.log("view : pieces.js - reprojectTrayPieces(levelSep, trayGap):", levelSep, trayGap);

  if(!currPiecesGroup) return;

  const pieces = mPieces.getPieceList();

  currPiecesGroup.traverse(obj => {
    if(!obj.userData?.isPiece) return;

    const key = obj.userData.key;
    const piece = pieces[key];

    if(!piece) return;
    if(piece.loc !== "~") return;

    // Recompute canonical tray VTS.
    const player = key[0];
    const vts = tileToVts(player, piece.pos, trayGap + 2); // Tray base offset from board.
    const pixels = coordsMaps.vts2pixels(vts, levelSep);

    const tileHeight = 5;
    const zOffset = tileHeight / 2;
    const decoratorGap = 2;

    obj.position.set(
      pixels[0],
      pixels[1] + zOffset + decoratorGap,
      pixels[2]
    );

    obj.userData.vts = vts;
  });
  }

export function highlight(key) {
  console.log("view : pieces.js - highlight(key)", key);  // "WKRP" etc.

  let found = null;

  currPiecesGroup.traverse(obj => {
    if(obj.userData?.key === key)
      found = obj;
  });
  if(!found) return;

  // Highlight the piece.
  found.scale.set(clickSize, clickSize, clickSize);
  const player = key[0];
  found.traverse(obj => {
    if(obj.type === "LineSegments" ||
       obj.type === "LineLoop" ||
       obj.type === "Line") {

      (player === 'W')
      ? obj.material.color.set(white.highlight)
      : obj.material.color.set(black.highlight);
    }
  });
  }

export function deHighlight(key) {
  console.log("view : pieces.js - deHighlight(key)", key);

  let found = null;

  currPiecesGroup.traverse(obj => {
    if(obj.userData?.key === key)
      found = obj;
  });
  if(!found) return;

  // Dehighlight the piece.
  found.scale.set(1.0, 1.0, 1.0);
  const player = key[0];
  found.traverse(obj => {
    if(obj.type === "LineSegments" ||
       obj.type === "LineLoop" ||
       obj.type === "Line") {

      (player === 'W')
      ? obj.material.color.set(white.lineColor)
      : obj.material.color.set(black.lineColor);
    }
  });
}
// Seampoint: more global functions...

// --- Helpers ---
function createPiece(key) {      // "WKRR", ...
  // console.log("view : pieces.js - createPiece(key)", key);

  let group = null;                                       // Return object.

  const player = key[0];  // W|B.                         // Parse arg.
  const side   = key[1];  // K|Q.
  const level  = key[2];  // R|N|B|Q|K.
  const type   = key[3];  // R|B|D|S|Q|N|P|U|K.

  const color = (player === "W") ? white : black;
  switch(type) {
    case "R": group = makeRookObject(  {color});                break;
    case "B": group = makeBishopObject({color, player});        break;
    case "D": group = makeDukeObject(  {color, player});        break;
    case "Q": group = makeQueenObject( {color});                break;
    case "N": group = makeKnightObject({color, player, side});  break;
    case "S": group = makeStackObject( {color, player});        break;
    case "P": group = makePawnObject(  {color});                break;
    case "K": group = makeKingObject(  {color});                break;
    // Seampoint: no more pieces.
    default:
      console.log(`view : pieces.js - Unknown piece type ${type}`); return; 
      break;
  }

  if(!group) return;

  group.userData.isPiece = true;
  group.userData.key = key;

  return group;
  }

function renderInTray(player, side, type, tray, pos) {
  // console.log("view : pieces.js - renderInTray(player, type, tray, pos)", player, type, tray, pos);

  let group = null;

  const color = (player === "W") ? white : black;
  switch(type) {
    case "R": group = makeRookObject(  {color});                break;
    case "B": group = makeBishopObject({color, player});        break;
    case "D": group = makeDukeObject(  {color, player});        break;
    case "Q": group = makeQueenObject( {color});                break;
    case "N": group = makeKnightObject({color, player, side});  break;
    case "S": group = makeStackObject( {color, player});        break;
    case "P": group = makePawnObject(  {color});                break;
    case "K": group = makeKingObject(  {color});                break;
    // Seampoint: no more pieces.
    default:
      console.log(`view : pieces.js - Unknown piece type ${type}`); return; 
      break;
  }

  if(!group) return;

  group.userData.isPiece = true;

  
  const tileSize = tiles.tileSize();
  const tileHeight = tileSize[0];  // Z.
  const zOffset = tileHeight/2;
  const decoratorGap = 2;

  let gap = cViewer.getTrayGap() + 2; // Tray offset from board with zero gap.
  const vts = tileToVts(player, pos, gap);
  const grid2 = coordsMaps.vts2pixels(vts)

  group.position.set(grid2[0], grid2[1]+zOffset+decoratorGap, grid2[2]);
  group.userData.vts = vts;

  currPiecesGroup.add(group);

  return group;
  }

function tileToVts(player, pos, gap) {
  // console.log("view : pieces.js - tileToVts(player, pos, gap)", player, pos, gap);

  // TODO: tileToVts() only works for 8x8x8 boards.
  const specOrName = "8x8x8";

  let vts = coords.normalizeTileToVts(pos, specOrName); // [4,-3,-3]=>[4,-4,-4] and [-3,-3,-3]=>[-3,-4,-4]
  const displacement = (player === "W") ? [0, -gap, -gap]: [0, gap, gap];

  vts = utils.add(vts, displacement);

  return vts;
  }

function renderOnBoard(player, side, type, pos) {
  console.log("view : pieces.js - renderOnBoard(player, type, pos)", player, type, pos);

  const coords = coords.boardToVts(pos);
  // TODO: write function renderOnBoard.
}

function makeRookObject(params = {}) {
  // console.log("view : pieces.js - makeRookObject(params)", params);

  const { color } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeRookGeo(tileWidth, rook);        // Mesh.
  const mesh = createMesh(geometry, color);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  return group;
  }

function makeBishopObject(params = {}) {
  // console.log("view : pieces.js - makeBishopObject(params)", params);

  const { color, player } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeBishopGeo(tileWidth, bishop);    // Mesh.
  const mesh     = createMesh(geometry, color);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  (player === "W") 
  ? group.rotation.y = bishop.orientation*Math.PI/3         // White bishop orientation: edge points toward opponent.
  : group.rotation.y = (bishop.orientation-1.0)*Math.PI/3;  // Black bishop orientation: edge points toward opponent.

  return group;
  }

function makeDukeObject(params = {}) {
  const { color, player } = params;

  let [, tileWidth] = tiles.tileSize();

  const geometry = makeDukeGeo(tileWidth, duke);
  const mesh = createMesh(geometry, color);

  const poseGroup = new THREE.Group();
  poseGroup.rotation.y = Math.PI/4;
  poseGroup.rotation.x = Math.atan(Math.sqrt(2));
  poseGroup.add(mesh);

  const box = new THREE.Box3().setFromObject(poseGroup);
  const centerX = (box.min.x + box.max.x)/2;
  const centerZ = (box.min.z + box.max.z)/2;

  poseGroup.position.set(
    -centerX,
    -box.min.y + duke.height,
    -centerZ
  );  

  const orientationGroup = new THREE.Group();
  orientationGroup.add(poseGroup);

  (player === "W") 
  ? orientationGroup.rotation.y = (duke.orientation-1.0)*Math.PI/3  // White duke orientation: high edge points toward opponent.
  : orientationGroup.rotation.y = duke.orientation*Math.PI/3;       // Black duke orientation: high edge points toward opponent.

  return orientationGroup;
  }

function makeQueenObject(params = {}) {
  // console.log("view : pieces.js - makeQueenObject(params)", params);

  const { color } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeQueenGeo(tileWidth, queen);      // Mesh.
  const mesh     = createMesh(geometry, color);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  return group;
}

function makeKnightObject(params = {}) {
  // console.log("view : pieces.js - makeKnightObject(params)", params);

  const { color, player, side } = params;
  let [, tileWidth] = tiles.tileSize();

  const chirality = (side === "K")?  1 : -1;
  const group = makeKnightMeshGroup(tileWidth, knight, chirality, color);

  (player === "W") 
  ? group.rotation.y = (knight.orientation-1.00)*Math.PI   // White knight orientation: tail points toward player.
  : group.rotation.y = knight.orientation*Math.PI; // Black knight orientation: tail points toward player.

  return group;
  }

function makeStackObject(params = {}) {
  // console.log("view : pieces.js - makeStackObject(params)", params);

  const bishop = makeBishopObject(params);
  const duke   = makeDukeObject(params);
  duke.position.y += stack.height;

  const stackGroup = new THREE.Group();
  stackGroup.add(bishop);
  stackGroup.add(duke);

  return stackGroup;
  }

function makePawnObject(params = {}) {
  // console.log("view : pieces.js - makePawnObject(params)", params);

  const { color, side } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();   // Canonical size fills tile.

  const group = makePawnMeshGroup(tileWidth, pawn, color);

  return group;
  }

function makeKingObject(params = {}) {
  // console.log("view : pieces.js - makeKingObject(params)", params);

  const { color } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeKingGeo(tileWidth, king);        // Mesh.
  const mesh     = createMesh(geometry, color, true);

  const radius = (tileWidth * king.breadth) / 2;        // Edges.
  const height = tileWidth * king.breadth * king.aspect;
  addCylinderEdges(mesh, radius, height, color);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  return group;
}
// Seampoint: no more pieces.

// Geometries:
function makeRookGeo(tileWidth, rook) {
  const { aspect, breadth } = rook;
  const base = tileWidth * breadth;
  const height = base * aspect;
  const geometry = new THREE.BoxGeometry(base, height, base);       // Cannonical cube.
  geometry.translate(0, (height/2), 0);

  return geometry;
  }

function makeBishopGeo(tileWidth, bishop) {
  const { aspect, breadth } = bishop;
  const radius = tileWidth * breadth;
  const height = aspect * radius;
  const geometry = new THREE.ConeGeometry(radius, height, 3);       // Triangular base.
  geometry.scale(1.0, aspect, 1.0);   // Scale vertically for bishop silhouette.
  geometry.computeBoundingBox();      // Center-bottom origin invariant.
  const bbox = geometry.boundingBox;
  const yOffset = -bbox.min.y;
  geometry.translate(0, yOffset, 0);

  return geometry;
  }

function makeDukeGeo(tileWidth, duke) {
  // console.log("view : pieces.js - makeDukeGeo(tileWidth, duke)", tileWidth, duke);
  const { aspect, breadth } = duke;
  const base = tileWidth * breadth;
  const height = base * aspect;
  const geometry = new THREE.BoxGeometry(base, height, base);       // Cannonical cube.
  
  geometry.translate(0, (height/2), 0);

  return geometry;
  }

function makeQueenGeo(tileWidth, queen) {
  const { aspect, breadth } = queen;

  const radius = tileWidth * breadth;
  const height = radius * aspect;

  const shape = new THREE.Shape();

  const pts = [];

  for(let i=0; i<6; i++) {
    const outerAngle = (i * Math.PI)/3;
    const innerAngle = outerAngle + Math.PI/6;

    pts.push( new THREE.Vector2(
        radius * Math.cos(outerAngle),
        radius * Math.sin(outerAngle))
    );
    pts.push( new THREE.Vector2(
        (radius * queen.starRatio) * Math.cos(innerAngle),
        (radius * queen.starRatio) * Math.sin(innerAngle))
    );
  }

  shape.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => shape.lineTo(p.x, p.y));
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });

  geometry.rotateX(Math.PI/2);
  geometry.computeBoundingBox();

  const box = geometry.boundingBox;
  geometry.translate(0, -box.min.y, 0);

  return geometry;
  }

function makeKingGeo(tileWidth, king) {
  const { aspect, breadth } = king;

  // --- Canonical dimensions ---
  const radius = (tileWidth * breadth) / 2;
  const height = tileWidth * breadth * aspect;

  // --- Primitive geometry ---
  const geometry = new THREE.CylinderGeometry(
    radius,   // top radius
    radius,   // bottom radius
    height,
    32        // radial segments
  );

  // --- Center-bottom origin invariant ---
  geometry.translate(0, height/2, 0);

  return geometry;
}

// Groups:
function makeKnightMeshGroup(tileWidth, knight, chirality = 1, color) {
  const { breadth } = knight;

  const cubeSize = tileWidth * breadth;

  const positions = [
    [-cubeSize, cubeSize/2, 0],            // Tail.
    [0, cubeSize/2, 0],                    // Column.
    [0, 3*cubeSize/2, 0],
    [0, 5*cubeSize/2, 0],
    [0, 5*cubeSize/2, chirality*cubeSize]  // Head.
  ];

  const group = new THREE.Group();

  positions.forEach(([x,y,z]) => {
    const cube = makeBeveledCubeMesh(cubeSize, color);
    cube.position.set(x, y, z);
    group.add(cube);
  });

  const box = new THREE.Box3().setFromObject(group);

  group.position.set(0, -box.min.y, 0);  // Center-bottom origin invariant.

  return group;
  }


function makePawnMeshGroup(tileWidth, pawn, color) {
  const { aspect, breadth } = pawn;

  const baseRadius = (tileWidth * breadth) / 2;                               // Dimensions.
  const washerRadius = baseRadius * 0.85;
  const washerHeight = baseRadius * 0.30;
  const sphereRadius = baseRadius * 0.62;

  const sphereGeo = new THREE.SphereGeometry(sphereRadius, 32, 24);           // Geometries.
  const washerGeo = new THREE.CylinderGeometry(washerRadius, washerRadius, washerHeight, 32);
  washerGeo.translate(0, washerHeight / 2, 0);

  const sphereMesh = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({ color: color.surfaceColor }));// Meshes.
  const washerMesh = new THREE.Mesh(washerGeo, new THREE.MeshBasicMaterial({ color: color.surfaceColor }));

  sphereMesh.position.y = washerHeight/2 + sphereRadius * 0.85;               // Placement.

  const group = new THREE.Group();                                            // Assembly.

  addCylinderEdges(washerMesh, washerRadius, washerHeight, color);            // Washer edges (king convention).
  addWasherCenterRing(washerMesh, washerRadius, washerHeight, color);
  group.add(washerMesh);
  group.add(sphereMesh);

  addPawnLatitudes(sphereMesh, sphereRadius, color);                          // Specular latitudes until skins and lighting.

  const box = new THREE.Box3().setFromObject(group);                          // Normalize origin.
  const centerX = (box.min.x + box.max.x) / 2;
  const centerZ = (box.min.z + box.max.z) / 2;
  group.position.set(-centerX, -box.min.y, -centerZ);

  return group;
  }

function addWasherCenterRing(mesh, radius, height, color) {
  const holeRadius = radius * 0.65;

  const curve = new THREE.EllipseCurve(
    0, 0, holeRadius, holeRadius, 0, 2 * Math.PI, false, 0
  );

  const points = curve.getPoints(64);

  const geometry =
    new THREE.BufferGeometry().setFromPoints(
      points.map(
        p => new THREE.Vector3(p.x, 0, p.y)
      )
    );

  const material =
    new THREE.LineBasicMaterial({ color: color.lineColor });

  const ring =
    new THREE.LineLoop(geometry, material);

  // Slightly above top face to avoid z-fighting.
  ring.position.y = height + 0.1;

  mesh.add(ring);
  }

function addPawnLatitudes(mesh, radius, color) {
  const material =
    new THREE.LineBasicMaterial({ color: color.lineColor });

  // Upper, middle, lower bands.
  const bands = [0.55, 0.20, -0.15];

  const scale = 1.03;  // Slightly outside sphere.

  bands.forEach(yFrac => {
    const yPos = radius * yFrac;

    // Radius of sphere cross-section at this latitude.
    const ringRadius = Math.sqrt(radius * radius - yPos * yPos) * scale;

    const curve = new THREE.EllipseCurve(
      0, 0, ringRadius, ringRadius, 0, 2 * Math.PI, false, 0
    );

    const points = curve.getPoints(64);

    const geometry =
      new THREE.BufferGeometry().setFromPoints(
        points.map(
          p => new THREE.Vector3(p.x, yPos, p.y)
        )
      );

    const line = new THREE.LineLoop(geometry, material);

    mesh.add(line);
  });
}

// Helpers:
function createMesh(geometry, color, suppress=false) {
  const material = new THREE.MeshBasicMaterial({ color: color.surfaceColor });
  const mesh = new THREE.Mesh(geometry, material);

  if(!suppress) {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const lines = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({ color: color.lineColor }));
    mesh.add(lines);
  }

  mesh.castShadow = true;
  mesh.receiveShadow = false;

  return mesh;
  }

function addCylinderEdges(mesh, radius, height, color) {
  const curve = new THREE.EllipseCurve(
    0, 0, radius, radius, 0, 2 * Math.PI, false, 0
  );

  const points = curve.getPoints(64);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map(p => new THREE.Vector3(p.x, 0, p.y))
  );

  const material = new THREE.LineBasicMaterial({ color: color.lineColor });

  // --- Bottom ring ---
  const bottomRing = new THREE.LineLoop(geometry, material);
  bottomRing.position.y = 0;

  // --- Top ring ---
  const topRing = new THREE.LineLoop(geometry, material);
  topRing.position.y = height;
  mesh.add(bottomRing);
  mesh.add(topRing);
  }

function makeBeveledCubeMesh(cubeSize, color) {
  const mesh =
    new THREE.Mesh(
      new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
      new THREE.MeshBasicMaterial({ color: color.surfaceColor })
    );

  addCubeBevelLines(mesh, cubeSize, color);

  return mesh;
  }

function addCubeBevelLines(mesh, cubeSize, color) {
  const material =
    new THREE.LineBasicMaterial({
      color: color.lineColor
    });

  const inset = cubeSize * 0.08;
  const h = cubeSize / 2;

  const faces = [
    [ [ h, -h+inset, -h+inset ],    // +X
      [ h,  h-inset, -h+inset ],
      [ h,  h-inset,  h-inset ],
      [ h, -h+inset,  h-inset ] ],

    [ [ -h, -h+inset, -h+inset ],    // -X
      [ -h,  h-inset, -h+inset ],
      [ -h,  h-inset,  h-inset ],
      [ -h, -h+inset,  h-inset ] ],

    [ [ -h+inset, h, -h+inset ],    // +Y
      [  h-inset, h, -h+inset ],
      [  h-inset, h,  h-inset ],
      [ -h+inset, h,  h-inset ] ],

    [ [ -h+inset, -h, -h+inset ],    // -Y
      [  h-inset, -h, -h+inset ],
      [  h-inset, -h,  h-inset ],
      [ -h+inset, -h,  h-inset ] ],

    [ [ -h+inset, -h+inset, h ],    // +Z
      [  h-inset, -h+inset, h ],
      [  h-inset,  h-inset, h ],
      [ -h+inset,  h-inset, h ]
    ],

    [ [ -h+inset, -h+inset, -h ],    // -Z
      [  h-inset, -h+inset, -h ],
      [  h-inset,  h-inset, -h ],
      [ -h+inset,  h-inset, -h ] ]
  ];

  faces.forEach(face => {
    const geometry =
      new THREE.BufferGeometry()
        .setFromPoints(
          face.map(
            p => new THREE.Vector3(...p)
          )
        );

    const ring = new THREE.LineLoop(geometry, material);

    mesh.add(ring);
  });
}
// Seampoint: more local functions...

/* TODO: QC checklist
  === Phase 1: Mesh Semantics ===
    1. Piece/ghost distinction.
    2. Common mesh helpers.
    3. White/Black materials.
    4. ✅ Confirm black tray placement.
    5. Ghost visibility + occupancy inversion.
    6. ✅ Piece edge conventions.

  === Phase 2: Interaction Semantics ===
    7. Raycast ghost interaction.
    8. Decorator interaction.
    9. Demo move tray → board.
    10. Move piece around board.
    11. Return piece to tray.
    12. Ghost ↔ real mesh replacement invariant.
    13. Pieces/ghosts move with tray as gap changes.

  === Phase 3: Piece System Expansion ===
    14. ✅ Meshes for remaining pieces.
    15. ✅ Canonical piece scaling/aspect language.
    16. Piece silhouette QC against movement semantics.

  === Phase 4: Render Architecture Cleanup ===
    17. Canonical VTS → world projection helper.
    18. Shared edge/material decorators.
    19. Separate geometry factories from render modes.
    20. Mesh registries / lookup helpers.
    21. Remove remaining model→view tension.
*/

