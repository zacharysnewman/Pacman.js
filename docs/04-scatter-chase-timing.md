# Chapter 4 — Scatter/Chase Timing

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info)

---

## Overview

Ghosts alternate between scatter and chase modes at **predetermined intervals**. Mode changes are easy to spot — the ghosts reverse direction when they occur.

- Scatter modes happen **four times per level** before the ghosts stay in chase mode indefinitely.
- The scatter/chase timer **resets** whenever a life is lost or a level is completed.
- At the start of a level or after losing a life, ghosts emerge from the ghost pen already in the **first scatter mode**.
- If ghosts enter **frightened mode**, the scatter/chase timer is **paused**. When frightened ends, they return to whichever mode they were in and the timer resumes.

---

## Timing Table

All values are in **seconds**.

| Mode | Level 1 | Levels 2–4 | Levels 5+ |
|---|---|---|---|
| **Scatter 1** | 7 | 7 | 5 |
| **Chase 1** | 20 | 20 | 20 |
| **Scatter 2** | 7 | 7 | 5 |
| **Chase 2** | 20 | 20 | 20 |
| **Scatter 3** | 5 | 5 | 5 |
| **Chase 3** | 20 | 1,033 | 1,037 |
| **Scatter 4** | 5 | 1/60 | 1/60 |
| **Chase 4** | indefinite | indefinite | indefinite |

### Notes

- **Scatter 4** at 1/60 second: appears as a simple reversal of direction with no visible scatter period.
- **Chase 3** of 1,033–1,037 seconds lasts over **17 minutes** — effectively permanent for most play.
- The transition from level 1 to levels 2–4 shrinks the 4th scatter from 5s → 1/60s and expands Chase 3 from 20s → 1,033s.
- Starting level 5, Scatter 1 and 2 shorten from 7s → 5s, and Chase 3 grows to 1,037s.

---

## Code Representation

The `AI.modePatterns` array in `src/static/AI.ts` already encodes this correctly as `[mode, level1, levels2-4, levels5+]` tuples (values in seconds; `-1` = indefinite):

```typescript
static modePatterns: [string, number, number, number][] = [
    ['scatter',  7,       7,       5      ],
    ['chase',    20,      20,      20     ],
    ['scatter',  7,       7,       5      ],
    ['chase',    20,      20,      20     ],
    ['scatter',  5,       5,       5      ],
    ['chase',    20,      1033,    1037   ],
    ['scatter',  5,       1 / 60,  1 / 60 ],
    ['chase',    -1,      -1,      -1     ],
];
```

---

## Implementation Status

| Feature | Status | Notes |
|---|---|---|
| Timing constants defined | ✅ Implemented | `AI.modePatterns` matches the spec exactly |
| Mode switching timer | ❌ Not implemented | `modePatterns` is defined but never read or activated |
| Scatter mode behavior | ❌ Not implemented | No corner targeting |
| Timer reset on life lost | ❌ Not implemented | |
| Timer reset on level complete | ❌ Not implemented | |
| Timer pause during frightened | ❌ Not implemented | |
| Ghost reversal on mode change | ❌ Not implemented | See [Chapter 3](./03-direction-reversal.md) |
