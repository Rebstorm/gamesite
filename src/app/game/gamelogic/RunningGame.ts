import * as PIXI from 'pixi.js';
import Floor from '../gameobjects/Floor';
import RunningGuy from '../gameobjects/RunningGuy';
import Platform from '../gameobjects/Platform';
import Star from '../gameobjects/Star';

export default class RunningGame extends PIXI.Application{
    
    public static game : RunningGame = new RunningGame();

    constructor(){
      super();
      
    }
    
    initialize(){
      this.removeWebPageElements();
      this.createGameField();
    }
    
    
    public pixiApp: PIXI.Application;
    private gameGuy: RunningGuy; 
    private groundFloor: Floor;
    private firstFloor: Platform;
    private secondFloor: Platform;
    private thirdFloor: Platform;
    public stars: Array<Star> = [];
  
    private canvasHeight = 400;
    private canvasWidth = 800; 

    public score : number = 0;
  
    public gameObjectList : Array<PIXI.Sprite> = [];
    
    removeWebPageElements(){
      document.getElementById("ground").style.display = "none";
      document.getElementById("clouds").style.display = "none";
    }
  
    createGameField(){
      this.pixiApp = new PIXI.Application(this.canvasWidth, this.canvasHeight, { backgroundColor: 0x1099bb });
      document.getElementById("main-playboard").appendChild(this.pixiApp.view);
  
      // Load the stuff for the game.
      PIXI.loader
        .add("guy-atlas", "../../assets/img/sprites/char.json" )
        .add("guy-atlas-falling", "../../assets/img/sprites/char_falling.json")
        .add("floor", "../../assets/img/ground_2.png")
        .add("star", "../../assets/img/sprites/star.json")
        .load(() => {
          this.createGameAssets();
        }
      );
      

      // Setting the speed of the game. Because screw everything else. 
      this.pixiApp.ticker.speed = 2;
  
    }

    
    starCounter: number = 0; 
    createGameAssets(): any {    
      // Get our running guy.
      this.gameGuy = new RunningGuy(this.canvasHeight, this.canvasWidth, this.pixiApp);
  
      // Get our ground. The absolute base floor.
      this.groundFloor = new Floor(this.canvasHeight, this.canvasWidth, 1, 1.15);
      this.firstFloor = new Platform(this.canvasHeight, this.canvasWidth, 1, 1.4);
      this.secondFloor = new Platform(this.canvasHeight, this.canvasWidth, 800, 1.4);

      // This is pointz yo. 
      RunningGame.game.stars.push(new Star(this.canvasHeight, this.canvasWidth, 1.2, 4, this.pixiApp, "star"+this.starCounter++));
      
      /*  
      * Add the stuff to the scene.
      * 
      */
      this.addGameObjects();
      this.addMoreStars();
  
      this.createEventHandlers();
      this.createColliders();
      this.startGame();
      this.listenToScoreChanges();
    }

    addMoreStars(){
      window.setInterval( e => {
        if(this.stars.length < 25){
          let newStar: Star = new Star(this.canvasHeight, this.canvasWidth, 1.5 + (0.4 * Math.random()), this.canvasWidth, this.pixiApp, "star"+this.starCounter++);
          this.stars.push(newStar);
          this.pixiApp.stage.addChild(newStar);
          console.log("star added: " + this.stars.length);
        }
      }, 1000);
    }

    listenToScoreChanges(){
      window.setInterval(e => {
        console.log("score: " + this.score);
      }, 100);
    }
  
    addGameObjects(){
      // Character
      this.pixiApp.stage.addChild(this.gameGuy);
      // BG
      this.pixiApp.stage.addChild(this.groundFloor);

      this.pixiApp.stage.addChild(this.firstFloor);  
      this.pixiApp.stage.addChild(this.secondFloor);

      this.stars.forEach( star => {
        console.log(star);
        this.pixiApp.stage.addChild(star);
      });
  
      this.gameObjectList.push(this.gameGuy, this.groundFloor, this.firstFloor, this.secondFloor);
  
    }
  
    createEventHandlers(){
  
      document.addEventListener('keydown', e => {
  
        if(this.gameGuy.isJumping)
          return;
  
        if(e.keyCode == 38 ){ // the up arrow
          this.gameGuy.isJumping = true;
          // Adding the jumping speed.
          this.gameGuy.addJumpSpeed(-15);
          this.pixiApp.ticker.addOnce( (e)=> { this.checkIfOnFloor(e) });
          
        }
      
      });
  
      document.addEventListener('mousedown', e => {

        if(this.gameGuy.isJumping){
          return;
        } else {
          this.gameGuy.isJumping = true;
          // Adding the jumping speed.
          this.gameGuy.addJumpSpeed(-15);
          this.pixiApp.ticker.addOnce( (e)=> { this.checkIfOnFloor(e) });
        }        
      
      });
    }
  
    sinceLastFrameUpdate : number = 0;
    checkIfOnFloor(e){
      window.setTimeout(()=> {
        if(this.objectsColliding(this.gameGuy, this.groundFloor))
          this.gameGuy.isJumping = false;
        else
          this.checkIfOnFloor(e);
      }, 200)    
    }
  
    startGame(){
      this.groundFloor.startGround(this.pixiApp);
      this.firstFloor.startPlatform(this.pixiApp);
      this.secondFloor.startPlatform(this.pixiApp);
  
    }
  
  
    createColliders(): any {
      this.createGroundFloorCollisionDetection();
      this.createPlatformCollider();
    }
  
    createGroundFloorCollisionDetection(){
      // Creating collision between guy and floor. 
      this.pixiApp.ticker.add((delta) => {
          //console.log(this.objectsColliding(this.gameGuy, this.floor));
          if(this.objectsColliding(this.gameGuy, this.groundFloor) && !this.gameGuy.isJumping){
  
            if(!this.gameGuy.isJumpingUp){
            this.gameGuy.jumpingSpeedY = 0;
            this.gameGuy.position.y = this.canvasHeight / 1.25;
            } else {
  
            }
          }
      });
  
    }
  
    lastSpeed : number = 0; 
    onPlatform: boolean = false;
    createPlatformCollider(){
  
      // First platform collider
      this.pixiApp.ticker.add((delta) => {
  
          if(this.objectsColliding(this.gameGuy, this.firstFloor) 
          && this.gameGuy.jumpingSpeedY > 2){
            this.gameGuy.jumpingSpeedY = 0;
            this.gameGuy.position.y = this.canvasHeight / 1.55;
            this.gameGuy.isJumpingUp = false;
            this.gameGuy.isJumping = false;
            this.onPlatform = true;
          } 
      
  
  
      });

      this.pixiApp.ticker.add((delta) => {
        if(this.objectsColliding(this.gameGuy, this.secondFloor) 
          && this.gameGuy.jumpingSpeedY > 2){
            this.gameGuy.jumpingSpeedY = 0;
            this.gameGuy.position.y = this.canvasHeight / 1.55;
            this.gameGuy.isJumpingUp = false;
            this.gameGuy.isJumping = false;
            this.onPlatform = true;
          } 

      });
    }
  
    objectsColliding(a:PIXI.Sprite, b: PIXI.Sprite): boolean{
      let ab = a.getBounds();
      let bb = b.getBounds();
  
      return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }
  }