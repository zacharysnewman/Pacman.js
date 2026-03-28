# Multiplayer Implementation Plan

## Design Decisions (Resolved)

| Question | Decision |
|---|---|
| Ghost multi-target strategy | Each ghost targets the **nearest active player** |
| Energizer scope | Any player eats a power pellet → **all ghosts frightened** |
| Ghost eaten chain | **Shared** across all players (escalates globally) |
| Max player count | **Up to 4 players** |
| Lives pool size | **Same as single-player (3 lives)** — shared across all players |
| Lives pool behavior | Deaths decrement the shared pool; when pool hits 0, dying players are eliminated rather than respawned |
| Game over condition | Only when **all players are simultaneously dead** |
| Level clear | If **any player** clears the level, **all players** (including eliminated ones) are revived for the next level |
| Extra life at 10k | **One life added to the shared pool** (not per player) |
| Elroy trigger | **No change** — based on total dots remaining in the shared maze; works identically with multiple players |
| Inky's targeting (Blinky reference) | **Option A** — Inky finds his nearest Pacman and uses that player for both the intermediate point and the Blinky vector; pincer behaviour is preserved against whoever Inky is closest to |

## Open Design Questions (Unresolved)

| # | Question | Options |
|---|---|---|
| 1 | **P2/P3/P4 colors** | Yellow taken; candidates: green, magenta, white, coral — avoid blue (frightened ghosts) and cyan (Inky) |
| 2 | **Death animation overlap** | Two players dying simultaneously — play both anims at once vs. queue them |
| 3 | **Touch controls for 3–4 players** | Left/right halves for 2P; 4P likely gamepads-only or quadrant zones |
| 4 | **"READY!" on individual death** | Freeze the whole game (current) vs. only pause the dying player while others keep moving |
| 5 | **High score entries** | Combined best score vs. per-player with a "2P/3P/4P" tag |
| 6 | **Fruit split** | First player to reach it eats it (no share) vs. simultaneous proximity awards to all nearby |

---

## Phase 1 — Input Abstraction

**Goal:** Replace the global `Input` static class with instantiable, player-owned input handlers that support keyboard and gamepad.

### `src/static/Input.ts` → `src/input/PlayerInput.ts`
- Define `PlayerInput` interface:
  ```ts
  interface PlayerInput {
    leftPressed: boolean
    rightPressed: boolean
    upPressed: boolean
    downPressed: boolean
    bufferedDir: Direction | null
    bufferedDirFramesLeft: number
    update(actor: IGameObject): void
    destroy(): void  // remove event listeners
  }
  ```

### `src/input/KeyboardPlayerInput.ts` *(new)*
- Implements `PlayerInput`
- Constructor accepts a key mapping:
  ```ts
  new KeyboardPlayerInput({ left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' })
  new KeyboardPlayerInput({ left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS' })
  new KeyboardPlayerInput({ left: 'KeyJ', right: 'KeyL', up: 'KeyI', down: 'KeyK' })
  new KeyboardPlayerInput({ left: 'Numpad4', right: 'Numpad6', up: 'Numpad8', down: 'Numpad5' })
  ```
- Registers its own `keydown`/`keyup` listeners on construction; `destroy()` removes them
- Moves walkability check (`tileValue > 2`) inside `update(actor)` rather than coupling to `gameState`
- Preserves 8-frame buffer behavior

### `src/input/GamepadPlayerInput.ts` *(new)*
- Implements `PlayerInput`
- Constructor accepts a gamepad index (0–3)
- Each frame polls `navigator.getGamepads()[index]`
- Maps standard gamepad D-pad (buttons 12–15) and left analog stick (axes 0/1, deadzone 0.3) to direction flags
- Mirrors 8-frame buffer behavior of keyboard input
- Static helpers:
  - `GamepadPlayerInput.connectedIndices(): number[]` — returns indices of currently connected gamepads
  - Listens to `gamepadconnected` / `gamepaddisconnected` window events; exposes a callback for the UI to react

### `src/Game.ts`
- Remove global `Input` import and `keydown`/`keyup` registration on window
- Each `PlayerState` owns its `PlayerInput` instance (constructed in player factory, see Phase 11)
- Game loop: `for (const p of gameState.players) p.input.update(p.actor)` replaces `Input.update()`
- `destroy()` called on each input instance when returning to menu

---

## Phase 2 — Player State Extraction

**Goal:** Everything that currently describes "one Pac-Man" becomes a `PlayerState` — grouping actor, input, stats, and death state together.

