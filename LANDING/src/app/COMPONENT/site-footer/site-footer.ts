import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-site-footer',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './site-footer.html',
    styleUrl: './site-footer.scss',
})
export class SiteFooter {
    @Input() products: Array<{ id: string; name: string; route: string }> = [];

    constructor(private readonly router: Router) {}

    scrollToTop(event?: Event): void {
        event?.preventDefault();

        if (this.router.url === '/' || this.router.url.startsWith('/#')) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        this.router.navigate(['/']).then(() => {
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        });
    }

    scrollToSection(sectionId: string, event?: Event): void {
        event?.preventDefault();

        const performScroll = () => {
            const section = document.getElementById(sectionId);

            if (!section) {
                return;
            }

            const offset = 84;
            const top = section.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top,
                behavior: 'smooth',
            });
        };

        if (this.router.url === '/' || this.router.url.startsWith('/#')) {
            performScroll();
            return;
        }

        this.router.navigate(['/']).then(() => {
            setTimeout(performScroll, 50);
        });
    }
}
