import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RightPanelInfo, ChatState } from '../../SERVICES/chat-state';

@Component({
  selector: 'app-right-panel',
  standalone: false,
  templateUrl: './right-panel.html',
  styleUrl: './right-panel.scss',
})
export class RightPanel {
  readonly info$: Observable<RightPanelInfo | null>;

  constructor(private readonly chatState: ChatState) {
    this.info$ = this.chatState.rightPanel$;
  }
}
