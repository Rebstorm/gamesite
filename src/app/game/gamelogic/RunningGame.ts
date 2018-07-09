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
      this.started = true;
    }
    
    public started: boolean = false;
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

    private ticker = new PIXI.ticker.Ticker();

    public score : number = 0;
    
    removeWebPageElements(){
      document.getElementById("ground").style.display = "none";
    }
  
    createGameField(){
      this.pixiApp = new PIXI.Application(this.canvasWidth, this.canvasHeight, { transparent: true });
      var canvas = document.getElementById("main-playboard");
      canvas.appendChild(this.pixiApp.view);


      // If we are reloading everything, we cant have all the tickers keep.
      window.clearInterval(this.starTicker);
      window.clearInterval(this.dangerTicker);
      PIXI.loader.reset();

      this.stars = [];
      this.dangers = [];
      this.pixiApp.stage.removeChildren();



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
      
      //this.gameGuy.alpha = 0;
      this.pixiApp.ticker.stop();      
      this.gameGuy.isDeaded = true;
      // removing the interval for the tickers.
      //window.clearInterval(this.starTicker);
      //window.clearInterval(this.dangerTicker);

      this.pixiApp.ticker.start();
      this.gameGuy.playDeadAnimation(false);
      this.showGameMenu();
    }

    restartGame(){
      this.gameGuy.isDeaded = false;
      
      window.setTimeout( e => {
        var gameMenu = document.getElementById("game-menu");
        gameMenu.style.display = "none";

        this.gameGuy.y = 0;
        this.gameGuy.jumpingSpeedY = 0;
        
        this.score = 0;
        this.scoreText.text = "0, lol";

      }, 100)
      
    }

    showGameMenu(){
        var gameMenu = document.getElementById("game-menu");
        var deadScreen = document.getElementById("game-ded");
        var deadScreenText = document.getElementById("game-ded-text");
        
        deadScreenText.innerHTML = (this.score > 0 ? "u ded by snail :( <br> but you maded " + this.score + " points. <br> Good Jobber.<br>" : "u suk, no points and dead");
        window.setTimeout( e => { 
          gameMenu.className = "shake";
          gameMenu.style.display = "block";
          deadScreen.style.display = "block";
        }, 1000);
              
    }
    
    starCounter: number = 0; 
    dangerCounter: number = 0;
    createGameAssets(): any {    
      // Get our running guy.
      this.gameGuy = new RunningGuy(this.canvasHeight, this.canvasWidth, RunningGame.game.pixiApp);
  
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
    dangerTime = 0;
    addMoreDanger(){
      let randomEnemy = (Math.random() * 3000) + 2500;
      this.dangerTicker = window.setInterval( e => {
        let newDanger: DangerousObject = new DangerousObject(this.canvasHeight, this.canvasWidth, 2, this.canvasWidth, this.pixiApp, "danger"+this.dangerCounter++)
        RunningGame.game.dangers.push(newDanger);
        RunningGame.game.pixiApp.stage.addChild(newDanger);        
        
      }, randomEnemy)
    }

    removeAllStars(){

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

      document.addEventListener('touchstart', e=> {
        if(this.gameGuy.isJumping){
          return;
        } else {
          this.gameGuy.isJumping = true;
          // Adding the jumping speed.
          RunningGame.game.gameGuy.addJumpSpeed(-15);
          RunningGame.game.pixiApp.ticker.addOnce( (e)=> { this.checkIfOnFloor(e) });
        }   
      })
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
          
          if(this.gameGuy.isDeaded)
            return;

          //console.log(this.objectsColliding(this.gameGuy, this.floor));
          if(this.objectsColliding(this.gameGuy, this.groundFloor) && !this.gameGuy.isJumping){
            if(!this.gameGuy.isJumpingUp){
              this.gameGuy.jumpingSpeedY = 0;
              this.gameGuy.position.y = this.canvasHeight / 1.25;
            }
          }
      });
  
    }
  
    createPlatformCollider(){

      // platform collider
      this.pixiApp.ticker.add((delta) => {

          if(this.gameGuy.isDeaded)
            return;
  
          if((this.objectsColliding(this.gameGuy, this.firstFloor) || 
          this.objectsColliding(this.gameGuy, this.secondFloor) ||
          this.objectsColliding(this.gameGuy, this.thirdFloor))
          && this.gameGuy.jumpingSpeedY > 1.8){
            this.gameGuy.jumpingSpeedY = 0;
            this.gameGuy.position.y = this.canvasHeight/ 1.55;
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