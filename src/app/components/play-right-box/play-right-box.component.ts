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
  encounterInProgress: boolean = true;
  encounter: any = {};
  canCatch: boolean = false;
  showConfirmationPopup: boolean = false;

  @Output() onCatchConfirmation = new EventEmitter<void>();
  @ViewChild('winFlash') winFlash!: WinFlashComponent;
  @ViewChild('loseFlash') loseFlash!: LoseFlashComponent;
  
  constructor(private cookieService: CookieService, private creatureService: CreatureService, private encounterService: EncounterService,
    private winService: WinService) { }

  ngOnInit(): void {
    this.initialize(false);
  }

  initialize(fromCreature: boolean) {
    this.currentLocationName = this.cookieService.get('currentLocation') ?? 'location1';
    this.locations = this.getCurrentLocation(this.currentLocationName);
    this.userId = this.cookieService.get('userId');
    this.encounterInProgress = false;
    if (this.userId == ""){
      this.creature = new Creature();    
    }
    else {
      this.getEncounter(fromCreature);
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

  getEncounter(fromCreature: boolean) {
    this.encounterService.getEncounter(this.userId).subscribe(
      (data: any) => {
        if (data.length == 0){
          this.encounterInProgress = false;
          this.encounter = {};         
        }
        else{
          this.encounterInProgress = true;
          this.encounter = data[0];
          this.canCatch = this.encounter.canCatch;
        }        
        if (!fromCreature) this.getCreature();
      },
      (error: any) => {
          console.error('Error fetching encounter:', error);
      }
    ); 
  }

  getCreature() {
    this.creatureService.getCreature(this.userId).subscribe(
      (data: any) => {
        if (data.length == 0){
          this.creature = new Creature();
        }
        else{
          this.creature = data[0];
          if (this.encounter.creatureName != undefined)
            this.creatureImagePath = `assets/${this.encounter.creatureName.toLowerCase()}.png`;
          
        }
        this.initialize(true);
      },
      (error: any) => {
          console.error('Error fetching creature:', error);
      }
    ); 
  }

  enabled(encounter: any){
    return this.creature.level >= encounter.minLevel && this.creature.level <=  encounter.maxLevel
  }

  isZoneLevel(minLevel: number, maxLevel: number){
    return this.creature.level >= minLevel && this.creature.level <= maxLevel
  }

  generateEncounter(encounter: any){
    if (this.enabled(encounter)){
      this.encounterService.generateEncounter(this.userId, this.creature.level, encounter.name, false).subscribe(
        (data: any) => {
          this.encounterInProgress = true;
          this.encounter = data[0]; 
          this.initialize(false);    
        },
        (error: any) => {
            console.error('Error generating encounter:', error);
        }
      ); 
    }
  }

  generateGymEncounter(gymName: string){
    this.encounterService.generateGymEncounter(this.userId, gymName, true).subscribe(
      (data: any) => {
        this.encounterInProgress = true;
        this.encounter = data[0]; 
        this.initialize(false);    
      },
      (error: any) => {
          console.error('Error generating encounter:', error);
      }
    ); 
  }

  run(){
    this.encounterService.run(this.userId).subscribe(
      (data: any) => {
        this.initialize(false);  
      },
      (error: any) => {
          console.error('Error generating encounter:', error);
      });   
  }

  catch(){
    this.showConfirmationPopup = true;
  }

  handleConfirm() {
    if (this.attemptCatch()){
      this.encounterService.successfulCatch(this.userId).subscribe(
        (data: any) => {
          this.onCatchConfirmation.emit();
          this.initialize(false);
        },
        (error: any) => {
            console.error('Error failing catch', error);
        }
      );
    }
    else{ 
      this.encounterService.failedCatch(this.userId).subscribe(
        (data: any) => {
          this.initialize(false);
        },
        (error: any) => {
            console.error('Error failing catch', error);
        }
      );    
    }
    this.showConfirmationPopup = false;  
  }

  attemptCatch(): boolean {
    if (this.creature.level > this.encounter.creatureLevel) {
      return Math.random() < 0.75;  // True with 75% probability
    } else if (this.creature.level == this.encounter.creatureLevel) {
        return Math.random() < 0.40;  // True with 40% probability
    } else {
        return Math.random() < 0.05;  // True with 5% probability
    }
  }
  
  handleDeny() {
    this.showConfirmationPopup = false;
  }

  fight(){
    this.encounterService.fight(this.userId).subscribe(
      (data: any) => {
        if (data.length > 0) { 
          this.winFlash.onWinEvent(); 
          this.winService.announceGymListReload();  
          this.initialize(false);                       
        } else {
          this.loseFlash.onLoseEvent(); 
          this.initialize(false);
        }
        this.onCatchConfirmation.emit();
      },
      (error: any) => {
        console.error('Error generating encounter:', error);
      }
    );
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

}
