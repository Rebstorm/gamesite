import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFontAwesomeModule } from 'angular-font-awesome';


import { AppComponent } from './app.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProfileComponent } from './mainmenu/profile/profile.component';


const routes: Routes = [
  { path: '', component: MainmenuComponent },
  { path: '**', component: NotfoundComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    MainmenuComponent,
    NotfoundComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      routes,
      {enableTracing: true}
    ),
    AngularFontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
