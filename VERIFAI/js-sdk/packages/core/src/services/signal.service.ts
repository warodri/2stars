// packages/core/src/services/signal.service.ts

import type { BehaviourCollector } from '../collectors/behaviour/behaviour.collector';
import { BrowserCollector } from '../collectors/browser/browser.collector';
import { CanvasCollector } from '../collectors/fingerprint/canvas.collector';
import { WebGLCollector } from '../collectors/fingerprint/webgl.collector';
import { signPayload } from '../identity/signature';
import type { IdentityClientConfig } from '../models/config.model';
import type { StepUpSignals, VerificationPayload } from '../models/signal.model';
import { extractFeatures } from '../utils/features';
import { hashString } from '../utils/hash';
import {
    generateBehaviourFingerprint,
    generateDeviceBindingHash,
    generateDeviceFingerprint,
    getCanvasHash
} from '../utils/identity';
import { getOrCreateDeviceKey } from '../storage/deviceKeyStore';
import { createSessionId, getOrCreateDeviceId } from './session.service';

export async function collectSignals(
    config: IdentityClientConfig,
    behaviourCollector: BehaviourCollector,
    stepUpSignals?: StepUpSignals
): Promise<VerificationPayload> {
    const collector = new BrowserCollector();
    const canvasCollector = new CanvasCollector();
    const webglCollector = new WebGLCollector();

    const browserSignals = await collector.collect();
    const deviceId = await getOrCreateDeviceId(browserSignals);
    const behaviour = behaviourCollector.getProfile();
    const enrichedBehaviour = {
        ...behaviour,
        mode: classifyBehaviourMode(behaviour),
        features: extractFeatures(behaviour)
    };
    const attention = behaviourCollector.getAttentionProfile();
    const rawInteraction = behaviourCollector.getInteractionProfile();
    const interaction = {
        ...rawInteraction,
        speed: classifyInteractionSpeed(rawInteraction)
    };
    const rawCanvas = canvasCollector.collect();
    const [canvasHash, audioHash, permissions, mediaDevices] = await Promise.all([
        getCanvasHash(rawCanvas),
        getAudioFingerprint(),
        getPermissionsState(),
        getMediaDevicesInfo()
    ]);
    const fingerprint = {
        canvasHash,
        audioHash,
        webgl: webglCollector.collect(),
        webglDetails: webglCollector.collectDetails(),
        hardware: getHardwareInfo()
    };
    const sessionQuality: {
        eventDensity: number;
        isShortSession: boolean;
        behaviourCompleteness: number;
        level: 'strong' | 'medium' | 'weak';
    } = {
        eventDensity: behaviour.hesitation.sessionDuration > 0
            ? behaviour.diagnostics.capturedEventCount / behaviour.hesitation.sessionDuration
            : 0,
        isShortSession: behaviour.hesitation.sessionDuration < 2000,
        behaviourCompleteness: behaviour.typing.keyCount >= 10 && behaviour.pointer.movementCount >= 20
            ? 1
            : 0.5,
        level: 'weak' as const
    };
    sessionQuality.level = classifySessionQuality(sessionQuality);

    const { privateKey, publicKey, createdAt, isNewDevice } = await getOrCreateDeviceKey();
    const deviceFingerprint = await generateDeviceFingerprint({
        ...browserSignals,
        fingerprint
    });
    const behaviourFingerprint = await generateBehaviourFingerprint(enrichedBehaviour);
    const deviceBindingHash = await generateDeviceBindingHash(deviceFingerprint, publicKey);
    const timestamp = Date.now();
    const payloadWithoutProof: Omit<VerificationPayload, 'deviceProof'> = {
        clientUserId: config.clientUserId,
        action: config.action,
        platform: 'js',
        deviceId,
        sessionId: createSessionId(),
        timestamp,
        isNewDevice,
        trust: {
            isKnownDevice: !isNewDevice,
            keyAge: Math.max(0, timestamp - createdAt),
            signaturePresent: true
        },
        signals: {
            ...browserSignals,
            fingerprint,
            identity: {
                deviceFingerprint,
                behaviourFingerprint,
                deviceBindingHash,
                deviceId,
                fingerprintVersion: 1,
                fingerprintConfidence: fingerprint.canvasHash && fingerprint.webgl?.renderer ? 1 : 0.7
            },
            network: getNetworkSignals(),
            environment: {
                permissions,
                mediaDevices
            },
            ...(stepUpSignals ? { stepUp: stepUpSignals } : {}),
            attention,
            interaction,
            sessionQuality,
            behaviour: enrichedBehaviour
        }
    };
    const signature = await signPayload(privateKey, payloadWithoutProof);

    return {
        ...payloadWithoutProof,
        deviceProof: {
            publicKey,
            signature,
            algorithm: 'ECDSA_P256',
            timestamp
        }
    };
}

