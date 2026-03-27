import json
from pathlib import Path

""" Define the perimeter class, Perim.
  """

# -- Load the perims module -----------------------------------------
perims_module = json.loads(Path("perims.json").read_text())["perims_module"]

# -- Load the lower layers ------------------------------------------
import coords
import colors
from rays import ROOK_RAYS, BISHOP_RAYS, DUKE_RAYS, KNIGHT_DELTAS
import quads
import quadMap


class Perims:
  """ Perims L6
    A geometrical perimeter defined by:
      - origin: Board space or VTS.
      - quad: quadrant identifier (int or "Q<n>")
      - k: positive integer distance.
      - board_spec: tag specifying board properties.
    """

  def __init__(self, origin, quad, k, board_spec): # Origin, board space ("K6,7") or vts (1,2,3)
    self.origin = origin
    self.quad = quad
    self.k = k
    self.spec = coords.get_board_spec(board_spec)  # On board depends on board size (8x8x8).

    # Normalize origin.
    if isinstance(origin, str):
      self.origin_vts = coords.rcs_to_vts(coords.board_to_rcs(origin, self.spec), self.spec)
    else:
      self.origin_vts = origin

    # Compute the tiles and stride along the perimeter.
    self.stride = []
    self.ray_pair = quadMap.by_quad(quad)["ray_pair"]
    self.tiles = self._compute_perimeter(self.origin_vts, self.ray_pair, k)
    self.onboard_count = self._onBoard()
    self.offboard_count = 2*k+1 - self.onboard_count
  
  # -- Helper methods -----------------------------------------------
  def _get_ray_vector(self, ray_name):
    """Return (dz,dx,dy) for any base-piece ray."""
    if ray_name in ROOK_RAYS:
        return tuple(ROOK_RAYS[ray_name])
    if ray_name in BISHOP_RAYS:
        return tuple(BISHOP_RAYS[ray_name])
    if ray_name in DUKE_RAYS:
        return tuple(DUKE_RAYS[ray_name])
    raise KeyError(f"Unknown ray: {ray_name}")

  def _onBoard(self):
    self.onboard = 0
    for tile in self.tiles:
      if isinstance(tile, str):
        tile = coords.rcs_to_vts(coords.board_to_rcs(tile, self.spec), self.spec)
      if coords.on_board_vts(tile, self.spec):
        self.onboard += 1
    return self.onboard

  # -- Vector math ----------------------------------------------------
  def _add(self, a, b):
    return (a[0] + b[0], a[1] + b[1], a[2] + b[2])

  def _scale(self, v, k):
    return (k*v[0], k*v[1], k*v[2])

  # -- Formatting (Perimeters Spec §3–4) ------------------------------
  def _format_tile(self, vts):
    """ Apply VTS→Board conversion and choose correct output format.
      If on-board → return "<LL>X,Y"
      If off-board → return "(z,x,y)"
      """

    # On-board: convert VTS to RCS.
    if coords.on_board_vts(vts, self.spec):
      rcs = coords.vts_to_rcs(vts, self.spec)
      return coords.rcs_to_board(rcs, self.spec)

    # Off-board: keep VTS form.
    return vts

  # -- Core perimeter computation (Spec §5) ---------------------------
  def _compute_perimeter(self, S, ray_pair, k):  # S => S_vts.
      """ Return the formatted tiles of P(k), strictly ordered:
          [E1, outbound..., Apex, inbound..., E2]
        S  = source tile (z,x,y) in VTS
        ray_pair = the tuple of ray names.
        k  = perimeter index (k ≥ 0)
        """
    
    # Perimeter 0, just the origin (source) tile.
      if(k == 0):
        self.stride = []
        bishop = colors.bishop_color_vts(S)
        duke   = colors.duke_color_vts(S)
        combined = f"{bishop}-{duke}"
        # self.stride.append([0, S, "Origin", bishop, duke, combined])
        self.stride.append([0, S, "Origin", combined])
        self.tiles = [self._format_tile(S)]
        return self.tiles
    
    # Get the ray vectors.
      ray_name1, ray_name2 = ray_pair
      self.v1 = v1 = self._get_ray_vector(ray_name1)
      self.v2 = v2 = self._get_ray_vector(ray_name2)

    # E1
      E1 = self._add(S, self._scale(v1, k))

      tiles = [E1]
      self.stride = []
      bishop = colors.bishop_color_vts(E1)
      duke   = colors.duke_color_vts(E1)
      combined = f"{bishop}-{duke}"
      # self.stride.append([1, E1, "E1", bishop, duke, combined])
      self.stride.append([1, E1, "E1", combined])

    # Outbound segment along +r2
      for n in range(1, k):
        tile = self._add(E1, self._scale(v2, n))
        tiles.append(tile)
        bishop = colors.bishop_color_vts(tile)
        duke   = colors.duke_color_vts(tile)
        combined = f"{bishop}-{duke}"
        # self.stride.append([n+1, tile, f"B{n+1}", bishop, duke, combined])
        self.stride.append([n+1, tile, f"B{n+1}", combined])
                       
    # Apex
      Apex = self._add(S, self._add(self._scale(v1, k), self._scale(v2, k)))
      tiles.append(Apex)
      bishop = colors.bishop_color_vts(Apex)
      duke   = colors.duke_color_vts(Apex)
      combined = f"{bishop}-{duke}"
      # self.stride.append([k+1, Apex, "Apex", bishop, duke, combined])
      self.stride.append([k+1, Apex, "Apex", combined])

    # Inbound segment along −r1
      for n in range(1, k):
        tile = self._add(Apex, self._scale(v1, -n))
        tiles.append(tile)
        bishop = colors.bishop_color_vts(tile)
        duke   = colors.duke_color_vts(tile)
        combined = f"{bishop}-{duke}"
        # self.stride.append([n+k+1, tile, f"B{n+k+1}", bishop, duke, combined])
        self.stride.append([n+k+1, tile, f"B{n+k+1}", combined])

    # E2
      E2 = self._add(S, self._scale(v2, k))
      tiles.append(E2)
      bishop = colors.bishop_color_vts(E2)
      duke   = colors.duke_color_vts(E2)
      combined = f"{bishop}-{duke}"
      # self.stride.append([2*k+1, E2, "E2", bishop, duke, combined])
      self.stride.append([2*k+1, E2, "E2", combined])

    # Length = 2k + 1, spec invariant
      self.tiles = [self._format_tile(tile) for tile in tiles]
      return self.tiles

  # -- Public API ---------------------------------------------------
  def get_tiles(self):
    return self.tiles
  
  def show_stride(self):
    # Display the stride in 4 rows.
      tiles = []
      types = []
      # bishop_color = []
      # duke_color = []
      color = []

    # Assemble the table rows.
      for strd in self.stride:
        possible_vts = self._format_tile(strd[1])
        if(isinstance(possible_vts, str)):
          tiles.append(f"{possible_vts:^12}")
        else:
          z, x, y = possible_vts
          vts_str = f"({z},{x},{y})"
          tiles.append(f"{vts_str:^12}")
        types.append(f"{strd[2]:^12}")
        # bishop_color.append(f"{strd[3]:^12}")
        # duke_color.append(f"{strd[4]:^12}")
        color.append(f"{strd[3]:^12}")
    
    # Pretty print as ~ columns.
      print(self.k, ":", tiles)
      print("  :", types)
      # print("  :", bishop_color)
      # print("  :", duke_color)
      print("  :", color)

    # Display on/off board tiles.
      n = 2*self.k + 1
      print(f"onboard {self.onboard_count}/{n} -", f"offboard {self.offboard_count}/{n}")
      print()

      return


