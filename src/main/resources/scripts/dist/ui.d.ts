import { Vector } from "./vector.js";
export declare enum UIStates {
    Menu = 0,
    SessionOptions = 1,
    Session = 2,
    Game = 3,
    EndGame = 4,
    Leaderboard = 5,
    Matchmaking = 6
}
export declare enum ButtonEvent {
    Matchmake = 0,
    Menu = 1
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
    endGame: Array<Button>;
    constructor(gameWidth: number, gameHeight: number);
    menuConstructor(): Button[];
    matchMakingConstructor(): Button[];
    endGameConstructor(): Button[];
}
//# sourceMappingURL=ui.d.ts.map