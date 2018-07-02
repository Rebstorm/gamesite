export default class Platform extends PIXI.extras.TilingSprite {

    private startPosition: number = 0;

    constructor(canvasHeight: number, canvasWidth: number, 
      posX:number, posY:number){
      super(PIXI.loader.resources["floor"].texture, canvasWidth, canvasHeight);
      
      this.startPosition = canvasWidth + posX;
  
      // Height and Width of the platform
      this.width = canvasWidth / 3;
      this.height = 64;
  
      this.scale.x = 0.8;
      this.scale.y = 0.8;
  
      this.x = this.startPosition;
      this.y = canvasHeight / posY;
    }
  
    public startPlatform(pixiApp : PIXI.Application){
      pixiApp.ticker.add(delta => this.move(delta));
    }
  
    private move(delta:number){
      // moving the tileposition with tileposition x minus delta, modulus texture width times the scale of the texture. 
      //this.tilePosition.x = (this.tilePosition.x - delta) % ( this.texture.width * 0.8 );
      if(this.position.x > -this.startPosition)
        this.position.x -= delta;
      else
        this.position.x = this.startPosition;
    }
}