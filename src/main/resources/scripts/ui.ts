import { Vector } from "./vector.js";

export enum UIStates {
  Menu,
  SessionOptions,
  Session,
  Game,
  EndGame,
  Leaderboard,
  Matchmaking,
}

export enum ButtonEvent {
  Matchmake,
  Menu,
  loginButton,
  registerButton,
}

export enum TextFieldEvent {
  Login,
  Password,
}

export class UIElement {
  width: number;
  height: number;
  pos: Vector;
  constructor(width: number, height: number, pos: Vector) {
    this.width = width;
    this.height = height;
    this.pos = pos;
  }
}

export class Button extends UIElement {
  event: ButtonEvent;
  text: string;
  constructor(width: number, height: number, pos: Vector, event: ButtonEvent, text: string) {
    super(width, height, pos);
    this.event = event;
    this.text = text;
  }
}

export class TextField extends UIElement {
  event: TextFieldEvent;
  text: string = "";
  active = false;
  constructor(width: number, height: number, pos: Vector, event: TextFieldEvent) {
    super(width, height, pos);
    this.event = event;
  }
}

export class UserInterface {
  gameWidth: number;
  gameHeight: number;
  state = UIStates.Menu;
  menu: Array<UIElement>;
  matchMaking: Array<UIElement>;
  endGame: Array<Button>;
  constructor(gameWidth: number, gameHeight: number) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.menu = this.menuConstructor();
    this.matchMaking = this.matchMakingConstructor();
    this.endGame = this.endGameConstructor();
  }

  menuConstructor() {
    let menu = new Array<UIElement>();
    const matchmakingButton = new Button(
      this.gameWidth * 0.6,
      this.gameHeight * 0.1,
      new Vector(this.gameWidth * 0.18, this.gameHeight * 0.5),
      ButtonEvent.Matchmake,
      "MATCHMAKE")
    menu.push(matchmakingButton)

    const usernameField = new TextField(
      this.gameWidth * 0.6,
      this.gameHeight * 0.1,
      new Vector(this.gameWidth * 0.18, this.gameHeight * 0.9),
      TextFieldEvent.Login)
    menu.push(usernameField)

    const passwordField = new TextField(
      this.gameWidth * 0.6,
      this.gameHeight * 0.1,
      new Vector(this.gameWidth * 0.18, this.gameHeight / 4),
      TextFieldEvent.Password)
    menu.push(passwordField)

    const loginButton = new Button(
      this.gameWidth * 0.15,
      this.gameHeight * 0.05,
      new Vector(this.gameWidth * 0.8, this.gameHeight * 0.05),
      ButtonEvent.loginButton,
      "LOGIN")
    menu.push(loginButton)


    const registerButton = new Button(
      this.gameWidth * 0.15,
      this.gameHeight * 0.05,
      new Vector(this.gameWidth * 0.8, this.gameHeight * 0.1),
      ButtonEvent.registerButton,
      "REGISTER")
     menu.push(registerButton)

    return menu;
  }

  matchMakingConstructor() {
    let matchmaking = new Array<UIElement>();
    const cancelButton = new Button(
      this.gameWidth * 0.4,
      this.gameHeight * 0.1,
      new Vector(this.gameWidth * 0.1, this.gameHeight * 0.7),
      ButtonEvent.Menu,
      "CANCEL")
    matchmaking.push(cancelButton)
    return matchmaking;
  }


  endGameConstructor() {
    let endGame = new Array<Button>();
    const menu = new Button(
      this.gameWidth * 0.4,
      this.gameHeight * 0.1,
      new Vector(this.gameWidth * 0.33, this.gameHeight / 2 * 1.1),
      ButtonEvent.Menu,
      "Menu")
    endGame.push(menu)
    return endGame;
  }

}
