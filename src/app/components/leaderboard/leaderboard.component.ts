import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { Leaderboard } from 'src/app/models/leaderboard.model';
import { LeaderboardService } from 'src/app/services/leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: Leaderboard[] = [];
  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize() {
    this.leaderboardService.getLeaderboard().pipe(
      map((result: any[]) => {
        return result.map(entry => ({
          ...entry,
          creatureImagePath: entry.creatureName ? this.getCreatureImage(entry) : undefined,
          level: entry.creatureName ? entry.level : 0
        }));
      })
    ).subscribe(leaderboard => {
      this.leaderboard = leaderboard;
    });
  }

  getCreatureImage(entry: any){
    return `assets/${entry.creatureName.toLowerCase()}.png`;
  }

}
