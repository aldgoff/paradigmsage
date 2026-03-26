import json
from pathlib import Path

""" Define planes by adjacent ray lists.
  """

# -- Load the quads module -----------------------------------------
quads_module = json.loads(Path("quads.json").read_text())["quads_module"]


# -- Load the lower layers ------------------------------------------
import coords
import colors
import rays

# -- Load the rays modules --------------------------------
### ??? Why are we going directly to the rays' json file??? ###
def load_ray_vectors(path="rays.json"):
  with open(path, "r") as f:
    data = json.load(f)

  rays_module = data["rays_module"]
  rayvecs = {}

  # rook, bishop, duke groups
  for group_name, group_dict in rays_module.items():
    print(group_name)
    if isinstance(group_dict, dict):
      for ray_name, vec in group_dict.items():
        if isinstance(vec, list):
          rayvecs[ray_name] = tuple(vec)

  return rayvecs


# -- UI functions ---------------------------------------------------
def planes_for_ray(ray_name):
  rayIndex = quads_module["rayIndex"]

  if ray_name not in rayIndex:
    raise KeyError(f"Unknown ray: {ray_name}")

  return rayIndex[ray_name]

def adjacent_rays(ray_name, plane_name):
  planes = quads_module["planes"]

  # Find cycle
  for group in planes.values():
    if plane_name in group:
      cycle = group[plane_name]["rays"]
      break
  else:
    raise KeyError(f"Unknown plane: {plane_name}")

  if ray_name not in cycle:
    raise ValueError(f"Ray '{ray_name}' not in plane '{plane_name}'")

  i = cycle.index(ray_name)
  left_neighbor = cycle[i - 1]
  right_neighbor = cycle[(i + 1) % len(cycle)]

  return (left_neighbor, right_neighbor)

def is_valid_quad(ray1, ray2):
  planes1 = set(planes_for_ray(ray1))
  planes2 = set(planes_for_ray(ray2))
  shared = planes1 & planes2

  if not shared:
    return (False, None)

  planes = quads_module["planes"]

  for plane in shared:
    # fetch cycle
    for group in planes.values():
      if plane in group:
        cycle = group[plane]["rays"]
        break

    n = len(cycle)
    for i in range(n):
      a = cycle[i]
      b = cycle[(i + 1) % n]
      if (ray1 == a and ray2 == b) or (ray1 == b and ray2 == a):
        return (True, plane)

    return (False, None)

# -- Duke quad type (vector → edge/face) ----------------------------
def duke_quad_type_from_vectors(v1, v2):
  dz = v2[0] - v1[0]
  dx = v2[1] - v1[1]
  dy = v2[2] - v1[2]

  zero_count = sum(1 for c in (dz, dx, dy) if c == 0)

  if zero_count == 1:
    return "face"
  elif zero_count == 2:
    return "edge"
  else:
    raise ValueError(f"Invalid duke delta {(dz,dx,dy)}")

def duke_quad_type(ray1, ray2, rayvecs):
  return duke_quad_type_from_vectors(
    rayvecs[ray1],
    rayvecs[ray2]
  )


# -- Smoke Test -----------------------------------------------------
if __name__ == "__main__":
  rayvecs = load_ray_vectors()

  print("Planes for RFU:", planes_for_ray("RFU"))
  print("Adjacency in Upward:", adjacent_rays("RFU", "Upward"))
  print("Valid quad LFU-RFU:", is_valid_quad("LFU", "RFU"))
  print()

  # Major Neutral CW:  fore_down > fore_up > back_up > back_down >  1-4 1-4 37-40 Q37,Q38,Q39,Q40
  dukeMajor = [["fore_down","fore_up"],   ["fore_up",  "back_up"], 
               ["back_up",  "back_down"], ["back_down","fore_down"]]
  for ray_pair in dukeMajor:
    ray1 = ray_pair[0]
    ray2 = ray_pair[1]
    print(duke_quad_type(ray1,ray2, rayvecs))
  
  print('quads.py smoke test passed.')
  print()
