import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatQueues, UserInputTask } from './chat-queues';
import { ChatState } from './chat-state';

@Injectable({
    providedIn: 'root',
})
export class QueueListenerUserInputPanel {
    private readonly subscription: Subscription;
    private processing = false;

    constructor(
        private readonly chatQueues: ChatQueues,
        private readonly chatState: ChatState,
    ) {
        this.subscription = this.chatQueues.userInputQueue$.subscribe((queue) => {
            void this.processQueue(queue);
        });
    }

    private async processQueue(queue: UserInputTask[]): Promise<void> {
        if (this.processing || !queue.length) {
            return;
        }

        this.processing = true;
        const task = queue[0];

        try {
            await this.handleTask(task);
        } finally {
            this.chatQueues.dequeueUserInput(task.id);
            this.processing = false;
        }
    }

    private async handleTask(task: UserInputTask): Promise<void> {
        if (task.type !== 'send-message') {
            return;
        }

        const activeChannel = this.chatState.getActiveChannelSnapshot();
        const internetOkay = typeof navigator === 'undefined' ? true : navigator.onLine;

        if (!activeChannel || !internetOkay || !this.chatState.isCurrentUserMember(activeChannel.id)) {
            return;
        }

        this.chatQueues.enqueueMessagesPanel({
            id: `message-${Date.now()}`,
            type: 'add-message',
            payload: {
                channelId: activeChannel.id,
                author: this.chatState.getCurrentUser(),
                text: task.payload.text,
                direction: 'outgoing',
            },
        });
    }
}