function getHardwareInfo() {
    const nav = navigator as Navigator & {
        deviceMemory?: number;
    };

    return {
        cpuCores: navigator.hardwareConcurrency || null,
        deviceMemory: nav.deviceMemory || null,
        languages: Array.from(navigator.languages || [])
    };
}

function getNetworkSignals() {
    const nav = navigator as Navigator & {
        connection?: {
            effectiveType?: string;
            downlink?: number;
            rtt?: number;
        };
    };

    return {
        effectiveType: nav.connection?.effectiveType || null,
        downlink: nav.connection?.downlink || null,
        rtt: nav.connection?.rtt || null
    };
}

async function getAudioFingerprint() {
    try {
        const AudioContextCtor = window.AudioContext || (window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

        if (!AudioContextCtor) {
            return null;
        }

        const ctx = new AudioContextCtor();
        const oscillator = ctx.createOscillator();
        const analyser = ctx.createAnalyser();
        const gain = ctx.createGain();

        oscillator.type = 'triangle';
        oscillator.connect(analyser);
        analyser.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start(0);

        const data = new Float32Array(analyser.frequencyBinCount);
        analyser.getFloatFrequencyData(data);

        oscillator.stop();
        await ctx.close();

        const sample = Array.from(data.slice(0, 50)).join(',');
        return hashString(sample);
    } catch {
        return null;
    }
}

async function getPermissionsState() {
    if (!navigator.permissions) {
        return {
            geolocation: null,
            notifications: null
        };
    }

    const names = ['geolocation', 'notifications'] as const;
    const result: {
        geolocation: PermissionState | null;
        notifications: PermissionState | null;
    } = {
        geolocation: null,
        notifications: null
    };

    await Promise.all(names.map(async (name) => {
        try {
            const status = await navigator.permissions.query({ name } as PermissionDescriptor);
            result[name] = status.state;
        } catch {
            result[name] = null;
        }
    }));

    return result;
}

async function getMediaDevicesInfo() {
    try {
        if (!navigator.mediaDevices?.enumerateDevices) {
            return null;
        }

        const devices = await navigator.mediaDevices.enumerateDevices();

        return {
            audioInputs: devices.filter((device) => device.kind === 'audioinput').length,
            videoInputs: devices.filter((device) => device.kind === 'videoinput').length
        };
    } catch {
        return null;
    }
}

function classifyBehaviourMode(behaviour: BehaviourCollector['getProfile'] extends () => infer T ? T : never) {
    if (behaviour.typing.keyCount > 0 && behaviour.pointer.movementCount > 0) {
        return 'mixed' as const;
    }

    if (behaviour.typing.keyCount > 0) {
        return 'typing' as const;
    }

    if (behaviour.pointer.movementCount > 0) {
        return 'pointer' as const;
    }

    return 'minimal' as const;
}

function classifyInteractionSpeed(interaction: BehaviourCollector['getInteractionProfile'] extends () => infer T ? T : never) {
    if (interaction.idleBeforeSubmit < 50) {
        return 'instant' as const;
    }

    if (interaction.idleBeforeSubmit < 500) {
        return 'fast' as const;
    }

    return 'normal' as const;
}

function classifySessionQuality(session: {
    eventDensity: number;
    behaviourCompleteness: number;
}) {
    if (session.eventDensity > 0.03 && session.behaviourCompleteness === 1) {
        return 'strong' as const;
    }

    if (session.eventDensity > 0.015) {
        return 'medium' as const;
    }

    return 'weak' as const;
}
