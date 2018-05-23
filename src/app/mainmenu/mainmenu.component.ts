import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements AfterViewInit {

  constructor() { }



  ngAfterViewInit() {
    let menu = document.getElementById("main-menu-container");
  }

}
