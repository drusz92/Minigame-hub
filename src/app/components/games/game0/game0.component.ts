import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { WinService } from 'src/app/services/win.service';

@Component({
  selector: 'app-game0',
  templateUrl: './game0.component.html',
  styleUrls: ['./game0.component.css']
})
export class Game0Component implements OnInit {
  name: string = "game0";
  todaysFortune: string = "";
  fortunes: {id: string, fortune: string}[] = [];
  hasCookie: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService, private winService: WinService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(): void{
    this.http.get<any[]>('https://minigoats.github.io/Minigame-hub/assets/fortunes.json').subscribe((data: any[]) => {
      this.fortunes = data;
      });
    this.todaysFortune = this.cookieService.get('hasFortune');
    this.hasCookie = this.todaysFortune != "";
  }

  getDailyFortune() {
    const randomIndex = Math.floor(Math.random() * this.fortunes.length);
    this.todaysFortune = this.fortunes[randomIndex].fortune;
    this.cookieService.set('hasFortune', this.todaysFortune, 1); 
    this.initialize();
    }
}
