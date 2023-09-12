import { Component, OnInit } from '@angular/core';
import { WinService } from 'src/app/services/win.service';

@Component({
  selector: 'app-game1',
  templateUrl: './game1.component.html',
  styleUrls: ['./game1.component.css']
})
export class Game1Component implements OnInit {

  name: string = "game1";
  boxes: {color: string}[] = [];

  constructor(private winService: WinService) { }

  ngOnInit(): void {
    // Create the initial boxes. This ensures each box is a distinct object.
    for (let i = 0; i < 160; i++) {
      this.boxes.push({color: 'red'});
    }

    this.randomizeGreenBox();
    setInterval(this.randomizeGreenBox.bind(this), 1000); // Randomize green box every 100ms.
  }

  randomizeGreenBox(): void {
    // First, set all boxes to red
    this.boxes.forEach(box => box.color = 'red');
    
    // Then, randomly pick one box to be green
    const randomIndex = Math.floor(Math.random() * this.boxes.length);
    this.boxes[randomIndex].color = 'darkgreen';
  }

  win(): void {
    this.winService.announceWin(this.name + 'Won'); 
  }

}