import { Vector } from "./vector.js";
import { Castle } from "./objects.js";
import { Gamestate } from "./gamestate.js";
import { UserInterface, UIElement } from "./ui.js";
export declare class Controls {
    selected: Map<string, Castle>;
    isSelecting: boolean;
    isTargetingEnemyCastle: boolean;
    gameWidth: number;
    gameHeight: number;
    gameState: Gamestate;
    ui: UserInterface;
    canvas: HTMLCanvasElement;
    constructor(gameWidth: number, gameHeight: number, canvas: HTMLCanvasElement, gameState: Gamestate, ui: UserInterface);
    deselect(): void;
    visualVector(v: Vector): Vector;
    isMouseTargetingElement(target: Vector, mouse_pos: Vector, button: UIElement): boolean;
    isMouseTargetingCastle(target: Vector, mouse_pos: Vector): boolean;
    mouseMove(mouse_pos: Vector, castles: Array<Castle>, playerId: string): void;
    mouseDownButton(target: Vector, buttons: Array<UIElement>): any;
    mouseDownGame(target: Vector, castles?: Array<Castle>, playerId?: string): {
        target_castle_id: string;
        selected_castles_ids: string[];
    } | undefined;
}
//# sourceMappingURL=controls.d.ts.map