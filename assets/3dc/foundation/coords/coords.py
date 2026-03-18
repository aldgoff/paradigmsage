import json
import re
from pathlib import Path

# -- Load the coords module -----------------------------------------
coords_module = json.loads(Path("coords.json").read_text())["coords_module"]

# -- Helpers --------------------------------------------------------
def get_board_spec(name: str) -> dict:
  for board_spec in coords_module["board_specs"]:
    if board_spec["name"] == name:
      return board_spec
  raise ValueError(f"Unknown board spec: {name}")

def normalize_tile_to_vts(tile, spec):
  # Normalize tile to vts coords.
    if isinstance(tile, str):
      rcs = board_to_rcs(tile, spec)
      return rcs_to_vts(rcs, spec)
    else:
      return tile

def tile_to_rcs(tile, spec=None) -> tuple:
  if isinstance(tile, str):
    return board_to_rcs(tile, spec)
  return vts_to_rcs(tile, spec)

# -- Canonical --
def board_to_rcs(loc: str, spec: dict) -> tuple:
  m = re.fullmatch(r"([A-Z]{1,2})(\d+),(\d+)", loc)
  if not m:
    raise ValueError(f"Invalid board coord format: {loc}")
  LL, Xs, Ys = m.groups()
  if LL not in spec["level_map"]:
    raise ValueError(f"Unknown level prefix {LL}")
  Z = spec["level_map"][LL]
  X = int(Xs)
  Y = int(Ys)
  return (Z, X, Y)

def rcs_to_vts(rcs: tuple, spec: dict) -> tuple:
  Z, X, Y = rcs
  Nz, Nx, Ny = spec["Nz"], spec["Nx"], spec["Ny"]
  z = int(Z - Nz/2)
  x = int(X - Nx/2)
  y = int(Y - Ny/2)
  return (z, x, y)

def vts_to_rcs(vts: tuple, spec: dict) -> tuple:
  z, x, y = vts
  Nz, Nx, Ny = spec["Nz"], spec["Nx"], spec["Ny"]
  Z = int(z + Nz/2)
  X = int(x + Nx/2)
  Y = int(y + Ny/2)
  return (Z, X, Y)

def rcs_to_board(rcs: tuple, spec: dict) -> str:
  Z, X, Y = rcs
  inv = spec["inverse_level_map"]
  LL = inv[str(Z)]
  return f"{LL}{X},{Y}"


# -- On_board Tests --
def on_board_vts(vts, spec=None) -> bool:
  if spec is None:
    spec = get_board_spec("8x8x8")
  elif isinstance(spec, str):
    spec = get_board_spec(spec)

  Z, X, Y = vts_to_rcs(vts, spec)

  return (
    (1 <= Z <= spec["Nz"]) and
    (1 <= X <= spec["Nx"]) and
    (1 <= Y <= spec["Ny"])
  )

def on_board_rcs(rcs, spec=None) -> bool:
  if spec is None:
    spec = get_board_spec("8x8x8")
  elif isinstance(spec, str):
    spec = get_board_spec(spec)

  Z, X, Y = rcs

  return (
    (1 <= Z <= spec["Nz"]) and
    (1 <= X <= spec["Nx"]) and
    (1 <= Y <= spec["Ny"])
  )

# -- Round Trip -----------------------------------------------------
Coord = tuple[int, int, int]
RoundTrip = tuple[Coord, Coord, Coord, str]

def round_trip(brd: str, spec_name: str) -> RoundTrip:
  spec = get_board_spec(spec_name)

  rcs  = board_to_rcs(brd, spec)
  vts  = rcs_to_vts(rcs, spec)
  rcs2 = vts_to_rcs(vts, spec)
  brd2 = rcs_to_board(rcs2, spec)

  return (rcs, vts, rcs2, brd2)

# -- Smoke Test --
if __name__ == "__main__":

  boardDef = "8x8x8"
  spec = get_board_spec(boardDef)
  testArray = ["Q4,4", "QR1,1"]
  for input in testArray:
    rcs, vts, rcs2, brd2 = round_trip(input, boardDef)
    print(boardDef, "Board:", input, "> RCS:", rcs, "VTS:", vts, "Back:", rcs2, "Board:", brd2)

  boardDef = "10x10x10"
  spec = get_board_spec(boardDef)
  testArray = ["KR2,1", "K6,6"]
  for input in testArray:
    rcs, vts, rcs2, brd2 = round_trip(input, boardDef)
    print(boardDef, "Board:", input, "> RCS:", rcs, "VTS:", vts, "Back:", rcs2, "Board:", brd2)

  print()

  # -- true, false, true.
  print(on_board_vts((-3, -3, -3)))
  print(on_board_vts((-4, -4, -4)))
  print(on_board_vts((-4, -4, -4), "10x10x10"))

  print(on_board_rcs((1, 1, 1)))
  print(on_board_rcs((0, 0, 0)))
  print(on_board_rcs((1, 1, 1), "10x10x10"))

  print('coords.py smoke test passed.')
  print()
