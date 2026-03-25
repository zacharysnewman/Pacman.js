# Chapter 11 — Ghost AI (Meet the Ghosts)

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info) — "Meet The Ghosts"

---

## Overview

All four ghosts share the same **pathfinding logic** (choose the direction that minimizes Euclidean distance to a target tile, with up/left/down/right tie-break priority). What makes each ghost unique is how it **calculates its target tile** in chase mode.

> "Itawani's team created the illusion of complex pathfinding by using very simple logic and very little code."

---

## Blinky — The Red Ghost

**Nickname:** Blinky
**Japanese:** *oikake* — "to run down or pursue"
**Personality:** Shadow — aggressive, direct, tenacious

### Chase Target

Blinky's target tile is always **Pac-Man's current tile**. No offset, no calculation — pure direct pursuit.

```
target = { x: pacman.roundedX(), y: pacman.roundedY() }
```

This makes Blinky the most relentless ghost. Once behind Pac-Man he is very hard to shake.

### Scatter Target

Fixed tile in the **top-right** corner: **(26, 0)** — in dead space above the maze.

### Cruise Elroy (special)

When dot count falls below the Elroy threshold, Blinky's **scatter target is overridden** — he keeps targeting Pac-Man's tile even during scatter periods. See [Chapter 6 — Speed](./06-speed.md) for Elroy thresholds and speeds.

### Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Chase — direct Pac-Man targeting | ✅ Implemented | `AI.ghostTileCenter(blinky)` uses `pacman.roundedX/Y()` |
| Scatter — corner target (26, 0) | ❌ Not implemented | |
| Cruise Elroy speed boost | ❌ Not implemented | |
| Elroy scatter override | ❌ Not implemented | |

---

## Pinky — The Pink Ghost

**Nickname:** Pinky
**Japanese:** *machibuse* — "to perform an ambush"
**Personality:** Speedy — aims to cut Pac-Man off ahead

### Chase Target

Pinky targets **4 tiles ahead of Pac-Man** in the direction Pac-Man is currently moving:

| Pac-Man Direction | Pinky's Target Offset |
|---|---|
| Left | 4 tiles to the left |
| Right | 4 tiles to the right |
| Down | 4 tiles downward |
| Up | **4 tiles up AND 4 tiles left** ⚠️ (overflow bug) |

The **upward overflow bug** is a real bug in the original arcade ROM. When Pac-Man faces up, the offset calculation overflows, mistakenly adding a leftward offset equal to the upward offset. This is part of authentic Pac-Man behavior.

```
// Correct directions:
target = pacman.tile + (0, -4)   // up (ignoring bug)
target = pacman.tile + (0, +4)   // down
target = pacman.tile + (-4, 0)   // left
target = pacman.tile + (+4, 0)   // right

// Actual behavior when facing up (with bug):
target = pacman.tile + (-4, -4)  // 4 up AND 4 left
```

### Scatter Target

Fixed tile in the **top-left** corner: **(2, 0)** — in dead space above the maze.

### Exploiting Pinky

Because Pinky targets 4 tiles *ahead* of Pac-Man, **changing direction** can instantly redirect Pinky. A single well-timed reversal toward Pinky just before he commits to an intersection turn can send him off in a different direction ("head faking").

### Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Chase — 4-tiles-ahead targeting | ❌ Not implemented | `Move.pinky()` is an empty stub |
| Upward overflow bug | ❌ Not implemented | |
| Scatter — corner target (2, 0) | ❌ Not implemented | |

---

## Inky — The Cyan Ghost

**Nickname:** Inky
**Japanese:** *kimagure* — "fickle, moody, or uneven temper"
**Personality:** Bashful — the least predictable, potentially most dangerous

### Chase Target

Inky's targeting is the most complex. It depends on **both Pac-Man's position/direction and Blinky's position**:

1. Find the **intermediate tile**: 2 tiles ahead of Pac-Man in his current direction
   *(Same upward overflow bug applies — 2 up facing up becomes 2 up AND 2 left)*
2. Draw a **vector** from Blinky's current tile to this intermediate tile
3. **Double** that vector (extend it by the same length again beyond the intermediate tile)
4. The tile at the end of the doubled vector is Inky's target

```
intermediate = pacman.tile + 2 tiles in pacman.direction   // (with up-bug)
vector       = intermediate - blinky.tile
target       = intermediate + vector                        // = blinky.tile + 2 * vector
             = 2 * intermediate - blinky.tile
```

**Example:** If Pac-Man is at (10, 10) facing right, intermediate is (12, 10). If Blinky is at (8, 10), the vector is (4, 0), and Inky's target is (16, 10).

### Why Inky Is Unpredictable

- When Blinky is **far from Pac-Man**, Inky's target is also far from Pac-Man
- As Blinky **closes in**, Inky's target moves toward Pac-Man too
- Inky's behavior changes as Pac-Man moves relative to Blinky — the further Pac-Man is from Blinky, the more erratic Inky becomes

### Scatter Target

Fixed tile in the **bottom-right** corner: **(27, 34)** — in dead space below the maze.

### Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Chase — Blinky-vector targeting | ❌ Not implemented | `Move.inky()` is an empty stub |
| Upward overflow bug | ❌ Not implemented | |
| Scatter — corner target (27, 34) | ❌ Not implemented | |

---

## Clyde — The Orange Ghost

**Nickname:** Clyde (Japanese: "Guzuta" — "one who lags behind")
**Japanese:** *otoboke* — "pretending ignorance"
**Personality:** Pokey — shy, tends to separate from the group

### Chase Target

Clyde switches his targeting based on his **distance to Pac-Man**:

```
distance = euclidean(clyde.tile, pacman.tile)

if distance >= 8:
    target = pacman.tile           // behaves like Blinky
else:
    target = scatterCorner         // (0, 34) — bottom-left
```

This creates a pattern of Clyde **approaching Pac-Man**, then veering off when he gets within 8 tiles, heading to his corner — then approaching again once far enough. He loops indefinitely if Pac-Man stays still.

### Why Clyde Seems Unpredictable

The 8-tile threshold is invisible to most players. Clyde will appear to be chasing aggressively like Blinky one moment, then suddenly dart away. He is still dangerous if Pac-Man gets in his way during the retreat.

### Scatter Target

Fixed tile in the **bottom-left** corner: **(0, 34)** — in dead space below the maze.

### Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Chase — distance-based dual targeting | ❌ Not implemented | `Move.sue()` is an empty stub |
| 8-tile proximity switch | ❌ Not implemented | |
| Scatter — corner target (0, 34) | ❌ Not implemented | |

---

## Scatter Corner Summary

| Ghost | Corner | Target Tile (col, row) |
|---|---|---|
| Blinky | Top-right | (26, 0) |
| Pinky | Top-left | (2, 0) |
| Inky | Bottom-right | (27, 34) |
| Clyde | Bottom-left | (0, 34) |

> All scatter targets are in **dead space** — tiles the ghosts can never actually reach — causing them to orbit the nearest corner.

---

## The Upward Overflow Bug (Pinky & Inky)

Both Pinky and Inky are affected by the same integer overflow bug in the original ROM when Pac-Man faces **upward**:

- **Pinky:** target offset should be (0, -4) but becomes (-4, -4)
- **Inky:** intermediate offset should be (0, -2) but becomes (-2, -2)

This is not a mistake to be fixed — it is a defining characteristic of authentic Pac-Man behavior and should be reproduced faithfully.
