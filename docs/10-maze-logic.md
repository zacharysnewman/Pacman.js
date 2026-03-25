# Chapter 10 — Maze Logic

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info) — "Maze Logic 101"

---

## The Tile Grid

The visible game screen is a regular grid of **tiles**, each **8 × 8 pixels** in the original arcade. The screen is 224 × 288 pixels, yielding a grid of **28 × 36 tiles**.

This implementation uses **20 × 20 pixel tiles** on a 560 × 720 canvas — the same 28 × 36 grid, scaled 2.5×.

Each tile is either:
- **Legal space** — traversable by actors (corridors, dot tiles, ghost house interior)
- **Dead space** — walls and out-of-bounds areas

### Tile Values in This Codebase

| Value | Meaning |
|---|---|
| `0` | Wall (dead space) |
| `2` | Ghost house door area |
| `3` | Small dot (10 pts) |
| `4` | Energizer / power pellet (50 pts) |
| `5` | Empty walkable space |

---

## Actor Tile Occupancy

Each actor (Pac-Man or a ghost) is associated with **exactly one tile** at any time — the tile containing its **center point**. The graphic overlaps surrounding tiles, but only the center point determines which tile the actor occupies.

### Coordinate Conversion (this codebase)

```
gridX()    = x / unit - 0.5         // fractional tile column
gridY()    = y / unit - 0.5         // fractional tile row
roundedX() = Math.round(gridX())    // current tile column (integer)
roundedY() = Math.round(gridY())    // current tile row (integer)
```

Pixel position to tile center:
```
absoluteX = roundedX() * unit + unit / 2
absoluteY = roundedY() * unit + unit / 2
```

---

## How Ghosts Navigate

### One Step Ahead

Ghosts are always thinking **one tile ahead**. When a ghost enters a new tile it immediately decides which direction it will go when it reaches the **next** tile along its current path. When it arrives at that tile, it executes the pre-decided turn and looks ahead again.

### Choosing a Direction at an Intersection

When evaluating the next tile, the ghost:

1. Lists all four exits from that tile
2. **Discards** any exit blocked by a wall
3. **Discards** the reverse direction (no voluntary U-turns)
4. **Discards** upward exits if inside a **red zone** (chase/scatter only — see [Chapter 9](./09-maze-zones.md))
5. For each remaining candidate exit, measures the **Euclidean distance** from the tile one step beyond that exit to the **target tile**
6. Chooses the candidate with the **shortest distance**

### Tie-Breaking

When two or more candidate directions have equal distance to the target, the ghost uses this preference order:

| Priority | Direction |
|---|---|
| 1st | Up |
| 2nd | Left |
| 3rd | Down |
| 4th | Right |

This priority is applied even when the "preferred" direction is clearly the longer route — ghosts cannot look further ahead to resolve ambiguity.

### Distance Metric

Distance is **Euclidean** (straight-line), not Manhattan. Calculated between the **test tile** (one step beyond each candidate exit) and the **target tile**.

```
distance = sqrt((targetX - testX)² + (targetY - testY)²)
```

---

## Collision Detection

Pac-Man collides with a ghost if they **occupy the same tile** at the same time. It does not matter which one moved into the other's tile — the result is the same.

### The Pass-Through Bug

A rare edge case produces a "ghost pass-through": if Pac-Man and a ghost **swap tiles simultaneously** in the same frame (1/60 s), they never share the same tile and no collision is registered. This requires them to be at precisely the right relative position and speed to cross in the same frame.

This is a known, un-patched quirk of the original arcade hardware and is considered part of authentic Pac-Man behavior.

---

## Target Tiles

In chase or scatter mode every ghost has a **target tile** it is trying to reach. The pathfinding logic is identical in both modes — the only difference is *where* the target tile is.

- **Scatter mode:** fixed tile outside the maze near the ghost's home corner (unreachable dead space)
- **Chase mode:** tile determined by each ghost's unique targeting algorithm (usually related to Pac-Man)
- **Eyes (returning home):** fixed tile directly above the left side of the ghost house door

Because the scatter target tiles are in dead space and can never be reached, ghosts orbit their nearest corner indefinitely during scatter mode.

---

## Tile Callbacks (this codebase)

`GameObject` fires two callbacks as an actor moves:

| Callback | Trigger |
|---|---|
| `onTileChanged` | Actor's `roundedX/Y` changes — actor has crossed into a new tile |
| `onTileCentered` | After tile change, actor's center is within 0.1 tiles of the tile center |

Ghost AI direction decisions happen in `ghostOnTileCentered()` → `AI.ghostTileCenter()`, which mirrors the dossier's "decide on entry to tile" model.

---

## Implementation Status

| Feature | Status | Notes |
|---|---|---|
| 28 × 36 tile grid | ✅ Implemented | `gridW = 28`, `gridH = 36`, `unit = 20` |
| Tile occupancy (center point) | ✅ Implemented | `roundedX/Y()` from center coordinates |
| `onTileChanged` callback | ✅ Implemented | `GameObject.checkTileUpdates()` |
| `onTileCentered` callback | ✅ Implemented | 0.1-tile threshold in `GameObject` |
| Euclidean distance to target | ✅ Implemented | `getDistance()` in `utils.ts` used by `AI.ghostTileCenter()` |
| Up/Left/Down/Right tie-break priority | ✅ Implemented | `turns` pushed in Up→Left→Down→Right order in `AI.ghostTileCenter()` |
| No-reverse rule | ✅ Implemented | Opposite direction discarded in `AI.ghostTileCenter()` |
| One-tile lookahead decision | ✅ Implemented | Decision made at tile center, executed on next tile |
| Red zone upward restriction | ❌ Not implemented | No intersection-specific rules |
| Ghost pathfinding to scatter target | ❌ Not implemented | No scatter target tiles used |
| Ghost pathfinding to chase target | ⚠️ Blinky only | Uses Pac-Man's `roundedX/Y` — correct for Blinky; Pinky/Inky/Clyde are stubs |
| Collision detection (Pac-Man vs ghost) | ❌ Not implemented | |
| Pass-through edge case | ❌ Not implemented | Collision itself not implemented |
| Eyes returning home | ❌ Not implemented | |
