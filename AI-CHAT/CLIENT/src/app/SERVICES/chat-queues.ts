import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type LeftPanelTask =
    | {
        id: string;
        type: 'create-channel';
        payload: {
            channelName: string;
            members: string[];
        };
    }
    | {
        id: string;
        type: 'select-channel';
        payload: {
            channelId: string;
        };
    };

export type MessagesPanelTask =
    | {
        id: string;
        type: 'add-message';
        payload: {
            channelId: string;
            author: string;
            text: string;
            direction: 'incoming' | 'outgoing';
        };
    }
    | {
        id: string;
        type: 'delete-message';
        payload: {
            channelId: string;
            messageId: string;
        };
    };

export type RightPanelTask = {
    id: string;
    type: 'noop';
    payload?: Record<string, never>;
};

export type UserInputTask = {
    id: string;
    type: 'send-message';
    payload: {
        text: string;
    };
};

@Injectable({
    providedIn: 'root',
})
export class ChatQueues {
    private readonly leftPanelQueueSubject = new BehaviorSubject<LeftPanelTask[]>([]);
    readonly leftPanelQueue$ = this.leftPanelQueueSubject.asObservable();

    private readonly messagesPanelQueueSubject = new BehaviorSubject<MessagesPanelTask[]>([]);
    readonly messagesPanelQueue$ = this.messagesPanelQueueSubject.asObservable();

    private readonly rightPanelQueueSubject = new BehaviorSubject<RightPanelTask[]>([]);
    readonly rightPanelQueue$ = this.rightPanelQueueSubject.asObservable();

    private readonly userInputQueueSubject = new BehaviorSubject<UserInputTask[]>([]);
    readonly userInputQueue$ = this.userInputQueueSubject.asObservable();

    enqueueLeftPanel(task: LeftPanelTask): void {
        this.leftPanelQueueSubject.next([...this.leftPanelQueueSubject.value, task]);
    }

    dequeueLeftPanel(taskId: string): void {
        this.leftPanelQueueSubject.next(this.leftPanelQueueSubject.value.filter((task) => task.id !== taskId));
    }

    enqueueMessagesPanel(task: MessagesPanelTask): void {
        this.messagesPanelQueueSubject.next([...this.messagesPanelQueueSubject.value, task]);
    }

    dequeueMessagesPanel(taskId: string): void {
        this.messagesPanelQueueSubject.next(this.messagesPanelQueueSubject.value.filter((task) => task.id !== taskId));
    }

    enqueueRightPanel(task: RightPanelTask): void {
        this.rightPanelQueueSubject.next([...this.rightPanelQueueSubject.value, task]);
    }

    dequeueRightPanel(taskId: string): void {
        this.rightPanelQueueSubject.next(this.rightPanelQueueSubject.value.filter((task) => task.id !== taskId));
    }

    enqueueUserInput(task: UserInputTask): void {
        this.userInputQueueSubject.next([...this.userInputQueueSubject.value, task]);
    }

    dequeueUserInput(taskId: string): void {
        this.userInputQueueSubject.next(this.userInputQueueSubject.value.filter((task) => task.id !== taskId));
    }
}
