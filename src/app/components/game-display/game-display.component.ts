import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { WinService } from 'src/app/services/win.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game-display',
  templateUrl: './game-display.component.html',
  styleUrls: ['./game-display.component.css']
})
export class GameDisplayComponent implements OnChanges {
  hasWon: boolean = false;

  constructor(private winService: WinService, private cookieService: CookieService, private http: HttpClient) { 
    this.winService.winAnnounced$.subscribe(cookieName => {
      this.checkWin(cookieName);
    });
  }

  @Input() game: any;
  @Input() currentGameName: any;
  currentGameDisplayName: any;

  ngOnChanges(): void {  
    window.scrollTo(0, 0);
    this.http.get<any[]>('https://minigoats.github.io/Minigame-hub/assets/games.json').subscribe((data: any[]) => {
      const matchedGame = data.find((game: { name: any; }) => game.name === this.currentGameName);
      if (matchedGame) {
        this.currentGameDisplayName = matchedGame.displayName;
    }
    });
    if (this.cookieService.get(this.currentGameName + 'Won')) {
      this.checkWin(this.currentGameName + 'Won');
    }
    else{
      this.hasWon = false;
    }
  }

  checkWin(cookieName: string): void {
    this.hasWon = true;
    this.cookieService.set(cookieName, 'true', 60); 
    this.winService.announceGameListReload();
  }

  redoGame(): void {
    this.cookieService.delete(this.currentGameName + 'Won');
    this.winService.announceGameListReload();
    this.hasWon = false;
}

}
