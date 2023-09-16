import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Gym } from '../models/gym.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class WinService {

    constructor(private http: HttpClient){

    }

    private winAnnouncedSource = new Subject<string>();
    winAnnounced$ = this.winAnnouncedSource.asObservable();
  
    private reloadGymListSource = new Subject<void>();
    reloadGymList$ = this.reloadGymListSource.asObservable();
  
    announceWin(gym: Gym) {
    this.http.post(`${environment.apiUrl}/Gym/CompleteGym`, gym).subscribe(
        response => {
          return response;
        },
        error => {
          console.error('Error fetching data:', error);
        }
      );
    }
  
    announceGymListReload() {
      this.reloadGymListSource.next();
    }
  }