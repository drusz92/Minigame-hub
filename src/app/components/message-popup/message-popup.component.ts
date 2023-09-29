import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-message-popup',
    templateUrl: './message-popup.component.html',
    styleUrls: ['./message-popup.component.css']
})
export class MessagePopupComponent {
    @Input() message: string = '';
    @Input() isVisible: boolean = false;
    @Output() closePopup = new EventEmitter<void>();

    close() {
        this.isVisible = false;
        this.closePopup.emit();
    }
}