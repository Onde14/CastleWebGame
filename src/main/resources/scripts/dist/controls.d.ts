import { Vector } from "./vector.js";
import { Castle } from "./objects.js";
import { Gamestate } from "./gamestate.js";
import { UserInterface, Button } from "./ui.js";
export declare class Controls {
    selected: Map<string, Castle>;
    isSelecting: boolean;
    isTargetingEnemyCastle: boolean;
    gameWidth: number;
    gameHeight: number;
    gameState: Gamestate;
    ui: UserInterface;
    constructor(gameWidth: number, gameHeight: number, gameState: Gamestate, ui: UserInterface);
    deselect(): void;
    visualVector(v: Vector): Vector;
    isMouseTargetingButton(target: Vector, mouse_pos: Vector, button: Button): boolean;
    isMouseTargetingCastle(target: Vector, mouse_pos: Vector): boolean;
    mouseMove(mouse_pos: Vector, castles: Array<Castle>, playerId: string): void;
    mouseDown(target: Vector, castles?: Array<Castle>, playerId?: string): any;
}
//# sourceMappingURL=controls.d.ts.map