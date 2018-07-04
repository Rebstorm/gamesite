import * as PIXI from 'pixi.js';
import Floor from '../gameobjects/Floor';
import RunningGuy from '../gameobjects/RunningGuy';
import Platform from '../gameobjects/Platform';
import Star from '../gameobjects/Star';
import DangerousObject from '../gameobjects/DangerousObject';

export default class RunningGame {
    
    public static game : RunningGame = new RunningGame();

    constructor(){      
    }
    
    initialize(){
      this.removeWebPageElements();
      this.createGameField();
    }
    
    
    public pixiApp: PIXI.Application;
    public gameGuy: RunningGuy; 
    private groundFloor: Floor;
    private firstFloor: Platform;
    private secondFloor: Platform;
    private thirdFloor: Platform;
    public stars: Array<Star> = [];
    public dangers: Array<DangerousObject> = [];

    public scoreText: PIXI.Text;
  
    private canvasHeight = 400;
    private canvasWidth = window.innerWidth; 

    public score : number = 0;
    
    removeWebPageElements(){
      document.getElementById("ground").style.display = "none";
      document.getElementById("clouds").style.display = "none";
    }
  
    createGameField(){
      this.pixiApp = new PIXI.Application(this.canvasWidth, this.canvasHeight, { backgroundColor: 0x1099bb });
      var canvas = document.getElementById("main-playboard");
      canvas.appendChild(this.pixiApp.view);

      // Load the stuff for the game.
      PIXI.loader
        .add("guy-atlas", "../../assets/img/sprites/char.json" )
        .add("guy-atlas-falling", "../../assets/img/sprites/char_falling.json")
        .add("floor", "../../assets/img/ground_2.png")
        .add("star", "../../assets/img/sprites/star.json")
        .add("snail", "../../assets/img/sprites/snail.png")
        .add("snail1", "../../assets/img/sprites/snail1.json")
        .load(() => {
          this.createGameMenu();
        }
      );
      // Setting the speed of the game. Because screw everything else. 
      this.pixiApp.ticker.speed = 2;
    }

    createGameMenu(){
      this.createGameAssets();
    }

    endGame(){
      //this.pixiApp.ticker.stop();
     
      //this.pixiApp.ticker.remove
      //this.createGameMenu();
      
      // Waiting for current loops to run out.. not elegant but works.
      //window.setTimeout( e=> this.recreateGame(), 200);

      this.gameGuy.y = 10;
      this.gameGuy.alpha = 0;
      this.pixiApp.ticker.stop();
      window.setTimeout(e => {

        this.stars.forEach(star => {
          star.stopStars();
        })

        RunningGame.game.pixiApp.stage.removeChildren();
        RunningGame.game.pixiApp.ticker.start();
      }, 200)
      
      
      this.createGameAssets();
      
    }

    makeGameMenu(){

      

    }
    
    starCounter: number = 0; 
    dangerCounter: number = 0;
    createGameAssets(): any {    
      // Get our running guy.
      this.gameGuy = new RunningGuy(this.canvasHeight, this.canvasWidth, this.pixiApp);
  
      // Get our ground. The absolute base floor.
      this.groundFloor = new Floor(this.canvasHeight, this.canvasWidth, 1, 1.15, "floor");
      this.firstFloor = new Platform(this.canvasHeight, this.canvasWidth, 1, 1.4, 2, "firstFloor");
      this.secondFloor = new Platform(this.canvasHeight, this.canvasWidth, 2, 1.4, 3, "secondFloor");
      this.thirdFloor = new Platform(this.canvasHeight, this.canvasWidth, 1.5, 1.4, 5, "thirdFloor");

      this.scoreText = new PIXI.Text('',{fontFamily : 'cc_regular_alert', fontSize: 24, fill : "#fff", align : 'center'});
      
      /*  
      * Add the stuff to the scene.
      * 
      */
      this.addGameObjects();
      this.addMoreStars();
      this.addMoreDanger();
  
      this.createEventHandlers();
      this.createColliders();
      this.startGame();
      this.listenToScoreChanges();
    }

