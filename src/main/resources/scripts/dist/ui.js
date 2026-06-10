import { Vector } from "./vector.js";
export var UIStates;
(function (UIStates) {
    UIStates[UIStates["Menu"] = 0] = "Menu";
    UIStates[UIStates["SessionOptions"] = 1] = "SessionOptions";
    UIStates[UIStates["Session"] = 2] = "Session";
    UIStates[UIStates["Game"] = 3] = "Game";
    UIStates[UIStates["EndGame"] = 4] = "EndGame";
    UIStates[UIStates["Leaderboard"] = 5] = "Leaderboard";
    UIStates[UIStates["Matchmaking"] = 6] = "Matchmaking";
})(UIStates || (UIStates = {}));
export var ButtonEvent;
(function (ButtonEvent) {
    ButtonEvent[ButtonEvent["Matchmake"] = 0] = "Matchmake";
    ButtonEvent[ButtonEvent["Menu"] = 1] = "Menu";
    ButtonEvent[ButtonEvent["loginButton"] = 2] = "loginButton";
    ButtonEvent[ButtonEvent["registerButton"] = 3] = "registerButton";
})(ButtonEvent || (ButtonEvent = {}));
export var TextFieldEvent;
(function (TextFieldEvent) {
    TextFieldEvent[TextFieldEvent["Login"] = 0] = "Login";
    TextFieldEvent[TextFieldEvent["Password"] = 1] = "Password";
})(TextFieldEvent || (TextFieldEvent = {}));
export class UIElement {
    width;
    height;
    pos;
    constructor(width, height, pos) {
        this.width = width;
        this.height = height;
        this.pos = pos;
    }
}
export class Button extends UIElement {
    event;
    text;
    constructor(width, height, pos, event, text) {
        super(width, height, pos);
        this.event = event;
        this.text = text;
    }
}
export class TextField extends UIElement {
    event;
    text = "";
    active = false;
    constructor(width, height, pos, event) {
        super(width, height, pos);
        this.event = event;
    }
}
export class UserInterface {
    gameWidth;
    gameHeight;
    state = UIStates.Menu;
    menu;
    matchMaking;
    endGame;
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.menu = this.menuConstructor();
        this.matchMaking = this.matchMakingConstructor();
        this.endGame = this.endGameConstructor();
    }
    menuConstructor() {
        let menu = new Array();
        const matchmakingButton = new Button(this.gameWidth * 0.6, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.18, this.gameHeight * 0.5), ButtonEvent.Matchmake, "MATCHMAKE");
        menu.push(matchmakingButton);
        const usernameField = new TextField(this.gameWidth * 0.6, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.18, this.gameHeight * 0.9), TextFieldEvent.Login);
        menu.push(usernameField);
        const passwordField = new TextField(this.gameWidth * 0.6, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.18, this.gameHeight / 4), TextFieldEvent.Password);
        menu.push(passwordField);
        const loginButton = new Button(this.gameWidth * 0.15, this.gameHeight * 0.05, new Vector(this.gameWidth * 0.8, this.gameHeight * 0.05), ButtonEvent.loginButton, "LOGIN");
        menu.push(loginButton);
        const registerButton = new Button(this.gameWidth * 0.15, this.gameHeight * 0.05, new Vector(this.gameWidth * 0.8, this.gameHeight * 0.1), ButtonEvent.registerButton, "REGISTER");
        menu.push(registerButton);
        return menu;
    }
    matchMakingConstructor() {
        let matchmaking = new Array();
        const cancelButton = new Button(this.gameWidth * 0.4, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.1, this.gameHeight * 0.7), ButtonEvent.Menu, "CANCEL");
        matchmaking.push(cancelButton);
        return matchmaking;
    }
    endGameConstructor() {
        let endGame = new Array();
        const menu = new Button(this.gameWidth * 0.4, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.33, this.gameHeight / 2 * 1.1), ButtonEvent.Menu, "Menu");
        endGame.push(menu);
        return endGame;
    }
}
//# sourceMappingURL=ui.js.map