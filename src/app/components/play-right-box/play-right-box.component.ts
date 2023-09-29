import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Monster } from 'src/app/models/monster.model';
import { MonsterService } from 'src/app/services/monster.service';
import { WinFlashComponent } from '../win-flash/win-flash.component';
import { LoseFlashComponent } from '../lose-flash/lose-flash.component';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-play-right-box',
  templateUrl: './play-right-box.component.html',
  styleUrls: ['./play-right-box.component.css'],
  animations: [
    trigger('moveDot', [
        state('up', style({
            top: '0%'
        })),
        state('down', style({
            top: '98%' 
        })),
        transition('* <=> *', animate('{{speed}}ms linear'))
    ])
]
})
export class PlayRightBoxComponent implements OnInit {
  userId: string = "";
  monster: Monster = new Monster();
  canTrain: boolean = false;
  canRest: boolean = false;
  locations: boolean = true;
  strength: boolean = false;
  defense: boolean = false;
  speed: boolean = false;
  accuracy: boolean = false;
  health: boolean = false;
  showOverlay: boolean = false;
  dotPosition = 0;
  moveDirection: 'up' | 'down' = 'down';
  strengthInterval: any;
  targetHeight: number = 40;
  targetStart = 50 - (this.targetHeight / 2);  // 50% is the middle, so we subtract half the height to get the start
  targetEnd = 50 + (this.targetHeight / 2);    // Similarly, add half the height to get the end
  dotSpeed: number = 2000; 
  animationStartTime = Date.now();
  oldMessage: string = '';
  retireMessage: string = '';
  showOld: boolean = false;
  showRetire: boolean = false;

  @Output() onCatchConfirmation = new EventEmitter<void>();
  @ViewChild('winFlash') winFlash!: WinFlashComponent;
  @ViewChild('loseFlash') loseFlash!: LoseFlashComponent;
  
  constructor(private monsterService: MonsterService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.userId = this.cookieService.get('userId');
    this.locations = true;
    this.strength = false;
    this.defense = false;
    this.speed = false;
    this.accuracy = false;
    this.health = false;
    this.monsterService.getMonster(this.userId).subscribe(
      (data: any) => {
        this.monster = data.find((item: { isActive: boolean; }) => item.isActive === true);
        if (!this.monster) { 
          this.setEmptyCreature();
          this.canRest = false;
          this.canTrain = false;
        } else {     
          this.canTrain = true;
          this.canRest = this.monster.stamina < 5;
          if (this.monster.years == 3 && this.monster.months == 0 && this.monster.weeks == 0){
            this.showOldPopup();
          }
          if (this.monster.years >= 3 && this.monster.months >= 5){
            if (Math.random() < 0.25) {
              this.showRetirePopup();
              this.retirePokemon();
            } 
          }
        }
      },
      (error: any) => {
        console.error('Error fetching creature:', error);
        this.setEmptyCreature();
      }
    ); 
  }

  toggleDirection() {
    if (this.moveDirection === 'down') {
      this.dotPosition = 98;  // 98% from the top
      this.moveDirection = 'up';
  } else {
      this.dotPosition = 0;   // Reset to top
      this.moveDirection = 'down';
  }
}

get animationParams() {
  return { speed: this.dotSpeed };
}

checkPosition() {
  const elapsedTime = Date.now() - this.animationStartTime;
  const totalDuration = this.dotSpeed; // The total duration of one cycle of the animation.

  // Determine how far along the animation is as a percentage of the total duration.
  const animationProgress = (elapsedTime % totalDuration) / totalDuration;

  if (this.moveDirection === 'down') {
      this.dotPosition = animationProgress * 98; // 98% is the max value.
  } else {
      this.dotPosition = 98 - (animationProgress * 98);
  }

  if (this.dotPosition > this.targetStart && this.dotPosition < this.targetEnd) {
      this.winFlash.onWinEvent();
      this.successfulTraining();
  } else {
      this.loseFlash.onLoseEvent();
      this.unsuccessfulTraining();
  }
}

  setEmptyCreature() {
    this.monster = new Monster();
  }

  rest(){
    if (this.canRest){    
      this.monsterService.rest(this.userId, this.monster.id).subscribe(
        (data: any) => {
          this.showOverlay = true;
                setTimeout(() => {            
                    this.onCatchConfirmation.emit();
                    this.initialize();
                    this.showOverlay = false;
                }, 1000); 
        },
        (error: any) => {
          console.error('Error resting:', error);
          this.initialize();
        }
      );     
    }
  }

  trainStrength(){
    if (this.canTrain){    
      var speed = this.monster.stamina == 0 ? 0.5 : this.monster.stamina;
      this.setDotSpeed(400 * speed);  
      this.targetStart = 40;
      this.targetEnd = 56.66;
      this.animationStartTime = Date.now();
      this.strength = true;  
      this.locations = false;
      if (this.strengthInterval) {
        clearInterval(this.strengthInterval);
      }
      this.strengthInterval = setInterval(() => {
        this.toggleDirection();
      }, this.dotSpeed);
    }
}