# -- Smoke Test -----------------------------------------------------
if __name__ == "__main__":
  # Compute rook nested strides: S=(0,0,2), Forward quad (left_fore,right_fore), k=0...8
    print("Show rook stride for", "Q4,6", "Q1", "on an 8x8x8 board")
    for k in range(9):
      perim = Perims("Q4,6", "Q1", k, "8x8x8")    # Pass.

      if(perim._onBoard() == 0):
         break
      perim.show_stride()

  # Compute bishop nested strides: S=(0,0,2), Upward quad (LFU,RFU), k=0...8
    print("Show bishop stride for", "Q4,6", "Q1", "on an 8x8x8 board")
    for k in range(9):
      perim = Perims("Q4,6", "Q13", k, "8x8x8")    # Pass.
      if(perim._onBoard() == 0):
         break
      perim.show_stride() # All white tiles, alternating duke colors.

  # Compute duke nested strides: S=(0,0,2), Fore quad (fore_down","fore_up), k=0...8
    print("Show duke stride for", "Q4,6", "Q1", "on an 8x8x8 board")
    for k in range(9):
      perim = Perims("Q4,6", "Q37", k, "8x8x8")    # Pass.
      if(perim._onBoard() == 0):
         break
      perim.show_stride() # All silver tiles, alternating bishop colors.

  # Compute bishop nested perimeters: S=(0,0,2), Upward quad (LFU,RFU), k=0...8
    print("Show bishop tiles for", "Q4,6", "Q1", "on an 8x8x8 board")
    for k in range(9):
      perim = Perims("Q4,6", "Q13", k, "8x8x8")    # Pass.
      if(perim._onBoard() == 0):
         break
      print(perim.tiles) # All white tiles, alternating duke colors.
    print()

  # The 24 knight deltas.
    bishop = colors.bishop_color_vts((0,0,0))
    duke   = colors.duke_color_vts((0,0,0))
    print(f"({0:2d}", f"{0:2d}", f"{0:2d}", "):", bishop, duke)

    for tile in KNIGHT_DELTAS:
      bishop = colors.bishop_color_vts(tuple(tile))
      duke   = colors.duke_color_vts(tuple(tile))
      z, x, y = tile
      print(f"[{z:2d}", f"{x:2d}", f"{y:2d}", "]:", bishop, duke)

  # Passed.
    print('perims.py smoke test passed.')
    print()

  # Bishop checks, all 4 planes, on 10x10x10 board, with source at Q5,5, out to perimeter 2.
    plane_set = [0, 6, 12, 18]
    board = "10x10x10"
    source = "Q5,5"
    P = 2
    for quads in plane_set:
      first = 13 + quads
      last  = 13 + quads + 6
      print(first, "-", last)
      for quad in range(first, last):
        perim = Perims(source, quad, P, board); 
        perim.show_stride()

