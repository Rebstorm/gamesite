import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as PIXI from 'pixi.js';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    this.removeWebPageElements();
    this.createGameField(); 
  }

  removeWebPageElements(){
    document.getElementById("ground").style.display = "none";
    document.getElementById("clouds").style.display = "none";
  }


  private pixiApp: PIXI.Application;
  private gameGuy: RunningGuy; 
  private floor: Floor;

  private canvasHeight = 400;
  private canvasWidth = window.innerWidth;

  createGameField(){
    this.pixiApp = new PIXI.Application(this.canvasWidth, this.canvasHeight, { backgroundColor: 0x1099bb });
    document.getElementById("main-playboard").appendChild(this.pixiApp.view);

    // Load the stuff for the game.
    PIXI.loader
      .add("guy-atlas", "../../assets/img/sprites/char.json" )
      .add("guy-atlas-falling", "../../assets/img/sprites/char_falling.json")
      .add("floor", "../../assets/img/ground_2.png")
      .load(() => {
        this.createGameAssets();
      }
    );

  }

  createGameAssets(): any {    
    // Get our running guy.
    this.gameGuy = new RunningGuy(this.canvasHeight, this.canvasWidth, this.pixiApp);

    // Get our ground.
    this.floor = new Floor(this.canvasHeight, this.canvasWidth);
      
    /*  
    * Add the stuff to the scene.
    * 
    */

    // Character
    this.pixiApp.stage.addChild(this.gameGuy);

    // BG
    this.pixiApp.stage.addChild(this.floor);

    this.createEventHandlers();

    this.createCollisionDetection();


    this.startGame();
  }

  createEventHandlers(){

    document.addEventListener('keydown', e => {
      
      if(this.gameGuy.isJumping)
        return;

      if(e.keyCode == 38 ){ // the up arrow
        this.gameGuy.isJumping = true;
        // Adding the jumping speed.
        this.gameGuy.addJumpSpeed(-15);

        this.pixiApp.ticker.addOnce( (e)=> { this.checkIfOnFloor(e) };
        
      }
    
    });
  }

  checkIfOnFloor(e){
    window.setTimeout(()=> {
      if(this.objectsColliding(this.gameGuy, this.floor))
        this.gameGuy.isJumping = false;
      else
        this.checkIfOnFloor(e);

    }, 250)
  }

  startGame(){
    this.floor.startGround(this.pixiApp);

  }

  createCollisionDetection(){
    // Creating collision between guy and floor. 
    this.pixiApp.ticker.add((delta) => {
        //console.log(this.objectsColliding(this.gameGuy, this.floor));
        if(this.objectsColliding(this.gameGuy, this.floor) && !this.gameGuy.isJumping){
          this.gameGuy.jumpingSpeedY = 0;
          this.gameGuy.position.y = this.canvasHeight / 1.25;
        }
    });

  }

  objectsColliding(a:PIXI.Sprite, b: PIXI.Sprite): boolean{
    let ab = a.getBounds();
    let bb = b.getBounds();

    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
  }

  
}


class RunningGuy extends PIXI.Sprite {

  canvasHeight: number;
  canvasWidth: number;

  private GRAVITY = 9.8;
  private GAME_SPEED_X = 40;
  public jumpingSpeedY: number = 0;
  public isJumping = false;
  private pixiApp: PIXI.Application;
  

  constructor(canvasHeight: number, canvasWidth: number, pixiApp: PIXI.Application) {
    super();
    this.pixiApp = pixiApp;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Set the transformation origin
    //this.anchor.set(0.5, 0.5);

    this.x = canvasWidth / 2;
    // Offset for ground and stuff.
    this.y = canvasHeight / 1.25;

    this.scale.x *= 1.50;
    this.scale.y *= 1.50;

    // Todo: find out what interactive means. But it sounds fancy. 

    document.addEventListener("keyup", (e) => {

    });

    // We got to animate the dude, yo. 
    pixiApp.ticker.add(()=> { this.animateGuy() });

    
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

      this.updateSprite();
  }

  

  addJumpSpeed(speedInc: number) {
    this.jumpingSpeedY += speedInc;
    //this.jumpingSpeedY = Math.max(-this.GRAVITY, this.jumpingSpeedY);
    //console.log(Math.max(-this.GRAVITY, this.jumpingSpeedY));
  }
  

  updateSprite(){   
    this.jumpingSpeedY += this.GRAVITY / this.pixiApp.ticker.elapsedMS * 2 ;
    
    // todo: boolean grounded. 
    this.y += this.jumpingSpeedY;
    
    
    //this.rotation = Math.atan(this.speedY / this.GAME_SPEED_X);

    /*
    let isCollide = false;
    const { x, y, width, height } = this;
    */
  }




}

// Tileposition is the best
class Floor extends PIXI.extras.TilingSprite {
  
  private canvasHeight: number;
  private canvasWidth: number;

  private GAME_SPEED_X = 40;

  constructor(canvasHeight: number, canvasWidth: number){
    super(PIXI.loader.resources["floor"].texture, canvasWidth, canvasHeight);

    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    //this.x = canvasWidth;
    // Offset for ground and stuff.
    this.y = canvasHeight / 1.15;

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
    this.tilePosition.x = (this.tilePosition.x - delta) % ( this.texture.width * 0.8 );

  }



}
