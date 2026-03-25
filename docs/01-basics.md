# Chapter 1 — The Basics

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info)

---

## Overview

The premise of Pac-Man is delightfully simple: using a four-way joystick, the player guides Pac-Man—up, down, left, and right—through a maze filled with dots for him to gobble up. Four ghost monsters are also in the maze and chase after our hero, trying to capture and kill him. The goal is to clear the maze of dots while avoiding the deadly ghosts.

Each round starts with the ghosts in the **monster pen** at the center of the maze, emerging from it to join in the chase. If Pac-Man is captured by a ghost, a life is lost, the ghosts are returned to their pen, and a new Pac-Man is placed at the starting position before play continues. When the maze is cleared of all dots, the board is reset and a new round begins. If Pac-Man gets caught when he has no extra lives, the game is over.

---

## Dots

| Item | Count | Points | Total |
|---|---|---|---|
| Small dot | 240 | 10 | 2,400 |
| Energizer (power pellet) | 4 | 50 | 200 |
| **Total** | **244** | — | **2,600** |

Pac-Man must eat all 244 dots to complete a round and advance to the next.

---

## Energizers & Ghost Eating

Whenever Pac-Man eats one of the four energizer dots located in the corners of the maze, the ghosts **reverse direction** and, in early levels, turn dark blue for a short period of time before returning to normal. While blue, they are vulnerable and can be eaten for bonus points—providing they are caught before the time expires.

After being eaten, a ghost's **eyes return to the monster pen** where it is resurrected, exiting to chase Pac-Man once again.

### Ghost Eating Score Chain

Each energizer resets the chain. Points **double** for each successive ghost eaten:

| Ghost # | Points |
|---|---|
| 1st | 200 |
| 2nd | 400 |
| 3rd | 800 |
| 4th | 1,600 |

If all four ghosts are captured at all four energizers in a single round, an additional **12,000 points** can be earned.

> By **level 19**, the ghosts stop turning blue altogether and can no longer be eaten for additional points.

---

## Bonus Fruit

Bonus symbols (commonly known as fruit) appear **directly below the monster pen** twice each round:

| Trigger | Condition |
|---|---|
| 1st appearance | After **70 dots** have been cleared |
| 2nd appearance | After **170 dots** have been cleared |

Each fruit stays on screen for between **9 and 10 seconds** before disappearing. The exact duration (e.g. 9.3333s, 10.0s, 9.75s) is variable and does not become predictable with patterns.

### Fruit Scoring by Level

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

The symbols used for the last six rounds completed, plus the current round, are shown along the bottom edge of the screen (the **fruit counter / level counter**).

---

## Extra Life

An extra life is awarded at **10,000 points**.

---

## Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Dot collection (10 pts) | ✅ Implemented | `pacmanOnTileChanged` in `Game.ts` |
| Energizer collection (50 pts) | ✅ Implemented | Sets tile to 5, calls `Stats.addToScore(50)` |
| Score tracking | ✅ Implemented | `Stats.currentScore`, `Stats.highScore` |
| Lives tracking | ⚠️ Partial | `Stats.lives = 3` initialised but never decremented |
| 244 dots in maze | ✅ Implemented | Level map has 240 dots (tile `3`) + 4 energizers (tile `4`) |
| Ghost eating score chain (200/400/800/1600) | ❌ Not implemented | No ghost collision or frightened mode |
| Bonus fruit spawning | ❌ Not implemented | No fruit logic exists |
| Extra life at 10,000 pts | ❌ Not implemented | Score is tracked but threshold not checked |
| Score display (HUD) | ❌ Not implemented | Score is calculated but never rendered |
| Lives display (HUD) | ❌ Not implemented | |
| Level/fruit counter display | ❌ Not implemented | |
| Game over condition | ❌ Not implemented | |
| Level clear / advance | ❌ Not implemented | |
