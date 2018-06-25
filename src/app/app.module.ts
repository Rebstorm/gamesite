import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProfileComponent } from './mainmenu/profile/profile.component';
import { TechComponent } from './mainmenu/tech/tech.component';
import { GameComponent } from './game/game.component';

// External stuff
import { AngularFontAwesomeModule } from 'angular-font-awesome';



const routes: Routes = [
  { path: '', component: MainmenuComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'tech', component: TechComponent},
  { path: 'game', component: GameComponent},
  { path: '**', component: NotfoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    NotfoundComponent,
    ProfileComponent,
    TechComponent,
    GameComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes,
      {enableTracing: false}
    ),
    AngularFontAwesomeModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
