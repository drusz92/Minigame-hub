import { Component, OnInit } from '@angular/core';
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
    this.leaderboardService.getLeaderboard().subscribe(result=>{
      this.leaderboard = result;
      this.setupImages();
    });
  }

  setupImages(): void {
    this.leaderboard.forEach(leaderboardEntry => {
      if (leaderboardEntry.creatureName){
        leaderboardEntry.creatureImagePath = `assets/${leaderboardEntry.creatureName.toLowerCase()}.png`;
      }
      else{
        leaderboardEntry.level = 0;
      }
    });
}

}
