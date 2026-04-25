import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenChatDesktop } from './SCREEN/screen-chat-desktop/screen-chat-desktop';

const routes: Routes = [
    {path: '', component: ScreenChatDesktop},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