''' Q13-18:
  2 : ['   KD7,5    ', '   KB7,6    ', '   KN7,7    ', '   KB6,7    ', '   KD5,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   KD5,7    ', '   KD4,8    ', '   KD3,9    ', '    K3,8    ', '    Q3,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q3,7    ', '   QD2,7    ', '   QB1,7    ', '   QB2,6    ', '   QB3,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB3,5    ', '   QN3,4    ', '   QR3,3    ', '   QN4,3    ', '   QB5,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB5,3    ', '   QB6,2    ', '   QB7,1    ', '   QD7,2    ', '    Q7,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q7,3    ', '    K8,3    ', '   KD9,3    ', '   KD8,4    ', '   KD7,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5
  '''

''' Q19-24:
  2 : ['   QB7,5    ', '   QN7,6    ', '   QR7,7    ', '   QN6,7    ', '   QB5,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB5,7    ', '   QB4,8    ', '   QB3,9    ', '   QD3,8    ', '    Q3,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q3,7    ', '    K2,7    ', '   KD1,7    ', '   KD2,6    ', '   KD3,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   KD3,5    ', '   KB3,4    ', '   KN3,3    ', '   KB4,3    ', '   KD5,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   KD5,3    ', '   KD6,2    ', '   KD7,1    ', '    K7,2    ', '    Q7,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q7,3    ', '   QD8,3    ', '   QB9,3    ', '   QB8,4    ', '   QB7,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5
  '''

