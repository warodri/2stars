import type { BehaviourSignals, BrowserSignals, FingerprintSignals } from '../models/signal.model';
import { hashString } from './hash';

type FingerprintInputSignals = BrowserSignals & {
    fingerprint?: FingerprintSignals;
};

export async function getCanvasHash(canvasData: string | null) {
    if (!canvasData) {
        return null;
    }

    return hashString(canvasData);
}

export function buildFingerprintInput(signals: FingerprintInputSignals) {
    return {
        userAgent: getStableUserAgent(signals.device.userAgent),
        platform: signals.device.platform,
        language: signals.device.language,
        screen: `${signals.browser.screen.width}x${signals.browser.screen.height}`,
        pixelRatio: signals.browser.screen.pixelRatio,
        timezone: signals.browser.timezone,
        canvasHash: signals.fingerprint?.canvasHash ?? null,
        webglVendor: signals.fingerprint?.webgl?.vendor || null,
        webglRenderer: signals.fingerprint?.webgl?.renderer || null,
        cpuCores: signals.fingerprint?.hardware?.cpuCores || null,
        deviceMemory: signals.fingerprint?.hardware?.deviceMemory || null
    };
}

export async function generateDeviceFingerprint(signals: FingerprintInputSignals) {
    const input = buildFingerprintInput(signals);
    const normalized = JSON.stringify(input);
    const hash = await hashString(normalized);

    return `fp_${hash.slice(0, 16)}`;
}

export async function generateBehaviourFingerprint(behaviour: BehaviourSignals) {
    const input = {
        typingSpeed: behaviour.features.typingSpeed ?? undefined,
        typingConsistency: behaviour.features.typingConsistency ?? undefined,
        hesitationRatio: behaviour.features.hesitationRatio,
        pointerStability: behaviour.features.pointerStability,
        holdTimeAvg: behaviour.typing.holdTimeAvg ?? undefined
    };
    const normalized = JSON.stringify(input);
    const hash = await hashString(normalized);

    return `bf_${hash.slice(0, 16)}`;
}

export async function generateDeviceBindingHash(deviceFingerprint: string, publicKey: string) {
    return hashString(`${deviceFingerprint}${publicKey}`);
}

function getStableUserAgent(ua: string | null | undefined) {
    if (!ua) {
        return null;
    }

    if (ua.includes('Chrome')) {
        return 'Chrome';
    }

    if (ua.includes('Safari')) {
        return 'Safari';
    }

    if (ua.includes('Firefox')) {
        return 'Firefox';
    }

    return 'Other';
}
