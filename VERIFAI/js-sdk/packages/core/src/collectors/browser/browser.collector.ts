import type { BrowserSignals } from '../../models/signal.model';

// packages/core/src/collectors/browser/browser.collector.ts

export class BrowserCollector {
    async collect(): Promise<BrowserSignals> {
        return {
            device: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
            },
            browser: {
                screen: {
                    width: window.screen.width,
                    height: window.screen.height,
                    pixelRatio: window.devicePixelRatio
                },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
        };
    }
}
