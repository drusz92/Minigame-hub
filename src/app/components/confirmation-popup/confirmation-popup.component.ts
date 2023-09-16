import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-popup',
  templateUrl: './confirmation-popup.component.html',
  styleUrls: ['./confirmation-popup.component.css']
})
export class ConfirmationPopupComponent {
  @Output() onConfirm: EventEmitter<void> = new EventEmitter();
  @Output() onDeny: EventEmitter<void> = new EventEmitter();
  @Input() message: string = ''; 

  confirm() {
    this.onConfirm.emit();
  }

  deny() {
    this.onDeny.emit();
  }
}