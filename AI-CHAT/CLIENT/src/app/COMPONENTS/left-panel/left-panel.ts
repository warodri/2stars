import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatQueues } from '../../SERVICES/chat-queues';
import { ChatChannel, ChatState } from '../../SERVICES/chat-state';

@Component({
    selector: 'app-left-panel',
    standalone: false,
    templateUrl: './left-panel.html',
    styleUrl: './left-panel.scss',
})
export class LeftPanel {
    readonly channels$: Observable<ChatChannel[]>;
    readonly activeChannelId$: Observable<string | null>;

    constructor(
        private readonly chatState: ChatState,
        private readonly chatQueues: ChatQueues,
    ) {
        this.channels$ = this.chatState.channels$;
        this.activeChannelId$ = this.chatState.activeChannelId$;
    }

    selectChannel(channelId: string): void {
        this.chatQueues.enqueueLeftPanel({
            id: `select-channel-${Date.now()}`,
            type: 'select-channel',
            payload: {
                channelId,
            },
        });
    }

    channelAvatar(channel: ChatChannel): string {
        return channel.name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? '')
            .join('');
    }

    channelTime(channel: ChatChannel): string {
        return channel.updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}
