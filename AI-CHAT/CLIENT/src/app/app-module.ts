import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ScreenChatDesktop } from './SCREEN/screen-chat-desktop/screen-chat-desktop';
import { ScreenChatMobile } from './SCREEN/screen-chat-mobile/screen-chat-mobile';
import { LeftPanel } from './COMPONENTS/left-panel/left-panel';
import { MessagesPanel } from './COMPONENTS/messages-panel/messages-panel';
import { RightPanel } from './COMPONENTS/right-panel/right-panel';
import { TypingPanel } from './COMPONENTS/typing-panel/typing-panel';


@NgModule({
  declarations: [
    App,
    ScreenChatDesktop,
    ScreenChatMobile,
    LeftPanel,
    MessagesPanel,
    RightPanel,
    TypingPanel,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