  trainDefense(){
    if (this.canTrain){
      var speed = this.monster.stamina == 0 ? 0.5 : this.monster.stamina;
      this.setDotSpeed(400 * speed);  
      this.targetStart = 40;
      this.targetEnd = 56.66;
      this.animationStartTime = Date.now();
      this.defense = true;
      this.locations = false;
      if (this.strengthInterval) {
        clearInterval(this.strengthInterval);
      }
      this.strengthInterval = setInterval(() => {
        this.toggleDirection();
      }, this.dotSpeed);
    }
  }

  trainSpeed(){
    if (this.canTrain){
      var speed = this.monster.stamina == 0 ? 0.5 : this.monster.stamina;
      this.setDotSpeed(400 * speed);  
      this.targetStart = 40;
      this.targetEnd = 56.66;
      this.animationStartTime = Date.now();
      this.speed = true;
      this.locations = false;
      if (this.strengthInterval) {
        clearInterval(this.strengthInterval);
      }
      this.strengthInterval = setInterval(() => {
        this.toggleDirection();
      }, this.dotSpeed);
    }
  }

  trainAccuracy(){
    if (this.canTrain){
      var speed = this.monster.stamina == 0 ? 0.5 : this.monster.stamina;
      this.setDotSpeed(400 * speed);  
      this.targetStart = 40;
      this.targetEnd = 56.66;
      this.animationStartTime = Date.now();
      this.accuracy = true;
      this.locations = false;
      if (this.strengthInterval) {
        clearInterval(this.strengthInterval);
      }
      this.strengthInterval = setInterval(() => {
        this.toggleDirection();
      }, this.dotSpeed);
    }
  }

  trainHealth(){
    if (this.canTrain){
      var speed = this.monster.stamina == 0 ? 0.5 : this.monster.stamina;
      this.setDotSpeed(400 * speed);  
      this.targetStart = 40;
      this.targetEnd = 56.66;
      this.animationStartTime = Date.now();
      this.health = true;
      this.locations = false;
      if (this.strengthInterval) {
        clearInterval(this.strengthInterval);
      }
      this.strengthInterval = setInterval(() => {
        this.toggleDirection();
      }, this.dotSpeed);
    }
  }

  successfulTraining() {
    let trainingType: 'strength' | 'defense' | 'speed' | 'accuracy' | 'health' | undefined = undefined;
    if (this.strength) {
        trainingType = 'strength';
    } else if (this.defense) {
        trainingType = 'defense';
    } else if (this.speed) {
      trainingType = 'speed';
    } else if (this.accuracy) {
      trainingType = 'accuracy';
    } else if (this.health) {
      trainingType = 'health';
    } 
    if (trainingType) {
        this.trainMonster(trainingType);
    } else {
        console.error('Unknown training type encountered.');
    }
}

trainMonster(type: 'strength' | 'defense' | 'speed' | 'accuracy' | 'health') {
    let trainingObservable;
    switch (type) {
        case 'strength':
            trainingObservable = this.monsterService.trainStrength(this.userId, this.monster.id);
            break;
        case 'defense':
            trainingObservable = this.monsterService.trainDefense(this.userId, this.monster.id);
            break;
        case 'speed':
           trainingObservable = this.monsterService.trainSpeed(this.userId, this.monster.id);
            break;
        case 'accuracy':
           trainingObservable = this.monsterService.trainAccuracy(this.userId, this.monster.id);
           break;
        case 'health':
           trainingObservable = this.monsterService.trainHealth(this.userId, this.monster.id);
           break;
        default:
            console.error('Invalid training type:', type);
            return;
    }
    trainingObservable.subscribe(
        (data: any) => {
            this.initialize();
            this.onCatchConfirmation.emit();
        },
        (error: any) => {
            console.error(`Error training ${type}:`, error);
            this.initialize();
        }
    );
}

  unsuccessfulTraining(){
    this.monsterService.failTraining(this.userId, this.monster.id).subscribe(
      (data: any) => {
        this.initialize();
        this.onCatchConfirmation.emit();
    },
    (error: any) => {
        console.error(`Error training fail:`, error);
        this.initialize();
    }
    );
  }

  setDotSpeed(newSpeed: number) {
    clearInterval(this.strengthInterval);
    this.dotSpeed = newSpeed;

    this.strengthInterval = setInterval(() => {
        this.toggleDirection();
    }, this.dotSpeed);
}

  showOldPopup(){
    this.oldMessage = this.monster.creatureName + ' is getting older. They are now 3 years old today! You might want to think about '
      + 'retiring them to the PC before you lose them.';
    this.showOld = true;
  }

  showRetirePopup(){
    this.retireMessage = 'Unfortunately ' + this.monster.creatureName + ' passed away today. They will be dearly missed but you may continue with a new Pokemon.';
    this.showRetire = true;
  }

  retirePokemon(){
    this.monsterService.retire(this.userId, this.monster.id).subscribe(
      (data: any) => {
        this.initialize();
        this.onCatchConfirmation.emit();
    },
    (error: any) => {
        console.error(`Error training fail:`, error);
        this.initialize();
    }
    );
  }

handleClosePopup() {
    this.showOld = false;
    this.showRetire = false;
}

  ngOnDestroy() {
    if (this.strengthInterval) {
        clearInterval(this.strengthInterval);
    }
  } 

}