### `src/types.ts`
Add:
```ts
export interface PlayerState {
  id: number               // 1–4
  actor: IGameObject
  input: PlayerInput
  stats: PlayerStats       // see Phase 3
  frozen: boolean          // replaces gameState.pacmanFrozen (per-player ghost-eat freeze)
  dying: boolean           // replaces gameState.pacmanDying
  deathProgress: number    // replaces gameState.pacmanDeathProgress
  active: boolean          // false once eliminated (shared pool depleted on their death)
}
```

### `src/game-state.ts`
- Add `players: PlayerState[]`
- Add `sharedLives: number` — the global life pool, starts at 3 regardless of player count
- Remove: `pacman`, `pacmanFrozen`, `pacmanDying`, `pacmanDeathProgress`
- Keep all ghost state, maze state, scatter/chase, frightened, elroy, and fruit as **shared**
- `frozen` flag remains global (level clear, ready screen)

---

## Phase 3 — Per-Player Stats

**Goal:** `Stats` stops being a static class with one score/lives and becomes an instance per player.

### `src/PlayerStats.ts` *(new, replaces instance use of `Stats`)*
- Instance properties: `currentScore`, `extraLifeAwarded`
- Instance methods: `addToScore(points)`, `reset()`
- `addToScore` fires a callback (or checks against `gameState.sharedLives`) when score crosses 10,000 — adds **one life to the shared pool**, flagged so it only triggers once per game total (not once per player)

### `src/static/Stats.ts`
- Remove `lives`, `currentScore`, `extraLifeAwarded` static properties
- Keep static: `highScore`, `loadHighScores()`, `saveScore()`, `qualifiesForTopTen()`, `loadBestScore()`
- `highScore` updated whenever any player's score surpasses it

### `src/static/Draw.ts` — `Draw.hud()`
- Updated signature: `Draw.hud(players: PlayerState[], sharedLives: number)`
- Shared lives displayed once (bottom-left, Pacman icons) — single pool
- Per-player scores across the top row, adapting to player count:
  - 1P: `1UP` top-left, `HIGH SCORE` center (unchanged)
  - 2P: `1UP` top-left, `HIGH SCORE` center, `2UP` top-right
  - 3P/4P: scores equally spaced across top, high score omitted or shown very small
- Eliminated players shown dimmed/grey with no score updates

---

## Phase 4 — Parameterize `Move.pacman()`

**Goal:** Movement logic operates on a `PlayerState` rather than the global `gameState.pacman`.

### `src/static/Move.ts`
- `Move.pacman()` → `Move.pacman(player: PlayerState)`
- Replace `gameState.pacman` → `player.actor`
- Replace `gameState.pacmanFrozen` → `player.frozen`
- `gameState.frozen` check remains (global freeze still applies to all players)
- Ghost move functions unchanged — they already accept `IGameObject` via closure

### `src/Game.ts` — game loop
```ts
// Before
Move.pacman()

// After
for (const p of gameState.players) {
  if (p.active && !p.dying) Move.pacman(p)
}
```

---

## Phase 5 — Parameterize Tile Callbacks & Collision

**Goal:** Dot eating, collision, and death all operate on a specific player.

### `src/Game.ts` — `pacmanOnTileChanged`
Convert from free function to factory:
```ts
function makePacmanOnTileChanged(player: PlayerState) {
  return (x: number, y: number) => {
    // dot eating: player.stats.addToScore(10), player.actor.moveSpeed = 0
    // energizer: activateFrightened() is global — all ghosts turn blue regardless of which player ate it
    // dot counters: incrementDotCounters() still shared (fruit/house release is global)
    // level clear check: countRemainingDots() still shared maze
  }
}
```

### `src/Game.ts` — `checkCollisions()`
```ts
function checkCollisions(): void {
  for (const player of gameState.players) {
    if (!player.active || player.dying || player.frozen) continue
    const px = player.actor.roundedX()
    const py = player.actor.roundedY()
    for (const ghost of gameState.ghosts) {
      if (ghost.roundedX() !== px || ghost.roundedY() !== py) continue
      if (ghost.ghostMode === 'frightened') {
        eatGhost(ghost, player)  // score attributed to the player who ate it
      } else if (ghost.ghostMode !== 'eyes' && ghost.ghostMode !== 'house' && ghost.ghostMode !== 'exiting') {
        loseLife(player)
        return
      }
    }
  }
}
```

### `src/Game.ts` — `eatGhost(ghost, player)`
- `ghostEatenChain` stays on `gameState` — **shared**, escalates across all players globally
- `player.stats.addToScore(score)` — attributed to the player who ate the ghost
- `player.frozen = true` for 0.5s — only freezes that player (see Design Question 4 re: READY! behavior)

