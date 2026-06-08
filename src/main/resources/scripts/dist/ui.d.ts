import { Vector } from "./vector.js";
export declare enum UIStates {
    Menu = 0,
    SessionOptions = 1,
    Session = 2,
    Game = 3,
    Leaderboard = 4
}
declare enum ButtonEvent {
    Matchmake = 0
}
export declare class Button {
    width: number;
    height: number;
    pos: Vector;
    event: ButtonEvent;
    text: string;
    constructor(width: number, height: number, pos: Vector, event: ButtonEvent, text: string);
}
export declare class UserInterface {
    gameWidth: number;
    gameHeight: number;
    state: UIStates;
    menu: Array<Button>;
    constructor(gameWidth: number, gameHeight: number);
    menuConstruction(): Button[];
}
export {};
//# sourceMappingURL=ui.d.ts.map