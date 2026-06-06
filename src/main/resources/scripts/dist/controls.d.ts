import { Vector } from "./vector.js";
import { Castle } from "./objects.js";
export declare class Controls {
    selected: Map<string, Castle>;
    is_selecting: boolean;
    is_targeting: boolean;
    gameWidth: number;
    gameHeight: number;
    constructor(gameWidth: number, gameHeight: number);
    deselect(): void;
    visual_vector(v: Vector): Vector;
    is_mouse_targeting_castle(target: Vector, mouse_pos: Vector): boolean;
    create_attack_unit_logic(start: Vector, target: Vector): void;
    mouse_move(mouse_pos: Vector, castles: Array<Castle>): void;
    mouse_down(target: Vector, castles: Array<Castle>, playerId: string): {
        target_castle_id: string;
        selected_castles_ids: string[];
    } | undefined;
}
//# sourceMappingURL=controls.d.ts.map