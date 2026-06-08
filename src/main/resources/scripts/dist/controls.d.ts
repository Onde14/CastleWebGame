import { Vector } from "./vector.js";
import { Castle } from "./objects.js";
export declare class Controls {
    selected: Map<string, Castle>;
    isSelecting: boolean;
    isTargetingEnemyCastle: boolean;
    gameWidth: number;
    gameHeight: number;
    constructor(gameWidth: number, gameHeight: number);
    deselect(): void;
    visualVector(v: Vector): Vector;
    isMouseTargetingCastle(target: Vector, mouse_pos: Vector): boolean;
    mouseMove(mouse_pos: Vector, castles: Array<Castle>, playerId: string): void;
    mouseDown(target: Vector, castles: Array<Castle>, playerId: string): {
        target_castle_id: string;
        selected_castles_ids: string[];
    } | undefined;
}
//# sourceMappingURL=controls.d.ts.map