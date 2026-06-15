import { Vector } from "./vector.js";
export declare enum UIStates {
    Menu = 0,
    SessionOptions = 1,
    Session = 2,
    Game = 3,
    EndGame = 4,
    Leaderboard = 5,
    Matchmaking = 6,
    Defeated = 7
}
export declare enum ButtonEvent {
    Matchmake = 0,
    Menu = 1,
    loginButton = 2,
    registerButton = 3
}
export declare enum TextFieldEvent {
    Username = 0,
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
    textPixels: number;
    constructor(width: number, height: number, pos: Vector, event: ButtonEvent, text: string, textPixels: number);
}
export declare class TextField extends UIElement {
    event: TextFieldEvent;
    text: string;
    active: boolean;
    label: string;
    textPixels: number;
    constructor(width: number, height: number, pos: Vector, event: TextFieldEvent, label: string | undefined, textPixels: number);
}
export declare class UserInterface {
    gameWidth: number;
    gameHeight: number;
    state: UIStates;
    menu: Array<UIElement>;
    matchMaking: Array<UIElement>;
    endGame: Array<Button>;
    defeated: Array<UIElement>;
    constructor(gameWidth: number, gameHeight: number);
    menuConstructor(): UIElement[];
    matchMakingConstructor(): UIElement[];
    endGameConstructor(): Button[];
    defeatedConstructor(): Button[];
}
//# sourceMappingURL=ui.d.ts.map