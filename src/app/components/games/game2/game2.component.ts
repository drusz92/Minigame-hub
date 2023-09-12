import { Component, OnInit } from '@angular/core';
import { WinService } from 'src/app/services/win.service';

@Component({
  selector: 'app-game2',
  templateUrl: './game2.component.html',
  styleUrls: ['./game2.component.css']
})
export class Game2Component implements OnInit {

  typedText: string = '';
  name: string = "game2";

  constructor(private winService: WinService) { }

  ngOnInit(): void {
  }

  testWin(): void {
    if (this.typedText.toLowerCase() === 'hello') {
      this.win();
    }
  }

  win(): void {
    this.winService.announceWin(this.name + 'Won');
  }

}