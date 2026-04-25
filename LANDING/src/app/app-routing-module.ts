import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenMain } from './SCREEN/screen-main/screen-main';

const routes: Routes = [
    {path: '', component: ScreenMain}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
