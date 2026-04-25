import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatQueues, LeftPanelTask } from './chat-queues';
import { ChatState } from './chat-state';

@Injectable({
    providedIn: 'root',
})
export class QueueListenerLeftPanel {
    private readonly subscription: Subscription;
    private processing = false;

    constructor(
        private readonly chatQueues: ChatQueues,
        private readonly chatState: ChatState,
    ) {
        this.subscription = this.chatQueues.leftPanelQueue$.subscribe((queue) => {
            void this.processQueue(queue);
        });
    }

    private async processQueue(queue: LeftPanelTask[]): Promise<void> {
        if (this.processing || !queue.length) {
            return;
        }

        this.processing = true;
        const task = queue[0];

        try {
            await this.handleTask(task);
        } finally {
            this.chatQueues.dequeueLeftPanel(task.id);
            this.processing = false;
        }
    }

    private async handleTask(task: LeftPanelTask): Promise<void> {
        if (task.type === 'create-channel') {
            const channelId = this.slugify(`${task.payload.channelName}-${Date.now()}`);
            const members = Array.from(new Set([this.chatState.getCurrentUser(), ...task.payload.members]));

            this.chatState.addChannel({
                id: channelId,
                name: task.payload.channelName,
                members,
                lastMessage: 'Channel created',
                updatedAt: new Date(),
            });
            this.chatState.setActiveChannel(channelId);
            return;
        }

        if (task.type === 'select-channel') {
            this.chatState.setActiveChannel(task.payload.channelId);
        }
    }

    private slugify(value: string): string {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
}
