import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SiteFooter } from '../../COMPONENT/site-footer/site-footer';

@Component({
    selector: 'app-product-verifai',
    standalone: true,
    imports: [CommonModule, RouterModule, SiteFooter],
    templateUrl: './product-verifai.html',
    styleUrl: './product-verifai.scss',
})
export class ProductVerifai {
    readonly footerProducts = [
        { id: 'verifai', name: 'VerifAI', route: '/products/verifai' },
        { id: 'relai', name: 'RelAI', route: '/products/relai' },
        { id: 'vision-ai', name: 'Vision AI', route: '/products/visionai' },
        { id: 'ai-chat', name: 'AI Chat', route: '/products/aichat' }
    ];
}