### `src/Game.ts` — `loseLife(player)`
- `gameState.sharedLives--`
- Sets `player.dying = true`, `player.deathProgress = 0`
- If `gameState.sharedLives <= 0`: mark `player.active = false` after death anim — no respawn
- If `gameState.sharedLives > 0`: respawn this player after death anim
- Game over check: `gameState.players.every(p => !p.active)` → trigger full game over
- Level clear revive: on `levelClear()`, set all players `active = true`, reset positions, restore `sharedLives = 3`

### `src/Game.ts` — `checkFruitCollision()`
- Loop over all active players; first player to collide eats the fruit (removed on first hit)

---

## Phase 6 — Ghost AI Multi-Target

**Goal:** Ghost targeting picks the nearest active player rather than a hardcoded single Pacman.

### `src/static/AI.ts` — `ghostTileCenter(ghost)`
Add helper:
```ts
static nearestPlayer(ghost: IGameObject): IGameObject | null {
  let nearest: IGameObject | null = null
  let minDist = Infinity
  for (const player of gameState.players) {
    if (!player.active || player.dying) continue
    const d = getDistance(ghost.roundedX(), ghost.roundedY(), player.actor.roundedX(), player.actor.roundedY())
    if (d < minDist) { minDist = d; nearest = player.actor }
  }
  return nearest
}
```

All chase-mode targeting resolves the Pacman reference through `nearestPlayer()`:
- **Blinky:** `target = nearestPlayer(blinky).tile`
- **Pinky:** `tilesAheadOf(nearestPlayer(pinky), 4)`
- **Inky:** finds `nearestPlayer(inky)`, uses that actor for **both** the intermediate point (2 ahead) and the Blinky-vector calculation — pincer behaviour preserved against whoever Inky is closest to
- **Clyde:** proximity logic against `nearestPlayer(clyde)`
- Elroy scatter override: `nearestPlayer(blinky).tile`

### `src/static/AI.ts` — `tilesAheadOfPacman(n)` → `tilesAheadOf(actor, n)`
- Accept any `IGameObject` instead of always reading `gameState.pacman`
- Same upward overflow bug preserved

---

## Phase 7 — Rendering Updates

**Goal:** Canvas correctly renders up to 4 Pacmen and a multi-player HUD.

### `src/static/Draw.ts` — `Draw.pacman(obj, player)`
- Draw function closes over player: `(obj) => Draw.pacman(obj, player)`
- Player colors (subject to Design Question 1):
  - P1: `yellow`
  - P2: `#00e676` (green)
  - P3: `#ff6ec7` (magenta)
  - P4: `white`
- Death anim reads `player.deathProgress` instead of `gameState.pacmanDeathProgress`
- Each player's death anim plays independently

### `src/static/Draw.ts` — `Draw.ghost(obj)`
- Replace `gameState.pacmanDying` check with `gameState.players.some(p => p.dying)`
- Preserves the original behavior of hiding ghosts during any death sequence

### `src/static/Draw.ts` — `Draw.hud(players, sharedLives)`
- Single shared lives row bottom-left (Pacman icons representing pool)
- Score layout adapts to player count (see Phase 3)
- Eliminated players: score shown dimmed, no icon in lives row

### `src/Game.ts` — game loop death progress
```ts
for (const p of gameState.players) {
  if (p.dying) {
    p.deathProgress = Math.min(p.deathProgress + Time.deltaTime / DEATH_ANIM_DURATION, 1.0)
  }
}
```

### `src/Game.ts` — `gameState.gameObjects`
- Contains all 4 ghost actors + all active player actors
- Order: player actors first (drawn under ghosts), then ghosts

---

## Phase 8 — Player Selection Menu

**Goal:** Screen between the start screen and gameplay where 1–4 players join and assign input devices.

### `src/Game.ts` — new `playerSelectLoop()` state
New game phase after tapping start:

**Layout (up to 4 slot cards):**
```
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│  P1  │ │  P2  │ │  P3  │ │  P4  │
│  ●   │ │  ●   │ │  —   │ │  —   │
│ARROWS│ │ WASD │ │      │ │      │
│JOINED│ │JOINED│ │ JOIN │ │ JOIN │
└──────┘ └──────┘ └──────┘ └──────┘
         PRESS START / TAP TO BEGIN
```

- Slot card shows player color Pacman icon if joined, grey outline if open
- Input device label: `ARROWS`, `WASD`, `IJKL`, `NUMPAD`, `GAMEPAD 1`–`GAMEPAD 4`
- Pressing any button on a connected gamepad claims that slot
- Keyboard: P1 defaults to arrows, P2 WASD, P3 IJKL, P4 numpad
- Minimum 1 player required to start
- `GAMEPAD N CONNECTED` badge appears dynamically as controllers plug in

