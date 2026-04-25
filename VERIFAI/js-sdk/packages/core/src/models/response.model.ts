export type VerificationResponse = {
    success: boolean;
    score: number;
    decision: 'allow' | 'allow_first_time' | 'challenge' | string;
    isFirstTimeUser?: boolean;
    isKnownDevice: boolean;
    behaviourRisk?: 'normal' | 'medium-risk' | 'high-risk' | 'insufficient-data';
    behaviourMatch?: number;
    behaviourBaselineUpdated?: boolean;
    scoreBreakdown?: {
        deviceScore: number;
        behaviourScore: number;
        environmentScore: number;
        weights: {
            device: number;
            behaviour: number;
            environment: number;
        };
    };
    action?: string;
    sessionId: string;
    deviceId?: string;
};
