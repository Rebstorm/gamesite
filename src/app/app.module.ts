import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { NotfoundComponent } from './notfound/notfound.component';


const routes: Routes = [
  { path: '', component: MainmenuComponent },
  { path: '**', component: NotfoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes,
      {enableTracing: true}
    ),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
