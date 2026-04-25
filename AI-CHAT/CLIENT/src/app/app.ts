import { Component, signal } from '@angular/core';
import { QueueListenerLeftPanel } from './SERVICES/queue-listener-left-panel';
import { QueueListenerMessagesPanel } from './SERVICES/queue-listener-messages-panel';
import { QueueListenerRightPanel } from './SERVICES/queue-listener-right-panel';
import { QueueListenerUserInputPanel } from './SERVICES/queue-listener-user-input-panel';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('CLIENT');

  constructor(
    readonly queueListenerLeftPanel: QueueListenerLeftPanel,
    readonly queueListenerMessagesPanel: QueueListenerMessagesPanel,
    readonly queueListenerRightPanel: QueueListenerRightPanel,
    readonly queueListenerUserInputPanel: QueueListenerUserInputPanel,
  ) {}
}
