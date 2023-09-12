import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { WinService } from 'src/app/services/win.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit, OnDestroy {
  games: any[] = [];
  private subscriptions: Subscription[] = [];
  private isInitialLoad = true; 

  constructor(private http: HttpClient, private cookieService: CookieService, private winService: WinService) {}

  @Output() gameSelected = new EventEmitter<any>();
  
  ngOnInit() {
    this.loadGames();
    const sub = this.winService.reloadGameList$.subscribe(() => {
      this.loadGames();
    });
    this.subscriptions.push(sub);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadGames() {
    this.http.get<any[]>('/assets/games.json').subscribe((data: any[]) => {
      this.games = data;
      this.games.forEach(game => {
        let hasWonCookie = this.cookieService.get(game.name + 'Won');
        game.hasWon = (hasWonCookie === 'true');
      });

      if (this.isInitialLoad && this.games.length > 0) {  // Step 2: Check the flag
        this.gameSelected.emit(this.games[0]);
        this.isInitialLoad = false;  // Set the flag to false after emitting
      }
    });  
  }

  selectGame(game: any) {
    this.winService.announceGameListReload();
    this.gameSelected.emit(game);
  }
}