import type { IdentityClientConfig } from '../models/config.model';
import type { StepUpSignals } from '../models/signal.model';

declare global {
    interface Window {
        __sdkConfig?: Partial<IdentityClientConfig>;
    }
}

export function initSDK(config?: IdentityClientConfig) {
    if (typeof window === 'undefined') {
        return;
    }

    window.__sdkConfig = config || {};
}

export async function requestStepUpSignals(): Promise<StepUpSignals> {
    if (typeof window === 'undefined') {
        return null;
    }

    const config = window.__sdkConfig?.stepUp;

    if (!config || !config.enabled) {
        return null;
    }

    const results: NonNullable<StepUpSignals> = {
        granted: {},
        signals: {}
    };

    if (config.signals.geolocation && navigator.geolocation) {
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            results.granted.geolocation = true;
            results.signals.location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                accuracy: pos.coords.accuracy
            };
        } catch {
            results.granted.geolocation = false;
        }
    }

    if (config.signals.camera && navigator.mediaDevices?.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const framesCaptured = await captureCameraFrames(stream);

            results.granted.camera = true;
            results.signals.cameraFramesCaptured = framesCaptured;
            stream.getTracks().forEach((track) => track.stop());
        } catch {
            results.granted.camera = false;
        }
    }

    if (config.signals.microphone && navigator.mediaDevices?.getUserMedia) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const rawLevel = await captureMicrophoneLevel(stream);

            results.granted.microphone = true;
            results.signals.microphoneSampleLevel = normalizeAudioLevel(rawLevel);
            stream.getTracks().forEach((track) => track.stop());
        } catch {
            results.granted.microphone = false;
        }
    }

    if (config.signals.motion && typeof DeviceMotionEvent !== 'undefined') {
        try {
            let totalMagnitude = 0;
            let sampleCount = 0;
            const handler = (event: DeviceMotionEvent) => {
                const acc = event.accelerationIncludingGravity ?? event.acceleration;
                const x = acc?.x ?? 0;
                const y = acc?.y ?? 0;
                const z = acc?.z ?? 0;

                totalMagnitude += Math.sqrt((x * x) + (y * y) + (z * z));
                sampleCount += 1;
            };

            window.addEventListener('devicemotion', handler);
            await new Promise((resolve) => window.setTimeout(resolve, 500));
            window.removeEventListener('devicemotion', handler);

            results.granted.motion = true;
            results.signals.motion = {
                captured: sampleCount > 0,
                intensity: sampleCount > 0 ? totalMagnitude / sampleCount : 0
            };
        } catch {
            results.granted.motion = false;
        }
    }

    results.score = computeStepUpScore(results);
    return results;
}

async function captureCameraFrames(stream: MediaStream) {
    const video = document.createElement('video');
    video.playsInline = true;
    video.muted = true;
    video.srcObject = stream;

    try {
        await video.play();
    } catch {
        return 0;
    }

    let framesCaptured = 0;

    if (typeof video.requestVideoFrameCallback === 'function') {
        await new Promise<void>((resolve) => {
            const capture = () => {
                framesCaptured += 1;

                if (framesCaptured >= 10) {
                    resolve();
                    return;
                }

                video.requestVideoFrameCallback(() => capture());
            };

            video.requestVideoFrameCallback(() => capture());
            window.setTimeout(resolve, 800);
        });
    } else {
        for (let i = 0; i < 10; i += 1) {
            await new Promise((resolve) => window.requestAnimationFrame(() => resolve(null)));

            if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
                framesCaptured += 1;
            }
        }
    }

    video.pause();
    video.srcObject = null;
    return framesCaptured;
}

async function captureMicrophoneLevel(stream: MediaStream) {
    const AudioContextCtor = window.AudioContext || (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;

    if (!AudioContextCtor) {
        return 0;
    }

    const ctx = new AudioContextCtor();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaStreamSource(stream);
    const data = new Uint8Array(analyser.fftSize);
    source.connect(analyser);

    let totalAmplitude = 0;
    let samples = 0;
    const startedAt = performance.now();

    while (performance.now() - startedAt < 250) {
        analyser.getByteTimeDomainData(data);

        let frameAmplitude = 0;
        for (const value of data) {
            frameAmplitude += Math.abs((value - 128) / 128);
        }

        totalAmplitude += frameAmplitude / data.length;
        samples += 1;
        await new Promise((resolve) => window.setTimeout(resolve, 25));
    }

    source.disconnect();
    await ctx.close();

    return samples > 0 ? totalAmplitude / samples : 0;
}

function normalizeAudioLevel(level: number) {
    if (!level) {
        return 0;
    }

    return Math.min(1, level * 100);
}

function computeStepUpScore(stepUp: NonNullable<StepUpSignals>) {
    let score = 0;

    if (stepUp.granted.geolocation) {
        score += 0.25;
    }

    if (stepUp.granted.camera) {
        const frames = stepUp.signals.cameraFramesCaptured || 0;
        score += Math.min(0.25, (frames / 10) * 0.25);
    }

    if (stepUp.granted.microphone) {
        const level = stepUp.signals.microphoneSampleLevel || 0;
        score += Math.min(0.25, level * 0.25);
    }

    if (stepUp.granted.motion && stepUp.signals.motion?.captured && stepUp.signals.motion.intensity > 0) {
        const intensity = stepUp.signals.motion.intensity || 0;
        score += Math.min(0.25, intensity * 0.25);
    }

    return Math.min(1, score);
}
