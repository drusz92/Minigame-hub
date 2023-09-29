import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, catchError, finalize, switchMap, tap } from 'rxjs';
import { Monster } from 'src/app/models/monster.model';
import { MonsterService } from 'src/app/services/monster.service';
import { EncounterService } from 'src/app/services/encounter.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-play-my-pokemon',
  templateUrl: './play-my-pokemon.component.html',
  styleUrls: ['./play-my-pokemon.component.css']
})
export class PlayMyPokemonComponent implements OnInit {
  monsterImagePath: string = '';
  userId: string = "";
  maxStamina: number = 5;
  monster: Monster = new Monster();
  monsters: Monster[] = [];
  pokemonCode: string = '';
  showConfirmationPopup: boolean = false;
  showFreezePopup: boolean = false;
  showGenerateMonsterPopup: boolean = false;
  showUnFreezePopup: boolean = false;
  showCombinePopup: boolean = false;
  isCritRed: boolean = false;
  isCritGold: boolean = false;
  
  @Output() onRelease = new EventEmitter<void>();
  @Output() onGeneratePokemon = new EventEmitter<void>();
  @Output() critEvent = new EventEmitter<boolean>()

  constructor(private monsterService: MonsterService, private cookieService: CookieService, private userService: UserService,
    private encounterService: EncounterService) { 
  }

  ngOnInit(): void {  
    this.userService.userId$.subscribe(id => {
      this.userId = id;
    });
    this.initializeData();
  }

  initializeData() {
    this.userId = this.cookieService.get('userId');   
    if (!this.userId) {
      this.setEmptyCreature();
      return;
    }
    this.monsterService.getMonster(this.userId).subscribe(
      (data: any) => {
        this.monsters = data;
        this.monster = data.find((item: { isActive: boolean; }) => item.isActive === true);
        if (!this.monster) { 
          this.setEmptyCreature();
          this.flashGold();
        } else {     
          this.monsterImagePath = this.getMonsterImage();
        }
      },
      (error: any) => {
        console.error('Error fetching creature:', error);
        this.setEmptyCreature();
      }
    ); 
  }
  
  setEmptyCreature() {
    this.monster = new Monster();
    this.monsterImagePath = "";
  }

  generateMonster() {
    this.monsterService.generateMonster(this.userId, this.pokemonCode).pipe(
      tap((data: any) => {
        if (data && data.length > 0) {
          this.monsters = data;
          this.monster = data.find((item: { isActive: boolean; }) => item.isActive === true);         
          if (!this.monster) {
            this.setEmptyCreature();
          }
          this.monsterImagePath = this.getMonsterImage();
          this.pokemonCode = '';
          this.emitEventsAndInitialize();
        } else {
          console.warn('No pokemon data received.');
        }
      }),
      catchError((error: any) => {
        console.error('Error fetching pokemon:', error);
        return EMPTY;
      })
    ).subscribe();
  }
  
  private emitEventsAndInitialize() {
    this.onGeneratePokemon.emit();
    this.critEvent.emit(true);
    this.initializeData();
  }

  releasePokemon(){
    this.showConfirmationPopup = true;
  }

  freezePokemon(){
    this.showFreezePopup = true;
  }

  unfreezeMonster(){
    this.showUnFreezePopup = true;
  }

  handleUnFreeze(imgUrl: string) {
    if (imgUrl.includes('fused')){
      const regex = /(\d+\.\d+)(?=\.png$)/;
      let match = imgUrl.match(regex);
      var id = match ? match[0] : ""
    }
    else{
      const regex = /(\d+)(?=\.png$)/;
      let match = imgUrl.match(regex);
      var id = match ? match[0] : "";
    }
    this.monsterService.unFreezeMonster(this.userId, id).pipe(
      tap(() => {
        this.initializeData();
        this.onGeneratePokemon.emit();
        this.showUnFreezePopup = false;
      }),
      catchError((error: any) => {
        console.error('Error:', error);
        this.showUnFreezePopup = false;
        return EMPTY;
      })
    ).subscribe();
}

combinePokemon(){
  this.showCombinePopup = true;
}

handleCombine(imgUrl: string) {
  if (imgUrl.includes('fused')){
    const regex = /(\d+\.\d+)(?=\.png$)/;
    let match = imgUrl.match(regex);
    var id = match ? match[0] : ""
  }
  else{
    const regex = /(\d+)(?=\.png$)/;
    let match = imgUrl.match(regex);
    var id = match ? match[0] : "";
  }
  this.monsterService.combineMonster(this.userId, id).pipe(
    tap(() => {
      this.initializeData();
      this.onGeneratePokemon.emit();
      this.showCombinePopup = false;
    }),
    catchError((error: any) => {
      console.error('Error:', error);
      this.showCombinePopup = false;
      return EMPTY;
    })
  ).subscribe();
}

  handleConfirm() {
    this.monsterService.releaseMonster(this.userId).pipe(
      switchMap(() => this.encounterService.run(this.userId)),
      tap(() => {   
        this.initializeData();
        this.showConfirmationPopup = false;
        this.onRelease.emit();
      }),
      catchError((error: any) => {
        console.error('Error:', error);
        this.showConfirmationPopup = false;
        return EMPTY;
      })
    ).subscribe();
  }
  
  handleDeny() {
    this.showConfirmationPopup = false;
  }

  handleFreezeConfirm() {
    this.monsterService.freezeMonster(this.userId).pipe(
      switchMap(() => this.encounterService.run(this.userId)),
      tap(() => {
        this.onRelease.emit();
        this.initializeData();
        this.showFreezePopup = false;
      }),
      catchError((error: any) => {
        console.error('Error:', error);
        this.showFreezePopup = false;
        return EMPTY;
      })
    ).subscribe();
  }
  
  handleFreezeDeny() {
    this.showFreezePopup = false;
  }

  getHealthPercentage(): number {
    return (this.monster.stamina / this.maxStamina) * 100;
}

critHit() {
  this.isCritRed = true;
  setTimeout(() => {
      this.isCritRed = false;
  }, 500); 
}

flashGold() {
  this.isCritGold = true;
  setTimeout(() => {
      this.isCritGold = false;
  }, 500);
}

getMonsterImage(){
  return this.monster.url;
}

}
