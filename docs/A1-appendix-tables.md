# Appendix A.1 — Complete Level Tables

> Data sourced from: *The Pac-Man Dossier* by Jamey Pittman, cross-referenced with open-source implementations (shaunlebron/pacman, floooh/pacman.c, SteveDunn/PacManBlazor).

---

## Table 1 — Speed by Level Group

All values are percentages of maximum speed. "NORM+Dots" is the effective Pac-Man speed accounting for the 1-frame dot-eating pause.

| Level | PM NORM | PM NORM+Dots | PM FRIGHT | PM FRIGHT+Dots | Ghost NORM | Ghost FRIGHT | Ghost TUNNEL |
|---|---|---|---|---|---|---|---|
| 1 | 80% | ~71% | 90% | ~79% | 75% | 50% | 40% |
| 2–4 | 90% | ~79% | 95% | ~83% | 85% | 55% | 45% |
| 5–20 | 100% | ~87% | 100% | ~87% | 95% | 60% | 50% |
| 21+ | 90% | ~79% | — | — | 95% | — | 50% |

- At level 21+, ghosts (95%) are **faster than Pac-Man** (90%)
- Pac-Man FRIGHT applies while ghosts are blue
- Ghost TUNNEL applies only inside side tunnels; Pac-Man is immune
- "—" means frightened mode no longer triggers (level 19+ for duration 0, 21+ for speed)

---

## Table 2 — Frightened Mode Duration & Flash Count by Level

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

- Flash interval begins **14 game cycles** (≈0.233 s) before frightened time expires
- At level 17 and 19+: ghosts reverse direction but do **not** turn blue and **cannot** be eaten

---

## Table 3 — Scatter/Chase Timing by Level Group

All values in seconds. See [Chapter 4](./04-scatter-chase-timing.md).

| Phase | Level 1 | Levels 2–4 | Levels 5+ |
|---|---|---|---|
| Scatter 1 | 7 | 7 | 5 |
| Chase 1 | 20 | 20 | 20 |
| Scatter 2 | 7 | 7 | 5 |
| Chase 2 | 20 | 20 | 20 |
| Scatter 3 | 5 | 5 | 5 |
| Chase 3 | 20 | 1,033 | 1,037 |
| Scatter 4 | 5 | 1/60 | 1/60 |
| Chase 4 | ∞ | ∞ | ∞ |

---

## Table 4 — Cruise Elroy Thresholds & Speeds by Level

Elroy 2 triggers at **half** the Elroy 1 dot count.

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

---

## Table 5 — Ghost Release Dot Limits by Level

### Personal Dot Counters (new level start)

| Ghost | Level 1 | Level 2 | Level 3+ |
|---|---|---|---|
| Pinky | 0 | 0 | 0 |
| Inky | 30 | 0 | 0 |
| Clyde | 60 | 50 | 0 |

### Global Dot Counter (after losing a life)

| Ghost | Released at counter = |
|---|---|
| Pinky | 7 |
| Inky | 17 |
| Clyde | 32 (and deactivates counter if inside) |

### Idle Timer (no dot eaten)

| Level | Timer Limit |
|---|---|
| 1–4 | 4 seconds (240 frames) |
| 5+ | 3 seconds (180 frames) |

---

## Table 6 — Bonus Fruit by Level

Fruit appears after **70 dots** and **170 dots** eaten; visible for **9–10 seconds** (variable).

| Level | Fruit | Points |
|---|---|---|
| 1 | Cherry | 100 |
| 2 | Strawberry | 300 |
| 3–4 | Orange | 500 |
| 5–6 | Apple | 700 |
| 7–8 | Melon | 1,000 |
| 9–10 | Galaxian | 2,000 |
| 11–12 | Bell | 3,000 |
| 13+ | Key | 5,000 |

---

## Table 7 — Scoring Summary

| Event | Points |
|---|---|
| Small dot | 10 |
| Energizer | 50 |
| 1st ghost (per energizer) | 200 |
| 2nd ghost | 400 |
| 3rd ghost | 800 |
| 4th ghost | 1,600 |
| Cherry | 100 |
| Strawberry | 300 |
| Orange | 500 |
| Apple | 700 |
| Melon | 1,000 |
| Galaxian | 2,000 |
| Bell | 3,000 |
| Key | 5,000 |
| Extra life | at 10,000 pts |
| Perfect maze (dots only) | 2,600 |
| Perfect maze (all ghosts all energizers) | 14,600 |

---

## Table 8 — Ghost Scatter Corner Targets

Target tiles are in **dead space** outside the navigable maze (on the 28×36 grid).

| Ghost | Corner | Target Tile (col, row) |
|---|---|---|
| Blinky | Top-right | (26, 0) |
| Pinky | Top-left | (2, 0) |
| Inky | Bottom-right | (27, 34) |
| Clyde | Bottom-left | (0, 34) |

Ghost house return target (eyes navigating home): approximately **(13, 14)** — directly above the left side of the ghost house door.

---

## Table 9 — Maze Constants

| Constant | Value |
|---|---|
| Total dots | 244 |
| Small dots | 240 |
| Energizers | 4 |
| Total dot points | 2,600 |
| Tile grid width | 28 |
| Tile grid height | 36 |
| Tile size (original arcade) | 8 × 8 px |
| Tile size (this implementation) | 20 × 20 px |
| Canvas size (this implementation) | 560 × 720 px |
| Fruit appearance 1 | After 70 dots eaten |
| Fruit appearance 2 | After 170 dots eaten |
| Fruit visibility duration | 9–10 seconds (variable) |
| Dot-eat pause | 1 frame (1/60 s) |
| Energizer-eat pause | 3 frames (3/60 s) |
| Extra life threshold | 10,000 points |
