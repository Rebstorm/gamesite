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

  private canvasHeight = 400;
  private canvasWidth = window.innerWidth;

  createGameField(){
    this.pixiApp = new PIXI.Application(this.canvasWidth, this.canvasHeight, { backgroundColor: 0x1099bb });
    document.getElementById("main-playboard").appendChild(this.pixiApp.view);

    // Load the stuff for the game.
    PIXI.loader
      .add("guy-atlas", "../../assets/img/sprites/char.json" )
      .load(() => {
      this.createGameCharacter();
    });

  }

  createGameCharacter(): any {    

    this.gameGuy = new RunningGuy(this.canvasHeight, this.canvasWidth, this.pixiApp);
    this.pixiApp.stage.addChild(this.gameGuy);
  
  }

  
}


class RunningGuy extends PIXI.Sprite {
  
  pixiApp: PIXI.Application;
  canvasHeight: number;
  canvasWidth: number;

  constructor(canvasHeight: number, canvasWidth: number, pixiApp : PIXI.Application) {
    super();

    this.pixiApp = pixiApp;
    this.canvasHeight = canvasHeight;
    this.canvasWidth = canvasWidth;

    new PIXI.Sprite(
      PIXI.loader.resources["guy-atlas"].textures["frame_0.gif"]
    );

    this.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

    // Set the transformation origin
    this.anchor.set(0.5, 0.5);

    this.x = canvasWidth / 2;
    // Offset for ground and stuff.
    this.y = canvasHeight / 1.15;
    this.scale.x *= 1.25;
    this.scale.y *= 1.25;

    // Todo: find out what interactive means. But it sounds fancy. 
    this.interactive = true;

    
    this.on("onmousedown", (e) => {
      this.makeJump();
    });

    /*
    this.pixiApp.ticker.add((delta: number): void => {
    });
    */

    // We got to animate the dude, yo. 
    window.setInterval(()=> { this.animateGuy() }, 100);
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
  }

  public makeJump(){
    console.log("jump!")

    

  }




}
