import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { EMPTY, catchError, map } from 'rxjs';
import { CreatureService } from 'src/app/services/creature.service';

@Component({
  selector: 'app-my-pokemon-list',
  templateUrl: './my-pokemon-list.component.html',
  styleUrls: ['./my-pokemon-list.component.css']
})
export class MyPokemonListComponent implements OnInit {
  list: any = [];
  userId: string = '';

  constructor(private creatureService: CreatureService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.userId = this.cookieService.get('userId');
    if (this.userId == ""){
      this.list = [];
    }
    else {
      this.getMyList();
    }  
  }

  getMyList() {
    this.creatureService.getMyPokemon(this.userId).pipe(
      map((data: any) => {
        return data.map((item: any) => ({
          ...item,
          creatureImagePath: `assets/${item.name.toLowerCase()}.png`
        }));
      }),
      catchError((error: any) => {
        console.error('Error getting my pokemon list:', error);
        return EMPTY;
      })
    ).subscribe((list: any[]) => {
      this.list = list;
    });
  }

}
