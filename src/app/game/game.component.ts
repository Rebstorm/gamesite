import { Component, OnInit, AfterViewInit } from '@angular/core';

import RunningGame from './gamelogic/RunningGame';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements AfterViewInit {

  constructor(){

  }
  


  ngAfterViewInit(): void {
    RunningGame.game.initialize();
  }

}


