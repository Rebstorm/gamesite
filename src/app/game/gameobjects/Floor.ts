import { Bounds } from "pixi.js";
import { GameComponent } from "../game.component";
import RunningGame from "../gamelogic/RunningGame";


// TilingSprite is the best
export default class Floor extends PIXI.extras.TilingSprite {
  
    private canvasHeight: number;
    private canvasWidth: number;

    private isGround : boolean;
    private spriteName : string;
    private speed: number = 1;
  
    constructor(canvasHeight: number, canvasWidth: number, 
      posX:number, posY:number, name: string){
      super(PIXI.loader.resources["floor"].texture, canvasWidth, canvasHeight);

      this.spriteName = name;
      this.name = name;
  
      this.canvasHeight = canvasHeight;
      this.canvasWidth = canvasWidth;
    
      this.y = canvasHeight / posY;
    
      this.tileScale.y = 0.8;
      this.tileScale.x = 0.8;
      this.tilePosition.x = 0;
      this.tilePosition.y = 0;
    }
  
    public startGround(pixiApp : PIXI.Application){
      pixiApp.ticker.add(delta => this.move(delta));
    }
  
    private move(delta:number){
      // moving the tileposition with tileposition x minus delta, modulus texture width times the scale of the texture. 
      this.tilePosition.x = ((this.tilePosition.x - delta) % ( this.texture.width * 0.8 )) * this.speed;
    }

}