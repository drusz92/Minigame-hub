import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }
  selectedGame: any;
  currentGameName: any;

  ngOnInit(): void {
  }

  onGymSelected(game: any) {
    this.selectedGame = game;
    this.currentGameName = game.name;
  }

}
