# Chapter 6 — Speed

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info)

---

## Overview

All speeds are expressed as a **percentage of maximum speed**. At 80%, Pac-Man moves at roughly one tile per tick at 60 FPS. Speed is not a continuous value — the game uses a step-based system where actors move a fixed number of pixels per frame according to a lookup table.

---

## Pac-Man Speed

- Starts at **80%** on level 1
- Reaches **full speed (100%)** by level 5, holding there through level 20
- Drops back to **90%** at level 21 and stays there for the remainder of the game

### Dot-Eating Penalties

Every time Pac-Man eats a dot, he stops moving for a brief period:

| Event | Pause Duration |
|---|---|
| Eat a regular dot | **1 frame** (1/60 s) — slows Pac-Man by ~10% |
| Eat an energizer | **3 frames** (3/60 s) |

This 1-frame pause is just enough for a following ghost to overtake Pac-Man.

---

## Ghost Speed

- Normal ghost speed is **slightly slower than Pac-Man's** until level 21, when ghosts become faster
- Ghost speed in a **side tunnel** is cut to roughly **half** of normal ghost speed
- Frightened ghosts move at a much **slower** rate than normal

---

## Speed Table

All values are percentages of maximum speed. "NORM DOTS" is the effective speed accounting for the 1-frame dot-eating pause.

| Level | Pac-Man NORM | Pac-Man NORM+Dots | Pac-Man FRIGHT | Pac-Man FRIGHT+Dots | Ghost NORM | Ghost FRIGHT | Ghost TUNNEL |
|---|---|---|---|---|---|---|---|
| 1 | 80% | ~71% | 90% | ~79% | 75% | 50% | 40% |
| 2–4 | 90% | ~79% | 95% | ~83% | 85% | 55% | 45% |
| 5–20 | 100% | ~87% | 100% | ~87% | 95% | 60% | 50% |
| 21+ | 90% | ~79% | — | — | 95% | — | 50% |

- At level 21+, ghosts are **faster than Pac-Man** (95% vs 90%)
- Pac-Man frightened speed (`FRIGHT`) applies while ghosts are blue — Pac-Man also speeds up on levels 1–4
- Ghost `FRIGHT` speed applies to all four ghosts simultaneously while in frightened mode
- Ghost `TUNNEL` speed applies only while inside the side tunnels; Pac-Man is **immune** to this penalty

---

## Cruise Elroy (Blinky Speed Boost)

When the dot count in the maze drops below a threshold, Blinky enters an accelerated state known as **"Cruise Elroy"**. This happens **twice** per level at two different dot counts:

- **Elroy 1:** First speed boost — Blinky reaches at least Pac-Man's speed. His scatter behavior also changes to keep chasing Pac-Man instead of retreating to his corner.
- **Elroy 2:** Second speed boost — Blinky becomes **faster than Pac-Man**.

### Elroy Dot Thresholds & Speeds by Level

| Level | Elroy 1 (dots left) | Elroy 1 Speed | Elroy 2 (dots left) | Elroy 2 Speed |
|---|---|---|---|---|
| 1 | 20 | 80% | 10 | 85% |
| 2 | 30 | 90% | 15 | 95% |
| 3–4 | 40 | 90% | 20 | 95% |
| 5–7 | 40 | 100% | 20 | 105% |
| 8–10 | 50 | 100% | 25 | 105% |
| 11–13 | 60 | 100% | 30 | 105% |
| 14–17 | 80 | 100% | 40 | 105% |
| 18+ | 100 | 100% | 50 | 105% |

> As the levels progress, Blinky turns into Elroy with **more dots remaining** in the maze than in previous rounds — making him dangerous much earlier in later levels.

### Elroy After a Death

If Pac-Man dies, Blinky's Elroy abilities are **suspended** until Clyde stops bouncing inside the ghost house and moves toward the door to exit. Once Clyde begins exiting, Blinky resumes Elroy behavior based on the current dot count.

---

## Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Dot-eating 1-frame pause | ✅ Implemented | `Time.addTimer(0.01666s, ...)` — correct at 60 FPS |
| Energizer 3-frame pause | ✅ Implemented | `Time.addTimer(0.05s, ...)` — correct at 60 FPS |
| Level-based Pac-Man speed | ❌ Not implemented | `moveSpeed` hardcoded to `1.0` for all actors |
| Level-based ghost speed | ❌ Not implemented | All ghosts same fixed speed |
| Ghost frightened speed reduction | ❌ Not implemented | |
| Ghost tunnel speed penalty | ❌ Not implemented | Tunnel teleport exists for Pac-Man, not speed reduction for ghosts |
| Pac-Man frightened speed boost | ❌ Not implemented | |
| Cruise Elroy (dot count tracking) | ❌ Not implemented | |
| Elroy speed boost | ❌ Not implemented | |
| Elroy scatter override (keeps chasing) | ❌ Not implemented | |
| Elroy suspended after death | ❌ Not implemented | |
| Speed lookup table system | ❌ Not implemented | Movement uses `2 * moveSpeed * scaledDeltaTime * normalizedUnit()` |
