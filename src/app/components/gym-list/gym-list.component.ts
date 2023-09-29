import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { WinService } from 'src/app/services/win.service';
import { Subscription, map, switchMap, tap } from 'rxjs';
import { GymService } from 'src/app/services/gym.service';
import { MonsterService } from 'src/app/services/monster.service';
import { Monster } from 'src/app/models/monster.model';
import { Gym } from 'src/app/models/gym.model';

@Component({
  selector: 'app-gym-list',
  templateUrl: './gym-list.component.html',
  styleUrls: ['./gym-list.component.css']
})
export class GymListComponent implements OnInit, OnDestroy {
  gyms: any[] = [];
  userId: string = "";
  monster: Monster = new Monster();
  private subscriptions: Subscription[] = [];

  constructor(private cookieService: CookieService, private winService: WinService, private gymService: GymService, private monsterService: MonsterService) {}

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
      this.monster = new Monster();
      return;
    }
  
    this.monsterService.getMonster(this.userId)
      .pipe(
        tap((data: any) => {
          this.monster = data.find((item: { isActive: boolean; }) => item.isActive === true);    
          if (!this.monster) {
            this.monster = new Monster();
          }
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
        map((gyms: Gym[], index: number) => gyms.map((gym, idx) => {
          const gymNum = `gym${idx + 1}` as keyof typeof this.monster;
          return {
            ...gym,
            imagePath: `assets/${gym.name.toLowerCase()}.png`,
            isComplete: this.monster[gymNum]
          };
        }))
      )
      .subscribe(
        (processedGyms: Gym[]) => {
          this.gyms = processedGyms;  
          this.setGymAvailability();  
        },
        (error: any) => {
          console.error('Error fetching gyms:', error);
        }
      );
  }

  selectGym(gym: any) {
    if (gym.isComplete || gym.isAvailable == undefined || gym.isAvailable == false){
      return;
    }
    window.scrollTo(0, 0);

    this.winService.announceGymListReload();
    this.gymSelected.emit(gym);
    this.winService.announceGymListReload();
  }

  setGymAvailability() {
    let previousGymComplete = true;
    for (const gym of this.gyms) {
        if (!gym.isComplete) {
            gym.isAvailable = true;
            return
        } else {
            gym.isAvailable = false;
        }
        if (gym.isComplete !== 1) {
            previousGymComplete = false;
        }
    }
}
}