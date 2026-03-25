import { gameState } from '../game-state';
import type { Direction } from '../types';

export class Input {
    static leftPressed = false;
    static rightPressed = false;
    static upPressed = false;
    static downPressed = false;
    static bufferedDir: Direction | null = null;

    static checkKeyDown(e: KeyboardEvent): void {
        switch (e.keyCode) {
            case 37: Input.leftPressed = true; break;
            case 38: Input.upPressed = true; break;
            case 39: Input.rightPressed = true; break;
            case 40: Input.downPressed = true; break;
        }
    }

    static checkKeyUp(e: KeyboardEvent): void {
        switch (e.keyCode) {
            case 37: Input.leftPressed = false; break;
            case 38: Input.upPressed = false; break;
            case 39: Input.rightPressed = false; break;
            case 40: Input.downPressed = false; break;
        }
    }

    static update(): void {
        const pacman = gameState.pacman;

        // Immediate keys override the buffer
        if (Input.leftPressed)  Input.bufferedDir = 'left';
        if (Input.upPressed)    Input.bufferedDir = 'up';
        if (Input.rightPressed) Input.bufferedDir = 'right';
        if (Input.downPressed)  Input.bufferedDir = 'down';

        if (Input.bufferedDir !== null) {
            const dir = Input.bufferedDir;
            const tileOpen =
                dir === 'left'  ? (pacman.leftObject()   ?? 0) > 2 :
                dir === 'right' ? (pacman.rightObject()  ?? 0) > 2 :
                dir === 'up'    ? (pacman.topObject()    ?? 0) > 2 :
                                  (pacman.bottomObject() ?? 0) > 2;

            if (tileOpen) {
                pacman.moveDir = dir;
                Input.bufferedDir = null;
            }
        }
    }
}