''' Q25-30:
  2 : ['   KD5,3    ', '   KB5,4    ', '   KN5,5    ', '   KB5,6    ', '   KD5,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   KD5,7    ', '   KD6,8    ', '   KD7,9    ', '    K7,8    ', '    Q7,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q7,7    ', '   QD8,7    ', '   QB9,7    ', '   QB8,6    ', '   QB7,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB7,5    ', '   QN6,5    ', '   QR5,5    ', '   QN4,5    ', '   QB3,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB3,5    ', '   QB2,4    ', '   QB1,3    ', '   QD2,3    ', '    Q3,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q3,3    ', '    K3,2    ', '   KD3,1    ', '   KD4,2    ', '   KD5,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5
  '''

''' Q31-36:
  2 : ['   KD3,5    ', '   KB4,5    ', '   KN5,5    ', '   KB6,5    ', '   KD7,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   KD7,5    ', '   KD8,6    ', '   KD9,7    ', '    K8,7    ', '    Q7,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q7,7    ', '   QD7,8    ', '   QB7,9    ', '   QB6,8    ', '   QB5,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB5,7    ', '   QN5,6    ', '   QR5,5    ', '   QN5,4    ', '   QB5,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB5,3    ', '   QB4,2    ', '   QB3,1    ', '   QD3,2    ', '    Q3,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q3,3    ', '    K2,3    ', '   KD1,3    ', '   KD2,4    ', '   KD3,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5
  '''

''' Q25-30 corrected:
  2 : ['   KD5,3    ', '   KB6,3    ', '   KN7,3    ', '   KB7,4    ', '   KD7,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   KD7,5    ', '   KD8,6    ', '   KD9,7    ', '    K8,7    ', '    Q7,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q7,7    ', '   QD7,8    ', '   QB7,9    ', '   QB6,8    ', '   QB5,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB5,7    ', '   QN4,7    ', '   QR3,7    ', '   QN3,6    ', '   QB3,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB3,5    ', '   QB2,4    ', '   QB1,3    ', '   QD2,3    ', '    Q3,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q3,3    ', '    K3,2    ', '   KD3,1    ', '   KD4,2    ', '   KD5,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5
  '''

''' Q31-Q36: corrected
  2 : ['   KD3,5    ', '   KB3,6    ', '   KN3,7    ', '   KB4,7    ', '   KD5,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   KD5,7    ', '   KD6,8    ', '   KD7,9    ', '    K7,8    ', '    Q7,7    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q7,7    ', '   QD8,7    ', '   QB9,7    ', '   QB8,6    ', '   QB7,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB7,5    ', '   QN7,4    ', '   QR7,3    ', '   QN6,3    ', '   QB5,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-ruby ', 'white-silver', ' white-jade ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['   QB5,3    ', '   QB4,2    ', '   QB3,1    ', '   QD3,2    ', '    Q3,3    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-gold ', 'white-silver', ' white-ruby ', 'white-silver']
  onboard 5/5 - offboard 0/5

  2 : ['    Q3,3    ', '    K2,3    ', '   KD1,3    ', '   KD2,4    ', '   KD3,5    ']
    : ['     E1     ', '     B2     ', '    Apex    ', '     B4     ', '     E2     ']
    : ['white-silver', ' white-jade ', 'white-silver', ' white-gold ', 'white-silver']
  onboard 5/5 - offboard 0/5
  '''

