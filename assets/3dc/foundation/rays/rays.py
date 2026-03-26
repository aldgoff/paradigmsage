import json
from pathlib import Path

""" Define the 26 rays (face, edge, vertex) and the 24 knight deltas.
  """

# -- Load data -------------------------------------------------
rays_module = json.loads(Path('rays.json').read_text())['rays_module']

ROOK_RAYS   = rays_module['rook']   # Used by perimeters.py.
BISHOP_RAYS = rays_module['bishop']
DUKE_RAYS   = rays_module['duke']
KNIGHT_DELTAS = rays_module['knight']

# -- Load the lower layers ------------------------------------------
import coords
import colors

# -- Public API -----------------------------------------------------
def get_ray_vector(ray_name):
  """Return (dz,dx,dy) for any base-piece ray."""
  if ray_name in ROOK_RAYS:
      return tuple(ROOK_RAYS[ray_name])
  if ray_name in BISHOP_RAYS:
      return tuple(BISHOP_RAYS[ray_name])
  if ray_name in DUKE_RAYS:
      return tuple(DUKE_RAYS[ray_name])
  raise KeyError(f"Unknown ray: {ray_name}")

# -- Registry --------------------------------------------------
RAY_REGISTRY = {
  'rook':   ROOK_RAYS,
  'bishop': BISHOP_RAYS,
  'duke':   DUKE_RAYS,
  'knight': KNIGHT_DELTAS,
}

# -- Smoke test ------------------------------------------------
if __name__ == '__main__':
  assert ROOK_RAYS['up']      == [1, 0, 0]
  assert BISHOP_RAYS['fore']  == [0, 1, 1]
  assert DUKE_RAYS['fore_up'] == [1, 1, 1]

  assert len(ROOK_RAYS)   ==  6
  assert len(BISHOP_RAYS) == 12
  assert len(DUKE_RAYS)   ==  8

  assert len(KNIGHT_DELTAS) == 24

  print("Number of rays - rook, bishop, duke, knight:", len(ROOK_RAYS), len(BISHOP_RAYS), len(DUKE_RAYS))
  print("Number of 2x2x1 deltas - knight:", len(KNIGHT_DELTAS))
  
  print('rays.py smoke test passed.')
  print()
