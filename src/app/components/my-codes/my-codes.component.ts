import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MonsterCode } from 'src/app/models/monsterCode.model';
import { MonsterService } from 'src/app/services/monster.service';

@Component({
  selector: 'app-my-codes',
  templateUrl: './my-codes.component.html',
  styleUrls: ['./my-codes.component.css']
})
export class MyCodesComponent implements OnInit {
  userId: string = '';
  codes: MonsterCode[] = [];

  constructor(private monsterService: MonsterService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.initialize();
  }

  initialize(){
    this.userId = this.cookieService.get('userId');   
    this.monsterService.getCodes(this.userId).subscribe(
      (data: any) => {
        this.codes = data;
      },
      (error: any) => {
        console.error('Error fetching codes:', error);
      }
    ); 
  }

}
