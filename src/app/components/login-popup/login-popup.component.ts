import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.css']
})
export class LoginPopupComponent {
  userInput: string = '';
  
  @Output() onClose = new EventEmitter<string>();

  closePopup() {
    if (this.userInput.length >= 1) {
      this.onClose.emit(this.userInput);
    }
  }
}