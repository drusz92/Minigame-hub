import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { WinService } from 'src/app/services/win.service';
import { Subscription, map, switchMap, tap } from 'rxjs';
import { GymService } from 'src/app/services/gym.service';
import { CreatureService } from 'src/app/services/creature.service';
import { Creature } from 'src/app/models/creature.model';
import { Gym } from 'src/app/models/gym.model';

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

  initialize() {
    this.userId = this.cookieService.get('userId');
  
    // Guard clause: If there's no userId, exit early.
    if (!this.userId) {
      this.creature = new Creature();
      return;
    }
  
    this.creatureService.getCreature(this.userId)
      .pipe(
        tap((data: any) => {
          this.creature = data.length ? data[0] : new Creature();
        }),
        switchMap(async () => this.loadGyms()) // Chain this call, it's assumed `loadGyms` returns an observable.
      )
      .subscribe(
        () => {}, // You can handle successful completion of both observables here if needed.
        (error: any) => {
          console.error('Error in the initialization sequence:', error);
        }
      );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadGyms() {
    this.gymService.getGyms(this.userId)
      .pipe(
        map((gyms: Gym[]) => gyms.map(gym => ({
          ...gym,
          imagePath: `assets/${gym.name.toLowerCase()}.png`,
          minLevel: this.setMinLevel(gym.name.toLowerCase())
        })))
      )
      .subscribe(
        (processedGyms: Gym[]) => {
          this.gyms = processedGyms;
        },
        (error: any) => {
          console.error('Error fetching gyms:', error);
        }
      );
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