    starTicker;
    addMoreStars(){
      this.starTicker = window.setInterval( e => {
        if(this.stars.length < 25){
          let newStar: Star = new Star(this.canvasHeight, this.canvasWidth, 1.5 + (0.4 * Math.random()), this.canvasWidth, this.pixiApp, "star"+this.starCounter++);
          this.stars.push(newStar);
          RunningGame.game.pixiApp.stage.addChild(newStar);
        }
      }, 1000);
    }
    
    dangerTicker; 
    addMoreDanger(){
      this.dangerTicker = window.setInterval( e => {
        if(this.dangers.length < 3){
          let newDanger: DangerousObject = new DangerousObject(this.canvasHeight, this.canvasWidth, 2, this.canvasWidth, this.pixiApp, "danger"+this.dangerCounter++)
          this.dangers.push(newDanger);
          RunningGame.game.pixiApp.stage.addChild(newDanger);
        }
      }, 1500)
    }

    listenToScoreChanges(){
      window.setInterval(e => {
      }, 100);
    }
  
    addGameObjects(){
      // Character
      this.pixiApp.stage.addChild(this.gameGuy);
      // BG
      this.pixiApp.stage.addChild(this.groundFloor);

      this.pixiApp.stage.addChild(this.firstFloor);  
      this.pixiApp.stage.addChild(this.secondFloor);
      this.pixiApp.stage.addChild(this.thirdFloor);

      this.pixiApp.stage.addChild(this.scoreText);

      this.stars.forEach( star => {
        this.pixiApp.stage.addChild(star);
      });
  
    }
  
    createEventHandlers(){
  
      document.addEventListener('keydown', e => {
  
        if(this.gameGuy.isJumping)
          return;
  
        if(e.keyCode == 38 ){ // the up arrow
          this.gameGuy.isJumping = true;
          // Adding the jumping speed.
          this.gameGuy.addJumpSpeed(-15);
          this.gameGuy.multiplier = 1.2;
          RunningGame.game.pixiApp.ticker.addOnce( (e)=> { this.checkIfOnFloor(e) });
          
        }
      
      });
  
      document.addEventListener('mousedown', e => {

        if(this.gameGuy.isJumping){
          return;
        } else {
          this.gameGuy.isJumping = true;
          // Adding the jumping speed.
          RunningGame.game.gameGuy.addJumpSpeed(-15);
          RunningGame.game.pixiApp.ticker.addOnce( (e)=> { this.checkIfOnFloor(e) });
        }        
      
      });
    }
  
    sinceLastFrameUpdate : number = 0;
    checkIfOnFloor(e){
      window.setTimeout(()=> {
        if(this.objectsColliding(this.gameGuy, this.groundFloor))
          RunningGame.game.gameGuy.isJumping = false;
        else
          RunningGame.game.checkIfOnFloor(e);
      }, 50)    
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
  
    createPlatformCollider(){
      // platform collider
      this.pixiApp.ticker.add((delta) => {
  
          if((this.objectsColliding(this.gameGuy, this.firstFloor) || 
          this.objectsColliding(this.gameGuy, this.secondFloor) ||
          this.objectsColliding(this.gameGuy, this.thirdFloor))
          && this.gameGuy.jumpingSpeedY > 1.8){
            this.gameGuy.jumpingSpeedY = 0;
            this.gameGuy.position.y = this.canvasHeight / 1.55;
            this.gameGuy.isJumpingUp = false;
            this.gameGuy.isJumping = false;
            this.gameGuy.isOnPlatform = true;
          } else {
            this.gameGuy.isOnPlatform = false;
          }
      
  
  
      });
      
    }
  
    objectsColliding(a:PIXI.Sprite, b: PIXI.Sprite): boolean{
      let ab = a.getBounds();
      let bb = b.getBounds();
  
      return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

  }