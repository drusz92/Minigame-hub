import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-win-flash',
  templateUrl: './win-flash.component.html',
  styleUrls: ['./win-flash.component.css']
})
export class WinFlashComponent implements OnInit {
  displayWin: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onWinEvent() {
    this.displayWin = true;
    setTimeout(() => {
      this.displayWin = false;
    }, 1000); // Hide after 1 second
  }
}