### `src/static/Draw.ts` — `Draw.playerSelectScreen(slots)`
- New static method rendering slot cards
- Slot data type:
  ```ts
  interface PlayerSlot { id: number; joined: boolean; inputLabel: string; color: string }
  ```

---

## Phase 9 — Game Over / End Screen

**Goal:** End state reflects up to 4 players with winner declaration and per-player high score entry.

### `src/Game.ts` — game over trigger
- `loseLife(player)` sets `player.active = false` when shared pool is empty
- Each frame: `if (gameState.players.every(p => !p.active)) triggerGameOver()`
- Game continues as long as at least one player is active

### `src/Game.ts` — `levelClear()`
- All players revived: `p.active = true`, `p.dying = false`
- Shared lives pool reset to 3
- All positions reset

### `src/static/Draw.ts` — `Draw.gameOverScreen(players)`
- Dark overlay
- `GAME OVER` heading (red)
- Per-player result rows ranked by score: `P1  AAA  012340  👑`
- Crown on highest scorer; `DRAW` if tied
- `TAP TO CONTINUE` prompt after 2s

### `src/Game.ts` — initials entry sequence
- After game over screen, iterate players whose score `qualifiesForTopTen()` sequentially
- Each calls `Stats.saveScore(initials, player.stats.currentScore)`
- After all entries: return to menu

---

## Phase 10 — Sound Adjustments

**Goal:** Sound events fire correctly for multi-player scenarios.

### `src/static/Sound.ts`
- `Sound.death()` — Web Audio is polyphonic; overlapping death sounds play naturally; no change
- `Sound.dot()` — fires for any player eating; stateless; no change
- `Sound.ghostEaten()` — fires on any player eating a ghost; no change

### `src/Game.ts` — `updateAmbientSiren()`
- Stop siren only on `gameState.frozen` (global) or `gameState.gameOver`
- Per-player `player.frozen` (ghost-eat pause) should **not** stop the siren — other players keep moving
- Siren state priority unchanged: `eyes` > `blue` > `normal`

---

## Phase 11 — Actor Construction & `GameObject` Cleanup

**Goal:** Clean, scalable factory for creating player actors.

### `src/Game.ts` — player factory
```ts
function createPlayer(id: number, startTile: {x: number, y: number}, input: PlayerInput, color: string): PlayerState {
  const stats = new PlayerStats()
  // playerState ref needed in closures below
  let playerState: PlayerState
  const actor = new GameObject(
    color,
    startTile.x, startTile.y,
    0.667,
    () => Move.pacman(playerState),
    (obj) => Draw.pacman(obj, playerState),
    (x, y) => makePacmanOnTileChanged(playerState)(x, y),
    (_x, _y) => {},
  )
  playerState = { id, actor, input, stats, frozen: false, dying: false, deathProgress: 0, active: true }
  return playerState
}
```

Starting positions for multi-player — all players currently share `(13.5, 26)`. Options:
- All stack on same tile (they pass through each other)
- Spread horizontally along row 26 (needs safe-tile verification)
- Stagger slightly and snap to nearest safe tile at game start

### `src/Game.ts` — `initializeLevel()` and `start()`
- `start()` reads confirmed player slots from player select screen
- `gameState.players = slots.map(s => createPlayer(s.id, START.pacman, s.input, s.color))`
- `gameState.sharedLives = 3`
- `gameState.gameObjects = [...gameState.players.map(p => p.actor), ...gameState.ghosts]`

### `src/object/GameObject.ts`
- No structural changes required

---

## Phase 12 — Menu Flow Wiring

**Goal:** Complete flow from start screen → player select → gameplay → game over → start screen.

### Flow
```
startScreenLoop()
  └─ tap/click
       └─ playerSelectLoop()
            └─ start pressed (≥1 player joined)
                 └─ start(confirmedSlots)
                      └─ update() [game loop]
                           └─ all players dead
                                └─ gameOverSequence()
                                     └─ initials entry (per qualifying player, sequential)
                                          └─ returningToMenu = true
                                               └─ startScreenLoop()
```

### `src/Game.ts`
- `gameStarted` flag set after player select, not immediately on tap
- `returningToMenu` unchanged — resets to start screen
- `start(slots)` constructs players from confirmed slots, initializes level, starts update loop
- Touch controls: `setupTouchControls()` wires swipe for players using touch input only
