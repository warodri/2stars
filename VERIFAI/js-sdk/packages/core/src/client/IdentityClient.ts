// packages/core/src/client/IdentityClient.ts

import { BehaviourCollector } from '../collectors/behaviour/behaviour.collector';
import type { IdentityClientConfig } from '../models/config.model';
import type { StepUpSignals } from '../models/signal.model';
import type { VerificationResponse } from '../models/response.model';
import { collectSignals } from '../services/signal.service';
import { initSDK, requestStepUpSignals as requestConfiguredStepUpSignals } from '../services/step-up.service';
import { sendToServer } from '../services/transport.service';
import { extractFeatures } from '../utils/features';

export class IdentityClient {
    private behaviourCollector = new BehaviourCollector();
    private pendingStepUpSignals: StepUpSignals = null;

    constructor(private config: IdentityClientConfig) {
        if (!config.clientUserId) {
            throw new Error('IdentityClient requires clientUserId');
        }

        if (!config.action) {
            throw new Error('IdentityClient requires action');
        }

        initSDK(config);
        this.behaviourCollector.start();
    }

    async verify(): Promise<VerificationResponse> {
        const payload = await collectSignals(this.config, this.behaviourCollector, this.pendingStepUpSignals);

        const response = await sendToServer(payload, this.config);
        this.behaviourCollector.reset();
        this.pendingStepUpSignals = null;

        return response;
    }

    async requestStepUpSignals() {
        const results = await requestConfiguredStepUpSignals();
        this.pendingStepUpSignals = results;

        return results;
    }

    getBehaviourDebug() {
        const behaviour = this.behaviourCollector.getProfile();

        return {
            ...behaviour,
            mode: classifyBehaviourMode(behaviour),
            features: extractFeatures(behaviour)
        };
    }

    destroy() {
        this.behaviourCollector.stop();
    }
}

function classifyBehaviourMode(behaviour: ReturnType<BehaviourCollector['getProfile']>) {
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
