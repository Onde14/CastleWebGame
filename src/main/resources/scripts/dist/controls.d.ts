import { Vector } from "./vector.js";
import { Castle } from "./objects.js";
export declare class Controls {
    selected: Map<string, Castle>;
    is_selecting: boolean;
    is_targeting: boolean;
    constructor();
    deselect(): void;
    is_click_targeting_castle(target: Vector, click: Vector): boolean;
    create_attack_unit_logic(start: Vector, target: Vector): void;
    mouse_move(target: Vector, castles: Array<Castle>): void;
    mouse_down(target: Vector, castles: Array<Castle>, playerId: string): {
        target_castle_id: string;
        selected_castles_ids: string[];
    } | undefined;
}
//# sourceMappingURL=controls.d.ts.map