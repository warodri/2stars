import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatMessage, ChatState } from '../../SERVICES/chat-state';

@Component({
    selector: 'app-messages-panel',
    standalone: false,
    templateUrl: './messages-panel.html',
    styleUrl: './messages-panel.scss',
})
export class MessagesPanel {
    readonly messages$: Observable<ChatMessage[]>;

    constructor(private readonly chatState: ChatState) {
        this.messages$ = this.chatState.activeMessages$;
    }

    formatTime(createdAt: Date): string {
        return new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

}
