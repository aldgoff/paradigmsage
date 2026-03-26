# File: quads.py
# Path: ./3dc/geometry/quads.py
# Purpose: Generate the quads.json objects (3) from the planes.json plane/quad/ray table.
# Author: Allan Goff
# Date: 3/25/26

import json

# --- Load inputs ---
import os

BASE = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE, "planes.json")) as f:
  planes_data = json.load(f)["planes_module"]

with open(os.path.join(BASE, "../foundation/rays/rays.json")) as f:
  rays_data = json.load(f)["rays_module"]

# --- Ray vectors ---
ray_vectors = {}

for group in ["rook", "bishop", "duke"]:
  for name, vec in rays_data[group].items():
    ray_vectors[name] = vec

# --- Helpers ---
def cyclic_pairs(rays):
  n = len(rays)
  return [(rays[i], rays[(i + 1) % n]) for i in range(n)]

def plane_type(name):
  pg = planes_data["planeGroups"]
  if name in pg["orthogonal"]: return "rook"
  if name in pg["skew"]:       return "bishop"
  if name in pg["slant"]:      return "duke"
  raise ValueError(f"Unknown plane: {name}")

def quad_type(r1, r2):
  v1, v2 = ray_vectors[r1], ray_vectors[r2]
  d = [v2[i] - v1[i] for i in range(3)]
  z = sum(1 for x in d if x == 0)

  if z == 2: return "edge"
  if z == 1: return "face"
  raise ValueError(f"Invalid Δ for {r1},{r2}: {d}")

# --- Generation ---
plane_quad_table = []
plane_ray_quad_table = []
ray_quad_array = []

global_q = 1
piece_q = {"rook": 1, "bishop": 1, "duke": 1}

for name, plane in planes_data["planes"].items():
  rays = plane["rays"]
  ptype = plane_type(name)
  pairs = cyclic_pairs(rays)

  g0 = global_q
  p0 = piece_q[ptype]

  pq_entry = {
    "plane": name,
    "global_range": None,
    "piece_range": None,
    "plane_range": [1, len(pairs)],
    "quads": []
  }

  pr_entry = {
    "plane": name,
    "pairs": []
  }

  for i, (r1, r2) in enumerate(pairs):
    q = {
      "global": global_q,
      "piece": piece_q[ptype],
      "plane": i + 1,
      "rays": [r1, r2]
    }

    if ptype == "duke":
      q["quadType"] = quad_type(r1, r2)

    pq_entry["quads"].append(q)
    pr_entry["pairs"].append([r1, r2])
    ray_quad_array.append([r1, r2])

    global_q += 1
    piece_q[ptype] += 1

  pq_entry["global_range"] = [g0, global_q - 1]
  pq_entry["piece_range"]  = [p0, piece_q[ptype] - 1]

  plane_quad_table.append(pq_entry)
  plane_ray_quad_table.append(pr_entry)

# --- Output ---
out = {
  "planeQuadTable": plane_quad_table,
  "planeRayQuadTable": plane_ray_quad_table,
  "rayQuadArray": ray_quad_array
}

with open("quads.json", "w") as f:
  json.dump(out, f, indent=2)

