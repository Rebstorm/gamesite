import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.css']
})
export class MainmenuComponent implements AfterViewInit {
  


  constructor() { 

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


  addClass(c:string, id:string) {
    var element, name, arr;
    element = document.getElementById(id);
    name = c;
    arr = element.className.split(" ");
    if (arr.indexOf(name) == -1) {
        element.className += " " + name;
    }
  }
  
  removeClass(c:string, id:string) {
    var element = document.getElementById(id);
    element.className = element.className.replace(/\bc\b/g, "");
  } 


  onResize(event) {
    // remove button if above 699
    if(event.target.innerWidth > 699){
      this.expandClick(undefined);
      document.getElementById("menu-collapser").classList.add("hide");
      document.getElementById("menu-collapser").classList.remove("show");
    } else {
      this.collapseClick(undefined);
      
    }
  }
  



}
