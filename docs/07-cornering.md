# Chapter 7 — Cornering

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info)

---

## Overview

Pac-Man is able to navigate turns in the maze **faster than the ghosts**. He does not have to wait until he reaches the middle of a turn to change direction as the ghosts do. Instead, he may start turning **several pixels before** he reaches the center of a turn and for **several pixels after** passing it.

- **Pre-turn:** Turn started one or more pixels before the tile center
- **Post-turn:** Turn started one or more pixels after the tile center
- Ghosts must be exactly at the **tile center** before they can change direction

---

## How Cornering Works

When Pac-Man makes a pre-turn or post-turn:

1. His orientation changes immediately
2. He moves **one pixel in his new direction for every pixel traveled in his old direction** — effectively moving at a **45° diagonal**
3. This diagonally doubles his effective speed through the turn
4. Once he reaches the **centerline** of the new path, he resumes moving purely in that direction at normal speed

The greatest distance advantage is gained by making the **earliest pre-turn possible**.

---

## Pre-Turn / Post-Turn Pixel Windows

The number of pre-turn and post-turn pixels available depends on the direction Pac-Man is approaching the intersection:

| Approach Direction | Pre-turn Pixels | Post-turn Pixels |
|---|---|---|
| From the left | 3 | 4 |
| From the right | 4 | 3 |
| From the top | 4 | 3 |
| From the bottom | 3 | 4 |

> For any turn made later than the earliest possible pre-turn, Pac-Man is **one frame behind** for every pixel of "lateness."

---

## Why Cornering Matters

- Cornering through a series of quick turns will **shake off even the most determined pursuer**
- It is required to execute patterns reliably — patterns are designed around **perfect cornering** to remove timing uncertainty
- Without cornering, reproducing exact timing from a pattern is near-impossible
- "Turning three pixels from center instead of four when approaching from the right" is considered a timing flaw

---

## Cornering & Pattern Play

Patterns are designed to be played with **perfect cornering**:

- It removes human timing variability (Pac-Man is always in the same tile at the same time)
- Some patterns "hold together" even with small errors; others fall apart if even one turn is slightly off
- Late-pattern sequences bringing Pac-Man close to ghosts are especially sensitive

---

## Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Pac-Man grid alignment (lerp) | ✅ Implemented | `Move.pacman()` lerps toward tile center on perpendicular axis |
| Pre-turn cornering | ❌ Not implemented | Direction only changes when tile ahead is confirmed clear |
| Post-turn cornering | ❌ Not implemented | |
| Diagonal speed boost during corner | ❌ Not implemented | |
| Input buffering (queue next turn) | ❌ Not implemented | Turn is rejected if the target tile is a wall — no buffering |
| Ghost must be at tile center to turn | ✅ Implemented | Ghost direction changes in `ghostOnTileCentered()` callback |

> **Note:** The current `Input.update()` only applies a direction change if the tile in that direction is immediately open (`> 2`). This means players must time inputs precisely to the tile boundary rather than being able to queue a turn in advance.
