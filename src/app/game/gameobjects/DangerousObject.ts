import { Sprite } from "pixi.js";
import RunningGame from "../gamelogic/RunningGame";

export default class DangerousObject extends PIXI.Sprite {

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
        var t = Math.random();
        console.log(t);
        if(t > 0.5){
            this.texture = PIXI.loader.resources["snail1"].textures["tile000.png"];
            this.scale.x *= 1.2;
            this.scale.y *= 1.2;
        } else {
            this.texture = PIXI.loader.resources["snail1"].textures["tile000.png"];
            this.scale.x *= 1.5;
            this.scale.y *= 1.5;
        }

        
        RunningGame.game.pixiApp.ticker.add(e => { this.startDanger(e) } , RunningGame.game);
    }

    stopStars(){
        this.pixiApp.ticker.remove(this.startDanger, RunningGame.game);
    }

    timeSinceLastFrameUpdate: number = 0;
    startDanger(delta: number){
               
        if(this.timeSinceLastFrameUpdate < 80){
            this.timeSinceLastFrameUpdate += delta;
        } else {
            this.timeSinceLastFrameUpdate = 0;
            this.animateSnail();
        }

        this.isColliding();
        this.isOnGround();
        this.move(delta);


        this.timeSinceLastFrameUpdate++;

    }

    move(delta:number){
        if(this.position.x > -this.startPosition){
            this.position.x -= delta;
        } else{
            this.position.x = this.startPosition;
            // Do we want to remove the stuff? I dont think we do.
            /*
            RunningGame.game.pixiApp.ticker.remove(e => { this.startDanger(e) } , RunningGame.game);
            this.pixiApp.stage.removeChild(this);
            RunningGame.game.dangers.splice(RunningGame.game.dangers.findIndex( danger =>  danger.spriteName == this.spriteName, 1));
            console.log("removed snail")
            */
        }
    }

    private snailSpinningCounter: number = 1;
    private animateSnail() {
        if(this.snailSpinningCounter < 4){
            this.texture = PIXI.loader.resources["snail1"].textures["tile00" + this.snailSpinningCounter + ".png"];
            this.snailSpinningCounter++;
        } else {
            this.snailSpinningCounter = 1;
            this.texture = PIXI.loader.resources["snail1"].textures["tile000.png"];
        }
    }


    hasCollided = false;
    isColliding(){

        if(!this || !this.pixiApp.stage.getChildByName("floor") || 
        !this.pixiApp.stage.getChildByName("firstFloor") ||
        !this.pixiApp.stage.getChildByName("secondFloor") || 
        !this.pixiApp.stage.getChildByName("thirdFloor")){
            return;
        }

        if(this.objectsColliding(this, this.pixiApp.stage.getChildByName("runningGuy") as Sprite) 
            && !this.hasCollided){
            RunningGame.game.pixiApp.ticker.remove(e => { this.stopDanger(e) } , RunningGame.game);
            this.pixiApp.stage.removeChild(this);
            this.hasCollided = true;
            console.log("you ded!! lololol");
            RunningGame.game.endGame();
        }
    }

    hasLanded = false;
    isLanding = false;
    isOnGround(){
        if(this.hasLanded)
            return;
        else{
        
            // Dirty but effective. Keep falling until you hit the ground.
            if(this.objectsColliding(this, this.pixiApp.stage.getChildByName("floor") as Sprite) || 
                this.objectsColliding(this, this.pixiApp.stage.getChildByName("firstFloor") as Sprite) ||
                this.objectsColliding(this, this.pixiApp.stage.getChildByName("secondFloor") as Sprite) ||
                this.objectsColliding(this, this.pixiApp.stage.getChildByName("thirdFloor") as Sprite)
                ){
                this.hasLanded = true;
                this.y = this.y + 10;
                                
            } else {
                this.y = this.y + 15;
                this.isLanding = false;
            }           
        }
    }

    objectsColliding(a:PIXI.Sprite, b: PIXI.Sprite): boolean{
        let ab = a.getBounds();
        let bb = b.getBounds();
    
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
      }
}