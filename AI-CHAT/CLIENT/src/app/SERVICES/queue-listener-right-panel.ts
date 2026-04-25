import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatQueues, RightPanelTask } from './chat-queues';

@Injectable({
    providedIn: 'root',
})
export class QueueListenerRightPanel {
    private readonly subscription: Subscription;
    private processing = false;

    constructor(private readonly chatQueues: ChatQueues) {
        this.subscription = this.chatQueues.rightPanelQueue$.subscribe((queue) => {
            void this.processQueue(queue);
        });
    }

    private async processQueue(queue: RightPanelTask[]): Promise<void> {
        if (this.processing || !queue.length) {
            return;
        }

        this.processing = true;
        const task = queue[0];

        try {
            await Promise.resolve(task);
        } finally {
            this.chatQueues.dequeueRightPanel(task.id);
            this.processing = false;
        }
    }
}
