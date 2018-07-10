import { Sprite } from "pixi.js";
import RunningGame from "../gamelogic/RunningGame";


// I cant believe this is how you do enums in TS... unbelievable.. 
enum SnailType {
    BlueSnail,
    OrangeSnail
}

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
    private snail : SnailType;
    
    constructor(canvasHeight: number, canvasWidth: number,
        posY:number, posX:number, pixiApp : PIXI.Application, name:string){
        super();
        
        this.x = 0;
        this.y = 0;

        this.pixiApp = pixiApp;
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;
        this.spriteName = name;

        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

        this.startPosition = canvasWidth;
    
        this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    
        // Set the transformation origin
        //this.anchor.set(0.5, 0.5);
    
        this.x =  posX;
        // Offset for ground and stuff.
        this.y = canvasHeight / posY;
        var t = Math.random();
        if(t > 0.5){
            this.texture = PIXI.loader.resources["snail1"].textures["tile000.png"];
            this.scale.x *= 1.5;
            this.scale.y *= 1.5;
            this.snail = SnailType.BlueSnail;
        } else {
            this.texture = PIXI.loader.resources["snail2"].textures["snail2_1.png"];
            this.scale.x *= 1.5;
            this.scale.y *= 1.5;
            this.snail = SnailType.OrangeSnail;
        }

        RunningGame.game.pixiApp.ticker.add(e => { this.startDanger(e) } , RunningGame.game);
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
            // Remove when outside screen.
            RunningGame.game.pixiApp.ticker.remove(e => { this.startDanger(e) } , RunningGame.game);
            this.pixiApp.stage.removeChild(this);
            RunningGame.game.dangers.splice(RunningGame.game.dangers.findIndex( dangers => dangers.spriteName == this.spriteName), 1);
        }
    }

    private snailSpinningCounter: number = 1;
    private animateSnail() {

        
        switch(this.snail){
            case SnailType.OrangeSnail:

                if(this.snailSpinningCounter < 4){
                    this.texture = PIXI.loader.resources["snail2"].textures["snail2_" + this.snailSpinningCounter + ".png"];
                    this.snailSpinningCounter++;
                } else {
                    this.snailSpinningCounter = 1;
                    this.texture = PIXI.loader.resources["snail2"].textures["snail2_1.png"];
                }

            break;

            case SnailType.BlueSnail:

                if(this.snailSpinningCounter < 4){
                    this.texture = PIXI.loader.resources["snail1"].textures["tile00" + this.snailSpinningCounter + ".png"];
                    this.snailSpinningCounter++;
                } else {
                    this.snailSpinningCounter = 1;
                    this.texture = PIXI.loader.resources["snail1"].textures["tile000.png"];
                }

            break;

            
            default:
            break;

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
            RunningGame.game.pixiApp.ticker.remove(e => { this.startDanger(e) } , RunningGame.game);
            //this.pixiApp.stage.removeChild(this);
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
                if(this.snail == SnailType.OrangeSnail)
                    this.y += 25;
                else if(this.snail == SnailType.BlueSnail)
                    this.y += 15;
                                
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