import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements AfterViewInit {
  
  router:Router;

  constructor(router:Router) { 
    this.router = router;
  }

  

  ngAfterViewInit() {
    
  }

  expandClick(event:Event){
    
    document.getElementById("main-menu-container").classList.add("show");
    document.getElementById("main-menu-container").classList.remove("hide");

    document.getElementById("menu-collapser").classList.add("show");
    document.getElementById("menu-collapser").classList.remove("hide");

    document.getElementById("menu-extender").classList.add("hide");
    document.getElementById("menu-extender").classList.remove("show");

  }

  collapseClick(event:Event){
    document.getElementById("main-menu-container").classList.add("hide");
    document.getElementById("main-menu-container").classList.remove("show");

    document.getElementById("menu-collapser").classList.add("hide");
    document.getElementById("menu-collapser").classList.remove("show");

    document.getElementById("menu-extender").classList.add("show");
    document.getElementById("menu-extender").classList.remove("hide");

  }

  onResize(event) {
    // remove button if above 791
    if(event.target.innerWidth > 791){
      this.expandClick(undefined);
      document.getElementById("menu-collapser").classList.add("hide");
      document.getElementById("menu-collapser").classList.remove("show");
    } else {
      this.collapseClick(undefined);
      
    }
  }

  linkTwitter(){
    window.open("https://twitter.com/rebstorm", "_blank");
    
  }

  linkGithub(){
    window.open("https://github.com/rebstorm", "_blank");
  }
  



}
