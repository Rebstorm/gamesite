import RunningGame from "../gamelogic/RunningGame";

export default class RunningGuy extends PIXI.Sprite {

    canvasHeight: number;
    canvasWidth: number;
  
    public GRAVITY = 9.8;
    public jumpingSpeedY: number = 0;
    public isJumping = false;
    public isJumpingUp = false;
    public isOnPlatform = false;
    private pixiApp: PIXI.Application;
    
  
    constructor(canvasHeight: number, canvasWidth: number, pixiApp: PIXI.Application) {
      super();
      this.pixiApp = pixiApp;
      this.canvasHeight = canvasHeight;
      this.canvasWidth = canvasWidth;
      this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      this.name = "runningGuy";
  
      // Set the transformation origin
      //this.anchor.set(0.5, 0.5);
  
      this.x = canvasWidth / 2;
      // Offset for ground and stuff.
      this.y = canvasHeight / 1.25;
  
      this.scale.x *= 1.50;
      this.scale.y *= 1.50;
  
      // We got to animate the dude, yo. 
      let timeSinceLastFrameUpdate: number = 0;
      pixiApp.ticker.add((delta)=> { 
  
  
        // TODO: Maybe move this back? I dont know..
        this.updateSprite();
  
        if(timeSinceLastFrameUpdate < 5){
          timeSinceLastFrameUpdate += delta;
        } else {
          this.animateGuy();
          timeSinceLastFrameUpdate = 0;
        }
        timeSinceLastFrameUpdate++;
      });
      
    }
  
    private guyRunningTextureCounter: number = 0;
    private guyJumpingTextureCounter: number = 0;
    animateGuy() {
        if(this.isJumping){
          if(this.guyJumpingTextureCounter < 2){
            this.texture = PIXI.loader.resources["guy-atlas-falling"].textures["falling_" + this.guyJumpingTextureCounter + ".png"];
            this.guyJumpingTextureCounter++;
          } else {
            this.texture = PIXI.loader.resources["guy-atlas-falling"].textures["falling_0.png"];
            this.guyJumpingTextureCounter = 0;
          }
    
        } else {
  
          if(this.guyRunningTextureCounter < 8){
            this.texture = PIXI.loader.resources["guy-atlas"].textures["frame_" + this.guyRunningTextureCounter + ".gif"];
            this.guyRunningTextureCounter++;
          } else {
            this.guyRunningTextureCounter = 0;
            this.texture = PIXI.loader.resources["guy-atlas"].textures["frame_0.gif"];
          }
        
        }
    }    
  
    addJumpSpeed(speedInc: number) {
      this.jumpingSpeedY += speedInc;
      //this.jumpingSpeedY = Math.max(-this.GRAVITY, this.jumpingSpeedY);
      //console.log(Math.max(-this.GRAVITY, this.jumpingSpeedY));
    }
    
    public multiplier = 1.2;
    updateSprite(){   
      
      if(this.jumpingSpeedY > 0){
        this.isJumpingUp = false;
      } else {
        this.isJumpingUp = true;
      }    

      if(this.isOnPlatform){
        this.y = this.canvasHeight / 1.55;
      } else {
        this.jumpingSpeedY += this.addGravity();
        this.y += this.jumpingSpeedY;
      }

      
    
    }

    addGravity() : number {
      return this.GRAVITY / this.pixiApp.ticker.elapsedMS * this.multiplier ;
    }
    
  }