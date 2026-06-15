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
    UIStates[UIStates["Defeated"] = 7] = "Defeated";
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
    TextFieldEvent[TextFieldEvent["Username"] = 0] = "Username";
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
    textPixels;
    constructor(width, height, pos, event, text, textPixels) {
        super(width, height, pos);
        this.event = event;
        this.text = text;
        this.textPixels = textPixels;
    }
}
export class TextField extends UIElement {
    event;
    text = "";
    active = false;
    label;
    textPixels;
    constructor(width, height, pos, event, label = "", textPixels) {
        super(width, height, pos);
        this.event = event;
        this.label = label;
        this.textPixels = textPixels;
    }
}
export class UserInterface {
    gameWidth;
    gameHeight;
    state = UIStates.Menu;
    menu;
    matchMaking;
    endGame;
    defeated;
    constructor(gameWidth, gameHeight) {
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.menu = this.menuConstructor();
        this.matchMaking = this.matchMakingConstructor();
        this.endGame = this.endGameConstructor();
        this.defeated = this.defeatedConstructor();
    }
    menuConstructor() {
        let menu = new Array();
        const matchmakingButton = new Button(this.gameWidth * 0.6, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.18, this.gameHeight * 0.5), ButtonEvent.Matchmake, "MATCHMAKE", 60);
        menu.push(matchmakingButton);
        const usernameField = new TextField(this.gameWidth * 0.4, this.gameHeight * 0.03, new Vector(this.gameWidth * 0.4, this.gameHeight * 0.05), TextFieldEvent.Username, "username", 25);
        usernameField.text = usernameField.label;
        menu.push(usernameField);
        const passwordField = new TextField(this.gameWidth * 0.4, this.gameHeight * 0.03, new Vector(this.gameWidth * 0.4, this.gameHeight * 0.12), TextFieldEvent.Password, "password", 25);
        passwordField.text = passwordField.label;
        menu.push(passwordField);
        const loginButton = new Button(this.gameWidth * 0.15, this.gameHeight * 0.05, new Vector(this.gameWidth * 0.84, this.gameHeight * 0.05), ButtonEvent.loginButton, "LOGIN", 30);
        menu.push(loginButton);
        const registerButton = new Button(this.gameWidth * 0.15, this.gameHeight * 0.05, new Vector(this.gameWidth * 0.8, this.gameHeight * 0.1), ButtonEvent.registerButton, "REGISTER", 10);
        //menu.push(registerButton)
        return menu;
    }
    matchMakingConstructor() {
        let matchmaking = new Array();
        const cancelButton = new Button(this.gameWidth * 0.4, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.1, this.gameHeight * 0.7), ButtonEvent.Menu, "CANCEL", 70);
        matchmaking.push(cancelButton);
        return matchmaking;
    }
    endGameConstructor() {
        let endGame = new Array();
        const menu = new Button(this.gameWidth * 0.4, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.33, this.gameHeight / 2 * 1.1), ButtonEvent.Menu, "Menu", 80);
        endGame.push(menu);
        return endGame;
    }
    defeatedConstructor() {
        let endGame = new Array();
        const menu = new Button(this.gameWidth * 0.4, this.gameHeight * 0.1, new Vector(this.gameWidth * 0.33, this.gameHeight / 2 * 1.1), ButtonEvent.Menu, "Menu", 80);
        endGame.push(menu);
        return endGame;
    }
}
//# sourceMappingURL=ui.js.map