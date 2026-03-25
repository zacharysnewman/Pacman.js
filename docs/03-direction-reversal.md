# Chapter 3 — Direction Reversal

> Source: *The Pac-Man Dossier* by Jamey Pittman (pacman.holenet.info)

---

## The No-Reverse Rule

In all three modes of behavior, ghosts are **prohibited from reversing their direction of travel** on their own. They can only:

- Continue on their current course, or
- Turn to one side or the other at the next intersection

Once a ghost chooses a direction at an intersection, it must continue forward on that path until the next intersection.

---

## Forced Reversals (Mode Changes)

When the game changes modes, the system **overrides** the no-reverse rule and forces all ghosts to turn around. This reversal is a visual signal that mode has changed.

### When Reversals ARE Forced

| Transition | Forced Reversal |
|---|---|
| Chase → Scatter | ✅ Yes |
| Chase → Frightened | ✅ Yes |
| Scatter → Chase | ✅ Yes |
| Scatter → Frightened | ✅ Yes |

### When Reversals Are NOT Forced

| Transition | Forced Reversal |
|---|---|
| Frightened → Chase | ❌ No |
| Frightened → Scatter | ❌ No |

---

## Reversal Timing

When the system signals a reversal, ghosts do **not** all change direction simultaneously. The delay for each ghost depends on how long it takes that ghost to enter the next tile along its current path after the reversal signal is given.

1. Reversal signal is issued.
2. Ghost continues forward until it crosses into the **next tile**.
3. Upon entering that tile, the ghost obeys the reversal signal and turns around.

This can result in ghosts appearing to reverse with a slight delay between them.

---

## Ghost House Exit Direction

When a ghost exits the ghost house, it **normally moves left**. However, if the system changes modes **one or more times** while the ghost is inside the house, that ghost will move **right** instead upon exiting.

---

## Implementation Status

| Feature | Status | Notes |
|---|---|---|
| No-reverse rule during normal movement | ✅ Implemented | `canMoveLeft` checks `obj.moveDir !== 'right'` etc. in `AI.ghostTileCenter` |
| Forced reversal on mode change | ❌ Not implemented | Mode switching itself is not implemented |
| Ghost house exit direction (left vs right) | ❌ Not implemented | Ghosts don't leave the house yet |
