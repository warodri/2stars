import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ScreenMain } from './SCREEN/screen-main/screen-main';

@NgModule({
    declarations: [
        App,
        ScreenMain
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule
    ],
    providers: [
        provideBrowserGlobalErrorListeners()
    ],
    bootstrap: [App]
})
export class AppModule { }
