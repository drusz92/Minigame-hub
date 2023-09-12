import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class WinService {
    private winAnnouncedSource = new Subject<string>();
    winAnnounced$ = this.winAnnouncedSource.asObservable();
  
    private reloadGameListSource = new Subject<void>();
    reloadGameList$ = this.reloadGameListSource.asObservable();
  
    announceWin(cookieName: string) {
      this.winAnnouncedSource.next(cookieName);
    }
  
    announceGameListReload() {
      this.reloadGameListSource.next();
    }
  }