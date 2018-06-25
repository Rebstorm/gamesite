import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as PIXI from 'pixi.js';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.removeWebPageElements();
    this.createGameField(); 
  }
  constructor() { }


  removeWebPageElements(){
    document.getElementById("ground").style.display = "none";
    document.getElementById("clouds").style.display = "none";
  }


  private pixiApp: PIXI.Application;
  private gameGuy: PIXI.Sprite;


  private stage = new PIXI.Container();

  // Frames for the guy.
  private GUY_FRAME_LIST = [
    "../../assets/img/sprites/frame_0.gif",
    "../../assets/img/sprites/frame_1.gif",
    "../../assets/img/sprites/frame_2.gif",
    "../../assets/img/sprites/frame_3.gif",
    "../../assets/img/sprites/frame_4.gif",
    "../../assets/img/sprites/frame_5.gif",
    "../../assets/img/sprites/frame_6.gif",
    "../../assets/img/sprites/frame_7.gif",
  ];
  
  private textureCounter: number = 0;

  private canvasWidthHeight = 400;

  updateTexture(){
    this.gameGuy.texture = PIXI.loader.resources[this.GUY_FRAME_LIST[this.textureCounter++]].texture;
    if (this.textureCounter === this.GUY_FRAME_LIST.length) this.textureCounter = 0;
  }

  createGameField(){
    this.pixiApp = new PIXI.Application(800, 400, { backgroundColor: 0x1099bb });
    document.getElementById("main-playboard").appendChild(this.pixiApp.view);

    // Load the stuff for the game.

    PIXI.loader.add(this.GUY_FRAME_LIST).load(()=>{
      this.createGameCharacter();
    });

  }

  createGameCharacter(): any {    
    this.gameGuy = new PIXI.Sprite();
  
    this.stage.addChild(this.gameGuy);
    this.gameGuy.scale.x = 0.06;
    this.gameGuy.scale.y = 0.06;
    // Set the transformation origin
    this.gameGuy.anchor.set(0.5, 0.5);
    this.gameGuy.anchor.set(0.5, 0.5);
    this.resetGuy();

    setInterval(this.updateTexture, 200);
    this.stage.addChild(this.gameGuy);

  }


  resetGuy() {
    this.gameGuy.x = this.canvasWidthHeight / 6;
    this.gameGuy.y = this.canvasWidthHeight / 2.5;
  }

  
  
}
