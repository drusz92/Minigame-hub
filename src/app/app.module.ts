import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { HomeComponent } from './home/home.component';
import { MinigameBoxComponent } from './components/minigame-box/minigame-box.component';
import { GameListComponent } from './components/game-list/game-list.component';
import { GameDisplayComponent } from './components/game-display/game-display.component';
import { Game1Component } from './components/games/game1/game1.component';
import { Game2Component } from './components/games/game2/game2.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
    ])
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    HomeComponent,
    MinigameBoxComponent,
    GameListComponent,
    GameDisplayComponent,
    Game1Component,
    Game2Component,
  ],
  providers: [
    CookieService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


