# Implementation Status

Consolidated view of what is and is not yet implemented in `Pacman.js`, measured against the original arcade specification documented in *The Pac-Man Dossier* by Jamey Pittman.

---

## Legend

| Symbol | Meaning |
|---|---|
| ✅ | Fully implemented and correct |
| ⚠️ | Partially implemented or approximated |
| ❌ | Not implemented |

---

## Core Engine

| Feature | Status | Notes / File |
|---|---|---|
| 60 FPS game loop (requestAnimationFrame) | ✅ | `Game.ts` |
| Canvas 28×36 tile grid (20 px tiles, 560×720) | ✅ | `constants.ts` |
| Delta-time scaled movement | ✅ | `Time.scaledDeltaTime` |
| Tile occupancy tracking (center point) | ✅ | `GameObject.roundedX/Y()` |
| `onTileChanged` callback | ✅ | `GameObject.checkTileUpdates()` |
| `onTileCentered` callback | ✅ | 0.1-tile threshold in `GameObject` |
| Keyboard input (arrow keys) | ✅ | `Input.ts` |
| Touch / swipe input | ✅ | `Game.ts` — min 20 px swipe, 300 ms clear |
| Responsive canvas scaling | ✅ | `resizeCanvas()` in `Game.ts` |
| Timer system | ✅ | `Time.addTimer()` / `Timer.ts` |

---

## Pac-Man

| Feature | Status | Notes / File |
|---|---|---|
| Pac-Man movement | ✅ | `Move.pacman()` |
| Perpendicular axis alignment (lerp) | ✅ | Lerp factor 0.1 toward tile center |
| Tunnel teleport (left ↔ right) | ✅ | `Move.moveObject()` wraps on `undefined` tile |
| Dot collection (10 pts, 1-frame pause) | ✅ | `pacmanOnTileChanged()` — `0.01666s` timer ≈ 1 frame |
| Energizer collection (50 pts, 3-frame pause) | ✅ | `pacmanOnTileChanged()` — `0.05s` timer ≈ 3 frames |
| Score tracking | ✅ | `Stats.addToScore()` |
| Pac-Man animation (mouth open/close) | ✅ | `Draw.pacman()` — 8 frames at 30 fps |
| Direction facing in animation | ✅ | `dirMultiplier` rotates arc |
| Level-based speed (80% / 90% / 100%) | ❌ | `moveSpeed` hardcoded to `1.0` |
| Frightened speed boost | ❌ | |
| Cornering (pre-turn / post-turn) | ❌ | Direction only changes when tile ahead is clear |
| Input buffering for turns | ❌ | Turn rejected immediately if wall is ahead |

---

## Ghosts — Shared

| Feature | Status | Notes / File |
|---|---|---|
| 4 ghosts rendered (correct colors) | ✅ | Red, hotpink, cyan, orange |
| Starting positions | ✅ | Blinky(13.5,14) Pinky(13.5,17) Inky(12,17) Clyde(15,17) |
| Ghost body rendering | ✅ | `Draw.drawGhostBody()` |
| Ghost eye rendering (static) | ✅ | `Draw.drawGhostEyes()` — pupils don't track direction |
| Ghost movement (Blinky) | ⚠️ | `Move.blinky()` calls `moveObject()` but direction set by AI |
| Ghost movement (Pinky / Inky / Clyde) | ❌ | `Move.pinky/inky/sue()` are empty stubs |
| No-reverse rule | ✅ | Opposite direction excluded in `AI.ghostTileCenter()` |
| Up/Left/Down/Right tie-break priority | ✅ | Push order in `AI.ghostTileCenter()` matches spec |
| Level-based ghost speed | ❌ | Fixed speed for all ghosts |
| Tunnel teleport for ghosts | ❌ | Only Pac-Man wraps |
| Tunnel speed penalty | ❌ | No zone detection |
| Red zone upward restriction | ❌ | No intersection-specific rules |
| Ghost eye direction tracking movement | ❌ | Pupils are static |
| Frightened appearance (blue body) | ❌ | |
| Frightened flash warning | ❌ | |
| Ghost collision with Pac-Man → life lost | ❌ | |

---

## Ghost AI — Modes

| Feature | Status | Notes / File |
|---|---|---|
| Scatter/chase timing constants | ✅ | `AI.modePatterns` matches spec exactly |
| Mode switching timer | ❌ | `modePatterns` defined but never activated |
| Scatter mode (corner targeting) | ❌ | |
| Forced reversal on mode change | ❌ | |
| Scatter/chase timer pause in frightened | ❌ | |
| Timer reset on life lost / level complete | ❌ | |
| Ghosts start in scatter on level begin | ❌ | Currently in chase immediately |

