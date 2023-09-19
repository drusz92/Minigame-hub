import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, catchError, finalize, switchMap, tap } from 'rxjs';
import { Creature } from 'src/app/models/creature.model';
import { CreatureService } from 'src/app/services/creature.service';
import { EncounterService } from 'src/app/services/encounter.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-play-my-pokemon',
  templateUrl: './play-my-pokemon.component.html',
  styleUrls: ['./play-my-pokemon.component.css']
})
export class PlayMyPokemonComponent implements OnInit {
  creatureImagePath: string = '';
  userId: string = "";
  creature: Creature = new Creature();
  showConfirmationPopup: boolean = false;
  isCritRed: boolean = false;
  isCritGold: boolean = false;
  
  @Output() onRelease = new EventEmitter<void>();
  @Output() onGeneratePokemon = new EventEmitter<void>();
  @Output() critEvent = new EventEmitter<boolean>()

  constructor(private creatureService: CreatureService, private cookieService: CookieService, private userService: UserService,
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
  
    this.creatureService.getCreature(this.userId).subscribe(
      (data: any) => {
        if (!data || data.length === 0) {          
          this.setEmptyCreature();
          this.flashGold();
        } else {
          this.creature = data[0];
          this.creatureImagePath = `assets/${this.creature.name.toLowerCase()}.png`;
        }
      },
      (error: any) => {
        console.error('Error fetching creature:', error);
        this.setEmptyCreature();
      }
    ); 
  }
  
  private setEmptyCreature() {
    this.creature = new Creature();
    this.creatureImagePath = "";
  }

  evolve() {
    this.creatureService.evolve(this.userId).pipe(
      tap((data: any) => {
        if (data && data.length > 0) {
          this.creature = data[0];
          this.creatureImagePath = `assets/${this.creature.name.toLowerCase()}.png`;
        } else {
          console.warn('No creature data received on evolve.');
        }
      }),
      catchError((error: any) => {
        console.error('Error evolving creature:', error);
        return EMPTY;
      }),
      finalize(() => {
        this.initializeData();
      })
    ).subscribe();
  }

  evolveEevee(eeveeValue: string) {
    this.creatureService.evolveEevee(this.userId, eeveeValue).pipe(
      tap((data: any) => {
        if (data && data.length > 0) {
          this.creature = data[0];
          this.creatureImagePath = `assets/${this.creature.name.toLowerCase()}.png`;
        } else {
          console.warn('No creature data received on evolveEevee.');
        }
      }),
      catchError((error: any) => {
        console.error('Error evolving Eevee:', error);
        return EMPTY;
      }),
      finalize(() => {
        this.initializeData();
      })
    ).subscribe();
  }

  canEvolve(){
    if (this.creature.evolvesAt != undefined){
      return this.creature.level >= this.creature.evolvesAt
    }
    return false;
  }

  getPokemon() {
    this.creatureService.getPokemon(this.userId).pipe(
      tap((data: any) => {
        if (data && data.length > 0) {
          this.creature = data[0];
          this.creatureImagePath = `assets/${this.creature.name.toLowerCase()}.png`;
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

  handleConfirm() {
    this.creatureService.releasePokemon(this.userId).pipe(
      switchMap(() => this.encounterService.run(this.userId)),
      tap(() => {
        this.onRelease.emit();
        this.initializeData();
        this.showConfirmationPopup = false;
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

  getHealthPercentage(): number {
    return (this.creature.currentHealth / this.creature.maxHealth) * 100;
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

}
