import json
from pathlib import Path

""" Define the mapping of quads, planes, and ray pairs.
  """

# -- Load the quadMap module -----------------------------------------
quadsMap_module = json.loads(Path("quadMap.json").read_text())["quadMap_module"]

# -- Load the lower layers ------------------------------------------
import coords
import colors
import rays
import quads


# -- Quad numbers via: global(int,str), piece(dict), plane(dict), rays(list), or nickname(dict,str) ------
def by_quad(quad):
  if isinstance(quad, str): # Assume global quad ("Q<n>")
    if len(quad) > 3:
      return _by_nickname(quadsMap_module, quad)
    return quadsMap_module[quad]
  elif isinstance(quad, int): # Assume global quad (<n>)
    return _by_global(quadsMap_module, quad)
  elif isinstance(quad, dict):  # {"Key": <value>, ...}
    if "piece" in quad:
      return _by_piece(quadsMap_module, quad["piece"], quad["piece_quad"])
    elif "plane" in quad:
      return _by_plane(quadsMap_module, quad["plane"], quad["plane_quad"])
    elif "nickname" in quad:
      return _by_nickname(quadsMap_module, quad["nickname"])
    elif "ray_pair" in quad:
      return _by_rays(quadsMap_module, quad["ray_pair"][0], quad["ray_pair"][1])
  else:           # Unknown format.
    raise KeyError(f"Quad not recognized: {quad}")

def _by_global(qmap, qnum):
  key = f"Q{qnum}"
  if key not in qmap:
    raise KeyError(f"No such quad: {key}")
  return qmap[key]

def _by_piece(qmap, piece, piece_quad):
  for qkey, entry in qmap.items():
    if entry["piece"] == piece and entry["piece_quad"] == piece_quad:
      return entry
  raise KeyError(f"No quad for piece={piece}, piece_quad={piece_quad}")

def _by_plane(qmap, plane, plane_quad):
  for qkey, entry in qmap.items():
    if entry["plane"] == plane and entry["plane_quad"] == plane_quad:
      return entry
  raise KeyError(f"No quad found for plane={plane}, plane_quad={plane_quad}")

def _by_rays(qmap, ray1, ray2):
  for entry in qmap.values():
    rp = entry["ray_pair"]
    # adjacency is ordered but allow reversed real-world queries
    if rp == [ray1, ray2] or rp == [ray2, ray1]:
      return entry
  raise KeyError(f"No quad for ray pair {ray1}, {ray2}")

def _by_nickname(qmap, nickname):
  for entry in qmap.values():
    if entry.get("nickname") == nickname:
      return entry
  raise KeyError(f"No quad with nickname={nickname}")


# -- Smoke Test -----------------------------------------------------
if __name__ == "__main__":
  qmap = quadsMap_module

  # Quad is overloaded with formats: <n>, Q<n>, piece, plane, ray_pair, nickname.
  print("22:", by_quad(22))
  print("Q23:", by_quad("Q23"))
  print("Keel:", by_quad("Keel"))
  print()

  byPiece = {"piece": "rook", "piece_quad": 5}
  print("piece quad", by_quad(byPiece))
  byPiece = {"piece": "bishop", "piece_quad": 5}
  print("piece quad", by_quad(byPiece))
  byPiece = {"piece": "duke", "piece_quad": 5}
  print("piece quad", by_quad(byPiece))
  print()

  byPlane = {"plane": "Upward", "plane_quad": 3}
  print("plane quad", by_quad(byPlane))
  byPlane = {"plane": "Downward", "plane_quad": 4}
  print("plane quad", by_quad(byPlane))
  byPlane = {"plane": "Leftward", "plane_quad": 5}
  print("plane quad", by_quad(byPlane))
  byPlane = {"plane": "Rightward", "plane_quad": 6}
  print("plane quad", by_quad(byPlane))
  print()

  byNickname = {"nickname": "UpPredator"}
  print("nickname quad", by_quad(byNickname))
  byNickname = {"nickname": "DnPredator"}
  print("nickname quad", by_quad(byNickname))
  byNickname = {"nickname": "LUpSling"}
  print("nickname quad", by_quad(byNickname))
  byNickname = {"nickname": "RDnSling"}
  print("nickname quad", by_quad(byNickname))
  print()

  print('quadMap.py smoke test passed.')
  print()
