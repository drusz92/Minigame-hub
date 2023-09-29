import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Monster } from 'src/app/models/monster.model';

@Component({
  selector: 'app-image-popup',
  templateUrl: './image-popup.component.html',
  styleUrls: ['./image-popup.component.css']
})
export class ImagePopupComponent implements OnInit{
  images: string[] = [];
  @Input() monsters: Monster[] = [];
  @Input() isFreeze: boolean = true;
  @Output() closePopup = new EventEmitter<void>();
  @Output() unFreezeEvent = new EventEmitter<string>();
  @Output() combineEvent = new EventEmitter<string>();

  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.images = [];
    this.monsters.forEach(monster => {
      if (monster.isActive == false){
        this.images.push(monster.url)
      }   
    });
  }

  unFreeze(img: string){
    this.unFreezeEvent.emit(img);
  }

  combine(img: string){
    this.combineEvent.emit(img);
  }
}