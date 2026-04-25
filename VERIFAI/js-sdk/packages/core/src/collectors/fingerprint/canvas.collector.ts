export class CanvasCollector {
    collect() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return null;
            }

            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('fingerprint', 2, 2);

            return canvas.toDataURL();
        } catch {
            return null;
        }
    }
}
