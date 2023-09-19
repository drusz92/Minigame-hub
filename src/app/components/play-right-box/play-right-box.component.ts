import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Creature } from 'src/app/models/creature.model';
import { CreatureService } from 'src/app/services/creature.service';
import { locations1 } from './locations1';
import { locations2 } from './locations2';
import { locations3 } from './locations3';
import { locations4 } from './locations4';
import { locations5 } from './locations5';
import { EncounterService } from 'src/app/services/encounter.service';
import { WinService } from 'src/app/services/win.service';
import { WinFlashComponent } from '../win-flash/win-flash.component';
import { LoseFlashComponent } from '../lose-flash/lose-flash.component';
import { EMPTY, Observable, Subject, catchError, filter, finalize, map, of, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { Encounter } from 'src/app/models/encounter.model';


@Component({
  selector: 'app-play-right-box',
  templateUrl: './play-right-box.component.html',
  styleUrls: ['./play-right-box.component.css']
})
export class PlayRightBoxComponent implements OnInit {
  userId: string = "";
  creature: Creature = new Creature();
  creatureImagePath: string = '';
  locations: any = [];
  currentLocationName: string = 'location1';
  encounterInProgress: boolean = false;
  encounter: any = {};
  canCatch: boolean = false;
  isCrit = false;
  showConfirmationPopup: boolean = false;
  private destroyed$ = new Subject<void>();

  @Output() onCatchConfirmation = new EventEmitter<void>();
  @Output() critEvent = new EventEmitter<void>();
  @ViewChild('winFlash') winFlash!: WinFlashComponent;
  @ViewChild('loseFlash') loseFlash!: LoseFlashComponent;
  
  constructor(private cookieService: CookieService, private creatureService: CreatureService, private encounterService: EncounterService,
    private winService: WinService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.currentLocationName = this.cookieService.get('currentLocation') ?? 'location1';
    this.locations = this.getCurrentLocation(this.currentLocationName);
    this.userId = this.cookieService.get('userId');
    if (this.encounter.id == undefined) this.creatureImagePath = '';
    if (this.userId == ""){
      this.creature = new Creature();    
    }
    else {
      this.getEncounter();
    }
  }

  getCurrentLocation(location: string){
    if (location == "location1"){
      return locations1;
    }
    else if (location == "location2"){
      return locations2
    }
    else if (location == "location3"){
      return locations3
    }
    else if (location == "location4"){
      return locations4
    }
    else if (location == "location5"){
      return locations5
    }
    else{
      return locations1
    }
  }

getEncounter() {
  this.encounterService.getEncounter(this.userId)
    .pipe(
      tap((data: any) => {
        if (data.length === 0) {
          this.encounterInProgress = false;
          this.encounter = {};         
        } else {
          this.encounter = data[0];
          this.encounterInProgress = true;        
          this.canCatch = this.encounter.canCatch;
        }
      }),
      switchMap(() => this.getCreature())
    )
    .subscribe(
      (creature: Creature) => {
        this.creature = creature;
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
}

  getCreature(): Observable<Creature> {
    return this.creatureService.getCreature(this.userId).pipe(
      map((data: any) => {
        if (data.length === 0) {
          return new Creature();
        } else {
          const creature = data[0];
          if (this.encounter.creatureName != undefined) {
            this.creatureImagePath = this.getEncounterImage();
          }
          return creature;
        }
      }),
      catchError(error => {
        console.error('Error fetching creature:', error);
        return of(new Creature()); 
      })
    );
  }

  enabled(encounter: any){
    return this.creature.level >= encounter.minLevel && this.creature.level <=  encounter.maxLevel
  }

  isZoneLevel(minLevel: number, maxLevel: number){
    return this.creature.level >= minLevel && this.creature.level <= maxLevel
  }

  generateEncounter(encounter: any) {
    if (!this.enabled(encounter)) {
      return;  // Simply exit the function if the encounter isn't enabled
    }
  
    this.encounterService.generateEncounter(this.userId, this.creature.level, encounter.name, false).subscribe(
      (data: any) => {
        this.encounterInProgress = true;
        this.encounter = data[0]; 
        this.initialize();    
      },
      (error: any) => {
        console.error('Error generating encounter:', error);
      }
    );
  }
  
  generateGymEncounter(gymName: string) {
    this.encounterService.generateGymEncounter(this.userId, gymName, true).subscribe(
      (data: any) => {
        this.encounterInProgress = true;
        this.encounter = data[0]; 
        this.initialize();    
      },
      (error: any) => {
        console.error('Error generating gym encounter:', error);
      }
    );
  }

  run() {
    this.encounterService.run(this.userId).pipe(
      catchError(error => {
        console.error('Error running encounter:', error);
        return throwError(error); 
      })
    ).subscribe(
      (data: any) => {
        this.initialize();
        this.onCatchConfirmation.emit();
      }
    );   
  }

  catch(){
    this.showConfirmationPopup = true;
  }

  handleConfirm() {
    let encounterObservable: Observable<any>;  
    if (this.attemptCatch()) {
      encounterObservable = this.encounterService.successfulCatch(this.userId);
    } else {
      encounterObservable = this.encounterService.failedCatch(this.userId);
    }
    encounterObservable.pipe(
      finalize(() => {
        this.onCatchConfirmation.emit();
        this.showConfirmationPopup = false;
      }),
      catchError(error => {
        console.error('Error processing catch:', error);
        return EMPTY; // This prevents the subsequent subscribe logic from running in case of an error.
      })
    ).subscribe(data => {
      this.initialize();
      if (this.attemptCatch()) {
        this.onCatchConfirmation.emit();
      }
    });
  }

  attemptCatch(): boolean {
    const healthPercentage = this.encounter.currentHealth / this.encounter.maxHealth;
    let maxRate: number;
    let minRate: number;
    if (this.encounter.creatureLevel < 10) {
        maxRate = 0.95;
        minRate = 0.50;
    } else if (this.encounter.creatureLevel < 30) {
        maxRate = 0.90;
        minRate = 0.40;
    } else if (this.encounter.creatureLevel < 50) {
        maxRate = 0.80;
        minRate = 0.20;
    } else {
        maxRate = 0.70;
        minRate = 0.10;
    }
    const adjustedRate = maxRate - (maxRate - minRate) * healthPercentage;
    return Math.random() < adjustedRate;
}
  
  handleDeny() {
    this.showConfirmationPopup = false;
  }

  fight() {
    this.encounterService.fight(this.userId).pipe(
      switchMap((data: any) => {
        return this.creatureService.getCreature(this.userId).pipe(
          map((creatureData: any) => {
            return { data, creatureData };
          })
        );
      }),
      catchError(error => {
        console.error('Error processing fight:', error);
        return EMPTY;
      })
    ).subscribe(({ data, creatureData }) => {
      const creature = creatureData[0] ?? new Creature();
      this.creature = creature;
      if (this.creature.currentHealth > (creature.currentHealth ?? 0) + 3) {
        this.critEvent.emit();
      }
      if (this.creature.id !== 0) {
        if (data && data.length > 0) {
          const encounterHealth = data[0].currentHealth; 
          if (this.encounter.currentHealth > encounterHealth + 3) {
            this.critHit();
          }
          this.encounter.currentHealth = encounterHealth;
          this.encounter.maxHealth = data[0].maxHealth;
        } else {
          this.winFlash.onWinEvent();
          this.winService.announceGymListReload();
        }
      } else {
        this.loseFlash.onLoseEvent();
      }
      this.initialize();
      this.onCatchConfirmation.emit();
    });
  }

  zone1(){
    if (!this.isZoneLevel(1, 15)){
      return;
    }
    this.currentLocationName = 'location1';
    this.cookieService.delete('currentLocation');
    this.cookieService.set('currentLocation', this.currentLocationName, 365);
    this.locations = locations1;
  }

  zone2(){
    if (!this.isZoneLevel(12, 28)){
      return;
    }
    this.currentLocationName = 'location2';
    this.cookieService.delete('currentLocation');
    this.cookieService.set('currentLocation', this.currentLocationName, 365);
    this.locations = locations2;
  }

  zone3(){
    if (!this.isZoneLevel(26, 38)){
      return;
    }
    this.currentLocationName = 'location3';
    this.cookieService.delete('currentLocation');
    this.cookieService.set('currentLocation', this.currentLocationName, 365);
    this.locations = locations3;
  }

  zone4(){
    if (!this.isZoneLevel(36, 50)){
      return;
    }
    this.currentLocationName = 'location4';
    this.cookieService.delete('currentLocation');
    this.cookieService.set('currentLocation', this.currentLocationName, 365);
    this.locations = locations4;
  }

  zone5(){
    if (!this.isZoneLevel(50, 100)){
      return;
    }
    this.currentLocationName = 'location5';
    this.cookieService.delete('currentLocation');
    this.cookieService.set('currentLocation', this.currentLocationName, 365);
    this.locations = locations5;
  }

  getHealthPercentage(): number {
    return (this.encounter.currentHealth / this.encounter.maxHealth) * 100;
}

critHit() {
  this.isCrit = true;
  // If you want to remove the crit flash after some time, reset the flag:
  setTimeout(() => {
      this.isCrit = false;
  }, 500); // 500ms matches the duration of the flash animation.
}

ngOnDestroy() {
  this.destroyed$.next();
  this.destroyed$.complete();
}

getEncounterImage(){
  return `assets/gifs/${this.encounter.creatureName.toLowerCase()}.gif`;
}

}
