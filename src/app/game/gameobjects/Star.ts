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

        this.pixiApp.ticker.add(e => { this.startStar(e) } , this);
    }

    stopStars(){
        this.pixiApp.ticker.remove(this.startStar, this);
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
            RunningGame.game.pixiApp.ticker.remove(e => { this.startStar(e) } , RunningGame.game);
            RunningGame.game.pixiApp.stage.removeChild(this);
            RunningGame.game.stars.splice(RunningGame.game.stars.findIndex( star => star.spriteName == this.spriteName), 1);
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
    isColliding():boolean{
        
        if(!this || !RunningGame.game.pixiApp.stage.getChildByName("runningGuy")){
            return false;
        }

        if(this.objectsColliding(this, RunningGame.game.pixiApp.stage.getChildByName("runningGuy") as Sprite) 
            && !this.hasCollided){
            RunningGame.game.pixiApp.ticker.remove(e => { this.startStar(e) } , RunningGame.game);
            RunningGame.game.pixiApp.stage.removeChild(this);
            // Todo: Add points once caught.
            this.hasCollided = true;
            RunningGame.game.stars.splice(RunningGame.game.stars.findIndex( star => star.spriteName == this.spriteName), 1);
            RunningGame.game.score += 10;
            RunningGame.game.scoreText.text = "Score: " + RunningGame.game.score;
            return true;
        }
    }

    objectsColliding(a:PIXI.Sprite, b: PIXI.Sprite): boolean{
        let ab = a.getBounds();
        let bb = b.getBounds();
    
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
      }
}