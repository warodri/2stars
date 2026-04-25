import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

export interface ChatChannel {
    id: string;
    name: string;
    members: string[];
    lastMessage: string;
    updatedAt: Date;
}

export interface ChatMessage {
    id: string;
    channelId: string;
    author: string;
    text: string;
    createdAt: Date;
    direction: 'incoming' | 'outgoing';
}

export interface RightPanelInfo {
    title: string;
    participants: string[];
    status: string;
    note: string;
}

@Injectable({
    providedIn: 'root',
})
export class ChatState {
    private readonly currentUser = 'Walter';

    private readonly channelsSubject = new BehaviorSubject<ChatChannel[]>([]);
    readonly channels$ = this.channelsSubject.asObservable();

    private readonly activeChannelIdSubject = new BehaviorSubject<string | null>(null);
    readonly activeChannelId$ = this.activeChannelIdSubject.asObservable();

    private readonly messagesSubject = new BehaviorSubject<Record<string, ChatMessage[]>>({});
    readonly messages$ = this.messagesSubject.asObservable();

    private readonly rightPanelSubject = new BehaviorSubject<RightPanelInfo | null>(null);
    readonly rightPanel$ = this.rightPanelSubject.asObservable();

    readonly activeMessages$ = combineLatest([this.messages$, this.activeChannelId$]).pipe(
        map(([messagesByChannel, activeChannelId]) => {
            if (!activeChannelId) {
                return [];
            }

            return messagesByChannel[activeChannelId] ?? [];
        }),
    );

    readonly activeChannel$ = combineLatest([this.channels$, this.activeChannelId$]).pipe(
        map(([channels, activeChannelId]) => channels.find((channel) => channel.id === activeChannelId) ?? null),
    );

    getCurrentUser(): string {
        return this.currentUser;
    }

    getChannelsSnapshot(): ChatChannel[] {
        return this.channelsSubject.value;
    }

    getActiveChannelSnapshot(): ChatChannel | null {
        const activeId = this.activeChannelIdSubject.value;
        return this.channelsSubject.value.find((channel) => channel.id === activeId) ?? null;
    }

    addChannel(channel: ChatChannel): void {
        const nextChannels = [channel, ...this.channelsSubject.value.filter((item) => item.id !== channel.id)];
        this.channelsSubject.next(nextChannels);
    }

    setActiveChannel(channelId: string): void {
        this.activeChannelIdSubject.next(channelId);
        this.refreshRightPanel();
    }

    addMessage(message: ChatMessage): void {
        const nextMessages = {
            ...this.messagesSubject.value,
            [message.channelId]: [...(this.messagesSubject.value[message.channelId] ?? []), message],
        };

        this.messagesSubject.next(nextMessages);
        this.bumpChannelPreview(message.channelId, message.text);
    }

    deleteMessage(channelId: string, messageId: string): void {
        const existing = this.messagesSubject.value[channelId] ?? [];
        const nextMessages = {
            ...this.messagesSubject.value,
            [channelId]: existing.filter((message) => message.id !== messageId),
        };

        this.messagesSubject.next(nextMessages);
    }

    isCurrentUserMember(channelId: string): boolean {
        const channel = this.channelsSubject.value.find((item) => item.id === channelId);
        return channel ? channel.members.includes(this.currentUser) : false;
    }

    private bumpChannelPreview(channelId: string, lastMessage: string): void {
        const updatedChannels = this.channelsSubject.value.map((channel) =>
            channel.id === channelId
                ? {
                    ...channel,
                    lastMessage,
                    updatedAt: new Date(),
                }
                : channel,
        );

        updatedChannels.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        this.channelsSubject.next(updatedChannels);
        this.refreshRightPanel();
    }

    private refreshRightPanel(): void {
        const activeChannel = this.getActiveChannelSnapshot();

        if (!activeChannel) {
            this.rightPanelSubject.next(null);
            return;
        }

        this.rightPanelSubject.next({
            title: activeChannel.name,
            participants: activeChannel.members,
            status: 'Connected',
            note: activeChannel.lastMessage || 'No messages yet.',
        });
    }
}
