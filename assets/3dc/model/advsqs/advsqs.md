# Advsqs Model Spec
  Describe the model layer roles for advsqs.

## 1. Purpose
  It has been surprisingly hard to keep to the MVC idiom.
  Is it flawed?

## 2. Title
  The advsq panel is a DOM panel.
  It is both view and control all at the same time.

## 3. Parameters
  An advancement square is specified by four parameters:
  - Src tile
  - Quad (1 - 60)
  - Perimeter (1 - Nz)
  - Stride (1 - (2*perimeter+1))

 ### 3.1 Opacity
  - Opacity (0.00 - 1.00)
  - Formally regarded as part of the specification.
  - Deterimines how offboard tiles look.

 ### 3.2 Nuances
  - Perimeter of 0 is permitted, it is equivalent to the src tile.
  - Such perimeters are quandrant ambiguous.
  - A quad of 0 is also permitted, also equivalent to the src tile.
  - A stride of 0 is allowed, no stride decorator on the perimeter.

## 4. Derived Values
  - Base piece quad number
    - Rook (1-12)
    - Bishop (1-24)
    - Duke (1-24)
  - Plane number
    - Rook (1-4)
    - Bishop (1-6)
    - Duke (1-4)
  - Nickname (significant quads only)
  - Plane (1-13), each has a name
  - Quad type
    - None
    - Edge
    - Face
  - Length
  - Area
  - OnBoard Count
  - Stride Type
    - Source
    - E1
    - Body
    - Apex
    - Duplex
    - Third
    - E2
  - Move Type
    - Q: quadrant
    - L: linear
    - D: duplex
    - O: overlap
  - Overlap Type
    - Brook
    - Qtile
    - Hotspot
    - Feynmann
  - Pieces: R|B|D|Q|N|S|P|K

