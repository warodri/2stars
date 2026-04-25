export type SdkPlatform = 'js';

export type BrowserSignals = {
    device: {
        userAgent: string;
        platform: string;
        language: string;
    };
    browser: {
        screen: {
            width: number;
            height: number;
            pixelRatio: number;
        };
        timezone: string;
    };
};

export type FingerprintSignals = {
    canvasHash: string | null;
    audioHash: string | null;
    webgl: {
        vendor: string | null;
        renderer: string | null;
    } | null;
    webglDetails: {
        maxTextureSize: number;
        maxViewportDims: number[];
        shadingLanguageVersion: string | null;
    } | null;
    hardware: {
        cpuCores: number | null;
        deviceMemory: number | null;
        languages: string[];
    };
};

export type NetworkSignals = {
    effectiveType: string | null;
    downlink: number | null;
    rtt: number | null;
};

export type EnvironmentSignals = {
    permissions: {
        geolocation: PermissionState | null;
        notifications: PermissionState | null;
    };
    mediaDevices: {
        audioInputs: number;
        videoInputs: number;
    } | null;
};

export type StepUpSignals = {
    granted: {
        camera?: boolean;
        microphone?: boolean;
        geolocation?: boolean;
        motion?: boolean;
    };
    signals: {
        location?: {
            lat: number;
            lng: number;
            accuracy: number;
        };
        cameraFramesCaptured?: number;
        microphoneSampleLevel?: number;
        motion?: {
            captured: boolean;
            intensity: number;
        };
    };
    score?: number;
} | null;

export type IdentitySignals = {
    deviceFingerprint: string;
    behaviourFingerprint: string;
    deviceBindingHash: string;
    deviceId: string;
    fingerprintVersion: number;
    fingerprintConfidence: number;
};

export type DeviceProof = {
    publicKey: string;
    signature: string;
    algorithm: 'ECDSA_P256';
    timestamp: number;
};

export type TrustMetadata = {
    isKnownDevice: boolean;
    keyAge: number;
    signaturePresent: boolean;
};

export type AttentionSignals = {
    hiddenDuringSession: boolean;
    visibilityChanges: number;
};

export type InteractionSignals = {
    idleBeforeSubmit: number;
    scrollUsed: boolean;
    speed?: 'instant' | 'fast' | 'normal';
};

export type SessionQualitySignals = {
    eventDensity: number;
    isShortSession: boolean;
    behaviourCompleteness: number;
    level?: 'strong' | 'medium' | 'weak';
};

export type RawBehaviourSignals = {
    typing: {
        keyCount: number;
        inputCount: number;
        pasteCount: number;
        pasteInPassword: boolean;
        pasteTimingMs: number | null;
        holdTimeAvg: number | null;
        avgDelay: number | null;
        variance: number | null;
        correctionRate: number;
    };
    pointer: {
        movementCount: number;
        avgSpeed: number | null;
        avgAcceleration: number | null;
        clickCount: number;
        avgClickInterval: number | null;
        tapCount: number;
        avgTapInterval: number | null;
    };
    hesitation: {
        timeToFirstInput: number | null;
        sessionDuration: number;
    };
    focus: {
        focusCount: number;
        transitionCount: number;
        tabTransitions: number;
        pointerTransitions: number;
        touchTransitions: number;
        keyboardTransitions: number;
        unknownTransitions: number;
        avgFocusDelay: number | null;
        sequence: Array<{
            from: string | null;
            to: string;
            method: 'tab' | 'pointer' | 'touch' | 'keyboard' | 'unknown';
            delay: number | null;
        }>;
    };
    diagnostics: {
        isStarted: boolean;
        startedAt: number;
        capturedEventCount: number;
    };
};

export type BehaviourSignals = RawBehaviourSignals & {
    mode: 'mixed' | 'typing' | 'pointer' | 'minimal';
    features: {
        typingSpeed: number | null;
        typingConsistency: number | null;
        hesitationRatio: number;
        pointerStability: number;
    };
};

export type CollectedSignals = BrowserSignals & {
    fingerprint: FingerprintSignals;
    identity: IdentitySignals;
    network: NetworkSignals;
    environment: EnvironmentSignals;
    stepUp?: StepUpSignals;
    attention: AttentionSignals;
    interaction: InteractionSignals;
    sessionQuality: SessionQualitySignals;
    behaviour: BehaviourSignals;
};

export type VerificationPayload = {
    clientUserId: string;
    action: string;
    platform: SdkPlatform;
    deviceId: string;
    sessionId: string;
    timestamp: number;
    isNewDevice: boolean;
    deviceProof: DeviceProof;
    trust: TrustMetadata;
    signals: CollectedSignals;
};