---

## Ghost AI — Individual Targeting

| Ghost | Chase Target | Status | Notes |
|---|---|---|---|
| Blinky | Pac-Man's current tile | ✅ | `AI.ghostTileCenter()` uses `pacman.roundedX/Y()` |
| Pinky | 4 tiles ahead of Pac-Man (with up-bug) | ❌ | Stub |
| Inky | Doubled vector from Blinky to 2-ahead of Pac-Man (with up-bug) | ❌ | Stub |
| Clyde | Pac-Man if ≥8 tiles away, else scatter corner | ❌ | Stub |
| All — Scatter | Fixed corner target tile | ❌ | |
| All — Frightened | PRNG random wandering | ❌ | |
| All — Eyes | Fixed ghost house return tile | ❌ | |
| Pinky/Inky upward overflow bug | ❌ | Should reproduce authentic ROM behavior |

---

## Ghost House & Release

| Feature | Status | Notes / File |
|---|---|---|
| Ghost house rendered (pink door) | ✅ | `Draw.cageGate()` |
| Ghosts locked inside house at start | ❌ | Ghosts move freely from frame 1 |
| Personal dot counter system | ❌ | |
| L1: Inky limit 30, Clyde limit 60 | ❌ | |
| L2: Clyde limit 50 | ❌ | |
| L3+: all exit immediately | ❌ | |
| Global dot counter after life lost | ❌ | |
| Idle timer (4 s / 3 s) | ❌ | |
| In-house bouncing animation | ❌ | |
| Ghost exit direction (left vs right) | ❌ | |
| Ghost eyes returning home | ❌ | |
| Ghost revived in house | ❌ | |

---

## Cruise Elroy

| Feature | Status | Notes |
|---|---|---|
| Dot count tracking | ❌ | |
| Elroy 1 speed boost | ❌ | |
| Elroy 2 speed boost | ❌ | |
| Elroy scatter override (keep chasing) | ❌ | |
| Elroy suspended after Pac-Man death | ❌ | |
| Elroy resumes when Clyde exits | ❌ | |

---

## Frightened Mode

| Feature | Status | Notes |
|---|---|---|
| Ghost frightened state triggered by energizer | ❌ | |
| Ghost blue visual | ❌ | |
| Ghost flash warning | ❌ | |
| Frightened speed reduction | ❌ | |
| PRNG random wandering | ❌ | |
| PRNG reset on new level / life lost | ❌ | |
| Ghost eating collision | ❌ | |
| Score chain 200→400→800→1,600 | ❌ | |
| Pac-Man freeze on ghost eat | ❌ | |
| Ghost eyes return home | ❌ | |
| Per-level duration table | ❌ | |
| Red zone ignored in frightened | ❌ | |

---

## Lives & Game Flow

| Feature | Status | Notes / File |
|---|---|---|
| Lives initialised to 3 | ✅ | `Stats.lives = 3` |
| Life lost on ghost collision | ❌ | |
| Ghost/Pac-Man reset on death | ❌ | |
| Scatter/chase timer reset on death | ❌ | |
| PRNG seed reset on death | ❌ | |
| Game over on 0 lives | ❌ | |
| Level clear on all dots eaten | ❌ | |
| Level counter increment | ❌ | |
| Extra life at 10,000 pts | ❌ | |
| Pass-through collision edge case | ❌ | Collision itself not implemented |

---

## HUD & Display

| Feature | Status | Notes |
|---|---|---|
| Score display | ❌ | Score tracked in `Stats` but never rendered |
| High score display | ❌ | |
| Lives display | ❌ | |
| Level / fruit counter display | ❌ | |
| Fruit sprite on screen | ❌ | |
| Ghost score display on eat | ❌ | |
| Ready! / Game Over text | ❌ | |

---

## Audio

| Feature | Status | Notes |
|---|---|---|
| Any sound | ❌ | No audio implementation exists |

---

## Summary

| Category | Implemented | Total | % Done |
|---|---|---|---|
| Core engine | 10 | 10 | 100% |
| Pac-Man | 9 | 13 | 69% |
| Ghosts (shared) | 8 | 15 | 53% |
| Ghost AI — modes | 1 | 7 | 14% |
| Ghost AI — targeting | 1 | 8 | 13% |
| Ghost house & release | 2 | 14 | 14% |
| Cruise Elroy | 0 | 6 | 0% |
| Frightened mode | 0 | 14 | 0% |
| Lives & game flow | 1 | 10 | 10% |
| HUD & display | 0 | 8 | 0% |
| Audio | 0 | 1 | 0% |
| **Overall** | **32** | **106** | **~30%** |
