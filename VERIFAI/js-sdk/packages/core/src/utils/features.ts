import type { RawBehaviourSignals } from '../models/signal.model';

export function extractFeatures(behaviour: RawBehaviourSignals) {
    const avgDelay = behaviour.typing.avgDelay;
    const variance = behaviour.typing.variance;
    const timeToFirstInput = behaviour.hesitation.timeToFirstInput;
    const sessionDuration = behaviour.hesitation.sessionDuration;
    const avgAcceleration = behaviour.pointer.avgAcceleration;
    const avgSpeed = behaviour.pointer.avgSpeed;
    const rawTypingConsistency = avgDelay && variance ? variance / avgDelay : null;
    const clampedTypingConsistency = rawTypingConsistency === null ? null : Math.min(rawTypingConsistency, 20);
    const hesitationRatio = timeToFirstInput && sessionDuration ? timeToFirstInput / sessionDuration : null;
    const rawPointerStability = avgAcceleration && avgSpeed ? avgAcceleration / avgSpeed : null;
    const clampedPointerStability = rawPointerStability === null ? null : Math.min(rawPointerStability, 30);

    const features = {
        typingSpeed: clamp01(1 - normalize(avgDelay, 50, 400)) as number | null,
        typingConsistency: normalizeLog(clampedTypingConsistency, 100) as number | null,
        hesitationRatio: safeRatio(hesitationRatio, 1),
        pointerStability: normalizeLog(clampedPointerStability, 100)
    };

    if (behaviour.typing.keyCount === 0) {
        features.typingSpeed = null;
        features.typingConsistency = null;
    }

    return features;
}

export function normalize(value: number | null, min: number, max: number) {
    if (!value) {
        return 0.5;
    }

    const v = Math.max(min, Math.min(max, value));
    return (v - min) / (max - min);
}

function safeRatio(value: number | null, max = 10) {
    if (!value) {
        return 0.5;
    }

    return Math.min(1, value / max);
}

function normalizeLog(value: number | null, scale = 20) {
    if (!value) {
        return 0.5;
    }

    return Math.min(1, Math.log(1 + value) / Math.log(1 + scale));
}

function clamp01(value: number) {
    return Math.max(0, Math.min(1, value));
}
