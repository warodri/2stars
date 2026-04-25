import type { BrowserSignals } from '../models/signal.model';
import { sha256 } from '../utils/hash';

const DEVICE_STORAGE_KEY = 'omwal:device';

type StoredDevice = {
    id: string;
    seed: string;
    createdAt: number;
};

export function createSessionId() {
    return crypto.randomUUID();
}

export async function getOrCreateDeviceId(signals: BrowserSignals) {
    const storedDevice = readStoredDevice();

    if (storedDevice) {
        return storedDevice.id;
    }

    const seed = crypto.randomUUID();
    const fingerprint = createFingerprintSource(signals);
    const hash = await sha256(`${fingerprint}:${seed}`);
    const device: StoredDevice = {
        id: `dev_${hash.slice(0, 32)}`,
        seed,
        createdAt: Date.now()
    };

    writeStoredDevice(device);

    return device.id;
}

function createFingerprintSource(signals: BrowserSignals) {
    return JSON.stringify({
        userAgent: signals.device.userAgent,
        platform: signals.device.platform,
        language: signals.device.language,
        screen: signals.browser.screen,
        timezone: signals.browser.timezone
    });
}

function readStoredDevice() {
    try {
        const raw = localStorage.getItem(DEVICE_STORAGE_KEY);

        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw) as Partial<StoredDevice>;

        if (!parsed.id || !parsed.seed || !parsed.createdAt) {
            return null;
        }

        return parsed as StoredDevice;
    } catch {
        return null;
    }
}

function writeStoredDevice(device: StoredDevice) {
    try {
        localStorage.setItem(DEVICE_STORAGE_KEY, JSON.stringify(device));
    } catch {
        // If storage is unavailable, the generated device ID still works for this attempt.
    }
}
