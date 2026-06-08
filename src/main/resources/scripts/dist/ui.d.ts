import { Vector } from "./vector.js";
export declare enum UIStates {
    Menu = 0,
    SessionOptions = 1,
    Session = 2,
    Game = 3,
    Leaderboard = 4,
    Matchmaking = 5
}
export declare enum ButtonEvent {
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
    matchMaking: Array<Button>;
    constructor(gameWidth: number, gameHeight: number);
    menuConstructor(): Button[];
    matchMakingConstructor(): Button[];
}
//# sourceMappingURL=ui.d.ts.map