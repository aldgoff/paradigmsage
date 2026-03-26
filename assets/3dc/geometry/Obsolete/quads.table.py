# File: quads.table.py
# Path: ./3dc/geometry/quads.table.py
# Purpose: Convert the quads.json objects into a human readable table.
# Author: Allan Goff
# Date: 3/25/26

import json
import os

# --- Paths ---

BASE = os.path.dirname(os.path.abspath(__file__))

QUADS_PATH = os.path.join(BASE, "quads.json")
OUT_PATH   = os.path.join(BASE, "quads.table.json")


# --- Load ---

with open(QUADS_PATH) as f:
  data = json.load(f)


# --- Transform (human layout, no loss, no gymnastics) ---

planes_out = {}

for p in data["planeQuadTable"]:
  name = p["plane"]
  quads = p["quads"]

  entry = {
    "global_range": p["global_range"],
    "piece_range":  p["piece_range"],
    "plane_range":  p["plane_range"],

    "global": [q["global"] for q in quads],
    "piece":  [q["piece"]  for q in quads],
    "plane":  [q["plane"]  for q in quads],

    "rays":   [q["rays"]   for q in quads]
  }

  # only include when present (duke)
  if "quadType" in quads[0]:
    entry["quadType"] = [q["quadType"] for q in quads]

  planes_out[name] = entry


# --- Output (mirror planes_module style) ---

out = {
  "quads_module": {
    "planes": planes_out
  }
}

print("Writing:", OUT_PATH)

with open(OUT_PATH, "w") as f:
  json.dump(out, f, indent=2)

print("Done.")

