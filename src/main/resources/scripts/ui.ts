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
}

export class Button {
  width: number;
  height: number;
  pos: Vector;
  event: ButtonEvent;
  text: string;
  constructor(width: number, height: number, pos: Vector, event: ButtonEvent, text: string) {
    this.width = width;
    this.height = height;
    this.pos = pos;
    this.event = event;
    this.text = text;
  }
}

export class UserInterface {
  gameWidth: number;
  gameHeight: number;
  state = UIStates.Menu;
  menu: Array<Button>;
  matchMaking: Array<Button>;
  endGame: Array<Button>;
  constructor(gameWidth: number, gameHeight: number) {
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.menu = this.menuConstructor();
    this.matchMaking = this.matchMakingConstructor();
    this.endGame = this.endGameConstructor();
  }

  menuConstructor() {
    let menu = new Array<Button>();
    const matchmakingButton = new Button(
      this.gameWidth * 0.6,
      this.gameHeight * 0.1,
      new Vector(this.gameWidth * 0.18, this.gameHeight / 4),
      ButtonEvent.Matchmake,
      "MATCHMAKE")
    menu.push(matchmakingButton)
    return menu;
  }

  matchMakingConstructor() {
    let matchmaking = new Array<Button>();
    const cancelButton = new Button(
      this.gameWidth * 0.4,
      this.gameHeight * 0.1,
      new Vector(this.gameWidth * 0.1, this.gameHeight / 2 * 1.1),
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