''' Corrected:
    "Q25": {"piece":"bishop", "piece_quad":13, "plane":"Leftward",    "plane_quad":1, "ray_pair":["LBU","RFU"],               "nickname":"LUpSling"},
    "Q26": {"piece":"bishop", "piece_quad":14, "plane":"Leftward",    "plane_quad":2, "ray_pair":["RFU","fore"],              "nickname":"LUpSling"},
    "Q27": {"piece":"bishop", "piece_quad":15, "plane":"Leftward",    "plane_quad":3, "ray_pair":["fore","LFD"],              "nickname":"LDnSling"},
    "Q28": {"piece":"bishop", "piece_quad":16, "plane":"Leftward",    "plane_quad":4, "ray_pair":["LFD","RBD"]},
    "Q29": {"piece":"bishop", "piece_quad":17, "plane":"Leftward",    "plane_quad":5, "ray_pair":["RBD","back"]},
    "Q30": {"piece":"bishop", "piece_quad":18, "plane":"Leftward",    "plane_quad":6, "ray_pair":["back","LBU"]},

    "Q31": {"piece":"bishop", "piece_quad":19, "plane":"Rightward",   "plane_quad":1, "ray_pair":["RBU","LFU"],               "nickname":"RUpSling"},
    "Q32": {"piece":"bishop", "piece_quad":20, "plane":"Rightward",   "plane_quad":2, "ray_pair":["LFU","fore"],              "nickname":"RUpSling"},
    "Q33": {"piece":"bishop", "piece_quad":21, "plane":"Rightward",   "plane_quad":3, "ray_pair":["fore","RFD"],              "nickname":"RDnSling"},
    "Q34": {"piece":"bishop", "piece_quad":22, "plane":"Rightward",   "plane_quad":4, "ray_pair":["RFD","LBD"]},
    "Q35": {"piece":"bishop", "piece_quad":23, "plane":"Rightward",   "plane_quad":5, "ray_pair":["LBD","back"]},
    "Q36": {"piece":"bishop", "piece_quad":24, "plane":"Rightward",   "plane_quad":6, "ray_pair":["back","RBU"]},
'''

''' Worked mostly:
    "Q25": {"piece":"bishop", "piece_quad":13, "plane":"Leftward",    "plane_quad":1, "ray_pair":["LBU","LFU"],               "nickname":"LUpSling"},
    "Q26": {"piece":"bishop", "piece_quad":14, "plane":"Leftward",    "plane_quad":2, "ray_pair":["LFU","fore"],              "nickname":"LUpSling"},
    "Q27": {"piece":"bishop", "piece_quad":15, "plane":"Leftward",    "plane_quad":3, "ray_pair":["fore","RFD"],              "nickname":"LDnSling"},
    "Q28": {"piece":"bishop", "piece_quad":16, "plane":"Leftward",    "plane_quad":4, "ray_pair":["RFD","RBD"]},
    "Q29": {"piece":"bishop", "piece_quad":17, "plane":"Leftward",    "plane_quad":5, "ray_pair":["RBD","back"]},
    "Q30": {"piece":"bishop", "piece_quad":18, "plane":"Leftward",    "plane_quad":6, "ray_pair":["back","LBU"]},

    "Q31": {"piece":"bishop", "piece_quad":19, "plane":"Rightward",   "plane_quad":1, "ray_pair":["RBU","RFU"],               "nickname":"RUpSling"},
    "Q32": {"piece":"bishop", "piece_quad":20, "plane":"Rightward",   "plane_quad":2, "ray_pair":["RFU","fore"],              "nickname":"RUpSling"},
    "Q33": {"piece":"bishop", "piece_quad":21, "plane":"Rightward",   "plane_quad":3, "ray_pair":["fore","LFD"],              "nickname":"RDnSling"},
    "Q34": {"piece":"bishop", "piece_quad":22, "plane":"Rightward",   "plane_quad":4, "ray_pair":["LFD","LBD"]},
    "Q35": {"piece":"bishop", "piece_quad":23, "plane":"Rightward",   "plane_quad":5, "ray_pair":["LBD","back"]},
    "Q36": {"piece":"bishop", "piece_quad":24, "plane":"Rightward",   "plane_quad":6, "ray_pair":["back","RBU"]},
'''