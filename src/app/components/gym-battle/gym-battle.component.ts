import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-gym-battle',
  templateUrl: './gym-battle.component.html',
  styleUrls: ['./gym-battle.component.css'],
  animations: [
    trigger('moveLeftImage', [
      state('moveLeft', style({
        transform: 'translateX(-70%)'
      })),
      state('moveRight', style({
        transform: 'translateX(70%)' // Return to the original position
      })),
      transition('moveLeft <=> moveRight', [
        animate('.5s')
      ])
    ]),
    trigger('moveRightImage', [
      state('moveRight', style({
        transform: 'translateX(70%)'
      })),
      state('moveLeft', style({
        transform: 'translateX(-70%)' // Return to the original position
      })),
      transition('moveRight <=> moveLeft', [
        animate('.5s')
      ])
    ])
  ]
})
export class GymBattleComponent implements OnInit {
  leftImageState: 'moveLeft' | 'moveRight' = 'moveLeft';
  rightImageState: 'moveRight' | 'moveLeft' = 'moveRight';
  bounceCount: number = 0;

  @Input() myMonster: string = '';
  @Input() bossMonster: string = '';

  ngOnInit(): void {
    this.bounceImages();
  }

  bounceImages() {
    setInterval(() => {
      this.leftImageState = this.leftImageState === 'moveLeft' ? 'moveRight' : 'moveLeft';
      this.rightImageState = this.rightImageState === 'moveRight' ? 'moveLeft' : 'moveRight';
    }, 500); 
  }
}