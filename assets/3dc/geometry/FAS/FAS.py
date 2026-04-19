from pathlib import Path

# -- Load the lower layers ------------------------------------------
import coords
import colors
import rays
import quads
import quadMap
import perims


# -- Public API -----------------------------------------------------
def FAS(S, Q, spec_name):
  # Load the right quad map.
    spec = coords.get_board_spec(spec_name)
    N = max(spec["Nz"], spec["Nx"], spec["Ny"])

    qmap = quadMap.by_quad(Q)
    ray_name1, ray_name2 = qmap["ray_pair"]
    v1 = rays.get_ray_vector(ray_name1)
    v2 = rays.get_ray_vector(ray_name2)

  # Normalize source tile to vts coords.
    S_vts = coords.normalize_tile_to_vts(S, spec)

  # Create the perimeters.
    perimeters = []
    onboard = 0

    k = 0
    while k<N:
      perim = perims.Perims(S, Q, k, spec_name)
      onboard += perim.onboard_count
      if(perim.onboard_count == 0):
         break
      perimeters.append(perim)    # Accumulate the nested perimeters.
      k += 1

    k_final = len(perimeters) - 1
    N = k_final + 1

  # Prepare dictionary.
    A = {
      "inputs": {
        "origin": S,
        "origin_vts": S_vts,
        "quad": Q,
        "spec": spec_name
        },
      "qmap": qmap,
      "ray_pairs": {
        "ray_vectors": [v1, v2]
        },
      "perimeters": perimeters,
      "outputs": {
        "k_final": k_final,
        "N": N,
        "Area": N*N,
        "Onboard": [onboard, N*N-onboard]
        }
      }

  # Return dictionary.
    return A


# -- Smoke Test -------------------------------------------------------
def print_FAS(geo, strides=None):
  print(geo["inputs"])
  print(geo["qmap"])
  print(geo["ray_pairs"])
  print()

  k = 0
  for perim in geo["perimeters"]:
    print(k, ":", perim.tiles)
    k += 1
  print()

  if(strides):
    k = 0
    for perim in geo["perimeters"]:
      perim.show_stride()
      k += 1

  print(geo["outputs"])
  print()

  return

if __name__ == "__main__":
  # Specify the board.
    spec_name = "10x10x10"

  # Compute a spread of advancement squares.
    geo = FAS("KR2,2", "Q1", spec_name); print_FAS(geo) # Rook Forward: 7x7, all on board.
    geo = FAS("QR4,5", "Q1", spec_name); print_FAS(geo) # Rook Forward: 5x5, 20 on board.
    geo = FAS("Q5,5", "Q13", spec_name); print_FAS(geo) # Bishop UpPredator: 5x5, 20 on board.
    geo = FAS("Q5,5", "Q19", spec_name); print_FAS(geo) # Bishop UpPredator: 5x5, 20 on board.
    geo = FAS("Q5,5", "Q25", spec_name); print_FAS(geo) # Bishop UpPredator: 5x5, 20 on board.
    geo = FAS("Q5,5", "Q31", spec_name); print_FAS(geo) # Bishop UpPredator: 5x5, 20 on board.
    geo = FAS("Q5,5", 37, spec_name); print_FAS(geo, True) # Duke Fore: 4x4, 6 on board.

  # Circumnavigate the horixontal plane (rook) at perimeter 4, Q1-Q4, around KR4,4.
    for quad in range(4):
      geo = FAS("KR4,4", f"Q{quad+1}", spec_name); print_FAS(geo) # Rook Horizontal

  # Passed.
    print('FAS.py smoke test passed.')
    print()
