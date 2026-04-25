import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatQueues, MessagesPanelTask } from './chat-queues';
import { ChatState } from './chat-state';

@Injectable({
    providedIn: 'root',
})
export class QueueListenerMessagesPanel {
    private readonly subscription: Subscription;
    private processing = false;

    constructor(
        private readonly chatQueues: ChatQueues,
        private readonly chatState: ChatState,
    ) {
        this.subscription = this.chatQueues.messagesPanelQueue$.subscribe((queue) => {
            void this.processQueue(queue);
        });
    }

    private async processQueue(queue: MessagesPanelTask[]): Promise<void> {
        if (this.processing || !queue.length) {
            return;
        }

        this.processing = true;
        const task = queue[0];

        try {
            await this.handleTask(task);
        } finally {
            this.chatQueues.dequeueMessagesPanel(task.id);
            this.processing = false;
        }
    }

    private async handleTask(task: MessagesPanelTask): Promise<void> {
        if (task.type === 'add-message') {
            this.chatState.addMessage({
                id: `${task.payload.channelId}-${Date.now()}`,
                channelId: task.payload.channelId,
                author: task.payload.author,
                text: task.payload.text,
                createdAt: new Date(),
                direction: task.payload.direction,
            });
            return;
        }

        if (task.type === 'delete-message') {
            this.chatState.deleteMessage(task.payload.channelId, task.payload.messageId);
        }
    }
}
