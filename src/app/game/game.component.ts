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
      .add("floor", "../../assets/img/ground_2.png")
      .load(() => {
        this.createGameAssets();
      }
    );

  }

  createGameAssets(): any {    
    // Get our running guy.
    this.gameGuy = new RunningGuy(this.canvasHeight, this.canvasWidth);

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

   


    this.startGame();
  }

  startGame(){
    this.floor.startGround(this.pixiApp);

  }

  
}


class RunningGuy extends PIXI.Sprite {

  canvasHeight: number;
  canvasWidth: number;

  private GRAVITY = 9.8;
  private GAME_SPEED_X = 40;
  public runningSpeedY: number = 0;
  

  constructor(canvasHeight: number, canvasWidth: number) {
    super();

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
    this.interactive = true;

    
    document.addEventListener('keydown', e => {
      this.addSpeed(-this.GRAVITY / 3);
      console.log("keydown pressed");
    });

    document.addEventListener("keyup", (e) => {

    });

    // We got to animate the dude, yo. 
    window.setInterval(()=> { this.animateGuy() }, 50);

    
  }

  private guyTextureCounter: number = 0;
  animateGuy() {
      this.guyTextureCounter++;
      if(this.guyTextureCounter < 8){
        this.texture = PIXI.loader.resources["guy-atlas"].textures["frame_" + this.guyTextureCounter + ".gif"];
      } else {
        this.guyTextureCounter = 0;
        this.texture = PIXI.loader.resources["guy-atlas"].textures["frame_0.gif"];
      }

      this.updateSprite();
  }

  

  addSpeed(speedInc: number) {
    this.runningSpeedY += speedInc;
    this.runningSpeedY = Math.max(-this.GRAVITY, this.runningSpeedY);
  }
  

  updateSprite(){
    /*
    this.speedY += this.GRAVITY / 70;
    
    // todo: boolean grounded. 
    if(this.y < this.canvasHeight / 1.15){
      this.speedY = 0; 
      return;
    } else {   
      this.y += this.speedY;
    }

    */
    
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

    //this.scale.x = 1;
    //this.scale.y = 0.8;
    
    this.tileScale.y = 0.8;
    this.tileScale.x = 0.8;
    this.tilePosition.x = 0;
    this.tilePosition.y = 0;
  }


  public startGround(pixiApp : PIXI.Application){
    pixiApp.ticker.add(delta => this.move(delta));
  }

  private move(delta:number){
    //this.x -= 1 + delta;
    console.log(this.x);

    this.tilePosition.x = (this.tilePosition.x - delta) % ( this.texture.width * 0.8 );

  }



}
