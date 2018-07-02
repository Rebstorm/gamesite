import { Text } from "pixi.js";

export default class UIText extends Text {


    public text: string; 

    canvasHeight : number;
    canvasWidth : number;
    
    constructor(text: string, canvasHeight: number, canvasWidth: number, posX:number, posY:number){
        super();
        this.text = text;
    
        this.canvasHeight = canvasHeight;
        this.canvasWidth = canvasWidth;

        this.x = canvasWidth;
        this.y = canvasHeight;

       
    }

    setText(text:string){
        this.text = text;
    }

    getText(){
        return this.text;
    }
}
