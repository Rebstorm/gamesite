import { Component, OnInit, AfterViewInit } from '@angular/core';

import RunningGame from './gamelogic/RunningGame';
import { Router } from '@angular/router';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements AfterViewInit {

  private router: Router;
  constructor(router : Router){
    this.router = router;

  }
  
  ngAfterViewInit(): void {
    RunningGame.game.initialize();
  }

  restartGame(){
    RunningGame.game.restartGame();
  }

  goBack(){
    
  }

}


