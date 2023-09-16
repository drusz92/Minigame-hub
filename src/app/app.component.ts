import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showLoginPopup: boolean = false;
  userName: string = '';
  constructor(private cookieService: CookieService, private userService: UserService) { 
  }

  ngOnInit() {
    this.initialize();
  }

  initialize(){
    this.userName = this.cookieService.get('userId');
    this.showLoginPopup = this.userName == ''; 
    if (!this.showLoginPopup){
      this.cookieService.set('userId', this.userName, 365);
    }
  }

  handleClose(name: any) {
    let userId = this.generateRandomString(25);
    this.cookieService.set('userId', userId, 365); 
    this.cookieService.set('userName', name, 365); 
    this.userService.saveUser(userId, name);
    this.showLoginPopup = false; 
    this.userService.setUserId(userId);
  }

  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}


