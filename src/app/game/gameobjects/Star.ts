import { Bounds, Sprite } from "pixi.js";
import RunningGame from "../gamelogic/RunningGame";

export default class Star extends PIXI.Sprite {

    private startPosition: number = 0;

    canvasHeight: number;
    canvasWidth: number;
  
    private GRAVITY = 9.8;
    public jumpingSpeedY: number = 0;
    public isJumping = false;
    public isJumpingUp = false;
    private pixiApp: PIXI.Application;
    private spriteName: string;

    constructor(canvasHeight: number, canvasWidth: number,
        posY:number, posX:number, pixiApp : PIXI.Application, name:string){
        super();
        
        this.x = 0;
        this.y = 0;

        this.pixiApp = pixiApp;
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.spriteName = name;

        this.startPosition = canvasWidth;
    
        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    
        // Set the transformation origin
        //this.anchor.set(0.5, 0.5);
    
        this.x =  posX;
        // Offset for ground and stuff.
        this.y = canvasHeight / posY;
    
        this.scale.x *= 0.2;
        this.scale.y *= 0.2;

        RunningGame.game.pixiApp.ticker.add(e => { this.startStar(e) } , RunningGame.game);
    }

    timeSinceLastFrameUpdate: number = 0;
    startStar(delta: number){
               
        if(this.timeSinceLastFrameUpdate < 5){
            this.timeSinceLastFrameUpdate += delta;
        } else {
            this.animateStar();
            this.timeSinceLastFrameUpdate = 0;
        }

        this.isColliding();
        this.move(delta);

        this.timeSinceLastFrameUpdate++;

    }

    move(delta:number){
        if(this.position.x > -this.startPosition){
            this.position.x -= delta;
        } else{
            this.position.x = this.startPosition;
            //this.destroy();
        }
    }

    private starSpinningTextureCounter: number = 1;
    private animateStar() {
        if(this.starSpinningTextureCounter < 7){
            this.texture = PIXI.loader.resources["star"].textures["star_" + this.starSpinningTextureCounter + ".png"];
            this.starSpinningTextureCounter++;
        } else {
            this.starSpinningTextureCounter = 1;
            this.texture = PIXI.loader.resources["star"].textures["star_1.png"];
        }
    }

    hasCollided = false;
    isColliding(){
        if(this.objectsColliding(this, this.pixiApp.stage.getChildByName("runningGuy") as Sprite) 
            && !this.hasCollided){
            this.pixiApp.stage.removeChild(this);
            RunningGame.game.pixiApp.ticker.remove(e => { this.startStar(e) } , RunningGame.game);
            // Todo: Add points once caught.
            this.hasCollided = true;
            RunningGame.game.stars.splice(RunningGame.game.stars.findIndex( star => star.spriteName == this.spriteName), 1);
            RunningGame.game.score += 100;
        }
    }

    objectsColliding(a:PIXI.Sprite, b: PIXI.Sprite): boolean{
        let ab = a.getBounds();
        let bb = b.getBounds();
    
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
      }
}