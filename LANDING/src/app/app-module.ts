import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ScreenMain } from './SCREEN/screen-main/screen-main';
import { ProductRelai } from './SCREEN/product-relai/product-relai';
import { ProductVisionai } from './SCREEN/product-visionai/product-visionai';
import { ProductAichat } from './SCREEN/product-aichat/product-aichat';
import { SiteFooter } from './COMPONENT/site-footer/site-footer';

@NgModule({
    declarations: [
        App,
        ScreenMain,
        ProductRelai,
        ProductVisionai,
        ProductAichat
    ],
    imports: [
        BrowserModule,
        FormsModule,
        SiteFooter,
        AppRoutingModule
    ],
    providers: [
        provideBrowserGlobalErrorListeners()
    ],
    bootstrap: [App]
})
export class AppModule { }
