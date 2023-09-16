import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lose-flash',
  templateUrl: './lose-flash.component.html',
  styleUrls: ['./lose-flash.component.css']
})
export class LoseFlashComponent implements OnInit {
  displayLose: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onLoseEvent() {
    this.displayLose = true;
    setTimeout(() => {
      this.displayLose = false;
    }, 1000); // Hide after 1 second
  }
}