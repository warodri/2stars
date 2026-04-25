import { Component } from '@angular/core';
import { ChatQueues } from '../../SERVICES/chat-queues';

@Component({
  selector: 'app-typing-panel',
  standalone: false,
  templateUrl: './typing-panel.html',
  styleUrl: './typing-panel.scss',
})
export class TypingPanel {
  channelName = '';
  members = '';
  message = '';

  constructor(private readonly chatQueues: ChatQueues) {}

  createChannel(): void {
    const trimmedName = this.channelName.trim();
    const parsedMembers = this.members
      .split(',')
      .map((member) => member.trim())
      .filter(Boolean);

    if (!trimmedName) {
      return;
    }

    this.chatQueues.enqueueLeftPanel({
      id: `create-channel-${Date.now()}`,
      type: 'create-channel',
      payload: {
        channelName: trimmedName,
        members: parsedMembers,
      },
    });

    this.channelName = '';
    this.members = '';
  }

  sendMessage(): void {
    const trimmedMessage = this.message.trim();

    if (!trimmedMessage) {
      return;
    }

    this.chatQueues.enqueueUserInput({
      id: `user-input-${Date.now()}`,
      type: 'send-message',
      payload: {
        text: trimmedMessage,
      },
    });

    this.message = '';
  }
}
