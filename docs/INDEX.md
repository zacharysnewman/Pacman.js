# Pac-Man Dossier — Documentation Index

Based on *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info).
Each chapter documents the original arcade specification and notes what is currently implemented in this codebase.

---

## Chapters

| File | Contents |
|---|---|
| [01-basics.md](./01-basics.md) | Dot counts, scoring, energizers, ghost eating chain, bonus fruit |
| [02-ghost-modes.md](./02-ghost-modes.md) | Chase, Scatter, and Frightened modes overview; scatter corner targets |
| [03-direction-reversal.md](./03-direction-reversal.md) | No-reverse rule, forced reversals on mode change, ghost house exit direction |
| [04-scatter-chase-timing.md](./04-scatter-chase-timing.md) | Full scatter/chase timing table for all level groups |
| [05-frightened-behavior.md](./05-frightened-behavior.md) | PRNG wandering, duration/flash table by level, ghost eating |
| [06-speed.md](./06-speed.md) | Speed table by level, dot-eating pauses, Cruise Elroy thresholds |
| [07-cornering.md](./07-cornering.md) | Pre-turn / post-turn mechanics, diagonal speed boost |
| [08-ghost-house.md](./08-ghost-house.md) | Starting positions, personal/global dot counters, idle timer, stuck-ghost exploit |
| [09-maze-zones.md](./09-maze-zones.md) | Red zones (no upward turns), pink zones (tunnel speed penalty) |
| [10-maze-logic.md](./10-maze-logic.md) | Tile grid, actor occupancy, pathfinding algorithm, collision detection |
| [11-ghost-ai.md](./11-ghost-ai.md) | Per-ghost chase targeting: Blinky, Pinky, Inky, Clyde; upward overflow bug |
| [A1-appendix-tables.md](./A1-appendix-tables.md) | All numeric tables: speeds, frightened times, Elroy thresholds, fruit, scoring |
| [IMPLEMENTATION-STATUS.md](./IMPLEMENTATION-STATUS.md) | Full feature-by-feature implementation checklist (~30% complete) |

---

## Quick Reference

### Speeds (% of max)

| Level | PM | Ghost | Ghost Fright | Ghost Tunnel |
|---|---|---|---|---|
| 1 | 80% | 75% | 50% | 40% |
| 2–4 | 90% | 85% | 55% | 45% |
| 5–20 | 100% | 95% | 60% | 50% |
| 21+ | 90% | 95% | — | 50% |

### Ghost Chase Targets

| Ghost | Target |
|---|---|
| Blinky | Pac-Man's current tile |
| Pinky | 4 tiles ahead of Pac-Man (+ upward overflow bug) |
| Inky | Double vector from Blinky to 2-ahead of Pac-Man |
| Clyde | Pac-Man if ≥8 tiles away, else scatter corner |

### Scatter/Chase Timing

| Phase | L1 | L2–4 | L5+ |
|---|---|---|---|
| Scatter 1 | 7s | 7s | 5s |
| Chase 1 | 20s | 20s | 20s |
| Scatter 2 | 7s | 7s | 5s |
| Chase 2 | 20s | 20s | 20s |
| Scatter 3 | 5s | 5s | 5s |
| Chase 3 | 20s | 1033s | 1037s |
| Scatter 4 | 5s | 1/60s | 1/60s |
| Chase 4 | ∞ | ∞ | ∞ |
