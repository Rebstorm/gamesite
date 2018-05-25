import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProfileComponent } from './mainmenu/profile/profile.component';
import { TechComponent } from './mainmenu/tech/tech.component';



const routes: Routes = [
  { path: '', component: MainmenuComponent },
  { path: 'profile', component: ProfileComponent},
  { path: 'tech', component: TechComponent},
  { path: '**', component: NotfoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    NotfoundComponent,
    ProfileComponent,
    TechComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes,
      {enableTracing: false}
    ),
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
