import { Component } from '@angular/core';

@Component({
  selector: 'app-minigame-box',
  templateUrl: './minigame-box.component.html',
  styleUrls: ['./minigame-box.component.css']
})
export class MinigameBoxComponent {
  gameLoaded = false;

  loadMinigame() {
    this.gameLoaded = true;
  }
}