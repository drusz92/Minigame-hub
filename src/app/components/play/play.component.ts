import { Component, OnInit, ViewChild } from '@angular/core';
import { PlayMyPokemonComponent } from '../play-my-pokemon/play-my-pokemon.component';
import { PlayRightBoxComponent } from '../play-right-box/play-right-box.component';
import { GymListComponent } from '../gym-list/gym-list.component';
import { Monster } from 'src/app/models/monster.model';
import { MonsterService } from 'src/app/services/monster.service';
import { CookieService } from 'ngx-cookie-service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  constructor(private monsterService: MonsterService, private cookieService: CookieService) { }
  selectedGame: any;
  currentGameName: any;
  showConfirmationPopup: boolean = false;
  gymName: string = "";
  errorMessage: string | null = null;
  showErrorModal: boolean = false;
  monster: Monster = new Monster();
  userId: string = '';
  showBattle: boolean = false;
  myMonster: string = 'https://images.alexonsager.net/pokemon/25.png';
  bossMonster: string = 'https://images.alexonsager.net/pokemon/25.png';

  @ViewChild(PlayMyPokemonComponent) playMyPokemonComponent!: PlayMyPokemonComponent;
  @ViewChild(PlayRightBoxComponent) playRightBoxComponent!: PlayRightBoxComponent;
  @ViewChild(GymListComponent) gymListComponent!: GymListComponent;

  ngOnInit(): void {
    this.userId = this.cookieService.get('userId'); 
  }

  initialize(){
    this.gymListComponent.initialize();
    this.playMyPokemonComponent.initializeData();
    this.playRightBoxComponent.initialize();
  }

  onGymSelected(gym: any) {
    this.monsterService.getMonster(this.userId)
      .pipe(
        tap((data: any) => {
          this.monster = data.find((item: { isActive: boolean; }) => item.isActive === true);
          if (!this.monster) {
            this.monster = new Monster();
            this.errorMessage = "You cannot challenge a gym without a pokemon";
            this.showErrorModal = true;
          } else {
            var oldStrength = this.monster.strength;
            this.myMonster = this.monster.url;
            this.bossMonster = this.getBossMonster(gym.name);
            this.monsterService.challengeGym(this.userId, gym).subscribe(
              (data: any) => {
                this.showBattleAnimation(oldStrength !== data[0].strength);
              },
              (error: any) => {
                console.error(`Error challenging gym:`, error);
                this.initialize();
              }
            );
          }
        }),
      )
      .subscribe(
        () => { },
        (error: any) => {
          console.error('Error in the initialization sequence:', error);
        }
      );
  }
  
  showBattleAnimation(isWin: boolean) {
    this.showBattle = true;
    setTimeout(() => {
      this.showBattle = false;
      if (isWin) {
        this.playRightBoxComponent.winFlash.onWinEvent();
      } else {
        this.playRightBoxComponent.loseFlash.onLoseEvent();
      }
      this.initialize();
    }, 1000); // Duration is 1 second
  }

  getBossMonster(gymName: string){
    if (gymName == 'Pewter'){
      return 'https://images.alexonsager.net/pokemon/95.png';
    }
    else if (gymName == 'Cerulean'){
      return 'https://images.alexonsager.net/pokemon/121.png';
    }
    else if (gymName == 'Vermilion'){
      return 'https://images.alexonsager.net/pokemon/26.png';
    }
    else if (gymName == 'Celadon'){
      return 'https://images.alexonsager.net/pokemon/45.png';
    }
    else if (gymName == 'Fuchsia'){
      return 'https://images.alexonsager.net/pokemon/49.png';
    }
    else if (gymName == 'Saffron'){
      return 'https://images.alexonsager.net/pokemon/65.png';
    }
    else if (gymName == 'Cinnabar'){
      return 'https://images.alexonsager.net/pokemon/126.png';
    }
    else if (gymName == 'Viridian'){
      return 'https://images.alexonsager.net/pokemon/112.png';
    }
    else return 'https://images.alexonsager.net/pokemon/25.png'
  }

  handleConfirm(){
    this.showConfirmationPopup = false;
  }

  handleDeny(){
    this.showConfirmationPopup = false;
  }

  handleCatchConfirmation() {
    this.playMyPokemonComponent.initializeData();
    this.gymListComponent.initialize();
  }

  handleRelease() {
    this.gymListComponent.initialize();
    this.playRightBoxComponent.initialize();
  }

  handleGeneratePokemon() {
    this.playRightBoxComponent.initialize();
    this.gymListComponent.initialize();
  }

  triggerCrit() {
    this.playMyPokemonComponent.critHit();
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }
}
