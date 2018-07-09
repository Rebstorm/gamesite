import RunningGame from "../gamelogic/RunningGame";
import { FnParam } from "@angular/compiler/src/output/output_ast";

export default class RunningGuy extends PIXI.Sprite {

    canvasHeight: number;
    canvasWidth: number;
  
    public GRAVITY = 9.8;
    public jumpingSpeedY: number = 0;
    public isJumping = false;
    public isJumpingUp = false;
    public isOnPlatform = false;
    private pixiApp: PIXI.Application;
    public isDeaded = false;
    
  
    constructor(canvasHeight: number, canvasWidth: number, pixiApp: PIXI.Application) {
      super();
      this.pixiApp = pixiApp;
      this.canvasHeight = canvasHeight;
      this.canvasWidth = canvasWidth;
      this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      this.name = "runningGuy";
  
      // Set the transformation origin
      this.anchor.set(0, 0);
  
      this.x = canvasWidth / 2;
      // Offset for ground and stuff.
      this.y = canvasHeight / 1.25;

      console.log(this.scale.x);
  
      this.scale.x *= 1.50;
      this.scale.y *= 1.50;
  
      // We got to animate the dude, yo. 
      let timeSinceLastFrameUpdate: number = 0;
      pixiApp.ticker.add((delta)=> {   
    
        if(timeSinceLastFrameUpdate < 5){
          timeSinceLastFrameUpdate += delta;
        } else {
          this.animateGuy();
          timeSinceLastFrameUpdate = 0;
        }
        timeSinceLastFrameUpdate++;

        // TODO: Maybe move this back? I dont know..
        this.updateSprite();
      });
      
    }

    playDeadAnimation(finished: boolean){
        var up = false;
        var x = window.setInterval( e => {
          this.y -= 10;
          this.isJumping = true;
          this.rotation -= 0.1 * this.pixiApp.ticker.deltaTime;
          this.scale.x -= 0.05;
          this.scale.y -= 0.05;
        
          if(this.y < -100){
            this.y = -60;
            this.rotation = 0;
            this.scale.x = 1.50;
            this.scale.y = 1.50;
            this.jumpingSpeedY = 0;
            this.isJumping = false;
            window.clearInterval(x);
          }

        }, 25);

    }

    
      

      /*
      var ticker = window.setInterval(e => {  
          if(this.y < 600 && this.y > 50 && !finished){
            
            this.y -= 10;
            this.isJumping = true;
            this.rotation -= 0.02 * this.pixiApp.ticker.deltaTime;
            
            if(this.y < 50){
              finished = true;
            }

          } else if(finished){
            if(this.y > 600){
              window.clearInterval(ticker);
              this.y = -51;
              this.rotation = 0;
              
              return true;
            }
            else {
              this.y += 10;
              this.rotation -= 0.02 * this.pixiApp.ticker.deltaTime;
            }
          }

      }, 25);
      */

  
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
     
      //incase we fall off. 
      if(this.y > 600){
        RunningGame.game.endGame();
        this.y = -60;
      }

      // if we dead, dont calculate this stuff.
      if(this.isDeaded)
        return;
      
      if(this.jumpingSpeedY > 0){
        this.isJumpingUp = false;
      } else {
        this.isJumpingUp = true;
      }    

      if(this.isOnPlatform){

      } else {
        this.jumpingSpeedY += this.addGravity();
        this.y += this.jumpingSpeedY;

      }      
    
    }

    addGravity() : number {
      return this.GRAVITY / this.pixiApp.ticker.elapsedMS * this.multiplier ;
      console.log("gravity: "  + this.GRAVITY)
    }
    
  }