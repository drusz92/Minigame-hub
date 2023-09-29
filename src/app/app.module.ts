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
import { GymListComponent } from './components/gym-list/gym-list.component';
import { LoginPopupComponent } from './components/login-popup/login-popup.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { PlayComponent } from './components/play/play.component';
import { PlayMyPokemonComponent } from './components/play-my-pokemon/play-my-pokemon.component';
import { PlayRightBoxComponent } from './components/play-right-box/play-right-box.component';
import { ConfirmationPopupComponent } from './components/confirmation-popup/confirmation-popup.component';
import { WinFlashComponent } from './components/win-flash/win-flash.component';
import { LoseFlashComponent } from './components/lose-flash/lose-flash.component';
import { ImagePopupComponent } from './components/image-popup/image-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessagePopupComponent } from './components/message-popup/message-popup.component';
import { MyCodesComponent } from './components/my-codes/my-codes.component';
import { GymBattleComponent } from './components/gym-battle/gym-battle.component';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: PlayComponent },
      { path: 'MyCodes', component: MyCodesComponent },
      { path: 'Leaderboard', component: LeaderboardComponent },
    ])
  ],
  declarations: [
    AppComponent,
    TopBarComponent,
    HomeComponent,
    GymListComponent,
    LoginPopupComponent,
    LeaderboardComponent,
    PlayComponent,
    PlayMyPokemonComponent,
    PlayRightBoxComponent,
    ConfirmationPopupComponent,
    WinFlashComponent,
    LoseFlashComponent,
    ImagePopupComponent,
    MessagePopupComponent,
    MyCodesComponent,
    GymBattleComponent,
  ],
  providers: [
    CookieService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }


