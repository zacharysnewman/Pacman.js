# Chapter 2 — Ghost Modes (Modus Operandi)

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info)

---

## Overview

Ghosts have three **mutually-exclusive** modes of behavior they can be in during play:

---

## Chase Mode

A ghost's objective in chase mode is to find and capture Pac-Man by hunting him down through the maze. Each ghost exhibits **unique behavior** when chasing Pac-Man, giving them their different personalities:

| Ghost | Color | Personality | Japanese Name | Meaning |
|---|---|---|---|---|
| Blinky | Red | Very aggressive, hard to shake once behind you | *oikake* | "to run down or pursue" |
| Pinky | Pink | Tends to get in front and cut you off | *machibuse* | "to perform an ambush" |
| Inky | Cyan | Least predictable of the bunch | *kimagure* | "fickle, moody, or uneven temper" |
| Clyde | Orange | Does his own thing, stays out of the way | *otoboke* / "Guzuta" | "pretending ignorance" / "one who lags behind" |

See [Chapter 4 — Ghost AI](./11-ghost-ai.md) for each ghost's full targeting algorithm.

---

## Scatter Mode

In scatter mode, the ghosts **give up the chase** for a few seconds and head for their respective **home corners**. It is a welcome but brief rest — soon enough, they will revert to chase mode and be after Pac-Man again.

Each ghost has a **fixed target tile** in dead space just outside its home corner that it can never actually reach, causing it to loop around that corner indefinitely.

| Ghost | Scatter Corner | Target Tile (col, row) |
|---|---|---|
| Blinky | Top-right | (26, 0) |
| Pinky | Top-left | (2, 0) |
| Inky | Bottom-right | (27, 34) |
| Clyde | Bottom-left | (0, 34) |

> Coordinates are 0-indexed on the 28×36 tile grid used by this implementation.
> The target tiles are **in dead space** — the ghosts eternally approach but never reach them.

See [Chapter 4 — Scatter/Chase Timing](./04-scatter-chase-timing.md) for when scatter mode occurs.

---

## Frightened Mode

Ghosts enter frightened mode whenever Pac-Man eats one of the **four energizers** located near the corners of the maze.

- Ghosts **reverse direction** upon entering frightened mode.
- On earlier levels, ghosts turn **dark blue** and move more slowly.
- They **wander aimlessly** using a pseudo-random number generator (PRNG) to pick directions at intersections — there is no target tile.
- They **flash white** briefly as a warning before returning to their previous mode.
- The PRNG is **reset with the same seed** at the start of each new level and whenever a life is lost — meaning frightened ghosts always choose the same paths when executing patterns.
- The scatter/chase timer is **paused** while ghosts are frightened; it resumes when frightened mode ends.
- Ghosts return to the mode they were in **before** being frightened (chase or scatter).
- The **red-zone upward-turn restrictions** near the ghost house are **ignored** during frightened mode.

### Frightened Duration & Flash Count by Level

| Level | Frightened Time (s) | Flash Count |
|---|---|---|
| 1 | 6 | 5 |
| 2 | 5 | 5 |
| 3 | 4 | 5 |
| 4 | 3 | 5 |
| 5 | 2 | 5 |
| 6 | 5 | 5 |
| 7 | 2 | 5 |
| 8 | 2 | 5 |
| 9 | 1 | 3 |
| 10 | 5 | 5 |
| 11 | 2 | 5 |
| 12 | 1 | 3 |
| 13 | 1 | 3 |
| 14 | 3 | 5 |
| 15 | 1 | 3 |
| 16 | 1 | 3 |
| 17 | 0 | 0 |
| 18 | 1 | 3 |
| 19+ | 0 | 0 |

> When frightened time is 0, ghosts still **reverse direction** but do **not** turn blue and cannot be eaten.
> Flash interval: **14 game cycles** before end of frightened time.

---

## Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Chase mode (Blinky) | ⚠️ Approximate | Uses Euclidean distance heuristic to Pac-Man's tile — not the exact targeting spec |
| Chase mode (Pinky) | ❌ Not implemented | `Move.pinky()` is an empty stub |
| Chase mode (Inky) | ❌ Not implemented | `Move.inky()` is an empty stub |
| Chase mode (Clyde) | ❌ Not implemented | `Move.sue()` is an empty stub |
| Scatter mode | ❌ Not implemented | Corner target tiles defined in research but not in code |
| Frightened mode | ❌ Not implemented | No blue color, no PRNG wandering, no ghost eating |
| Mode switching | ❌ Not implemented | `AI.modePatterns` array is defined correctly but never activated |
| Frightened PRNG | ❌ Not implemented | |
| Scatter timer pause during frightened | ❌ Not implemented | |
