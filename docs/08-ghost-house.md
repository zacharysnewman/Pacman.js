# Chapter 8 — Ghost House (Home Sweet Home)

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info)

---

## Overview

The **ghost house** (also called the monster pen) is the cordoned-off area in the center of the maze. It is the domain of the four ghosts and **off-limits to Pac-Man**.

Whenever a level is completed or a life is lost, ghosts return to their starting positions:

| Ghost | Starting Position |
|---|---|
| Blinky | Just above and **outside** the ghost house |
| Pinky | Inside — **center** |
| Inky | Inside — **left** |
| Clyde | Inside — **right** |

The **pink door** on top is used by ghosts to enter or exit the house. Once a ghost leaves, it **cannot re-enter** unless it is captured by Pac-Man — then only its eyes return to be revived.

Blinky starts outside every round. The only time he can enter the ghost house is after being eaten by Pac-Man, and he immediately turns around to leave once revived.

---

## Ghost Release — Personal Dot Counters

Each ghost has a personal dot counter that tracks how many dots Pac-Man eats. Rules:

- Only **one ghost's counter** can be active at a time
- Preference order: **Pinky → Inky → Clyde**
- Each dot Pac-Man eats increments the active ghost's counter by 1
- When a ghost's counter reaches its **dot limit**, it immediately exits and its counter deactivates
- The next most-preferred ghost inside then activates its counter

### Personal Dot Limits by Level

| Ghost | Level 1 | Level 2 | Level 3+ |
|---|---|---|---|
| Pinky | 0 | 0 | 0 |
| Inky | 30 | 0 | 0 |
| Clyde | 60 | 50 | 0 |

- **Pinky** always exits immediately (limit = 0) at the start of every level
- From **level 3 onwards**, all three ghosts exit immediately
- Counters are **reset to zero** when a level begins; they are **not reset** when deactivated (only deactivated)

---

## Ghost Release — Global Dot Counter (After a Life is Lost)

When a life is lost, the **personal counters are disabled** (but not reset) and a **global dot counter** takes over:

| Ghost | Released when global counter = |
|---|---|
| Pinky | 7 |
| Inky | 17 |
| Clyde | 32 (also deactivates the global counter if Clyde is inside) |

The global counter:
- Is **enabled and reset to zero** after a life is lost
- Counts every dot eaten from that point forward
- Can only be **deactivated** if Clyde is still inside the house when it reaches 32
- If Clyde is already outside when the counter hits 32, it **keeps counting** indefinitely (the "stuck ghosts" exploit)

Once deactivated, the **personal dot limits** are re-enabled for all remaining ghosts.

---

## Ghost Release — Idle Timer

If Pac-Man stops eating dots, a **fallback timer** forces ghosts out so they cannot be trapped forever:

| Levels | Timer Limit |
|---|---|
| 1–4 | **4 seconds** |
| 5+ | **3 seconds** |

- The timer **resets to zero** every time Pac-Man eats a dot
- When the timer reaches its limit, the most-preferred ghost waiting inside is **forced to exit immediately**
- The timer then resets and begins again
- Uses the same preference order: Pinky → Inky → Clyde

---

## Ghost House Return Target

When a ghost is eaten, its eyes navigate back to the ghost house using a **fixed target tile** located directly above the left side of the ghost house door. On the 28×36 grid this is approximately tile **(13, 14)**.

---

## The "Stuck Ghosts" Exploit

A subtle flaw allows Pinky, Inky, and Clyde to be kept inside the house indefinitely:

1. Sacrifice a life to reset and enable the global dot counter
2. **Avoid eating dots** — let the idle timer force Clyde out before 32 dots are eaten
3. Once Clyde exits, eat at least 32 dots total since the life was lost
4. Eat an energizer and gobble up ghosts — the three inside will remain stuck

Why it works: the global counter cannot deactivate unless Clyde is *inside* when it reaches 32. With Clyde already outside, it keeps counting past 32 with no mechanism to release the remaining ghosts. The only remaining control (the idle timer) can be indefinitely reset by eating a dot every few seconds.

---

## Ghost Exit Direction

- Normally, ghosts move **left** after exiting the ghost house
- If the system changes modes **one or more times** while a ghost is inside, that ghost moves **right** upon exiting instead

---

## In-House Behavior

While inside the ghost house, ghosts bounce up and down. Clyde's movement toward the exit door is the trigger that lifts Blinky's Elroy suspension after a death (see [Chapter 6 — Speed](./06-speed.md)).

---

## Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Ghost starting positions | ✅ Implemented | Blinky (13.5,14), Pinky (13.5,17), Inky (12,17), Clyde (15,17) |
| Ghost house rendered | ✅ Implemented | `Draw.cageGate()` draws the pink door |
| Ghosts locked inside house | ❌ Not implemented | All ghosts move freely from frame 1 |
| Personal dot counter system | ❌ Not implemented | |
| Global dot counter (after death) | ❌ Not implemented | |
| Idle timer release | ❌ Not implemented | |
| Ghost house return (eyes) | ❌ Not implemented | |
| In-house bouncing animation | ❌ Not implemented | |
| Ghost exit direction (left/right) | ❌ Not implemented | |
| Clyde exit unlocks Blinky Elroy | ❌ Not implemented | |
| Level 1 Inky limit (30) | ❌ Not implemented | |
| Level 1 Clyde limit (60) | ❌ Not implemented | |
| Level 2 Clyde limit (50) | ❌ Not implemented | |
