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
    Menu = 1,
    loginButton = 2,
    registerButton = 3
}
export declare enum TextFieldEvent {
    Login = 0,
    Password = 1
}
export declare class UIElement {
    width: number;
    height: number;
    pos: Vector;
    constructor(width: number, height: number, pos: Vector);
}
export declare class Button extends UIElement {
    event: ButtonEvent;
    text: string;
    constructor(width: number, height: number, pos: Vector, event: ButtonEvent, text: string);
}
export declare class TextField extends UIElement {
    event: TextFieldEvent;
    text: string;
    active: boolean;
    constructor(width: number, height: number, pos: Vector, event: TextFieldEvent);
}
export declare class UserInterface {
    gameWidth: number;
    gameHeight: number;
    state: UIStates;
    menu: Array<UIElement>;
    matchMaking: Array<UIElement>;
    endGame: Array<Button>;
    constructor(gameWidth: number, gameHeight: number);
    menuConstructor(): UIElement[];
    matchMakingConstructor(): UIElement[];
    endGameConstructor(): Button[];
}
//# sourceMappingURL=ui.d.ts.map