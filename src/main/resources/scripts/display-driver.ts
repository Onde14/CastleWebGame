import { Soldier, Castle, Village, GameObject } from "./objects.js";
import { SoldierConfig, CastleConfig, VillageConfig } from "./config.js";
import { Gamestate, GameStatus, Player, PlayerState } from "./gamestate.js";
import type { Game } from "./game.js";
import { type UserInterface, UIStates } from "./ui.js";

export class DisplayDriver {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameState: Gamestate;
  gameWidth: number;
  gameHeight: number;
  renderWidthPositionRatio: number;
  renderHeightPositionRatio: number;
  ui: UserInterface;
  matchmakingDots: number = 1;
  iterator: number = 0;
  constructor(
    ui: UserInterface,
    gameState: Gamestate,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    gameWidth: number,
    gameHeight: number,

  ) {
    this.ui = ui;
    this.ctx = ctx;
    this.canvas = canvas;
    this.gameState = gameState;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.renderWidthPositionRatio = this.canvas.width / this.gameWidth;
    this.renderHeightPositionRatio = this.canvas.height / this.gameHeight;
  }

  public resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.renderWidthPositionRatio = this.canvas.width / this.gameWidth;
    this.renderHeightPositionRatio = this.canvas.height / this.gameHeight;
  }

  drawGame() {
    this.ctx.fillStyle = "#407231";
    this.ctx.fillRect(
      0,
      0,
      this.gameWidth * this.renderWidthPositionRatio,
      this.gameHeight * this.renderHeightPositionRatio,
    );

    if (this.gameState.state == GameStatus.Ended) {
      this.ctx.font = this.renderWidthPositionRatio*100 + "px serif";
      this.ctx.fillStyle = "white";
      const winnerColor = this.gameState.winner?.color! + ""
      const text = winnerColor.toUpperCase()
      this.ctx.fillText(text + " PLAYER WON!", this.canvas.width*0.05, this.canvas.height/2);
    }


    //console.log("HEIGHT WINDOW RATIO: ", this.renderWidthPositionRatio);
    //console.log("WIDTH WINDOW RATIO: ", this.renderHeightPositionRatio);
    /*this.ctx.fillStyle = "brown";
    this.ctx.fillRect(this.gameWidth / 2 - 5, 75, 10, this.gameHeight - 175);
    this.ctx.save();
    this.ctx.restore();*/
    //console.log("this.gameState.currentPlayer?.state: ",this.gameState.currentPlayer?.state)
    if (this.gameState.currentPlayer?.state == PlayerState.Playing) {
      this.ctx.font = "48px serif";
      this.ctx.fillStyle = this.gameState.currentPlayer?.color!;
      this.ctx.fillText(this.gameState.currentPlayer?.color!, 50, 50);
    } else {
      this.ctx.font = "60px serif";
      this.ctx.fillStyle = "White";
      this.ctx.fillText("Defeated", 50, 50);
    }


    let castles = Array<Castle>();
    let soldiers = Array<Soldier>();
    let villages = Array<Village>();
    this.gameState.gameObjects.forEach((gameObject, key) => {
      if (gameObject instanceof Soldier) {
        soldiers.push(gameObject);
      }
      if (gameObject instanceof Castle) {
        castles.push(gameObject);
      }
      if (gameObject instanceof Village) {
        villages.push(gameObject)
      }
    });
    soldiers.forEach((unit: Soldier) => {
      this.ctx.beginPath();
      this.ctx.arc(
        (unit.pos.x * this.renderWidthPositionRatio),
        (unit.pos.y * this.renderHeightPositionRatio),
        SoldierConfig.radius,
        0,
        Math.PI * 2,
      );
      this.ctx.closePath();
      this.ctx.fillStyle = SoldierConfig.color;
      this.ctx.fill();
      this.ctx.save();

      this.ctx.beginPath();
      this.ctx.arc(
        (unit.pos.x * this.renderWidthPositionRatio),
        (unit.pos.y * this.renderHeightPositionRatio),
        SoldierConfig.ownerColorRadius,
        0,
        Math.PI * 2,
      );
      this.ctx.closePath();
      this.ctx.fillStyle = unit.ownerColor;
      this.ctx.fill();
      this.ctx.save();
      this.ctx.restore();
    });

    villages.forEach((village: Village) => {
      this.ctx.fillStyle = VillageConfig.color;
      //console.log("GAME WIDTH: ", this.gameWidth,"WIDTH POS: ", castle.pos.x, "CASTLE WIDTH: ", CastleConfig.width,"RATIO: ", this.renderWidthPositionRatio, "WIDTH CALC: ",(castle.pos.x - CastleConfig.width / 2) * this.renderWidthPositionRatio)
      this.ctx.fillRect(
        (village.pos.x * this.renderWidthPositionRatio) - VillageConfig.width / 2,
        (village.pos.y * this.renderHeightPositionRatio) - VillageConfig.height / 2,
        village.width,
        village.height,
      );
      this.ctx.save();
    });


    castles.forEach((castle) => {
      if (castle.selected) {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(
          (castle.pos.x * this.renderWidthPositionRatio) - CastleConfig.width / 2 - 2,
          (castle.pos.y * this.renderHeightPositionRatio) - CastleConfig.height / 2 - 2,
          castle.width + 4,
          castle.height + 4,
        );
        this.ctx.save();
      }

      if (castle.highlighted) {
        //console.log("DEBUG CASTLE POS " + castle.pos.x + ", " + castle.pos.y);
        this.ctx.fillStyle = "red";
        this.ctx.fillRect(
          (castle.pos.x * this.renderWidthPositionRatio) - CastleConfig.width / 2 - CastleConfig.width * 0.04,
          (castle.pos.y * this.renderHeightPositionRatio) - CastleConfig.height / 2 - CastleConfig.height * 0.04,
          castle.width + CastleConfig.width * 0.08,
          castle.height + CastleConfig.height * 0.08,
        );
        this.ctx.save();
      }

      this.ctx.fillStyle = CastleConfig.color;
      //console.log("GAME WIDTH: ", this.gameWidth,"castle.width: ", castle.width,"WIDTH POS: ",  castle.pos.x, "CASTLE WIDTH: ", CastleConfig.width,"RATIO: ", this.renderWidthPositionRatio, "WIDTH CALC: ",(castle.pos.x - CastleConfig.width / 2) * this.renderWidthPositionRatio)
      this.ctx.fillRect(
        (castle.pos.x * this.renderWidthPositionRatio) - CastleConfig.width / 2,
        (castle.pos.y * this.renderHeightPositionRatio) - CastleConfig.height / 2,
        castle.width,
        castle.height,
      );
      this.ctx.save();
      //console.log("GAME WIDTH: ", this.gameWidth,"WIDTH POS: ", castle.pos.x, "CASTLE WIDTH: ", CastleConfig.ownerColorWidth,"RATIO: ", this.renderWidthPositionRatio, "WIDTH CALC: ",(castle.pos.x - CastleConfig.ownerColorWidth / 2) * this.renderWidthPositionRatio)

      this.ctx.fillStyle = castle.ownerColor;
      this.ctx.fillRect(
        (castle.pos.x * this.renderWidthPositionRatio) - CastleConfig.ownerColorWidth / 2 ,
        (castle.pos.y* this.renderHeightPositionRatio) - CastleConfig.ownerColorHeight / 2,
        CastleConfig.ownerColorWidth,
        CastleConfig.ownerColorHeight,
      );
      this.ctx.save();
      this.ctx.restore();
    });
  }

  drawMenu() {

    this.ctx.fillStyle = "#407231";
    this.ctx.fillRect(
      0,
      0,
      this.gameWidth * this.renderWidthPositionRatio,
      this.gameHeight * this.renderHeightPositionRatio,
    );
    this.ctx.save();
    this.ctx.restore();


    this.ctx.font = this.renderWidthPositionRatio*70 + "px serif";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("CASTLEGAME", this.gameWidth*.25*this.renderWidthPositionRatio+3*this.renderWidthPositionRatio, this.gameHeight*.15*this.renderHeightPositionRatio+3*this.renderWidthPositionRatio);
    this.ctx.font = this.renderWidthPositionRatio*70 + "px serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("CASTLEGAME", this.gameWidth*.25*this.renderWidthPositionRatio, this.gameHeight*.15*this.renderHeightPositionRatio);
    this.ctx.save();
    this.ctx.restore();

    this.ui.menu.forEach(b => {
      /*this.ctx.fillStyle = "black";
      this.ctx.fillRect(
        (b.pos.x * 0.98 * this.renderWidthPositionRatio),
        (b.pos.y * 0.98 * this.renderHeightPositionRatio),
        (b.width * 1.02 * this.renderWidthPositionRatio),
        (b.height * 1.04),
      );*/

      this.ctx.fillStyle = "black";
      // console.log(b.height * 1/this.renderHeightPositionRatio)
      this.ctx.fillRect(
        (b.pos.x * this.renderWidthPositionRatio-4*this.renderWidthPositionRatio),
        (b.pos.y * this.renderHeightPositionRatio-4*this.renderWidthPositionRatio),
        (b.width * this.renderWidthPositionRatio+8*this.renderWidthPositionRatio),
        (b.height * this.renderWidthPositionRatio+8*this.renderWidthPositionRatio),
      );
      this.ctx.save();
      this.ctx.restore();

      this.ctx.fillStyle = "white";
      this.ctx.fillRect(
        (b.pos.x * this.renderWidthPositionRatio),
        (b.pos.y * this.renderHeightPositionRatio),
        (b.width * this.renderWidthPositionRatio),
        (b.height * this.renderWidthPositionRatio),
      );
      this.ctx.save();
      this.ctx.restore();

      console.log(b.height,b.pos.y)
      this.ctx.font = this.renderWidthPositionRatio*70 + "px serif";
      this.ctx.fillStyle = "black";
      this.ctx.fillText(b.text, (b.pos.x+b.width *0.12)* this.renderWidthPositionRatio, b.pos.y+b.height*.7* this.renderWidthPositionRatio);
      this.ctx.save();
      this.ctx.restore();
    });


  }

  drawMatchmaking() {

    //console.log("MATCHMAKING DRAWING")
    this.ctx.fillStyle = "#407231";
    this.ctx.fillRect(
      0,
      0,
      this.gameWidth * this.renderWidthPositionRatio,
      this.gameHeight * this.renderHeightPositionRatio,
    );
    this.ctx.save();
    this.ctx.restore();


    this.ctx.font = this.renderWidthPositionRatio*70 + "px serif";
    this.ctx.fillStyle = "black";
    this.ctx.fillText("CASTLEGAME", this.gameWidth*.25*this.renderWidthPositionRatio+3*this.renderWidthPositionRatio, this.gameHeight*.15*this.renderHeightPositionRatio+3*this.renderWidthPositionRatio);
    this.ctx.font = this.renderWidthPositionRatio*70 + "px serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("CASTLEGAME", this.gameWidth*.25*this.renderWidthPositionRatio, this.gameHeight*.15*this.renderHeightPositionRatio);
    this.ctx.save();
    this.ctx.restore();



    let matchmakingText = "MATCHMAKING"
    var i: number;

    for (i = 0; i < this.matchmakingDots; i++) {
      matchmakingText += "."
    }
    //console.log("this.matchmakingDots",this.matchmakingDots)
    if (Math.trunc(this.iterator / 90) > this.matchmakingDots) {

      this.matchmakingDots++;
    }
    if (Math.trunc(this.iterator / 360) == 1) {
      this.iterator = 0;
      this.matchmakingDots = 1;
    }
    this.iterator++;


    this.ctx.font = this.renderWidthPositionRatio*70 + "px serif";
    this.ctx.fillStyle = "black";
    this.ctx.fillText(matchmakingText, this.gameWidth*.2*this.renderWidthPositionRatio+3*this.renderWidthPositionRatio, this.gameHeight*.4*this.renderHeightPositionRatio+3*this.renderWidthPositionRatio);
    this.ctx.font = this.renderWidthPositionRatio*70 + "px serif";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(matchmakingText, this.canvas.width*0.2, this.canvas.height*0.4);
    this.ctx.save();
    this.ctx.restore();




    this.ui.matchMaking.forEach(b => {
      /*this.ctx.fillStyle = "black";
      this.ctx.fillRect(
        (b.pos.x * 0.98 * this.renderWidthPositionRatio),
        (b.pos.y * 0.98 * this.renderHeightPositionRatio),
        (b.width * 1.02 * this.renderWidthPositionRatio),
        (b.height * 1.04),
      );*/

      this.ctx.fillStyle = "black";
      console.log(b.pos.y * 0.98 * this.renderWidthPositionRatio)
      this.ctx.fillRect(
        (b.pos.x * this.renderWidthPositionRatio-4*this.renderWidthPositionRatio),
        (b.pos.y * this.renderHeightPositionRatio-4*this.renderWidthPositionRatio),
        (b.width * this.renderWidthPositionRatio+8*this.renderWidthPositionRatio),
        (b.height * this.renderWidthPositionRatio+8*this.renderWidthPositionRatio),
      );
      this.ctx.save();
      this.ctx.restore();

      this.ctx.fillStyle = "white";
      this.ctx.fillRect(
        (b.pos.x * this.renderWidthPositionRatio),
        (b.pos.y * this.renderHeightPositionRatio),
        (b.width * this.renderWidthPositionRatio),
        (b.height * this.renderWidthPositionRatio),
      );
      this.ctx.save();
      this.ctx.restore();


      this.ctx.font = this.renderWidthPositionRatio*70 + "px serif";
      this.ctx.fillStyle = "black";
      this.ctx.fillText(b.text, ((b.pos.x+b.width*.15)* this.renderWidthPositionRatio), ((b.pos.y+b.height*.7*this.renderWidthPositionRatio)));
      this.ctx.save();
      this.ctx.restore();
    });

}

  public draw() {
    //console.log(this.ui.state)
    switch (this.ui.state) {
      case UIStates.Game:
        this.drawGame()
        break;
      case UIStates.Matchmaking:
        this.drawMatchmaking()
        break;
      case UIStates.Menu:
        this.drawMenu()
        break;
      default:
        break;
    }
  }
}
