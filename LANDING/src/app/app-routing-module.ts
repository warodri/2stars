import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreenMain } from './SCREEN/screen-main/screen-main';
import { ProductVerifai } from './SCREEN/product-verifai/product-verifai';
import { ProductRelai } from './SCREEN/product-relai/product-relai';
import { ProductVisionai } from './SCREEN/product-visionai/product-visionai';
import { ProductAichat } from './SCREEN/product-aichat/product-aichat';

const routes: Routes = [
    {path: '', component: ScreenMain},
    {path: 'products/verifai', component: ProductVerifai},
    {path: 'products/relai', component: ProductRelai},
    {path: 'products/visionai', component: ProductVisionai},
    {path: 'products/aichat', component: ProductAichat}
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
