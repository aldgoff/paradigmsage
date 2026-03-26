import json
from pathlib import Path

""" Implements the 8 colored board:
  3 equivalence classes: bishop, duke, stack.
  """

# -- Load the colors module -----------------------------------------
colors_module = json.loads(Path("colors.json").read_text())["colors_module"]

BISHOP   = colors_module["bishop_color"]
DUKE     = colors_module["duke_color"]

# -- Load the lower layers ------------------------------------------
import coords

# -- Public API -----------------------------------------------------
def bishop_color_vts(tile) -> str:
  assert isinstance(tile, tuple)

  z, x, y = tile

  parity = (z + x + y) % 2

  return BISHOP["colors"][str(parity)]

def duke_color_vts(tile) -> str:
  assert isinstance(tile, tuple)

  z, x, y = tile

  uz = z & 1
  ux = x & 1
  uy = y & 1

  block = DUKE["color_map"][f"uz={uz}"]

  return block[f"{ux},{uy}"]


# -- Smoke Test ------------------------------------------------
if __name__ == "__main__":
  twoCubed = [(0,0,0), (1,1,1), (0,1,1), (1,0,0), (0,1,0), (1,0,1), (0,0,1), (1,1,0) ]

  for tile in twoCubed:
    bishop = bishop_color_vts(tile) 
    duke   = duke_color_vts(tile)
    combined = f"{bishop}-{duke}"
    print(tile, ":", bishop, duke, combined)

  print('colors.py smoke test passed.')
  print()
