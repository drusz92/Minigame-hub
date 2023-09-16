import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { WinService } from 'src/app/services/win.service';
import { Subscription } from 'rxjs';
import { GymService } from 'src/app/services/gym.service';
import { CreatureService } from 'src/app/services/creature.service';
import { Creature } from 'src/app/models/creature.model';

@Component({
  selector: 'app-gym-list',
  templateUrl: './gym-list.component.html',
  styleUrls: ['./gym-list.component.css']
})
export class GymListComponent implements OnInit, OnDestroy {
  gyms: any[] = [];
  userId: string = "";
  creature: Creature = new Creature();
  private subscriptions: Subscription[] = [];

  constructor(private cookieService: CookieService, private winService: WinService, private gymService: GymService, private creatureService: CreatureService) {}

  @Output() gymSelected = new EventEmitter<any>();
  
  ngOnInit() {
    this.initialize();
    const sub = this.winService.reloadGymList$.subscribe(() => {
      this.loadGyms();
    });
    this.subscriptions.push(sub);
  }

  initialize(){
    this.userId = this.cookieService.get('userId');
    this.creatureService.getCreature(this.userId).subscribe(
      (data: any) => {
        if (data.length == 0){
          this.creature = new Creature();
        }
        else{
          this.creature = data[0];
        }
      },
      (error: any) => {
          console.error('Error fetching creature:', error);
      }
    ); 
      if (this.userId != ""){
        this.loadGyms();
      }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadGyms() {
    this.gymService.getGyms(this.userId).subscribe(
      (data: any) => {       
        for (let item of data) {
          item.imagePath = `assets/${item.name.toLowerCase()}.png`;
          item.minLevel = this.setMinLevel(item.name.toLowerCase());
        }
        this.gyms = data;    
      });
  }

  setMinLevel(name: string) {
    switch (name) {
        case 'pewter':
          return 12;
        case 'cerulean':
          return 18;
        case 'vermilion':
          return 21;
        case 'celadon':
          return 24;
        case 'fuchsia':
          return 35;
        case 'saffron':
          return 39;
        case 'cinnabar':
          return 42;
        case 'viridian':
          return 45;
        default:
            return 0;
    }
}

  selectGym(gym: any) {
    if (gym.isComplete || gym.minLevel > this.creature.level){
      return;
    }
    window.scrollTo(0, 0);

    this.winService.announceGymListReload();
    this.gymSelected.emit(gym);
    this.winService.announceGymListReload();
  }

  canHighlight(gym: any, creature: Creature): boolean {
    return gym.minLevel <= creature.level && !gym.isComplete;
}
}